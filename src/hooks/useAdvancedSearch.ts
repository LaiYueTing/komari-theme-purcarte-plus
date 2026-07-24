/**
 * 進階搜尋狀態管理 Hook
 *
 * 職責：
 * 1. 管理 AdvancedSearchState 狀態
 * 2. URL 參數雙向同步（讀取和寫入）
 * 3. 校驗邏輯
 * 4. 搜尋執行和重置
 */

import { useAppConfig } from "@/config";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type {
  AdvancedSearchState,
  ValidationErrors,
  BooleanFilter,
  TrafficLimitTypeFilter,
  DateSearchMode,
} from "@/types/advancedSearch";
import {
  createDefaultAdvancedSearchState,
  isStateDefault,
  parseTextInput,
} from "@/types/advancedSearch";

/** 最大輸入長度限制，防止 JS 數值溢位 */
const MAX_INPUT_LENGTH = 16;

// ======================== URL 參數編碼/解碼 ========================

/** URL 參數前綴常數 */
const URL_PREFIX = {
  text: "t_",
  bool: "b_",
  enum: "e_",
  price: "p_",
  number: "n_",
  date: "d_",
  range: "r_",
} as const;

/** 合法的布林過濾值 */
const VALID_BOOL_VALUES = new Set(["true", "false"]);

/** 合法的流量統計方式值 */
const VALID_TLT_VALUES = new Set(["sum", "max", "min", "up", "down"]);

/** 合法的搜尋貨幣代碼 */
const VALID_CURRENCIES = new Set(["CNY", "USD", "HKD", "EUR", "GBP", "JPY", "TWD"]);

/** 合法的日期模式值 */
const VALID_DATE_MODES = new Set(["exact", "range"]);

/** 合法的單位值（按欄位） */
const VALID_UNITS: Record<string, Set<string>> = {
  mem_total: new Set(["MB", "GB"]),
  disk_total: new Set(["MB", "GB", "TB", "PB"]),
  swap_total: new Set(["MB", "GB"]),
  traffic_limit: new Set(["MB", "GB", "TB", "PB"]),
};

/** 日期格式校驗正規表達式 yyyy-mm-dd */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 將 AdvancedSearchState 序列化為 URL 查詢字串
 * 只序列化非空、非預設值的欄位
 */
function serializeStateToUrl(state: AdvancedSearchState): string {
  const params = new URLSearchParams();

  // 統一文字搜尋
  if (state.textSearch.value.trim()) {
    params.set(`${URL_PREFIX.text}q`, state.textSearch.value.trim());
  }

  // 布林欄位
  if (state.auto_renewal !== "any") {
    params.set(`${URL_PREFIX.bool}auto_renewal`, state.auto_renewal);
  }
  if (state.hidden !== "any") {
    params.set(`${URL_PREFIX.bool}hidden`, state.hidden);
  }

  // 列舉欄位
  if (state.traffic_limit_type !== "any") {
    params.set(`${URL_PREFIX.enum}tlt`, state.traffic_limit_type);
  }

  // 價格欄位
  if (state.price.isFreeSearch) {
    params.set(`${URL_PREFIX.price}free`, "1");
  } else if (state.price.isExact) {
    // 精確模式（非預設）
    if (state.price.exactValue.trim()) {
      params.set(`${URL_PREFIX.price}val`, state.price.exactValue.trim());
    }
  } else {
    // 範圍模式（預設）
    if (state.price.rangeFrom.trim()) {
      params.set(`${URL_PREFIX.price}from`, state.price.rangeFrom.trim());
    }
    if (state.price.rangeTo.trim()) {
      params.set(`${URL_PREFIX.price}to`, state.price.rangeTo.trim());
    }
  }
  // 價格貨幣（非 CNY 時才寫入）
  if (state.price.currency && state.price.currency !== "CNY") {
    params.set(`${URL_PREFIX.price}cur`, state.price.currency);
  }

  // CPU 核心數
  if (state.cpu_cores.isExact) {
    // 精確模式（非預設）
    if (state.cpu_cores.exactValue.trim()) {
      params.set(`${URL_PREFIX.number}cpu`, state.cpu_cores.exactValue.trim());
    }
  } else {
    // 範圍模式（預設）
    if (state.cpu_cores.rangeFrom.trim()) {
      params.set(`${URL_PREFIX.number}cpu_from`, state.cpu_cores.rangeFrom.trim());
    }
    if (state.cpu_cores.rangeTo.trim()) {
      params.set(`${URL_PREFIX.number}cpu_to`, state.cpu_cores.rangeTo.trim());
    }
  }

  // 日期欄位
  if (state.expired_at.mode === "exact") {
    // 精確模式（非預設）
    params.set(`${URL_PREFIX.date}mode`, "exact");
    if (state.expired_at.exactDate.trim()) {
      params.set(`${URL_PREFIX.date}exact`, state.expired_at.exactDate.trim());
    }
  } else {
    // 範圍模式（預設）
    if (state.expired_at.rangeFrom.trim()) {
      params.set(`${URL_PREFIX.date}from`, state.expired_at.rangeFrom.trim());
    }
    if (state.expired_at.rangeTo.trim()) {
      params.set(`${URL_PREFIX.date}to`, state.expired_at.rangeTo.trim());
    }
  }

  // 範圍欄位（不含 swap，swap 單獨處理）
  const rangeFields = [
    "mem_total",
    "disk_total",
    "traffic_limit",
  ] as const;
  for (const key of rangeFields) {
    const filter = state[key];
    if (filter.from.trim()) {
      params.set(`${URL_PREFIX.range}${key}_from`, filter.from.trim());
    }
    if (filter.to.trim()) {
      params.set(`${URL_PREFIX.range}${key}_to`, filter.to.trim());
    }
    if (
      filter.unit !== "MB" &&
      (filter.from.trim() || filter.to.trim())
    ) {
      params.set(`${URL_PREFIX.range}${key}_u`, filter.unit);
    }
  }

  // 交換空間（單獨處理：支援關閉搜尋開關）
  if (state.swap_total.isDisabledSearch) {
    params.set(`${URL_PREFIX.range}swap_total_disabled`, "1");
  } else {
    if (state.swap_total.from.trim()) {
      params.set(`${URL_PREFIX.range}swap_total_from`, state.swap_total.from.trim());
    }
    if (state.swap_total.to.trim()) {
      params.set(`${URL_PREFIX.range}swap_total_to`, state.swap_total.to.trim());
    }
    if (
      state.swap_total.unit !== "MB" &&
      (state.swap_total.from.trim() || state.swap_total.to.trim())
    ) {
      params.set(`${URL_PREFIX.range}swap_total_u`, state.swap_total.unit);
    }
  }

  return params.toString();
}

/**
 * 從 URL 查詢字串解析 AdvancedSearchState
 * 無效參數會被靜默丟棄
 */
function parseUrlToState(search: string): AdvancedSearchState {
  const state = createDefaultAdvancedSearchState();
  if (!search || search === "?") return state;

  const params = new URLSearchParams(search);

  // 統一文字搜尋
  const textQ = params.get(`${URL_PREFIX.text}q`);
  if (textQ !== null && textQ.trim()) {
    state.textSearch = parseTextInput(textQ);
  }

  // 布林欄位
  const autoRenewal = params.get(`${URL_PREFIX.bool}auto_renewal`);
  if (autoRenewal !== null && VALID_BOOL_VALUES.has(autoRenewal)) {
    state.auto_renewal = autoRenewal as BooleanFilter;
  }
  const hidden = params.get(`${URL_PREFIX.bool}hidden`);
  if (hidden !== null && VALID_BOOL_VALUES.has(hidden)) {
    state.hidden = hidden as BooleanFilter;
  }

  // 列舉欄位
  const tlt = params.get(`${URL_PREFIX.enum}tlt`);
  if (tlt !== null && VALID_TLT_VALUES.has(tlt)) {
    state.traffic_limit_type = tlt as TrafficLimitTypeFilter;
  }

  // 價格欄位
  const pFree = params.get(`${URL_PREFIX.price}free`);
  const pVal = params.get(`${URL_PREFIX.price}val`);
  const pMode = params.get(`${URL_PREFIX.price}mode`);
  const pFrom = params.get(`${URL_PREFIX.price}from`);
  const pTo = params.get(`${URL_PREFIX.price}to`);
  if (pFree === "1") {
    state.price = { ...state.price, isFreeSearch: true };
  } else if (pVal !== null && pVal.trim() && !isNaN(parseFloat(pVal))) {
    // p_val 存在 → 精確模式（相容舊 URL）
    state.price = { ...state.price, isExact: true, exactValue: pVal.trim() };
  } else if (pMode === "range" || pFrom !== null || pTo !== null) {
    // 顯式範圍模式或有範圍值（相容舊 URL 的 p_mode=range）
    state.price = { ...state.price, isExact: false };
    if (pFrom !== null && pFrom.trim() && !isNaN(parseFloat(pFrom))) {
      state.price.rangeFrom = pFrom.trim();
    }
    if (pTo !== null && pTo.trim() && !isNaN(parseFloat(pTo))) {
      state.price.rangeTo = pTo.trim();
    }
  }
  // 價格貨幣
  const pCur = params.get(`${URL_PREFIX.price}cur`);
  if (pCur !== null && VALID_CURRENCIES.has(pCur)) {
    state.price.currency = pCur;
  }

  // CPU 核心數
  const nCpuMode = params.get(`${URL_PREFIX.number}cpu_mode`);
  const nCpu = params.get(`${URL_PREFIX.number}cpu`);
  const nCpuFrom = params.get(`${URL_PREFIX.number}cpu_from`);
  const nCpuTo = params.get(`${URL_PREFIX.number}cpu_to`);
  if (nCpu !== null && nCpu.trim() && !isNaN(parseInt(nCpu, 10))) {
    // n_cpu 存在 → 精確模式（相容舊 URL）
    state.cpu_cores = { ...state.cpu_cores, isExact: true, exactValue: nCpu.trim() };
  } else if (nCpuMode === "range" || nCpuFrom !== null || nCpuTo !== null) {
    // 顯式範圍模式或有範圍值（相容舊 URL 的 n_cpu_mode=range）
    state.cpu_cores = { ...state.cpu_cores, isExact: false };
    if (nCpuFrom !== null && nCpuFrom.trim() && !isNaN(parseInt(nCpuFrom, 10))) {
      state.cpu_cores.rangeFrom = nCpuFrom.trim();
    }
    if (nCpuTo !== null && nCpuTo.trim() && !isNaN(parseInt(nCpuTo, 10))) {
      state.cpu_cores.rangeTo = nCpuTo.trim();
    }
  }

  // 日期欄位
  const dMode = params.get(`${URL_PREFIX.date}mode`);
  if (dMode !== null && VALID_DATE_MODES.has(dMode)) {
    state.expired_at.mode = dMode as DateSearchMode;
  }
  const dExact = params.get(`${URL_PREFIX.date}exact`);
  if (dExact !== null && DATE_REGEX.test(dExact)) {
    state.expired_at.exactDate = dExact;
    // d_exact 存在則隱式設為精確模式（相容舊 URL）
    if (!dMode) state.expired_at.mode = "exact";
  }
  const dFrom = params.get(`${URL_PREFIX.date}from`);
  if (dFrom !== null && DATE_REGEX.test(dFrom)) {
    state.expired_at.rangeFrom = dFrom;
  }
  const dTo = params.get(`${URL_PREFIX.date}to`);
  if (dTo !== null && DATE_REGEX.test(dTo)) {
    state.expired_at.rangeTo = dTo;
  }

  // 範圍欄位（不含 swap，swap 單獨處理）
  const rangeFields = [
    "mem_total",
    "disk_total",
    "traffic_limit",
  ] as const;
  for (const key of rangeFields) {
    const from = params.get(`${URL_PREFIX.range}${key}_from`);
    const to = params.get(`${URL_PREFIX.range}${key}_to`);
    const unit = params.get(`${URL_PREFIX.range}${key}_u`);

    if (from !== null && from.trim() && !isNaN(parseFloat(from))) {
      state[key].from = from.trim();
    }
    if (to !== null && to.trim() && !isNaN(parseFloat(to))) {
      state[key].to = to.trim();
    }
    if (unit !== null && VALID_UNITS[key]?.has(unit)) {
      (state[key] as { unit: string }).unit = unit;
    }
  }

  // 交換空間（單獨處理：支援關閉搜尋開關）
  const swapDisabled = params.get(`${URL_PREFIX.range}swap_total_disabled`);
  if (swapDisabled === "1") {
    state.swap_total.isDisabledSearch = true;
  } else {
    const swapFrom = params.get(`${URL_PREFIX.range}swap_total_from`);
    const swapTo = params.get(`${URL_PREFIX.range}swap_total_to`);
    const swapUnit = params.get(`${URL_PREFIX.range}swap_total_u`);
    if (swapFrom !== null && swapFrom.trim() && !isNaN(parseFloat(swapFrom))) {
      state.swap_total.from = swapFrom.trim();
    }
    if (swapTo !== null && swapTo.trim() && !isNaN(parseFloat(swapTo))) {
      state.swap_total.to = swapTo.trim();
    }
    if (swapUnit !== null && VALID_UNITS.swap_total?.has(swapUnit)) {
      state.swap_total.unit = swapUnit as "MB" | "GB";
    }
  }

  return state;
}

// ======================== 校驗邏輯 ========================

/**
 * 校驗進階搜尋狀態
 * 回傳空物件表示校驗通過
 */
function validateState(state: AdvancedSearchState): ValidationErrors {
  const errors: ValidationErrors = {};

  // 1. 統一文字搜尋：檢查 & 和 | 是否混用
  const textValue = state.textSearch.value.trim();
  if (textValue) {
    if (textValue.length > 500) {
      errors.textSearch = "inputTooLong";
    } else {
      const hasAnd = textValue.includes("&");
      const hasOr = textValue.includes("|");
      if (hasAnd && hasOr) {
        errors.textSearch = "mixedOperators";
      }
    }
  }

  // 2. CPU 核心數校驗
  if (state.cpu_cores.isExact) {
    if (state.cpu_cores.exactValue.trim()) {
      const val = state.cpu_cores.exactValue.trim();
      if (val.length > MAX_INPUT_LENGTH) {
        errors.cpu_cores = "inputTooLong";
      } else {
        const num = parseInt(val, 10);
        if (isNaN(num) || num.toString() !== val) {
          errors.cpu_cores = "invalidInteger";
        } else if (num === 0) {
          errors.cpu_cores = "zeroNotAllowed";
        }
      }
    }
  } else {
    const cpuFrom = state.cpu_cores.rangeFrom.trim();
    const cpuTo = state.cpu_cores.rangeTo.trim();
    if (cpuFrom) {
      if (cpuFrom.length > MAX_INPUT_LENGTH) {
        errors.cpu_cores_from = "inputTooLong";
      } else {
        const num = parseInt(cpuFrom, 10);
        if (isNaN(num) || num.toString() !== cpuFrom) {
          errors.cpu_cores_from = "invalidInteger";
        } else if (num === 0) {
          errors.cpu_cores_from = "zeroNotAllowed";
        }
      }
    }
    if (cpuTo) {
      if (cpuTo.length > MAX_INPUT_LENGTH) {
        errors.cpu_cores_to = "inputTooLong";
      } else {
        const num = parseInt(cpuTo, 10);
        if (isNaN(num) || num.toString() !== cpuTo) {
          errors.cpu_cores_to = "invalidInteger";
        } else if (num === 0) {
          errors.cpu_cores_to = "zeroNotAllowed";
        }
      }
    }
    if (cpuFrom && cpuTo && !errors.cpu_cores_from && !errors.cpu_cores_to) {
      if (parseInt(cpuTo, 10) <= parseInt(cpuFrom, 10)) {
        errors.cpu_cores = "rangeEndLessOrEqual";
      }
    }
  }

  // 3. 價格校驗
  if (!state.price.isFreeSearch) {
    if (state.price.isExact) {
      if (state.price.exactValue.trim()) {
        const val = state.price.exactValue.trim();
        if (val.length > MAX_INPUT_LENGTH) {
          errors.price = "inputTooLong";
        } else if (isNaN(parseFloat(val))) {
          errors.price = "invalidNumber";
        }
      }
    } else {
      const priceFrom = state.price.rangeFrom.trim();
      const priceTo = state.price.rangeTo.trim();
      if (priceFrom) {
        if (priceFrom.length > MAX_INPUT_LENGTH) {
          errors.price_from = "inputTooLong";
        } else if (isNaN(parseFloat(priceFrom))) {
          errors.price_from = "invalidNumber";
        }
      }
      if (priceTo) {
        if (priceTo.length > MAX_INPUT_LENGTH) {
          errors.price_to = "inputTooLong";
        } else if (isNaN(parseFloat(priceTo))) {
          errors.price_to = "invalidNumber";
        }
      }
      if (priceFrom && priceTo && !errors.price_from && !errors.price_to) {
        if (parseFloat(priceTo) <= parseFloat(priceFrom)) {
          errors.price = "rangeEndLessOrEqual";
        }
      }
    }
  }

  // 4. 日期範圍校驗
  if (state.expired_at.mode === "range") {
    const from = state.expired_at.rangeFrom.trim();
    const to = state.expired_at.rangeTo.trim();
    if (from && !DATE_REGEX.test(from)) {
      errors.expired_at_from = "invalidDate";
    }
    if (to && !DATE_REGEX.test(to)) {
      errors.expired_at_to = "invalidDate";
    }
    if (from && to && DATE_REGEX.test(from) && DATE_REGEX.test(to)) {
      if (new Date(to).getTime() <= new Date(from).getTime()) {
        errors.expired_at = "dateRangeInvalid";
      }
    }
  } else if (state.expired_at.mode === "exact") {
    const exact = state.expired_at.exactDate.trim();
    if (exact && !DATE_REGEX.test(exact)) {
      errors.expired_at = "invalidDate";
    }
  }

  // 5. 範圍欄位校驗（不含 swap，swap 單獨處理）
  const rangeFieldsConfig = [
    { key: "mem_total", allowZero: false },
    { key: "disk_total", allowZero: false },
    { key: "traffic_limit", allowZero: true },
  ] as const;

  for (const { key, allowZero } of rangeFieldsConfig) {
    const filter = state[key];
    const from = filter.from.trim();
    const to = filter.to.trim();

    // 校驗 from
    if (from) {
      if (from.length > MAX_INPUT_LENGTH) {
        errors[`${key}_from`] = "inputTooLong";
      } else {
        const num = parseFloat(from);
        if (isNaN(num)) {
          errors[`${key}_from`] = "invalidNumber";
        } else if (!allowZero && num === 0) {
          errors[`${key}_from`] = "zeroNotAllowed";
        } else {
          // 小數位數檢查（最多 2 位）
          const decimalPart = from.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            errors[`${key}_from`] = "tooManyDecimals";
          }
        }
      }
    }

    // 校驗 to
    if (to) {
      if (to.length > MAX_INPUT_LENGTH) {
        errors[`${key}_to`] = "inputTooLong";
      } else {
        const num = parseFloat(to);
        if (isNaN(num)) {
          errors[`${key}_to`] = "invalidNumber";
        } else if (!allowZero && num === 0) {
          errors[`${key}_to`] = "zeroNotAllowed";
        } else {
          const decimalPart = to.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            errors[`${key}_to`] = "tooManyDecimals";
          }
        }
      }
    }

    // from/to 範圍校驗：to 不能 <= from
    if (from && to && !errors[`${key}_from`] && !errors[`${key}_to`]) {
      const fromNum = parseFloat(from);
      const toNum = parseFloat(to);
      if (!isNaN(fromNum) && !isNaN(toNum) && toNum <= fromNum) {
        errors[`${key}`] = "rangeEndLessOrEqual";
      }
    }
  }

  // 6. 交換空間校驗（僅在非關閉搜尋模式下校驗範圍值）
  if (!state.swap_total.isDisabledSearch) {
    const swapFrom = state.swap_total.from.trim();
    const swapTo = state.swap_total.to.trim();
    if (swapFrom) {
      if (swapFrom.length > MAX_INPUT_LENGTH) {
        errors.swap_total_from = "inputTooLong";
      } else {
        const num = parseFloat(swapFrom);
        if (isNaN(num)) {
          errors.swap_total_from = "invalidNumber";
        } else {
          const decimalPart = swapFrom.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            errors.swap_total_from = "tooManyDecimals";
          }
        }
      }
    }
    if (swapTo) {
      if (swapTo.length > MAX_INPUT_LENGTH) {
        errors.swap_total_to = "inputTooLong";
      } else {
        const num = parseFloat(swapTo);
        if (isNaN(num)) {
          errors.swap_total_to = "invalidNumber";
        } else {
          const decimalPart = swapTo.split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            errors.swap_total_to = "tooManyDecimals";
          }
        }
      }
    }
    if (swapFrom && swapTo && !errors.swap_total_from && !errors.swap_total_to) {
      const fromNum = parseFloat(swapFrom);
      const toNum = parseFloat(swapTo);
      if (!isNaN(fromNum) && !isNaN(toNum) && toNum <= fromNum) {
        errors.swap_total = "rangeEndLessOrEqual";
      }
    }
  }

  return errors;
}

// ======================== Hook ========================

export function useAdvancedSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialized = useRef(false);

  // 取得設定，判斷是否真正開啟進階搜尋
  const { enableSearchButton, enableAdvancedSearch } = useAppConfig();
  const isFeatureEnabled = enableSearchButton && enableAdvancedSearch;

  // 從 URL 初始化狀態
  const [state, setState] = useState<AdvancedSearchState>(() =>
    parseUrlToState(window.location.search)
  );

  // 對話框顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 儲存最後一次搜尋執行的校驗錯誤
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // 如果 URL 中有進階搜尋參數，標記已初始化，自動開啟對話框
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      if (isFeatureEnabled) {
        const parsed = parseUrlToState(location.search);
        if (!isStateDefault(parsed)) {
          setState(parsed);
        }
      }
    }
  }, [isFeatureEnabled, location.search]);

  // 計算是否有作用中的搜尋條件
  const isActive = useMemo(
      () => isFeatureEnabled && !isStateDefault(state),
      [state, isFeatureEnabled]
  );

  // 用於搜尋後判斷的已確認搜尋狀態
  const [confirmedState, setConfirmedState] =
    useState<AdvancedSearchState | null>(() => {
      const initial = parseUrlToState(window.location.search);
      return isStateDefault(initial) ? null : initial;
    });

  /**
   * 執行搜尋
   * 1. 校驗狀態
   * 2. 如果校驗通過，序列化到 URL 並關閉對話框
   * 3. 回傳校驗錯誤（null 表示成功）
   */
  const executeSearch = useCallback(() => {
    const errors = validateState(state);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    // 序列化到 URL
    const queryString = serializeStateToUrl(state);
    if (queryString) {
      navigate(`/?${queryString}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }

    setConfirmedState(isStateDefault(state) ? null : { ...state });
    setIsModalOpen(false);
    return null;
  }, [state, navigate]);

  /**
   * 重置所有搜尋條件
   * 清空狀態並導覽到根路徑
   */
  const resetSearch = useCallback(() => {
    const defaultState = createDefaultAdvancedSearchState();
    setState(defaultState);
    setConfirmedState(null);
    setValidationErrors({});
    navigate("/", { replace: true });
  }, [navigate]);

  /**
   * 校驗目前狀態（供外部使用）
   */
  const validate = useCallback(() => validateState(state), [state]);

  return {
    /** 目前編輯中的搜尋狀態 */
    state,
    /** 更新搜尋狀態 */
    setState,
    /** 已確認的搜尋狀態（點擊搜尋後） */
    confirmedState: isFeatureEnabled ? confirmedState : null,
    /** 對話框是否開啟 */
    isModalOpen,
    /** 設定對話框開啟狀態 */
    setIsModalOpen,
    /** 是否有作用中的搜尋條件（基於編輯狀態） */
    isActive,
    /** 是否有已確認的搜尋結果 */
    isSearchApplied: isFeatureEnabled && confirmedState !== null,
    /** 執行搜尋 */
    executeSearch,
    /** 重置搜尋 */
    resetSearch,
    /** 校驗目前狀態 */
    validate,
    /** 最後一次校驗錯誤 */
    validationErrors,
    /** 設定校驗錯誤 */
    setValidationErrors,
  };
}

export type UseAdvancedSearchReturn = ReturnType<typeof useAdvancedSearch>;
