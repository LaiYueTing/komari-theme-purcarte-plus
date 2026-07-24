import { useState, useEffect, useCallback, useRef } from "react";

export interface ExchangeRates {
  [key: string]: number;
}

const FALLBACK_RATES_CNY: ExchangeRates = {
  CNY: 1,
  USD: 0.142536,
  HKD: 1.108377,
  EUR: 0.12102,
  GBP: 0.105581,
  JPY: 22.231552,
  TWD: 4.34,
};

// 模組級快取：按 baseCurrency 快取
const cachedRatesMap = new Map<string, { rates: ExchangeRates; lastUpdated: string }>();
const fetchPromiseMap = new Map<string, Promise<{ rates: ExchangeRates; lastUpdated: string }>>();

const apis = [
  {
    // ExchangeRate-API 開放端點：免金鑰、支援 TWD 等 160+ 幣別，優先使用
    buildUrl: (base: string) => `https://open.er-api.com/v6/latest/${base}`,
    parse: (data: any): Record<string, number> | null =>
      data?.result === "success" ? data.rates || null : null,
  },
  {
    // 備援：歐洲央行資料，不含 TWD
    buildUrl: (base: string) => `https://api.frankfurter.app/latest?from=${base}`,
    parse: (data: any): Record<string, number> | null => data.rates || null,
  },
  {
    // 備援：舊版 exchangerate-api
    buildUrl: (base: string) => `https://api.exchangerate-api.com/v4/latest/${base}`,
    parse: (data: any): Record<string, number> | null => data.rates || null,
  },
];

async function fetchRatesForBase(baseCurrency: string): Promise<{
  rates: ExchangeRates;
  lastUpdated: string;
}> {
  const cached = cachedRatesMap.get(baseCurrency);
  if (cached) return cached;

  const existing = fetchPromiseMap.get(baseCurrency);
  if (existing) return existing;

  const promise = (async () => {
    for (const api of apis) {
      try {
        const url = api.buildUrl(baseCurrency);
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const data = await res.json();
          const rates = api.parse(data);
          if (rates) {
            // API 回傳的 rates 以 baseCurrency=1 為基準
            const result: ExchangeRates = { [baseCurrency]: 1, ...rates };
            // 在「上午/下午」與時間之間補一個空格，例如「上午 1:44:04」
            const lastUpdated = new Date()
              .toLocaleTimeString()
              .replace(/^(上午|下午)(?=\d)/, "$1 ");
            const entry = { rates: result, lastUpdated };
            cachedRatesMap.set(baseCurrency, entry);
            return entry;
          }
        }
      } catch (e) {
        console.warn(`從 ${api.buildUrl(baseCurrency)} 取得匯率失敗:`, e);
      }
    }
    // 全部失敗：基於 CNY 硬編碼匯率推算
    const fallback = buildFallbackRates(baseCurrency);
    const entry = { rates: fallback, lastUpdated: "使用預設匯率" };
    cachedRatesMap.set(baseCurrency, entry);
    return entry;
  })();

  fetchPromiseMap.set(baseCurrency, promise);
  promise.finally(() => fetchPromiseMap.delete(baseCurrency));
  return promise;
}

/** 基於 CNY 硬編碼匯率推算任意 base 的匯率表 */
function buildFallbackRates(baseCurrency: string): ExchangeRates {
  const baseInCNY = FALLBACK_RATES_CNY[baseCurrency] || 1;
  const result: ExchangeRates = {};
  for (const [code, rateInCNY] of Object.entries(FALLBACK_RATES_CNY)) {
    result[code] = rateInCNY / baseInCNY;
  }
  result[baseCurrency] = 1;
  return result;
}

export function useExchangeRates(baseCurrency: string = "CNY") {
  const [rates, setRates] = useState<ExchangeRates>(() => {
    const cached = cachedRatesMap.get(baseCurrency);
    return cached?.rates || buildFallbackRates(baseCurrency);
  });
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    return cachedRatesMap.get(baseCurrency)?.lastUpdated || "";
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // baseCurrency 變化時重新取得
    fetchRatesForBase(baseCurrency).then(({ rates: r, lastUpdated: t }) => {
      if (mounted.current) {
        setRates(r);
        setLastUpdated(t);
      }
    });
    return () => { mounted.current = false; };
  }, [baseCurrency]);

  const refreshRates = useCallback(() => {
    cachedRatesMap.delete(baseCurrency);
    fetchRatesForBase(baseCurrency).then(({ rates: r, lastUpdated: t }) => {
      if (mounted.current) {
        setRates(r);
        setLastUpdated(t);
      }
    });
  }, [baseCurrency]);

  return { rates, lastUpdated, refreshRates };
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: "¥",
  USD: "$",
  HKD: "HK$",
  EUR: "€",
  GBP: "£",
  JPY: "JP¥",
  KRW: "₩",
  THB: "฿",
  RUB: "₽",
  INR: "₹",
  TWD: "NT$",
  SGD: "S$",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  SEK: "kr",
  NZD: "NZ$",
  MYR: "RM",
  PHP: "₱",
  VND: "₫",
  BRL: "R$",
  TRY: "₺",
  ZAR: "R",
  AED: "د.إ",
  SAR: "﷼",
};

export const CURRENCY_OPTIONS = [
  { value: "TWD", label: "TWD (NT$)" },
  { value: "USD", label: "USD ($)" },
  { value: "CNY", label: "CNY (¥)" },
  { value: "JPY", label: "JPY (JP¥)" },
  { value: "HKD", label: "HKD (HK$)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];
