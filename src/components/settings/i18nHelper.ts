import i18next from "i18next";

/**
 * 將 komari-theme.json 中的 i18n 物件解析為目前語言的字串。
 * 支援兩種格式：
 *  - 純字串：直接回傳
 *  - 多語言物件：{ "zh-CN": "...", "zh-TW": "...", "en": "...", "ja": "..." }
 *
 * 解析優先順序：精確比對 → 語言前綴比對 → en 回退 → 物件第一個值
 */
export function resolveI18n(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, string>;
    const lang = i18next.language || navigator.language; // 優先使用 i18next 目前語言
    if (record[lang]) return record[lang];
    const prefix = lang.split("-")[0]; // e.g. "zh"
    const fallbackKey = Object.keys(record).find((k) => k.startsWith(prefix));
    if (fallbackKey) return record[fallbackKey];
    if (record["en"]) return record["en"];
    const first = Object.values(record)[0];
    if (typeof first === "string") return first;
  }
  return String(value ?? "");
}
