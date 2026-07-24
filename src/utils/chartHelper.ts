import type { PingTask } from "@/types/node";

/**
 * 根據任務名稱和任務清單產生顏色
 * @param taskName - 任務名稱
 * @param sortedTasks - 已排序的任務清單
 * @returns CSS 顏色字串
 */
export const generateColor = (taskName: string, sortedTasks: PingTask[]) => {
  const index = sortedTasks.findIndex((t) => t.name === taskName);
  if (index === -1) return "#000000"; // Fallback color

  const total = sortedTasks.length;
  const hue = (index * (360 / total)) % 360;

  // 使用 OKLCH 色彩空間，最佳化折線圖的顏色區分度
  const oklchColor = `oklch(0.7 0.2 ${hue} / .8)`;

  // 為不支援 OKLCH 的瀏覽器提供 HSL 備用色
  const hslFallback = `hsl(${hue}, 50%, 60%)`;

  // 檢查瀏覽器是否支援 OKLCH
  if (
    typeof window !== "undefined" &&
    window.CSS &&
    CSS.supports("color", oklchColor)
  ) {
    return oklchColor;
  } else {
    return hslFallback;
  }
};

/**
 * 格式化圖表 X 軸的標籤
 * @param value - 時間戳記
 * @param hours - 目前選擇的時間範圍（小時）
 * @returns 格式化後的時間字串
 */
export const lableFormatter = (value: any, hours: number) => {
  const date = new Date(value);
  if (hours === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return date.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 格式化負載圖表 X 軸的時間標籤
 * @param value - 時間戳記
 * @param index - 索引
 * @param dataLength - 資料總長度
 * @returns 格式化後的時間字串 (只顯示首尾)
 */
export const loadChartTimeFormatter = (
  value: any,
  index: number,
  dataLength: number
) => {
  if (dataLength === 0) return "";
  if (index === 0 || index === dataLength - 1) {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "";
};
