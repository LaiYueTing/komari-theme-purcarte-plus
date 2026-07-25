import { useAppConfig } from "@/config";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNodeData } from "@/contexts/NodeDataContext";
import {
  useExchangeRates,
  CURRENCY_SYMBOLS,
  CURRENCY_OPTIONS,
} from "./useExchangeRates";
import type { ExchangeRates } from "./useExchangeRates";
import type { NodeData } from "@/types/node.d";
import {
  calculateFinanceNodeValues,
  normalizeCurrencyToCode,
} from "./financeUtils";
import { hasDelimitedTag, normalizeFreeTag } from "@/utils/tagHelper";
import { ServerTradeModal } from "./ServerTradeModal";
import { useLocale } from "@/config/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortBy = "weight_asc" | "weight_desc" | "price_asc" | "price_desc";

const SORT_VALUES: SortBy[] = ["weight_asc", "weight_desc", "price_asc", "price_desc"];
const SORT_LABEL_KEYS: Record<SortBy, string> = {
  weight_asc: "enhanced.finance.sortWeightAsc",
  weight_desc: "enhanced.finance.sortWeightDesc",
  price_asc: "enhanced.finance.sortPriceAsc",
  price_desc: "enhanced.finance.sortPriceDesc",
};

function sortNodes(nodes: NodeData[], sortBy: SortBy): NodeData[] {
  return nodes.slice().sort((a, b) => {
    switch (sortBy) {
      case "weight_asc":
        return a.weight - b.weight;
      case "weight_desc":
        return b.weight - a.weight;
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });
}

interface FinanceData {
  totalNodes: number;
  totalPrice: number;
  monthlyPrice: number;
  totalRemainVal: number;
  specialCases: string[];
  items: {
    node: NodeData;
    displayVal: number;
    remainingValue: number;
    tooltipText: string;
    isSpecialFree: boolean;
    isLongTerm: boolean;
    isFreeTag: boolean;
  }[];
}

function calculateFinanceData(
  nodes: NodeData[],
  rates: ExchangeRates,
  excludeFree: boolean,
  sortBy: SortBy,
  t: (key: string, params?: Record<string, string | number>) => string,
  freeTag: string
): FinanceData {
  const sorted = sortNodes(nodes, sortBy);
  const now = new Date();

  let totalPrice = 0;
  let monthlyPrice = 0;
  let totalRemainVal = 0;
  const specialCases: string[] = [];

  const items: FinanceData["items"] = [];
  for (const node of sorted) {
    const isFreeTag = hasDelimitedTag(node.tags, freeTag);
    const {
      priceBase,
      monthlyExpense,
      remainingValue,
      isSpecialFree,
      isLongTerm,
    } = calculateFinanceNodeValues(
      node,
      rates,
      now
    );

    // 排除免費：開啟時，免費標籤、特殊免費機(-1)、價格 <= 0（含 0）皆視為免費
    // 完全不顯示於列表，也不計入彙總與提示
    const rawPrice = parseFloat(String(node.price));
    const isZeroPrice = rawPrice <= 0;
    if (excludeFree && (isFreeTag || isZeroPrice)) {
      continue;
    }

    let tooltipText = "";
    if (isSpecialFree) {
      specialCases.push(`${node.name} (${t("enhanced.finance.freeChicken")})`);
      tooltipText = `${node.name} (${t("enhanced.finance.freeChicken")})`;
    } else if (isLongTerm) {
      specialCases.push(`${node.name} (${t("enhanced.finance.longTermChicken")})`);
      tooltipText = t("enhanced.finance.longTermTooltip");
    } else if (isFreeTag) {
      specialCases.push(`${node.name} (${freeTag})`);
      tooltipText = `${node.name} (${freeTag})`;
    }

    totalPrice += priceBase;
    monthlyPrice += monthlyExpense;
    totalRemainVal += remainingValue;

    items.push({
      node,
      displayVal: remainingValue,
      remainingValue,
      tooltipText,
      isSpecialFree,
      isLongTerm,
      isFreeTag,
    });
  }

  return {
    totalNodes: nodes.length,
    totalPrice,
    monthlyPrice,
    totalRemainVal,
    specialCases,
    items,
  };
}

export function FinanceWidget() {
  const { nodes } = useNodeData();
  const { t } = useLocale();
  const { enableSearchButton, enableAdvancedSearch, freeTag } = useAppConfig();
  const isAdvancedSearchEnabled = enableSearchButton && enableAdvancedSearch;
  const configuredFreeTag = normalizeFreeTag(freeTag);
  const [isOpen, setIsOpen] = useState(false);
  const [userCurrency, setUserCurrency] = useState<string>(
    () => localStorage.getItem("fin_currency") || "TWD"
  );
  const { rates, lastUpdated, refreshRates } = useExchangeRates(userCurrency);
  const [sortBy, setSortBy] = useState<SortBy>(
    () => (localStorage.getItem("fin_sort") as SortBy) || "weight_asc"
  );
  const [excludeFree, setExcludeFree] = useState<boolean>(() => {
    const stored = localStorage.getItem("fin_exclude_free");
    if (stored === null) return true;
    return stored === "true";
  });
  const [tradeNode, setTradeNode] = useState<NodeData | null>(null);
  const [showRatesInfo, setShowRatesInfo] = useState(false);

  // URL 分享參數：交易日期和金額
  const [initialTradeDate, setInitialTradeDate] = useState<string | undefined>();
  const [initialTradeAmount, setInitialTradeAmount] = useState<string | undefined>();
  const urlTradeHandled = useRef(false);

  // 監聽來自 Header 按鈕的自訂事件
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-finance-widget", handler);
    return () => window.removeEventListener("toggle-finance-widget", handler);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const uuid = (event as CustomEvent<{ uuid?: string }>).detail?.uuid;
      if (!uuid) return;
      const targetNode = nodes.find((node) => node.uuid === uuid);
      if (targetNode) {
        setTradeNode(targetNode);
      }
    };
    window.addEventListener("open-server-trade-modal", handler);
    return () => window.removeEventListener("open-server-trade-modal", handler);
  }, [nodes, isAdvancedSearchEnabled]);

  // 從 URL 載入交易對話框參數（僅在首次載入時執行）
  useEffect(() => {
    if (urlTradeHandled.current || nodes.length === 0) return;
    // 如果沒有同時開啟【搜尋按鈕】和【進階搜尋】，直接中止，不開啟交易面板
    if (!isAdvancedSearchEnabled) {
      urlTradeHandled.current = true;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const tmCur = params.get("tm_cur");
    const tmDate = params.get("tm_date");
    const tmAmount = params.get("tm_amount");
    const tq = params.get("t_q");

    // 如果有 tm_cur，更新貨幣單位到 localStorage 和狀態
    if (tmCur) {
      setUserCurrency(tmCur);
      localStorage.setItem("fin_currency", tmCur);
      window.dispatchEvent(
        new CustomEvent("finance-currency-change", { detail: tmCur })
      );
    }

    // 如果有 t_q（UUID 搜尋），嘗試開啟交易對話框
    if (tq && (tmDate || tmAmount || tmCur)) {
      const targetNode = nodes.find((n) => n.uuid === tq);
      if (targetNode) {
        urlTradeHandled.current = true;
        setInitialTradeDate(tmDate || undefined);
        setInitialTradeAmount(tmAmount || undefined);
        setTradeNode(targetNode);
      }
    }
  }, [nodes, isAdvancedSearchEnabled]);

  const financeData = useMemo(
    () => calculateFinanceData(nodes, rates, excludeFree, sortBy, t, configuredFreeTag),
    [nodes, rates, excludeFree, sortBy, t, configuredFreeTag]
  );

  const sym = CURRENCY_SYMBOLS[userCurrency] || userCurrency;

  const handleCurrencyChange = useCallback(
    (val: string) => {
      setUserCurrency(val);
      localStorage.setItem("fin_currency", val);
      window.dispatchEvent(new CustomEvent("finance-currency-change", { detail: val }));
    },
    []
  );

  const handleSortChange = useCallback(
    (val: string) => {
      const nextSort = val as SortBy;
      setSortBy(nextSort);
      localStorage.setItem("fin_sort", nextSort);
    },
    []
  );

  const handleToggleFree = useCallback(() => {
    setExcludeFree((prev) => {
      const next = !prev;
      localStorage.setItem("fin_exclude_free", String(next));
      window.dispatchEvent(
        new CustomEvent("finance-exclude-free-change", { detail: next })
      );
      return next;
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refreshRates();
  }, [refreshRates]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 匯率列表：常見主要貨幣 + 節點實際使用的貨幣，與使用者選擇貨幣之間的匯率
  const ratesList = useMemo(() => {
    // 常見主要貨幣，確保列表不會只剩單一貨幣
    const MAJOR_CURRENCIES = ["TWD", "USD", "CNY", "JPY", "HKD", "EUR", "GBP"];
    const relevantCodes = new Set<string>(MAJOR_CURRENCIES);
    // 併入節點資料中實際使用的貨幣代碼
    for (const node of nodes) {
      relevantCodes.add(normalizeCurrencyToCode(node.currency || "¥"));
    }

    const baseSym = CURRENCY_SYMBOLS[userCurrency] || userCurrency;

    return Array.from(relevantCodes)
      .filter(
        (code) => code !== userCurrency && rates[code] != null && rates[code] > 0
      )
      .sort((a, b) => a.localeCompare(b))
      .map((code) => {
        const s = CURRENCY_SYMBOLS[code];
        // rates[code] = 1 基準貨幣可換多少 code；取倒數得「1 code = 多少基準貨幣」
        const valueInBase = 1 / rates[code];
        return {
          code,
          name: s ? `1 ${code} ${s}` : `1 ${code}`,
          rate: `${baseSym} ${valueInBase.toFixed(2)}`,
        };
      });
  }, [rates, userCurrency, nodes]);

  return (
    <>
      {/* 資產面板 */}
      <div
        id="finance-widget"
        className={`finance-widget${isOpen ? " show" : ""}`}>
        <div className="bubble-header">
          <h3 className="bubble-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
            {t("enhanced.finance.title")}
          </h3>
          <button className="bubble-close" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>
        <div className="bubble-content">
          {/* 彙總 */}
          <div className="finance-row">
            <span>{t("enhanced.finance.serverCount")}</span>
            <span className="finance-value">{financeData.totalNodes}</span>
          </div>
          <div className="finance-row">
            <span>{t("enhanced.finance.totalValue")}</span>
            <span className="finance-value">
              {sym} {financeData.totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="finance-row">
            <span>{t("enhanced.finance.monthlyExpense")}</span>
            <span className="finance-value">
              {sym} {financeData.monthlyPrice.toFixed(2)}
            </span>
          </div>
          <div className="finance-row">
            <span>{t("enhanced.finance.remainingValue")}</span>
            <div className="item-right">
              <span className="finance-value">
                {sym}{" "}
                {financeData.totalRemainVal.toFixed(2)}
              </span>
              {financeData.specialCases.length > 0 && (
                <div
                  className="help-icon show-help help-icon-down"
                  data-tooltip={financeData.specialCases.join("\n")}
                  onClick={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).classList.toggle("active");
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="finance-separator" />

          {/* 伺服器列表 */}
          <div className="finance-list">
            {financeData.items.map((item) => (
              <div
                key={item.node.uuid}
                className="finance-list-item"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".help-icon")) return;
                  setTradeNode(item.node);
                }}>
                <span
                  className="item-name"
                  title={item.node.public_remark || item.node.name}>
                  {item.node.name}
                </span>
                <div className="item-right">
                  <span className="item-value">
                    {sym} {item.displayVal.toFixed(2)}
                  </span>
                  {item.tooltipText && (
                    <div
                      className="help-icon"
                      data-tooltip={item.tooltipText}
                      onClick={(e) => {
                        e.stopPropagation();
                        (e.currentTarget as HTMLElement).classList.toggle(
                          "active"
                        );
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 匯率資訊 */}
          <div
            className="finance-tooltip"
            style={{ cursor: "pointer" }}
            onClick={() => setShowRatesInfo((p) => !p)}>
            {lastUpdated
              ? lastUpdated === "使用預設匯率"
                ? t("enhanced.finance.defaultRates")
                : t("enhanced.finance.ratesUpdated", { time: lastUpdated })
              : t("enhanced.finance.ratesUpdating")}
          </div>

          {showRatesInfo && (
            <>
              <div className="finance-separator" />
              <div className="finance-exchange-rates">
                {ratesList.map((r) => (
                  <div key={r.code} className="finance-rate-item">
                    <span>{r.name}</span>
                    <span className="finance-rate-value">{r.rate}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 控制列 */}
          <div className="finance-controls">
            <div style={{ display: "flex", gap: 8 }}>
              <Select value={userCurrency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="h-8 w-[92px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-8 w-[132px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_VALUES.map((val) => (
                    <SelectItem key={val} value={val}>
                      {t(SORT_LABEL_KEYS[val])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                className={`finance-btn${excludeFree ? " active" : ""}`}
                title={
                  excludeFree
                    ? t("enhanced.finance.excludeFreeOn", { tag: configuredFreeTag })
                    : t("enhanced.finance.excludeFreeOff", { tag: configuredFreeTag })
                }
                onClick={handleToggleFree}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M19 5c-1.5 0-2.8 0.6-3.8 1.6l-1.2 1.2-1.2-1.2C11.8 5.6 10.5 5 9 5 5.5 5 3 7.6 3 11c0 3.5 3 7.6 9 13 6-5.4 9-9.5 9-13 0-3.4-2.5-6-6-6z" />
                </svg>
              </button>
              <button
                className="finance-btn"
                title={t("enhanced.finance.refresh")}
                onClick={handleRefresh}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 交易對話框 */}
      {tradeNode && (
        <ServerTradeModal
          node={tradeNode}
          rates={rates}
          userCurrency={userCurrency}
          onClose={() => {
            setTradeNode(null);
            setInitialTradeDate(undefined);
            setInitialTradeAmount(undefined);
          }}
          initialTradeDate={initialTradeDate}
          initialTradeAmount={initialTradeAmount}
        />
      )}
    </>
  );
}
