import type { NodeData } from "@/types/node.d";
import type { ExchangeRates } from "./useExchangeRates";

// 到期時間超過多少年視為無限期（按原價計算）
const LONG_TERM_YEARS = 100;

/**
 * 將貨幣符號或代碼統一標準化為貨幣代碼
 * 處理多字元符號（HK$、JP¥、NT$、S$、A$、C$、NZ$）和單字元符號（¥、$、€、£、₩、฿、₽、₹、₱、₫、₺）
 * 單獨的 ¥ 預設視為 CNY（人民幣），JPY 需要透過 "JP¥" 或 "JPY" 標識
 * 單獨的 $ 預設視為 USD，其他美元需要前綴（HK$、S$、A$、C$、NZ$、NT$）
 */
export function normalizeCurrencyToCode(cur: string): string {
  const trimmed = cur.trim();
  const upper = trimmed.toUpperCase();
  // 標準三字母貨幣代碼（直接回傳）
  const KNOWN_CODES = [
    "CNY", "USD", "HKD", "EUR", "GBP", "JPY", "KRW", "THB", "RUB",
    "INR", "TWD", "SGD", "AUD", "CAD", "CHF", "SEK", "NZD", "MYR",
    "PHP", "VND", "BRL", "TRY", "ZAR", "AED", "SAR", "IDR", "PLN",
    "NOK", "DKK", "CZK", "HUF", "ILS", "MXN", "ARS", "CLP", "COP",
    "PEN", "BGN", "RON", "HRK", "ISK",
  ];
  if (KNOWN_CODES.includes(upper)) return upper;
  // 多字元符號（必須在單字元之前比對）
  const MULTI_CHAR_MAP: Record<string, string> = {
    "HK$": "HKD", "JP¥": "JPY", "NT$": "TWD", "S$": "SGD",
    "A$": "AUD", "C$": "CAD", "NZ$": "NZD", "R$": "BRL",
    "RM": "MYR", "د.إ": "AED", "﷼": "SAR",
  };
  for (const [sym, code] of Object.entries(MULTI_CHAR_MAP)) {
    if (trimmed === sym) return code;
  }
  // 單字元符號
  const SINGLE_CHAR_MAP: Record<string, string> = {
    "¥": "CNY", "$": "USD", "€": "EUR", "£": "GBP",
    "₩": "KRW", "฿": "THB", "₽": "RUB", "₹": "INR",
    "₱": "PHP", "₫": "VND", "₺": "TRY",
  };
  if (SINGLE_CHAR_MAP[trimmed]) return SINGLE_CHAR_MAP[trimmed];
  return upper || "CNY"; // 未知貨幣回傳原始大寫，空值預設 CNY
}

/**
 * 將節點價格轉換為目前基準貨幣（rates 的基準貨幣，即 rates 中值為 1 的那個）
 *
 * rates 由 useExchangeRates(baseCurrency) 回傳，baseCurrency=1，
 * 其他貨幣的值表示 "1 baseCurrency = X otherCurrency"
 *
 * 節點價格 nodePrice 的貨幣為 nodeCode，要轉換為 baseCurrency：
 *   priceInBase = nodePrice / rates[nodeCode]
 *
 * 例：baseCurrency=USD, rates.CNY=7.2, 節點 price=100 CNY
 *   → 100 / 7.2 = 13.89 USD ✓
 */
export function parsePriceToBase(
  node: NodeData,
  rates: ExchangeRates
): { price: number; isSpecialFree: boolean } {
  let price = parseFloat(String(node.price));
  let isSpecialFree = false;

  if (price === -1) {
    price = 0;
    isSpecialFree = true;
  } else if (isNaN(price)) {
    price = 0;
  }

  const cur = node.currency || "¥";
  const code = normalizeCurrencyToCode(cur);
  const rate = rates[code];

  // rate 存在且 > 0 時轉換，否則原價回傳（未知貨幣不轉換）
  const finalPrice = rate && rate > 0 ? price / rate : price;

  return { price: finalPrice, isSpecialFree };
}

// 向後相容別名
export const parsePriceToCNY = parsePriceToBase;

/**
 * 計算節點剩餘價值（以 rates 基準貨幣計）
 */
export function calculateRemainingValue(
  node: NodeData,
  rates: ExchangeRates,
  date: Date = new Date()
): { remainingValue: number; isLongTerm: boolean } {
  if (!node.expired_at) return { remainingValue: 0, isLongTerm: false };

  const { price: priceBase } = parsePriceToBase(node, rates);

  // 一次性付費（billing_cycle = -1）視為長期機器，按原價計算
  if (node.billing_cycle === -1) {
    return { remainingValue: priceBase, isLongTerm: true };
  }

  const exp = new Date(node.expired_at);
  const nowUTC = new Date(date.toISOString());
  const diffMs = exp.getTime() - nowUTC.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365);

  if (diffYears > LONG_TERM_YEARS) {
    return { remainingValue: priceBase, isLongTerm: true };
  }

  const billingCycleMs = node.billing_cycle * 24 * 60 * 60 * 1000;
  if (diffMs > 0 && billingCycleMs > 0) {
    return { remainingValue: priceBase * (diffMs / billingCycleMs), isLongTerm: false };
  }

  return { remainingValue: 0, isLongTerm: false };
}

/**
 * 計算月均支出（以 rates 基準貨幣計）
 */
export function calculateMonthlyExpense(
  priceBase: number,
  billingCycleDays: number
): number {
  if (billingCycleDays === -1) return 0;

  let cycleMonths = 1;
  if (billingCycleDays === 30) cycleMonths = 1;
  else if (billingCycleDays === 92) cycleMonths = 3;
  else if (billingCycleDays === 184) cycleMonths = 6;
  else if (billingCycleDays === 365) cycleMonths = 12;
  else if (billingCycleDays === 730) cycleMonths = 24;
  else if (billingCycleDays === 1095) cycleMonths = 36;
  else if (billingCycleDays === 1825) cycleMonths = 60;
  else if (billingCycleDays > 0) cycleMonths = billingCycleDays / 30;

  return cycleMonths > 0 ? priceBase / cycleMonths : 0;
}

/**
 * 根據選擇的日期計算剩餘價值（以 rates 基準貨幣計）
 */
export function calculateRemainValueForDate(
  node: NodeData,
  rates: ExchangeRates,
  selectedDateStr: string
): number {
  const now = new Date();
  const todayStr = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  )
    .toISOString()
    .split("T")[0];

  let calculationTime: Date;
  if (selectedDateStr === todayStr) {
    calculationTime = now;
  } else {
    calculationTime = new Date(selectedDateStr + "T00:00:00+08:00");
  }

  if (!node.expired_at) return 0;

  const { price: priceBase } = parsePriceToBase(node, rates);

  if (node.billing_cycle === -1) {
    return priceBase;
  }

  const exp = new Date(node.expired_at);
  const nowUTC = new Date(calculationTime.toISOString());
  const diffMs = exp.getTime() - nowUTC.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365);

  if (diffYears > LONG_TERM_YEARS) {
    return priceBase;
  }

  const billingCycleMs = node.billing_cycle * 24 * 60 * 60 * 1000;
  if (diffMs > 0 && billingCycleMs > 0) {
    return priceBase * (diffMs / billingCycleMs);
  }

  return 0;
}

/**
 * 格式化位元組
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 格式化流量
 */
export function formatTraffic(bytes: number, t?: (key: string) => string): string {
  if (bytes === 362838837166080) return t ? t("enhanced.trade.trafficInfinite") : "∞TB/月";
  if (bytes === 0) return t ? t("enhanced.trade.trafficUnlimited") : "無限制";
  return formatBytes(bytes) + (t ? t("enhanced.trade.trafficPerMonth") : "/月");
}

/**
 * 計費週期文字
 */
export function getBillingCycleText(days: number, t?: (key: string, params?: Record<string, string | number>) => string): string {
  if (t) {
    const cycleMap: Record<string, string> = {
      "30": t("enhanced.trade.billingMonthly"),
      "92": t("enhanced.trade.billingQuarterly"),
      "184": t("enhanced.trade.billingSemiAnnual"),
      "365": t("enhanced.trade.billingYearly"),
      "730": t("enhanced.trade.billingBiennial"),
      "1095": t("enhanced.trade.billingTriennial"),
      "1825": t("enhanced.trade.billingQuinquennial"),
      "-1": t("enhanced.trade.billingOneTime"),
    };
    return cycleMap[String(days)] || t("enhanced.trade.billingDays", { days });
  }
  const cycleMap: Record<string, string> = {
    "30": "月付",
    "92": "季付",
    "184": "半年付",
    "365": "年付",
    "730": "兩年付",
    "1095": "三年付",
    "1825": "五年付",
    "-1": "一次性",
  };
  return cycleMap[String(days)] || `${days} 天`;
}
