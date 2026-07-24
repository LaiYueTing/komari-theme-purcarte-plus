import { forwardRef, useState, useEffect, useMemo } from "react";
import { useAppConfig, useLocale } from "@/config/hooks";
import { Card } from "../ui/card";
import { cn } from "@/utils";
import { useIsMobile } from "@/hooks/useMobile";
import { Clock } from "lucide-react";

/**
 * 簡易 Markdown 解析：將 ![alt](url) 轉為 img，[text](url) 轉為 a 標籤
 * 對輸入進行 HTML 轉義以防止 XSS，僅允許 markdown 連結和圖片語法
 */
function parseMarkdown(text: string): string {
  // 先轉義 HTML 特殊字元
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // 處理圖片 ![alt](url) — 必須先於連結處理
  escaped = escaped.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-height:1.5em;vertical-align:middle;display:inline;" />'
  );

  // 處理連結 [text](url)
  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 transition-colors">$1</a>'
  );

  return escaped;
}

/**
 * 解析 serverStartTime 設定字串為 Date 物件
 * 格式: "年,月,日,時,分,秒" (UTC+8)，例如 "2025,11,5,20,30,5"
 */
function parseStartTime(timeStr: string): Date | null {
  if (!timeStr) return null;
  const parts = timeStr.split(",").map((s) => parseInt(s.trim(), 10));
  if (parts.length < 3 || parts.some(isNaN)) return null;

  const [year, month, day, hour = 0, minute = 0, second = 0] = parts;
  // 建構 UTC+8 時間：先按 UTC 建構，再減去 8 小時偏移得到真實 UTC 時間
  const utcMs =
    Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  return new Date(utcMs);
}

/**
 * 根據模板計算運行時間字串
 * 模板變數: {days} {hours} {minutes} {seconds}
 */
function formatUptime(startTime: Date, template: string): string {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  if (diff < 0) return "尚未啟動";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return template
    .replace(/\{days\}/g, String(days))
    .replace(/\{hours\}/g, String(hours))
    .replace(/\{minutes\}/g, String(minutes))
    .replace(/\{seconds\}/g, String(seconds));
}

const Footer = forwardRef<
  HTMLElement,
  {
    isSettingsOpen: boolean;
  }
>(({ isSettingsOpen }, ref) => {
  const { t } = useLocale();
  const {
    selectedFooterStyle,
    hideFooterOriginal,
    enableServerUptime,
    serverStartTime,
    serverUptimeTemplate,
    footerCustomContent,
  } = useAppConfig();
  const isMobile = useIsMobile();

  // 解析啟動時間
  const startTime = useMemo(
    () => parseStartTime(serverStartTime),
    [serverStartTime]
  );

  // 運行時間計時器
  const [uptimeText, setUptimeText] = useState("");
  useEffect(() => {
    if (!enableServerUptime || !startTime) {
      setUptimeText("");
      return;
    }
    const tpl = serverUptimeTemplate || "已不穩定運行 {days} 天 {hours} 小時 {minutes} 分鐘 {seconds} 秒";
    setUptimeText(formatUptime(startTime, tpl));
    const timer = setInterval(() => {
      setUptimeText(formatUptime(startTime, tpl));
    }, 1000);
    return () => clearInterval(timer);
  }, [enableServerUptime, startTime, serverUptimeTemplate]);

  // 解析自訂內容（支援實際換行符和 ${n} 兩種分隔方式）
  // 同時支援 {year} 變數，會替換為目前年份
  const customLines = useMemo(() => {
    if (!footerCustomContent) return [];
    const currentYear = String(new Date().getFullYear());
    return footerCustomContent
      .replace(/\{year\}/g, currentYear)
      .split(/\$\{n\}|\n/)
      .filter((line) => line.trim() !== "");
  }, [footerCustomContent]);

  // 判斷是否有任何內容需要顯示
  const hasContent =
    !hideFooterOriginal ||
    (enableServerUptime && uptimeText) ||
    customLines.length > 0;

  return (
    <footer
      ref={ref}
      className={cn(
        selectedFooterStyle === "levitation"
          ? "fixed"
          : selectedFooterStyle === "followContent"
            ? "mb-4 w-(--main-width) max-w-screen-2xl mx-auto"
            : "",
        "bottom-0 left-0 right-0 flex z-10"
      )}
      style={{
        right: isSettingsOpen && !isMobile ? "var(--setting-width)" : "0",
      }}>
      <Card
        className={cn(
          selectedFooterStyle !== "followContent" ? "rounded-none" : "",
          "p-2 w-full flex items-center justify-center inset-shadow-sm inset-shadow-(color:--accent-a4)"
        )}>
        {hasContent ? (
          <div className="flex flex-col items-center justify-center space-y-1">
            {/* 原始內容 */}
            {!hideFooterOriginal && (
              <p className="flex justify-center text-sm text-secondary-foreground theme-text-shadow whitespace-pre">
                {t("footer.poweredBy")}{" "}
                <a
                  href="https://github.com/komari-monitor/komari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors">
                  Komari Monitor
                </a>
                {" | "}
                {t("footer.themeBy")}{" "}
                <a
                  href="https://github.com/YoungYannick/komari-theme-purcarte-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors">
                  PurCarte-Plus
                </a>
              </p>
            )}

            {/* 伺服器運行時間 */}
            {enableServerUptime && uptimeText && (
              <div className="flex items-center justify-center text-sm text-secondary-foreground theme-text-shadow">
                <Clock className="mr-2" size={14} />
                <span>{uptimeText}</span>
              </div>
            )}

            {/* 自訂內容 */}
            {customLines.map((line, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-sm text-secondary-foreground theme-text-shadow"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
              />
            ))}
          </div>
        ) : (
          // 當所有內容都被隱藏時保持最小高度
          <div className="h-2" />
        )}
      </Card>
    </footer>
  );
});

export default Footer;
