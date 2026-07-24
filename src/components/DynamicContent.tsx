import { type ReactNode, useCallback, useMemo, useEffect, useRef } from "react";
import { useAppConfig } from "@/config/hooks";
import { useIsMobile } from "@/hooks/useMobile";
import { useTheme } from "@/hooks/useTheme";

export function DynamicContent({ children }: { children: ReactNode }) {
  const config = useAppConfig();
  const isMobile = useIsMobile();
  const { appearance } = useTheme();

  // 快取隨機選擇的背景 URL，避免每次父元件重新渲染時重新隨機導致背景閃爍
  const cachedUrlsRef = useRef<Record<string, string>>({});

  const getUrlFromConfig = useCallback(
    (urls: string) => {
      if (!urls) return "";

      // 使用 urls + appearance 作為快取 key，只有設定值真正變化時才重新隨機
      const cacheKey = `${urls}|${appearance}`;
      if (cacheKey in cachedUrlsRef.current) {
        return cachedUrlsRef.current[cacheKey];
      }

      const themes = urls.split("|").map((theme) => theme.trim());
      const themeIndex = appearance === "dark" ? 1 : 0;
      const selectedTheme =
        themes.length > themeIndex ? themes[themeIndex] : themes[0] || "";
      const themeUrls = selectedTheme
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);
      const randomIndex = Math.floor(Math.random() * themeUrls.length);
      const result = themeUrls[randomIndex] || "";
      cachedUrlsRef.current[cacheKey] = result;
      return result;
    },
    [appearance]
  );

  const backgroundMode = config.backgroundMode || "image";

  // 使用具體的原始值作為依賴，而非整個 config 物件，避免無關設定變化觸發重新計算
  const bgImage = config.backgroundImage;
  const bgImageMobile = config.backgroundImageMobile;
  const videoBgUrl = config.videoBackgroundUrl;
  const videoBgUrlMobile = config.videoBackgroundUrlMobile;
  const solidColorBg = config.solidColorBackground;
  const mainWidth = config.mainWidth;
  const blurValue = config.blurValue;
  const blurBackgroundColor = config.blurBackgroundColor;
  const bgAlignment = config.backgroundAlignment;
  const globalFontFamily = config.globalFontFamily;
  const customFontFaceCss = config.customFontFaceCss;
  const enableCustomCursor = config.enableCustomCursor;
  const cursorNormalUrl = config.cursorNormalUrl;
  const cursorPointerUrl = config.cursorPointerUrl;

  const imageUrl = useMemo(() => {
    if (backgroundMode !== "image") return "";
    return isMobile && bgImageMobile
      ? getUrlFromConfig(bgImageMobile)
      : getUrlFromConfig(bgImage);
  }, [bgImage, bgImageMobile, isMobile, getUrlFromConfig, backgroundMode]);

  const videoUrl = useMemo(() => {
    if (backgroundMode !== "video") return "";
    return isMobile && videoBgUrlMobile
      ? getUrlFromConfig(videoBgUrlMobile)
      : getUrlFromConfig(videoBgUrl);
  }, [videoBgUrl, videoBgUrlMobile, isMobile, getUrlFromConfig, backgroundMode]);

  const solidColor = useMemo(() => {
    if (backgroundMode !== "solidColor") return "";
    return solidColorBg || "";
  }, [solidColorBg, backgroundMode]);

  const dynamicStyles = useMemo(() => {
    const styles: string[] = [];

    styles.push(`--main-width: ${mainWidth}vw;`);
    styles.push(`--body-background-url: url(${imageUrl});`);
    styles.push(`--purcarte-blur: ${blurValue}px;`);

    const colors = blurBackgroundColor.split("|").map((color) => color.trim());
    if (colors.length >= 2) {
      styles.push(`--card-light: ${colors[0]};`);
      styles.push(`--card-dark: ${colors[1]};`);
    } else if (colors.length === 1) {
      styles.push(`--card-light: ${colors[0]};`);
      styles.push(`--card-dark: ${colors[0]};`);
    }

    return `:root { ${styles.join(" ")} }`;
  }, [mainWidth, blurValue, blurBackgroundColor, imageUrl]);

  // 全域字型樣式：注入自訂 @font-face 並覆寫 Radix Themes 的字型變數
  const fontStyles = useMemo(() => {
    const parts: string[] = [];
    if (customFontFaceCss && customFontFaceCss.trim()) {
      parts.push(customFontFaceCss.trim());
    }
    if (globalFontFamily && globalFontFamily.trim()) {
      const family = globalFontFamily.trim();
      // 覆寫 Radix Themes 的 --default-font-family（標題、強調文字皆引用此變數）
      parts.push(`:root, .radix-themes { --default-font-family: ${family}; }`);
      // 套用至 body，涵蓋非 Radix 區域（載入畫面、背景等）
      parts.push(`body { font-family: ${family}; }`);
    }
    return parts.join("\n");
  }, [globalFontFamily, customFontFaceCss]);

  // 自訂滑鼠游標：一般狀態套用至 body，可點擊元素套用 pointer 游標
  // 文字輸入區維持系統 text 游標，避免影響輸入體驗
  const cursorStyles = useMemo(() => {
    if (!enableCustomCursor) return "";
    const normal = (cursorNormalUrl || "").trim();
    const pointer = (cursorPointerUrl || "").trim();
    if (!normal && !pointer) return "";

    const parts: string[] = [];
    if (normal) {
      parts.push(`body { cursor: url("${normal}"), auto !important; }`);
    }
    if (pointer) {
      parts.push(
        `a,\nbutton,\n[role="button"],\ninput[type="submit"],\ninput[type="button"],\nlabel[for],\nselect,\nsummary,\n.cursor-pointer,\n.finance-ball,\n.scroll-helper-btn {\n  cursor: url("${pointer}"), pointer !important;\n}`
      );
    }
    // 文字輸入區域保留系統文字游標
    parts.push(
      `input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]),\ntextarea,\n[contenteditable="true"] {\n  cursor: text !important;\n}`
    );
    return parts.join("\n");
  }, [enableCustomCursor, cursorNormalUrl, cursorPointerUrl]);

  useEffect(() => {
    const imageBackground = document.getElementById("image-background");
    const videoBackground = document.getElementById(
      "video-background"
    ) as HTMLVideoElement;
    const [size, position] = bgAlignment
      .split(",")
      .map((s) => s.trim());

    if (imageBackground) {
      if (backgroundMode === "solidColor" && solidColor) {
        imageBackground.style.backgroundImage = "none";
        imageBackground.style.backgroundColor = solidColor;
      } else if (backgroundMode === "image" && imageUrl) {
        imageBackground.style.backgroundColor = "";
        imageBackground.style.backgroundImage = `url(${imageUrl})`;
        imageBackground.style.backgroundSize = size;
        imageBackground.style.backgroundPosition = position;
      } else {
        imageBackground.style.backgroundImage = "none";
        imageBackground.style.backgroundColor = "";
      }
    }

    if (videoBackground) {
      if (backgroundMode === "video" && videoUrl) {
        videoBackground.src = videoUrl;
        videoBackground.style.objectFit = size;
        videoBackground.style.objectPosition = position;
        videoBackground.style.display = "block";
      } else {
        videoBackground.src = "";
        videoBackground.style.display = "none";
      }
    }
  }, [
    imageUrl,
    videoUrl,
    solidColor,
    backgroundMode,
    bgAlignment,
  ]);

  return (
    <>
      {fontStyles && <style>{fontStyles}</style>}
      {cursorStyles && <style>{cursorStyles}</style>}
      <style>{dynamicStyles}</style>
      <div className="fade-in">{children}</div>
    </>
  );
}
