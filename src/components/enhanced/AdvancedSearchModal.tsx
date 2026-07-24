/**
 * 進階搜尋對話框元件
 *
 * 提供多條件搜尋介面，支援文字/布林/列舉/價格/數值/日期/範圍等多種欄位型別。
 * 遵循 ServerTradeModal 的 bubble-header/close/content 模式。
 * 每個子元件均標註作用及限制。
 */

import { useCallback, useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, RotateCcw } from "lucide-react";
import { useLocale } from "@/config/hooks";
import type {
  AdvancedSearchState,
  ValidationErrors,
  BooleanFilter,
  TrafficLimitTypeFilter,
  PriceFilter,
  CpuCoresFilter,
  SwapFilter,
  MemoryUnit,
  DiskUnit,
  SwapUnit,
  TrafficUnit,
  DateSearchMode,
} from "@/types/advancedSearch";
import { parseTextInput } from "@/types/advancedSearch";
import { CURRENCY_OPTIONS } from "@/components/enhanced/useExchangeRates";
import "./AdvancedSearchModal.css";

// ======================== 工具函式 ========================

/**
 * 價格輸入失焦自動更正
 * 負數（除 -1 外）→ 取絕對值
 */
function correctPriceOnBlur(value: string): string {
  if (!value.trim()) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num < 0 && num !== -1) return Math.abs(num).toString();
  return value;
}

/**
 * CPU 核心數 / 記憶體 / 磁碟 輸入失焦自動更正
 * 0 → "1"，負數 → 取絕對值
 */
function correctZeroAndNegative(value: string): string {
  if (!value.trim()) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num === 0) return "1";
  if (num < 0) return Math.abs(num).toString();
  return value;
}

/**
 * 流量限制輸入失焦自動更正
 * 負數 → 取絕對值（0 允許）
 */
function correctNegativeOnly(value: string): string {
  if (!value.trim()) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num < 0) return Math.abs(num).toString();
  return value;
}

interface AdvancedSearchModalProps {
  /** 目前搜尋狀態 */
  state: AdvancedSearchState;
  /** 更新搜尋狀態 */
  setState: React.Dispatch<React.SetStateAction<AdvancedSearchState>>;
  /** 執行搜尋回呼，回傳校驗錯誤或 null */
  onSearch: () => ValidationErrors | null;
  /** 重置搜尋回呼 */
  onReset: () => void;
  /** 關閉對話框回呼 */
  onClose: () => void;
  /** 是否已登入（控制 hidden 欄位可見性） */
  isAuthenticated: boolean;
  /** 校驗錯誤 */
  validationErrors: ValidationErrors;
  /** 設定校驗錯誤 */
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
}

export function AdvancedSearchModal({
  state,
  setState,
  onSearch,
  onReset,
  onClose,
  isAuthenticated,
  validationErrors,
  setValidationErrors,
}: AdvancedSearchModalProps) {
  const { t } = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }, [isClosing, onClose]);

  // 點擊遮罩層關閉
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  // ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // 搜尋按鈕點擊
  const handleSearch = useCallback(() => {
    onSearch();
  }, [onSearch]);

  // 重置按鈕點擊
  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  /**
   * 更新統一文字搜尋值
   */
  const updateTextSearch = useCallback(
    (value: string) => {
      setState((prev) => ({
        ...prev,
        textSearch: { ...prev.textSearch, value },
      }));
    },
    [setState]
  );

  /**
   * 統一文字搜尋失去焦點時解析關鍵字並校驗
   * 限制：禁止 & 和 | 混用
   */
  const handleTextSearchBlur = useCallback(() => {
    setState((prev) => {
      const parsed = parseTextInput(prev.textSearch.value);
      return { ...prev, textSearch: parsed };
    });
    const value = state.textSearch.value.trim();
    if (value && value.includes("&") && value.includes("|")) {
      setValidationErrors((prev) => ({ ...prev, textSearch: "mixedOperators" }));
    } else {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.textSearch;
        return next;
      });
    }
  }, [setState, state, setValidationErrors]);

  return (
    <div
      className={`advanced-search-overlay${isClosing ? " closing" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`advanced-search-modal${isClosing ? " closing" : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* ========== 頭部：標題 + 關閉按鈕 ========== */}
        <div className="bubble-header">
          <h3 className="bubble-title">
            <Search size={18} />
            {t("advancedSearch.title")}
          </h3>
          <button className="bubble-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        {/* ========== 內容區域 ========== */}
        <div className="advanced-search-content">

          {/* ---- 區域 1：統一文字搜尋 ---- */}
          {/* 在一個輸入框中搜尋 uuid, name, cpu_name 等 13 個文字欄位 */}
          <div className="search-section">
            <div className="search-section-title">
              <Search size={16} />
              {t("advancedSearch.textFields")}
            </div>
            <div className="search-field-item">
              <label className="search-field-label">
                {t("advancedSearch.unifiedTextLabel")}
              </label>
              <Input
                type="text"
                placeholder={t("advancedSearch.unifiedTextPlaceholder")}
                value={state.textSearch.value}
                onChange={(e) => updateTextSearch(e.target.value)}
                onBlur={handleTextSearchBlur}
                maxLength={500}
                className={validationErrors.textSearch ? "search-input-error" : ""}
              />
              <span className="search-field-help">{t("advancedSearch.unifiedTextHelp")}</span>
              {validationErrors.textSearch && (
                <span className="search-field-error">
                  {t(`advancedSearch.validation.${validationErrors.textSearch}`)}
                </span>
              )}
            </div>
          </div>

          {/* ---- 區域 2：選擇欄位（布林 + 列舉） ---- */}
          {/* auto_renewal/hidden 使用三態下拉，traffic_limit_type 使用列舉下拉 */}
          <div className="search-section">
            <div className="search-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              {t("advancedSearch.selectFields")}
            </div>
            <div className="search-fields-grid">
              {/* 自動續費：三態下拉 (不限/是/否) */}
              <BooleanSearchField
                fieldKey="auto_renewal"
                value={state.auto_renewal}
                onChange={(val) =>
                  setState((prev) => ({ ...prev, auto_renewal: val }))
                }
                t={t}
              />

              {/* 隱藏狀態：僅登入後可見 */}
              {isAuthenticated && (
                <BooleanSearchField
                  fieldKey="hidden"
                  value={state.hidden}
                  onChange={(val) =>
                    setState((prev) => ({ ...prev, hidden: val }))
                  }
                  t={t}
                />
              )}

              {/* 流量統計方式：列舉下拉 */}
              <EnumSearchField
                value={state.traffic_limit_type}
                onChange={(val) =>
                  setState((prev) => ({ ...prev, traffic_limit_type: val }))
                }
                t={t}
              />
            </div>
          </div>

          {/* ---- 區域 3：數值欄位（價格 + CPU 核心數）—— 無分界線 ---- */}
          <div className="search-section">
            <div className="search-section-title search-section-title-no-border">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {t("advancedSearch.numericFields")}
            </div>

            {/* 價格欄位：免費開關 + 精確/範圍切換 */}
            <PriceSearchField
              state={state.price}
              onChange={(price) => setState((prev) => ({ ...prev, price }))}
              errors={validationErrors}
              t={t}
            />

            {/* CPU 核心數：精確/範圍切換 */}
            <CpuCoresSearchField
              state={state.cpu_cores}
              onChange={(cpu_cores) => setState((prev) => ({ ...prev, cpu_cores }))}
              errors={validationErrors}
              t={t}
            />
          </div>

          {/* ---- 區域 4：日期欄位 ---- */}
          {/* expired_at：精確日期或範圍搜尋，UTC+8 時間 */}
          <div className="search-section">
            <div className="search-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {t("advancedSearch.dateFields")}
            </div>
            <DateSearchField
              state={state.expired_at}
              onChange={(expired_at) =>
                setState((prev) => ({ ...prev, expired_at }))
              }
              errors={validationErrors}
              t={t}
            />
          </div>

          {/* ---- 區域 5：範圍欄位（記憶體/磁碟/流量）—— 無分界線 ---- */}
          {/* 每個欄位有 from/to 輸入框 + 單位下拉 */}
          <div className="search-section">
            <div className="search-section-title search-section-title-no-border">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
              {t("advancedSearch.rangeFields")}
            </div>

            {/* 新增關閉搜尋開關：ON=搜尋已關閉 SWAP 的節點，OFF=範圍搜尋 */}
            <SwapSearchField
                state={state.swap_total}
                onChange={(swap_total) =>
                    setState((prev) => ({ ...prev, swap_total }))
                }
                errors={validationErrors}
                t={t}
            />

            {/* 記憶體：不允許為 0，單位 MB/GB */}
            <RangeSearchField<MemoryUnit>
              fieldKey="mem_total"
              state={state.mem_total}
              onChange={(val) =>
                setState((prev) => ({ ...prev, mem_total: val }))
              }
              units={["MB", "GB"] as MemoryUnit[]}
              errors={validationErrors}
              onBlurCorrect={correctZeroAndNegative}
              t={t}
            />

            {/* 磁碟：不允許為 0，單位 MB/GB/TB/PB */}
            <RangeSearchField<DiskUnit>
              fieldKey="disk_total"
              state={state.disk_total}
              onChange={(val) =>
                setState((prev) => ({ ...prev, disk_total: val }))
              }
              units={["MB", "GB", "TB", "PB"] as DiskUnit[]}
              errors={validationErrors}
              onBlurCorrect={correctZeroAndNegative}
              t={t}
            />

            {/* 流量限制：允許為 0，單位 MB/GB/TB/PB */}
            <RangeSearchField<TrafficUnit>
              fieldKey="traffic_limit"
              state={state.traffic_limit}
              onChange={(val) =>
                setState((prev) => ({ ...prev, traffic_limit: val }))
              }
              units={["MB", "GB", "TB", "PB"] as TrafficUnit[]}
              errors={validationErrors}
              onBlurCorrect={correctNegativeOnly}
              t={t}
            />
          </div>
        </div>

        {/* ========== 底部操作列 ========== */}
        <div className="advanced-search-footer">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw size={14} className="mr-1" />
            {t("advancedSearch.reset")}
          </Button>
          <Button size="sm" onClick={handleSearch}>
            <Search size={14} className="mr-1" />
            {t("advancedSearch.search")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ======================== 子元件 ========================

/**
 * 布林欄位搜尋（三態下拉）
 * 作用：選擇 不限/是/否 進行布林欄位過濾
 * 限制：hidden 欄位僅在登入後顯示（由父元件控制）
 */
function BooleanSearchField({
  fieldKey,
  value,
  onChange,
  t,
}: {
  fieldKey: "auto_renewal" | "hidden";
  value: BooleanFilter;
  onChange: (val: BooleanFilter) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="search-field-item">
      <label className="search-field-label">
        {t(`advancedSearch.field.${fieldKey}`)}
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as BooleanFilter)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{t("advancedSearch.noLimit")}</SelectItem>
          <SelectItem value="true">{t("advancedSearch.true")}</SelectItem>
          <SelectItem value="false">{t("advancedSearch.false")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * 流量統計方式列舉搜尋
 * 作用：選擇 不限/sum/max/min/up/down 進行列舉欄位過濾
 * 限制：預設選中「不限」
 */
function EnumSearchField({
  value,
  onChange,
  t,
}: {
  value: TrafficLimitTypeFilter;
  onChange: (val: TrafficLimitTypeFilter) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="search-field-item">
      <label className="search-field-label">
        {t("advancedSearch.field.traffic_limit_type")}
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TrafficLimitTypeFilter)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{t("advancedSearch.noLimit")}</SelectItem>
          <SelectItem value="sum">{t("advancedSearch.trafficType.sum")}</SelectItem>
          <SelectItem value="max">{t("advancedSearch.trafficType.max")}</SelectItem>
          <SelectItem value="min">{t("advancedSearch.trafficType.min")}</SelectItem>
          <SelectItem value="up">{t("advancedSearch.trafficType.up")}</SelectItem>
          <SelectItem value="down">{t("advancedSearch.trafficType.down")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * 價格搜尋欄位
 * 作用：三種搜尋模式
 *   - 免費搜尋開關：搜尋 price === -1
 *   - 精確搜尋：輸入精確價格比對
 *   - 範圍搜尋（預設）：輸入最低/最高價格範圍
 * 限制：免費開關優先順序最高，開啟時停用其他輸入
 * 失焦校正：負數（除 -1 外）自動更正為正數
 */
function PriceSearchField({
  state,
  onChange,
  errors,
  t,
}: {
  state: PriceFilter;
  onChange: (val: PriceFilter) => void;
  errors: ValidationErrors;
  t: (key: string) => string;
}) {
  const fromError = errors.price_from;
  const toError = errors.price_to;
  const rangeError = errors.price;

  return (
    <div className="search-field-item" style={{ marginBottom: 12 }}>
      <label className="search-field-label">
        {t("advancedSearch.field.price")}
      </label>
      <div className="search-toggle-row">
        {/* 免費搜尋開關 */}
        <Switch
          checked={state.isFreeSearch}
          onCheckedChange={(checked) =>
            onChange({ ...state, isFreeSearch: checked })
          }
        />
        <span className="search-toggle-label">
          {t("advancedSearch.priceFreeToggle")}
        </span>
      </div>
      {!state.isFreeSearch && (
        <>
          <div className="search-toggle-row">
            {/* 精確/範圍模式開關：ON=精確，OFF=範圍（預設） */}
            <Switch
              checked={state.isExact}
              onCheckedChange={(checked) =>
                onChange({ ...state, isExact: checked })
              }
            />
            <span className="search-toggle-label">
              {state.isExact
                ? t("advancedSearch.exactToggle")
                : t("advancedSearch.rangeToggle")}
            </span>
          </div>
          {state.isExact ? (
            <div className="search-range-row">
              <div className="search-range-input">
                <Input
                  type="number"
                  placeholder={t("advancedSearch.priceExactPlaceholder")}
                  value={state.exactValue}
                  onChange={(e) =>
                    onChange({ ...state, exactValue: e.target.value })
                  }
                  onBlur={() => {
                    const corrected = correctPriceOnBlur(state.exactValue);
                    if (corrected !== state.exactValue) {
                      onChange({ ...state, exactValue: corrected });
                    }
                  }}
                  maxLength={16}
                  className={rangeError ? "search-input-error" : ""}
                />
              </div>
              <div className="search-range-unit">
                <Select
                  value={state.currency}
                  onValueChange={(val) => onChange({ ...state, currency: val })}
                >
                  <SelectTrigger>
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
              </div>
            </div>
          ) : (
            <div className="search-range-row">
              <div className="search-range-input">
                <Input
                  type="number"
                  placeholder={t("advancedSearch.rangeFrom")}
                  value={state.rangeFrom}
                  onChange={(e) =>
                    onChange({ ...state, rangeFrom: e.target.value })
                  }
                  onBlur={() => {
                    const corrected = correctPriceOnBlur(state.rangeFrom);
                    if (corrected !== state.rangeFrom) {
                      onChange({ ...state, rangeFrom: corrected });
                    }
                  }}
                  maxLength={16}
                  className={fromError || rangeError ? "search-input-error" : ""}
                />
              </div>
              <span className="search-range-separator">~</span>
              <div className="search-range-input">
                <Input
                  type="number"
                  placeholder={t("advancedSearch.rangeTo")}
                  value={state.rangeTo}
                  onChange={(e) =>
                    onChange({ ...state, rangeTo: e.target.value })
                  }
                  onBlur={() => {
                    const corrected = correctPriceOnBlur(state.rangeTo);
                    if (corrected !== state.rangeTo) {
                      onChange({ ...state, rangeTo: corrected });
                    }
                  }}
                  maxLength={16}
                  className={toError || rangeError ? "search-input-error" : ""}
                />
              </div>
              <div className="search-range-unit">
                <Select
                  value={state.currency}
                  onValueChange={(val) => onChange({ ...state, currency: val })}
                >
                  <SelectTrigger>
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
              </div>
            </div>
          )}
        </>
      )}
      <span className="search-field-help">{t("advancedSearch.priceHelp")}</span>
      {fromError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeFrom")}: {t(`advancedSearch.validation.${fromError}`)}
        </span>
      )}
      {toError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeTo")}: {t(`advancedSearch.validation.${toError}`)}
        </span>
      )}
      {rangeError && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${rangeError}`)}
        </span>
      )}
    </div>
  );
}

/**
 * CPU 核心數搜尋欄位
 * 作用：兩種搜尋模式
 *   - 精確搜尋：輸入整數進行精確比對
 *   - 範圍搜尋（預設）：輸入最少/最多核心數範圍
 * 限制：必須為正整數，不允許為 0，為空則不參與搜尋
 * 失焦校正：0 → 1，負數 → 取絕對值
 */
function CpuCoresSearchField({
  state,
  onChange,
  errors,
  t,
}: {
  state: CpuCoresFilter;
  onChange: (val: CpuCoresFilter) => void;
  errors: ValidationErrors;
  t: (key: string) => string;
}) {
  const fromError = errors.cpu_cores_from;
  const toError = errors.cpu_cores_to;
  const rangeError = errors.cpu_cores;

  const handleBlur = (field: "exactValue" | "rangeFrom" | "rangeTo") => {
    const corrected = correctZeroAndNegative(state[field]);
    if (corrected !== state[field]) {
      onChange({ ...state, [field]: corrected });
    }
  };

  return (
    <div className="search-field-item" style={{ marginBottom: 12 }}>
      <label className="search-field-label">
        {t("advancedSearch.field.cpu_cores")}
      </label>
      <div className="search-toggle-row">
        {/* 精確/範圍模式開關：ON=精確，OFF=範圍（預設） */}
        <Switch
          checked={state.isExact}
          onCheckedChange={(checked) =>
            onChange({ ...state, isExact: checked })
          }
        />
        <span className="search-toggle-label">
          {state.isExact
            ? t("advancedSearch.exactToggle")
            : t("advancedSearch.rangeToggle")}
        </span>
      </div>
      {state.isExact ? (
        <Input
          type="number"
          placeholder={t("advancedSearch.cpuCoresPlaceholder")}
          value={state.exactValue}
          onChange={(e) => onChange({ ...state, exactValue: e.target.value })}
          onBlur={() => handleBlur("exactValue")}
          step="1"
          min="1"
          maxLength={16}
          className={rangeError ? "search-input-error" : ""}
        />
      ) : (
        <div className="search-range-row">
          <div className="search-range-input">
            <Input
              type="number"
              placeholder={t("advancedSearch.rangeFrom")}
              value={state.rangeFrom}
              onChange={(e) =>
                onChange({ ...state, rangeFrom: e.target.value })
              }
              onBlur={() => handleBlur("rangeFrom")}
              step="1"
              min="1"
              maxLength={16}
              className={fromError || rangeError ? "search-input-error" : ""}
            />
          </div>
          <span className="search-range-separator">~</span>
          <div className="search-range-input">
            <Input
              type="number"
              placeholder={t("advancedSearch.rangeTo")}
              value={state.rangeTo}
              onChange={(e) =>
                onChange({ ...state, rangeTo: e.target.value })
              }
              onBlur={() => handleBlur("rangeTo")}
              step="1"
              min="1"
              maxLength={16}
              className={toError || rangeError ? "search-input-error" : ""}
            />
          </div>
        </div>
      )}
      {fromError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeFrom")}: {t(`advancedSearch.validation.${fromError}`)}
        </span>
      )}
      {toError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeTo")}: {t(`advancedSearch.validation.${toError}`)}
        </span>
      )}
      {rangeError && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${rangeError}`)}
        </span>
      )}
    </div>
  );
}

/**
 * 日期搜尋欄位 (expired_at)
 * 作用：開關切換精確日期/範圍搜尋模式
 *   - 精確模式：單個日期輸入（年月日），比對同一 UTC+8 日曆日
 *   - 範圍模式（預設）：兩個日期輸入（from/to），支援單側範圍
 * 限制：日期輸入為 UTC+8 時間，後台儲存 ISO UTC 格式需轉換
 *       為空則不參與搜尋
 */
function DateSearchField({
  state,
  onChange,
  errors,
  t,
}: {
  state: { mode: DateSearchMode; exactDate: string; rangeFrom: string; rangeTo: string };
  onChange: (val: { mode: DateSearchMode; exactDate: string; rangeFrom: string; rangeTo: string }) => void;
  errors: ValidationErrors;
  t: (key: string) => string;
}) {
  return (
    <div className="search-field-item">
      <label className="search-field-label">
        {t("advancedSearch.field.expired_at")}
      </label>

      {/* 日期模式切換開關：ON=精確日期, OFF=範圍搜尋（預設） */}
      <div className="search-toggle-row">
        <Switch
          checked={state.mode === "exact"}
          onCheckedChange={(checked) =>
            onChange({ ...state, mode: checked ? "exact" : "range" })
          }
        />
        <span className="search-toggle-label">
          {state.mode === "exact"
            ? t("advancedSearch.dateExactMode")
            : t("advancedSearch.dateRangeMode")}
        </span>
      </div>

      {state.mode === "exact" ? (
        /* 精確日期輸入 */
        <input
          type="date"
          className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.expired_at ? "search-input-error" : ""}`}
          value={state.exactDate}
          onChange={(e) => onChange({ ...state, exactDate: e.target.value })}
        />
      ) : (
        /* 範圍日期輸入：from 和 to */
        <div className="search-date-inputs">
          <div className="search-date-input">
            <input
              type="date"
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.expired_at_from ? "search-input-error" : ""}`}
              value={state.rangeFrom}
              onChange={(e) =>
                onChange({ ...state, rangeFrom: e.target.value })
              }
              placeholder={t("advancedSearch.dateFrom")}
            />
          </div>
          <span className="search-range-separator">~</span>
          <div className="search-date-input">
            <input
              type="date"
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.expired_at_to ? "search-input-error" : ""}`}
              value={state.rangeTo}
              onChange={(e) =>
                onChange({ ...state, rangeTo: e.target.value })
              }
              placeholder={t("advancedSearch.dateTo")}
            />
          </div>
        </div>
      )}

      <span className="search-field-help">{t("advancedSearch.dateHelp")}</span>
      {errors.expired_at && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${errors.expired_at}`)}
        </span>
      )}
      {errors.expired_at_from && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${errors.expired_at_from}`)}
        </span>
      )}
      {errors.expired_at_to && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${errors.expired_at_to}`)}
        </span>
      )}
    </div>
  );
}

/**
 * 交換空間搜尋欄位
 * 作用：
 *   - 關閉搜尋開關 ON：搜尋已關閉 SWAP 的節點 (swap_total === 0)
 *   - 關閉搜尋開關 OFF：使用 from/to 範圍搜尋 + 單位下拉
 * 限制：為空則不參與搜尋
 */
function SwapSearchField({
  state,
  onChange,
  errors,
  t,
}: {
  state: SwapFilter;
  onChange: (val: SwapFilter) => void;
  errors: ValidationErrors;
  t: (key: string) => string;
}) {
  const fromError = errors.swap_total_from;
  const toError = errors.swap_total_to;
  const rangeError = errors.swap_total;

  return (
    <div className="search-section">
      <div className="search-field-item" style={{ marginBottom: 12 }}>
        <label className="search-field-label">
          {t("advancedSearch.field.swap_total")}
        </label>
        <div className="search-toggle-row">
          {/* 關閉搜尋開關：ON=搜尋已關閉 SWAP 的節點(0)，OFF=範圍搜尋 */}
          <Switch
            checked={state.isDisabledSearch}
            onCheckedChange={(checked) =>
              onChange({ ...state, isDisabledSearch: checked })
            }
          />
          <span className="search-toggle-label">
            {t("advancedSearch.swapDisabledToggle")}
          </span>
        </div>
        {!state.isDisabledSearch && (
          <div className="search-range-row">
            {/* 最小值輸入 */}
            <div className="search-range-input">
              <Input
                type="number"
                placeholder={t("advancedSearch.rangeFrom")}
                value={state.from}
                onChange={(e) => onChange({ ...state, from: e.target.value })}
                onBlur={() => {
                  const corrected = correctNegativeOnly(state.from);
                  if (corrected !== state.from) {
                    onChange({ ...state, from: corrected });
                  }
                }}
                step="0.01"
                maxLength={16}
                className={fromError || rangeError ? "search-input-error" : ""}
              />
            </div>
            <span className="search-range-separator">~</span>
            {/* 最大值輸入 */}
            <div className="search-range-input">
              <Input
                type="number"
                placeholder={t("advancedSearch.rangeTo")}
                value={state.to}
                onChange={(e) => onChange({ ...state, to: e.target.value })}
                onBlur={() => {
                  const corrected = correctNegativeOnly(state.to);
                  if (corrected !== state.to) {
                    onChange({ ...state, to: corrected });
                  }
                }}
                step="0.01"
                maxLength={16}
                className={toError || rangeError ? "search-input-error" : ""}
              />
            </div>
            {/* 單位選擇下拉 */}
            <div className="search-range-unit">
              <Select
                value={state.unit}
                onValueChange={(val) => onChange({ ...state, unit: val as SwapUnit })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["MB", "GB"] as SwapUnit[]).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <span className="search-field-help">{t("advancedSearch.swapHelp")}</span>
        {fromError && (
          <span className="search-field-error">
            {t("advancedSearch.rangeFrom")}: {t(`advancedSearch.validation.${fromError}`)}
          </span>
        )}
        {toError && (
          <span className="search-field-error">
            {t("advancedSearch.rangeTo")}: {t(`advancedSearch.validation.${toError}`)}
          </span>
        )}
        {rangeError && (
          <span className="search-field-error">
            {t(`advancedSearch.validation.${rangeError}`)}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * 範圍搜尋欄位（mem_total/disk_total/traffic_limit）
 * 作用：兩個數字輸入框（from/to）+ 單位下拉
 *   - 只填 from：大於等於
 *   - 只填 to：小於等於
 *   - 兩個都填：範圍內
 * 限制：
 *   - 小數最多精確到兩位
 *   - to 必須大於 from
 *   - 輸入框最大長度 16，防止 JS 溢位
 *   - 為空則不參與搜尋
 *   - onBlurCorrect: 失焦時自動更正值
 */
function RangeSearchField<U extends string>({
  fieldKey,
  state,
  onChange,
  units,
  errors,
  onBlurCorrect,
  t,
}: {
  fieldKey: string;
  state: { from: string; to: string; unit: U };
  onChange: (val: { from: string; to: string; unit: U }) => void;
  units: U[];
  errors: ValidationErrors;
  onBlurCorrect?: (value: string) => string;
  t: (key: string) => string;
}) {
  const fromError = errors[`${fieldKey}_from`];
  const toError = errors[`${fieldKey}_to`];
  const rangeError = errors[fieldKey];

  return (
    <div className="search-field-item" style={{ marginBottom: 12 }}>
      <label className="search-field-label">
        {t(`advancedSearch.field.${fieldKey}`)}
      </label>
      <div className="search-range-row">
        {/* 最小值輸入 */}
        <div className="search-range-input">
          <Input
            type="number"
            placeholder={t("advancedSearch.rangeFrom")}
            value={state.from}
            onChange={(e) => onChange({ ...state, from: e.target.value })}
            onBlur={onBlurCorrect ? () => {
              const corrected = onBlurCorrect(state.from);
              if (corrected !== state.from) {
                onChange({ ...state, from: corrected });
              }
            } : undefined}
            step="0.01"
            maxLength={16}
            className={fromError || rangeError ? "search-input-error" : ""}
          />
        </div>
        <span className="search-range-separator">~</span>
        {/* 最大值輸入 */}
        <div className="search-range-input">
          <Input
            type="number"
            placeholder={t("advancedSearch.rangeTo")}
            value={state.to}
            onChange={(e) => onChange({ ...state, to: e.target.value })}
            onBlur={onBlurCorrect ? () => {
              const corrected = onBlurCorrect(state.to);
              if (corrected !== state.to) {
                onChange({ ...state, to: corrected });
              }
            } : undefined}
            step="0.01"
            maxLength={16}
            className={toError || rangeError ? "search-input-error" : ""}
          />
        </div>
        {/* 單位選擇下拉 */}
        <div className="search-range-unit">
          <Select
            value={state.unit}
            onValueChange={(val) => onChange({ ...state, unit: val as U })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {fromError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeFrom")}: {t(`advancedSearch.validation.${fromError}`)}
        </span>
      )}
      {toError && (
        <span className="search-field-error">
          {t("advancedSearch.rangeTo")}: {t(`advancedSearch.validation.${toError}`)}
        </span>
      )}
      {rangeError && (
        <span className="search-field-error">
          {t(`advancedSearch.validation.${rangeError}`)}
        </span>
      )}
    </div>
  );
}
