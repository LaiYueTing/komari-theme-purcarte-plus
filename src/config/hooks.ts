import { useContext, useCallback, useEffect, useRef } from "react";
import { ConfigContext } from "./ConfigContext";
import type { ConfigContextType } from "./ConfigContext";
import { DEFAULT_CONFIG } from "./default";
import { defaultTexts, otherTexts } from "./locales";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { parseCustomTexts, unflattenObject } from "@/utils/localeUtils";

/**
 * 安全地取得巢狀物件的屬性
 * @param obj 要查詢的物件
 * @param path 屬性路徑
 * @param defaultValue 如果解析值為 undefined，則回傳此值
 * @returns 解析後的值
 */
const get = (obj: any, path: string, defaultValue: any = undefined) => {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

type Paths<T, P extends string = ""> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? Paths<T[K], `${P}${Exclude<K, symbol>}.`>
        : `${P}${Exclude<K, symbol>}`;
    }[keyof T]
  : never;

type MergedTexts = typeof defaultTexts & typeof otherTexts;
type LocaleKeys = Paths<MergedTexts>;

/**
 * 使用全域設定 Hook，用於取得目前應用設定
 * @returns 設定物件（合併了預設設定，確保所有屬性都有值）
 */
export function useAppConfig(): ConfigContextType {
  const config = useContext(ConfigContext);
  // 從上下文中過濾掉 undefined/null 值，以防止
  // 覆蓋 DEFAULT_CONFIG 的預設值（修復 React 錯誤 #130）
  const safeConfig = Object.fromEntries(
    Object.entries(config).filter(([, v]) => v !== undefined && v !== null)
  );
  return { ...DEFAULT_CONFIG, ...safeConfig } as ConfigContextType;
}

/**
 * 使用在地化文字 Hook（橋接 i18next）
 * 優先順序：i18next 翻譯 > 自訂文字覆蓋 > locales.ts 預設值
 * @returns t 函式用於取得翻譯文字，i18n 實例用於語言切換
 */
export function useLocale() {
  const appConfig = useAppConfig();
  const { texts } = appConfig;
  const rawCustomTexts = appConfig.customTexts;
  const { i18n } = useTranslation();
  const prevCustomTextsRef = useRef<string | null>(null);

  // 僅注入後台自訂文字覆蓋到 i18next，而非完整的中文預設文字
  // 舊版注入完整 texts 會汙染非中文語言包，導致切換語言後回退中文
  useEffect(() => {
    if (rawCustomTexts === prevCustomTextsRef.current) return;
    prevCustomTextsRef.current = rawCustomTexts;

    if (!rawCustomTexts) return;
    const parsed = parseCustomTexts(rawCustomTexts);
    if (Object.keys(parsed).length === 0) return;

    // 轉換 {param} 為 {{param}} 以相容 i18next 插值格式
    const converted: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string") {
        converted[k] = v.replace(/(?<!\{)\{([^{}]+)\}(?!\})/g, "{{$1}}");
      } else {
        converted[k] = v;
      }
    }
    const nested = unflattenObject(converted);

    // 注入到所有語言包，使管理員覆蓋全域生效
    const languages = Object.keys(i18next.options?.resources || {});
    for (const lang of languages) {
      i18next.addResourceBundle(lang, "translation", nested, true, true);
    }
  }, [rawCustomTexts]);

  const t = useCallback(
    (key: LocaleKeys | (string & {}), params?: Record<string, string | number>): string => {
      // 使用 i18next 翻譯（已包含 JSON locale + customTexts 覆蓋）
      const result = i18next.t(key as string, params as any);

      // 如果 i18next 回傳了 key 本身（找不到翻譯），回退到 texts 物件
      if (result === key) {
        const text = get(texts, key, key);
        if (typeof text !== "string") return key as string;
        if (params) {
          return Object.entries(params).reduce(
            (acc, [paramKey, paramValue]) =>
              acc.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue)),
            text
          );
        }
        return text;
      }

      return result as string;
    },
    [texts, i18n.language]
  );

  return { t, i18n };
}
