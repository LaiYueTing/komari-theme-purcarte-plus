// src/utils/localeUtils.ts

/**
 * 將自訂文字字串解析為物件。
 * 值應該是經過 URL 編碼的。
 * @param customTexts 要解析的字串 (例如, "key1:value%201,key2:value%2C2")。
 * @returns 自訂文字的記錄。
 */
export const parseCustomTexts = (
  customTexts: string
): Record<string, string> => {
  if (!customTexts) {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = customTexts.split(",");

  for (const pair of pairs) {
    const separatorIndex = pair.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = pair.substring(0, separatorIndex).trim();
    const value = pair.substring(separatorIndex + 1).trim();

    if (key) {
      try {
        result[key] = decodeURIComponent(value);
      } catch (e) {
        console.error(`無法解碼自訂文字值: ${value}`, e);
        result[key] = value; // 退回原始值
      }
    }
  }

  return result;
};

/**
 * 將自訂文字記錄序列化為 URL 編碼的字串。
 * @param customTextsRecord 自訂文字的記錄。
 * @returns 一個 URL 編碼的字串 (例如, "key1:value%201,key2:value%2C2")。
 */
export const serializeCustomTexts = (
  customTextsRecord: Record<string, string>
): string => {
  return Object.entries(customTextsRecord)
    .map(([key, value]) => `${key.trim()}:${encodeURIComponent(value.trim())}`)
    .join(",");
};

/**
 * 將巢狀物件扁平化為單層物件。
 * @param obj 要扁平化的物件。
 * @param parentKey 當前遞迴層級的父鍵。
 * @param separator 用於在鍵之間分隔的分隔符。
 * @returns 一個扁平化的物件。
 */
export const flattenObject = (
  obj: any,
  parentKey = "",
  separator = "."
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(result, flattenObject(obj[key], newKey, separator));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
};

/**
 * 將自訂文字合併到預設文字中。
 * @param defaultTexts 預設文字物件。
 * @param customTexts 自訂文字字串 (例如, "key1:value%201,key2:value%2C2")。
 * @returns 包含合併後文字的新物件。
 */
export const mergeTexts = (defaultTexts: any, customTexts: string): any => {
  const parsedCustomTexts = parseCustomTexts(customTexts);
  const merged = JSON.parse(JSON.stringify(defaultTexts));
  const flatDefault = flattenObject(defaultTexts);

  for (const key in parsedCustomTexts) {
    if (
      Object.prototype.hasOwnProperty.call(parsedCustomTexts, key) &&
      flatDefault[key] !== parsedCustomTexts[key]
    ) {
      const keys = key.split(".");
      let current = merged;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }
      current[keys[keys.length - 1]] = parsedCustomTexts[key];
    }
  }

  return merged;
};

/**
 * 取得在自訂文字中被修改的鍵。
 * @param defaultTexts 預設文字物件。
 * @param customTexts 自訂文字字串 (例如, "key1:value%201,key2:value%2C2")。
 * @returns 一個包含被修改鍵的陣列。
 */
export const getModifiedKeys = (
  defaultTexts: any,
  customTexts: string
): string[] => {
  const parsedCustomTexts = parseCustomTexts(customTexts);
  const flatDefault = flattenObject(defaultTexts);
  const modifiedKeys: string[] = [];

  for (const key in parsedCustomTexts) {
    if (Object.prototype.hasOwnProperty.call(parsedCustomTexts, key)) {
      if (flatDefault[key] !== parsedCustomTexts[key]) {
        modifiedKeys.push(key);
      }
    }
  }

  return modifiedKeys;
};

/**
 * 檢查一個值是否為物件。
 * @param item 要檢查的值。
 * @returns 如果值是物件則回傳 true，否則回傳 false。
 */
const isObject = (item: any): item is Record<string, any> => {
  return item && typeof item === "object" && !Array.isArray(item);
};

/**
 * 深度合併兩個物件。
 * @param target 要合併到的目標物件。
 * @param source 要從中合併的來源物件。
 * @returns 合併後的物件。
 */
export const deepMerge = <T extends object, S extends object>(
  target: T,
  source: S
): T & S => {
  const output = { ...target } as T & S;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceKey = key as keyof S;
      if (isObject(source[sourceKey])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[sourceKey] });
        } else {
          (output as any)[key] = deepMerge(
            (target as any)[key],
            source[sourceKey]
          );
        }
      } else {
        Object.assign(output, { [key]: source[sourceKey] });
      }
    });
  }

  return output;
};

/**
 * 將扁平化的 dot-path 物件還原為巢狀物件。
 * @param obj 扁平化物件（鍵以 . 分隔）
 * @returns 巢狀物件
 */
export const unflattenObject = (
  obj: Record<string, string>
): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
};
