import * as React from "react";
import { Box } from "@radix-ui/themes";
import { useLocale } from "@/config/hooks";

interface FlagProps {
  flag: string; // 地區代碼 (例如 "SG", "US") 或旗幟 emoji (例如 "🇸🇬", "🇺🇳")
  size?: string; // 可選的尺寸 prop，用於未來擴充
}

/**
 * 演算法：將由兩個區域指示符符號組成的 emoji 轉換為對應的兩字母國家代碼。
 * 例如：🇸🇬 (由兩個區域指示符組成) -> SG
 * @param emoji 輸入的 emoji 字串
 * @returns 轉換後的兩字母國家代碼（例如 "SG"），如果不是有效的旗幟 emoji 則回傳 null。
 */
const getCountryCodeFromFlagEmoji = (emoji: string): string | null => {
  // 使用 Array.from() 來正確處理 Unicode 代理對，將 emoji 字串拆分為邏輯上的字元陣列。
  // 對於一個國家旗幟 emoji，chars 陣列的長度將是 2 (每個元素是一個區域指示符字元)。
  const chars = Array.from(emoji);

  // 國家旗幟 emoji 應該由且僅由兩個區域指示符字元組成
  if (chars.length !== 2) {
    return null;
  }

  // 取得兩個區域指示符字元的 Unicode 碼點
  const codePoint1 = chars[0].codePointAt(0)!;
  const codePoint2 = chars[1].codePointAt(0)!;

  // 區域指示符符號的 Unicode 範圍是從 U+1F1E6 (🇦) 到 U+1F1FF (🇿)
  const REGIONAL_INDICATOR_START = 0x1f1e6; // 🇦 的 Unicode 碼點
  const ASCII_ALPHA_START = 0x41; // A 的 ASCII 碼點

  // 檢查兩個碼點是否都在區域指示符範圍內
  if (
    codePoint1 >= REGIONAL_INDICATOR_START &&
    codePoint1 <= 0x1f1ff &&
    codePoint2 >= REGIONAL_INDICATOR_START &&
    codePoint2 <= 0x1f1ff
  ) {
    // 演算法轉換：透過計算與 'A' 對應的區域指示符的偏移量，將區域指示符碼點轉換回對應的 ASCII 字母碼點
    const letter1 = String.fromCodePoint(
      codePoint1 - REGIONAL_INDICATOR_START + ASCII_ALPHA_START
    );
    const letter2 = String.fromCodePoint(
      codePoint2 - REGIONAL_INDICATOR_START + ASCII_ALPHA_START
    );
    return `${letter1}${letter2}`;
  }

  return null;
};

const Flag = React.memo(({ flag, size }: FlagProps) => {
  const { t } = useLocale();
  let imgSrc: string;
  let altText: string;
  let resolvedFlagFileName: string; // 最終用於建構檔名的字串 (例如 "SG", "UN")

  // 1. **演算法處理：** 嘗試將輸入作為由區域指示符組成的旗幟 emoji 進行轉換
  const countryCodeFromEmoji = getCountryCodeFromFlagEmoji(flag);

  if (countryCodeFromEmoji) {
    resolvedFlagFileName = countryCodeFromEmoji; // 例如，如果輸入是 "🇸🇬"，則這裡得到 "SG"
  }
  // 2. **直接辨識：** 如果不是區域指示符 emoji，檢查是否是兩字母的字母組合（ISO 國家代碼）
  else if (flag && flag.length === 2 && /^[a-zA-Z]{2}$/.test(flag)) {
    resolvedFlagFileName = flag.toUpperCase(); // 例如，如果輸入是 "us"，則這裡得到 "US"
  }
  // 3. **硬編碼處理特殊 Emoji：** 對於無法透過演算法轉換的特殊 emoji（例如 🇺🇳, 🌐），
  //    因為它們不符合區域指示符模式，且不使用對照表，只能透過硬編碼來辨識。
  else if (flag === "🇺🇳" || flag === "🌐") {
    resolvedFlagFileName = "UN"; // 例如，如果輸入是 "🇺🇳"，則這裡得到 "UN"
  }
  // 4. **回退：** 對於任何其他無法辨識的輸入（包括不符合上述規則的 emoji 或非兩字母代碼），
  //    使用預設的 "UN" 旗幟作為回退。
  else {
    resolvedFlagFileName = "UN";
  }

  // 建構本機圖片路徑
  imgSrc = `/assets/flags/${resolvedFlagFileName}.svg`;
  // 建構 alt 文字和 aria-label
  altText = t("node.flagAlt", { code: resolvedFlagFileName });

  return (
    <Box
      as="span"
      className={`self-center flex-shrink-0 inline-flex items-center ${
        size ? `w-${size} h-${size}` : "w-6 h-6"
      }`}
      aria-label={altText}>
      <img
        src={imgSrc}
        alt={altText}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        loading="lazy"
      />
    </Box>
  );
});

// 確保 displayName 以便在 React DevTools 中辨識
Flag.displayName = "Flag";

export default Flag;
