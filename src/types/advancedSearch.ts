/**
 * 進階搜尋 -- 型別定義
 *
 * 定義多條件進階搜尋所需的所有欄位篩選器狀態。
 * NodeData 欄位按搜尋行為分類：
 * - Text: 模糊關鍵字搜尋，支援 AND/OR 邏輯
 * - Boolean: 三態下拉（true/false/不限）
 * - Enum: 下拉選擇
 * - Price: 免費搜尋開關 + 精確比對
 * - Number: 整數輸入
 * - Date: 精確日期或範圍
 * - Range: 數值範圍 + 單位選擇
 */

/** 文字欄位關鍵字邏輯運算子 */
export type TextLogicOperator = "and" | "or" | "none";

/** 文字欄位搜尋條件 */
export interface TextFieldFilter {
  value: string; // 原始輸入字串
  operator: TextLogicOperator; // 偵測到的邏輯運算子
  keywords: string[]; // 解析後的關鍵字清單
}

/** 三態布林篩選器 */
export type BooleanFilter = "any" | "true" | "false";

/** 流量統計方式列舉篩選器 */
export type TrafficLimitTypeFilter =
  | "any"
  | "sum"
  | "max"
  | "min"
  | "up"
  | "down";

/** 價格欄位篩選器 */
export interface PriceFilter {
  isFreeSearch: boolean; // 開關：ON = 搜尋免費 (price=-1)
  isExact: boolean; // 開關：ON = 精確比對，OFF = 範圍搜尋（預設）
  exactValue: string; // 精確價格比對值
  rangeFrom: string; // 範圍模式：最低價格
  rangeTo: string; // 範圍模式：最高價格
  currency: string; // 搜尋貨幣代碼，預設 "CNY"，自動匯率轉換
}

/** 日期搜尋模式 */
export type DateSearchMode = "exact" | "range";

/** 日期欄位篩選器 */
export interface DateFilter {
  mode: DateSearchMode; // exact=精確日期, range=範圍
  exactDate: string; // yyyy-mm-dd 格式 (UTC+8 顯示)
  rangeFrom: string; // yyyy-mm-dd
  rangeTo: string; // yyyy-mm-dd
}

/** 記憶體單位 */
export type MemoryUnit = "MB" | "GB";

/** 磁碟單位 */
export type DiskUnit = "MB" | "GB" | "TB" | "PB";

/** 交換空間單位 */
export type SwapUnit = "MB" | "GB";

/** 流量單位 */
export type TrafficUnit = "MB" | "GB" | "TB" | "PB";

/** 數值範圍篩選器（含單位選擇） */
export interface RangeFilter<U extends string = string> {
  from: string; // 起始值（字串用於輸入綁定）
  to: string; // 結束值
  unit: U; // 選擇的單位
}

/** CPU 核心數篩選器 */
export interface CpuCoresFilter {
  isExact: boolean; // 開關：ON = 精確比對，OFF = 範圍搜尋（預設）
  exactValue: string; // 精確核心數
  rangeFrom: string; // 範圍模式：最少核心
  rangeTo: string; // 範圍模式：最多核心
}

/** 交換空間篩選器（擴充範圍篩選器，新增關閉搜尋開關） */
export interface SwapFilter extends RangeFilter<SwapUnit> {
  isDisabledSearch: boolean; // ON = 搜尋已關閉 SWAP 的節點 (swap_total === 0)
}

/** 所有文字型別的欄位名稱 */
export const TEXT_FIELD_KEYS = [
  "uuid",
  "name",
  "cpu_name",
  "virtualization",
  "arch",
  "os",
  "kernel_version",
  "gpu_name",
  "region",
  "currency",
  "group",
  "tags",
  "public_remark",
] as const;

export type TextFieldKey = (typeof TEXT_FIELD_KEYS)[number];

/** 完整的進階搜尋狀態 */
export interface AdvancedSearchState {
  // 統一文字搜尋（模糊搜尋 uuid, name, cpu_name, virtualization, arch, os,
  // kernel_version, gpu_name, region, currency, group, tags, public_remark）
  textSearch: TextFieldFilter;

  // 布林欄位
  auto_renewal: BooleanFilter;
  hidden: BooleanFilter;

  // 列舉欄位
  traffic_limit_type: TrafficLimitTypeFilter;

  // 價格欄位
  price: PriceFilter;

  // 數值欄位
  cpu_cores: CpuCoresFilter;

  // 日期欄位
  expired_at: DateFilter;

  // 範圍欄位
  mem_total: RangeFilter<MemoryUnit>;
  disk_total: RangeFilter<DiskUnit>;
  swap_total: SwapFilter;
  traffic_limit: RangeFilter<TrafficUnit>;
}

/** 校驗錯誤對應 -- key 對應 AdvancedSearchState 欄位名 */
export type ValidationErrors = Partial<Record<string, string>>;

/** 建立空的文字欄位篩選器 */
function emptyTextFilter(): TextFieldFilter {
  return { value: "", operator: "none", keywords: [] };
}

/** 建立預設的進階搜尋狀態 */
export function createDefaultAdvancedSearchState(): AdvancedSearchState {
  return {
    textSearch: emptyTextFilter(),
    auto_renewal: "any",
    hidden: "any",
    traffic_limit_type: "any",
    price: { isFreeSearch: false, isExact: false, exactValue: "", rangeFrom: "", rangeTo: "", currency: "CNY" },
    cpu_cores: { isExact: false, exactValue: "", rangeFrom: "", rangeTo: "" },
    expired_at: { mode: "range", exactDate: "", rangeFrom: "", rangeTo: "" },
    mem_total: { from: "", to: "", unit: "MB" },
    disk_total: { from: "", to: "", unit: "MB" },
    swap_total: { from: "", to: "", unit: "MB", isDisabledSearch: false },
    traffic_limit: { from: "", to: "", unit: "MB" },
  };
}

/** 解析文字輸入為 TextFieldFilter（偵測 & 或 | 分隔符） */
export function parseTextInput(value: string): TextFieldFilter {
  const trimmed = value.trim();
  if (!trimmed) {
    return { value, operator: "none", keywords: [] };
  }

  const hasAnd = trimmed.includes("&");
  const hasOr = trimmed.includes("|");

  if (hasAnd && hasOr) {
    // 混用 & 和 | ，標記為 none 但保留 keywords 為空（校驗時報錯）
    return { value, operator: "none", keywords: [] };
  }

  if (hasAnd) {
    const keywords = trimmed
      .split("&")
      .map((k) => k.trim())
      .filter(Boolean);
    return { value, operator: "and", keywords };
  }

  if (hasOr) {
    const keywords = trimmed
      .split("|")
      .map((k) => k.trim())
      .filter(Boolean);
    return { value, operator: "or", keywords };
  }

  // 單個關鍵字
  return { value, operator: "none", keywords: [trimmed] };
}

/** 檢查進階搜尋狀態是否為預設值（即沒有任何搜尋條件） */
export function isStateDefault(state: AdvancedSearchState): boolean {
  // 檢查統一文字搜尋
  if (state.textSearch.value.trim() !== "") return false;
  // 檢查布林欄位
  if (state.auto_renewal !== "any") return false;
  if (state.hidden !== "any") return false;
  // 檢查列舉欄位
  if (state.traffic_limit_type !== "any") return false;
  // 檢查價格欄位
  if (state.price.isFreeSearch) return false;
  if (state.price.exactValue.trim() !== "") return false;
  if (state.price.rangeFrom.trim() !== "" || state.price.rangeTo.trim() !== "") return false;
  // 檢查 CPU 核心數
  if (state.cpu_cores.exactValue.trim() !== "") return false;
  if (state.cpu_cores.rangeFrom.trim() !== "" || state.cpu_cores.rangeTo.trim() !== "") return false;
  // 檢查日期欄位
  if (state.expired_at.exactDate.trim() !== "") return false;
  if (state.expired_at.rangeFrom.trim() !== "") return false;
  if (state.expired_at.rangeTo.trim() !== "") return false;
  // 檢查交換空間
  if (state.swap_total.isDisabledSearch) return false;
  if (state.swap_total.from.trim() !== "" || state.swap_total.to.trim() !== "") return false;
  // 檢查範圍欄位
  const rangeFields = [
    "mem_total",
    "disk_total",
    "traffic_limit",
  ] as const;
  for (const key of rangeFields) {
    if (state[key].from.trim() !== "" || state[key].to.trim() !== "")
      return false;
  }
  return true;
}
