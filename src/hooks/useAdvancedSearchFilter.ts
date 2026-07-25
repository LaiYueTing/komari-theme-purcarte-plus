/**
 * 進階搜尋過濾邏輯
 *
 * 純函式模組：接收 AdvancedSearchState 和節點陣列，回傳過濾後的節點陣列。
 * 每個 match 函式對應一種欄位型別的過濾邏輯。
 */

import type { NodeData } from "@/types/node";
import type {
  AdvancedSearchState,
  TextFieldFilter,
  BooleanFilter,
  TrafficLimitTypeFilter,
  PriceFilter,
  CpuCoresFilter,
  DateFilter,
  RangeFilter,
  SwapFilter,
} from "@/types/advancedSearch";
import { TEXT_FIELD_KEYS } from "@/types/advancedSearch";
import type { ExchangeRates } from "@/components/enhanced/useExchangeRates";
import { parsePriceToCNY } from "@/components/enhanced/financeUtils";
import { DEFAULT_FREE_TAG } from "@/config/default";
import { hasDelimitedTag, normalizeFreeTag } from "@/utils/tagHelper";

/**
 * 單位轉換為位元組
 * NodeData 中 mem_total/disk_total/swap_total/traffic_limit 儲存單位為位元組
 */
const UNIT_MULTIPLIERS: Record<string, number> = {
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

function convertToBytes(value: number, unit: string): number {
  return value * (UNIT_MULTIPLIERS[unit] || 1);
}

/**
 * 文字欄位比對
 * - 空值：不參與過濾（回傳 true）
 * - none（單關鍵字）：模糊比對
 * - and（& 分隔）：所有關鍵字必須符合
 * - or（| 分隔）：任一關鍵字符合即可
 */
function matchTextField(nodeValue: string, filter: TextFieldFilter): boolean {
  if (!filter.value.trim()) return true;
  if (filter.keywords.length === 0) return true;

  const lowerNode = (nodeValue || "").toLowerCase();

  if (filter.operator === "and") {
    return filter.keywords.every((kw) => lowerNode.includes(kw.toLowerCase()));
  }
  if (filter.operator === "or") {
    return filter.keywords.some((kw) => lowerNode.includes(kw.toLowerCase()));
  }
  // 單關鍵字模糊比對
  return lowerNode.includes(filter.keywords[0].toLowerCase());
}

/**
 * 布林欄位比對
 * - "any"：不參與過濾
 * - "true"/"false"：精確比對
 */
function matchBooleanField(
  nodeValue: boolean,
  filter: BooleanFilter
): boolean {
  if (filter === "any") return true;
  return filter === "true" ? nodeValue === true : nodeValue === false;
}

/**
 * 流量統計方式列舉比對
 * - "any"：不參與過濾
 * - 其他值：精確比對
 */
function matchEnumField(
  nodeValue: string | undefined,
  filter: TrafficLimitTypeFilter
): boolean {
  if (filter === "any") return true;
  // 當節點未設定 traffic_limit_type 時，預設行為是 "max"
  const effectiveValue = nodeValue || "max";
  return effectiveValue === filter;
}

/**
 * 將搜尋輸入的價格（貨幣代碼）轉換為 CNY
 * 與 parsePriceToCNY 互補：parsePriceToCNY 處理節點的貨幣符號，此函式處理搜尋下拉的貨幣代碼
 */
function searchPriceToCNY(
  price: number,
  currencyCode: string,
  rates: ExchangeRates
): number {
  switch (currencyCode) {
    case "CNY": return price;
    case "USD": return price / (rates.USD || 0.14);
    case "HKD": return price / (rates.HKD || 1.08);
    case "EUR": return price / (rates.EUR || 0.12);
    case "GBP": return price / (rates.GBP || 0.11);
    case "JPY": return price / (rates.JPY || 22.23);
    case "TWD": return price / (rates.TWD || 4.34);
    default: return price;
  }
}

/**
 * 價格欄位比對（貨幣感知）
 * - isFreeSearch=true：比對 price === -1（不受貨幣影響）
 * - 有匯率時：將搜尋價格和節點價格統一轉換為 CNY 後比較
 * - 無匯率時：直接比較原始數值（向後相容）
 * - isExact 精確比對使用 0.01 容差（匯率轉換浮點誤差）
 */
function matchPriceField(
  node: NodeData,
  filter: PriceFilter,
  rates?: ExchangeRates,
  freeTag: string = DEFAULT_FREE_TAG
): boolean {
  if (filter.isFreeSearch) {
    return node.price === -1 || hasDelimitedTag(node.tags, normalizeFreeTag(freeTag));
  }

  // 取得節點價格（轉 CNY 或直接使用）
  const getNodePriceCNY = (): number => {
    if (rates) return parsePriceToCNY(node, rates).price;
    return node.price;
  };

  // 取得搜尋價格（轉 CNY 或直接使用）
  const getSearchPriceCNY = (val: number): number => {
    if (rates) return searchPriceToCNY(val, filter.currency, rates);
    return val;
  };

  if (filter.isExact) {
    if (!filter.exactValue.trim()) return true;
    const target = parseFloat(filter.exactValue);
    if (isNaN(target)) return true;
    const nodeCNY = getNodePriceCNY();
    const searchCNY = getSearchPriceCNY(target);
    return Math.abs(nodeCNY - searchCNY) < 0.01;
  }
  // 範圍模式
  const hasFrom = filter.rangeFrom.trim() !== "";
  const hasTo = filter.rangeTo.trim() !== "";
  if (!hasFrom && !hasTo) return true;
  const nodeCNY = getNodePriceCNY();
  if (hasFrom && hasTo) {
    const from = parseFloat(filter.rangeFrom);
    const to = parseFloat(filter.rangeTo);
    if (isNaN(from) || isNaN(to)) return true;
    return nodeCNY >= getSearchPriceCNY(from) && nodeCNY <= getSearchPriceCNY(to);
  }
  if (hasFrom) {
    const from = parseFloat(filter.rangeFrom);
    return isNaN(from) ? true : nodeCNY >= getSearchPriceCNY(from);
  }
  const to = parseFloat(filter.rangeTo);
  return isNaN(to) ? true : nodeCNY <= getSearchPriceCNY(to);
}

/**
 * CPU 核心數比對
 * - isExact=true 且 exactValue 為空：不參與過濾
 * - isExact=true 且 exactValue 有值：精確比對（整數）
 * - isExact=false：範圍比對（from/to）
 */
function matchCpuCores(nodeCores: number, filter: CpuCoresFilter): boolean {
  if (filter.isExact) {
    if (!filter.exactValue.trim()) return true;
    const target = parseInt(filter.exactValue, 10);
    if (isNaN(target)) return true;
    return nodeCores === target;
  }
  // 範圍模式
  const hasFrom = filter.rangeFrom.trim() !== "";
  const hasTo = filter.rangeTo.trim() !== "";
  if (!hasFrom && !hasTo) return true;
  if (hasFrom && hasTo) {
    const from = parseInt(filter.rangeFrom, 10);
    const to = parseInt(filter.rangeTo, 10);
    if (isNaN(from) || isNaN(to)) return true;
    return nodeCores >= from && nodeCores <= to;
  }
  if (hasFrom) {
    const from = parseInt(filter.rangeFrom, 10);
    return isNaN(from) ? true : nodeCores >= from;
  }
  const to = parseInt(filter.rangeTo, 10);
  return isNaN(to) ? true : nodeCores <= to;
}

/**
 * 將使用者輸入的 UTC+8 日期字串轉換為 UTC 的 Date 物件
 * 使用者輸入 "2025-03-15" 表示該日期 UTC+8 時間的開始
 */
function userDateToUtcStart(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00+08:00");
}

/**
 * 將使用者輸入的 UTC+8 日期字串轉換為該日結束時間的 UTC Date 物件
 */
function userDateToUtcEnd(dateStr: string): Date {
  return new Date(dateStr + "T23:59:59.999+08:00");
}

/**
 * 日期欄位比對
 * - exact 模式：檢查 expired_at 是否在同一 UTC+8 日曆日內
 * - range 模式：
 *   - 只有 from：>= from 日開始
 *   - 只有 to：<= to 日結束
 *   - 兩者都有：範圍內
 * - 日期為空：不參與過濾
 */
function matchDateField(
  nodeDate: string | null,
  filter: DateFilter
): boolean {
  if (filter.mode === "exact") {
    if (!filter.exactDate.trim()) return true;
    if (!nodeDate) return false;
    const nodeTime = new Date(nodeDate).getTime();
    const dayStart = userDateToUtcStart(filter.exactDate).getTime();
    const dayEnd = userDateToUtcEnd(filter.exactDate).getTime();
    return nodeTime >= dayStart && nodeTime <= dayEnd;
  }

  // range 模式
  const hasFrom = filter.rangeFrom.trim() !== "";
  const hasTo = filter.rangeTo.trim() !== "";
  if (!hasFrom && !hasTo) return true;
  if (!nodeDate) return false;

  const nodeTime = new Date(nodeDate).getTime();

  if (hasFrom && hasTo) {
    const fromTime = userDateToUtcStart(filter.rangeFrom).getTime();
    const toTime = userDateToUtcEnd(filter.rangeTo).getTime();
    return nodeTime >= fromTime && nodeTime <= toTime;
  }
  if (hasFrom) {
    const fromTime = userDateToUtcStart(filter.rangeFrom).getTime();
    return nodeTime >= fromTime;
  }
  // 只有 to
  const toTime = userDateToUtcEnd(filter.rangeTo).getTime();
  return nodeTime <= toTime;
}

/**
 * 範圍欄位比對（mem_total/disk_total/swap_total/traffic_limit）
 * - from 和 to 都為空：不參與過濾
 * - 只有 from：>= from（轉換單位後比較）
 * - 只有 to：<= to（轉換單位後比較）
 * - 兩者都有：範圍內
 */
function matchRangeField(
  nodeValue: number | undefined,
  filter: RangeFilter
): boolean {
  const hasFrom = filter.from.trim() !== "";
  const hasTo = filter.to.trim() !== "";
  if (!hasFrom && !hasTo) return true;

  const actual = nodeValue || 0;

  if (hasFrom && hasTo) {
    const fromBytes = convertToBytes(parseFloat(filter.from), filter.unit);
    const toBytes = convertToBytes(parseFloat(filter.to), filter.unit);
    if (isNaN(fromBytes) || isNaN(toBytes)) return true;
    return actual >= fromBytes && actual <= toBytes;
  }
  if (hasFrom) {
    const fromBytes = convertToBytes(parseFloat(filter.from), filter.unit);
    if (isNaN(fromBytes)) return true;
    return actual >= fromBytes;
  }
  // 只有 to
  const toBytes = convertToBytes(parseFloat(filter.to), filter.unit);
  if (isNaN(toBytes)) return true;
  return actual <= toBytes;
}

/**
 * 交換空間比對
 * - isDisabledSearch=true：比對 swap_total === 0（已關閉 SWAP）
 * - isDisabledSearch=false：使用範圍比對
 */
function matchSwapField(
  nodeValue: number | undefined,
  filter: SwapFilter
): boolean {
  if (filter.isDisabledSearch) {
    return (nodeValue || 0) === 0;
  }
  return matchRangeField(nodeValue, filter);
}

/**
 * 主過濾函式：套用所有進階搜尋條件過濾節點陣列
 * @param rates 可選匯率資料，用於價格欄位的跨幣別比對
 */
export function applyAdvancedFilters(
  nodes: (NodeData & { stats?: any })[],
  state: AdvancedSearchState,
  rates?: ExchangeRates,
  freeTag: string = DEFAULT_FREE_TAG
): (NodeData & { stats?: any })[] {
  return nodes.filter((node) => {
    // 1. 統一文字搜尋：跨所有文字欄位模糊比對
    if (state.textSearch.value.trim() && state.textSearch.keywords.length > 0) {
      const allTextValues = TEXT_FIELD_KEYS
        .map(key => String(node[key as keyof NodeData] || ""))
        .join(" ");
      if (!matchTextField(allTextValues, state.textSearch)) {
        return false;
      }
    }

    // 2. 布林欄位比對
    if (!matchBooleanField(node.auto_renewal, state.auto_renewal)) return false;
    if (!matchBooleanField(node.hidden, state.hidden)) return false;

    // 3. 列舉欄位比對
    if (!matchEnumField(node.traffic_limit_type, state.traffic_limit_type))
      return false;

    // 4. 價格欄位比對（貨幣感知）
    if (!matchPriceField(node, state.price, rates, freeTag)) return false;

    // 5. CPU 核心數比對
    if (!matchCpuCores(node.cpu_cores, state.cpu_cores)) return false;

    // 6. 日期欄位比對
    if (!matchDateField(node.expired_at, state.expired_at)) return false;

    // 7. 範圍欄位比對
    if (!matchRangeField(node.mem_total, state.mem_total)) return false;
    if (!matchRangeField(node.disk_total, state.disk_total)) return false;
    if (!matchSwapField(node.swap_total, state.swap_total)) return false;
    if (!matchRangeField(node.traffic_limit, state.traffic_limit)) return false;

    return true;
  });
}
