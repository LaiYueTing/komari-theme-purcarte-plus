/**
 * LTTB (Largest-Triangle-Three-Buckets) 降採樣演算法
 * 比簡單的每 N 個取一個採樣保留更好的視覺形狀
 *
 * 對於多線條圖表，使用所有非 null 值的平均值作為代表 Y 值進行三角計算
 */
export function lttbDownsample<T extends { time: number; [key: string]: any }>(
  data: T[],
  targetPoints: number,
  valueKeys: string[]
): T[] {
  const len = data.length;
  if (targetPoints >= len || targetPoints <= 2) return data;

  const result: T[] = [data[0]]; // 始終保留第一個點
  const bucketSize = (len - 2) / (targetPoints - 2);

  let prevIndex = 0;

  for (let i = 0; i < targetPoints - 2; i++) {
    // 目前桶範圍
    const bucketStart = Math.floor((i + 1) * bucketSize) + 1;
    const bucketEnd = Math.min(
      Math.floor((i + 2) * bucketSize) + 1,
      len - 1
    );

    // 下一個桶的平均值 (用於三角計算)
    const nextBucketStart = Math.floor((i + 2) * bucketSize) + 1;
    const nextBucketEnd = Math.min(
      Math.floor((i + 3) * bucketSize) + 1,
      len - 1
    );

    let avgX = 0;
    let avgY = 0;
    let avgCount = 0;
    for (let j = nextBucketStart; j < nextBucketEnd && j < len; j++) {
      avgX += data[j].time;
      avgY += getAvgValue(data[j], valueKeys);
      avgCount++;
    }
    if (avgCount === 0) {
      // 最後一個桶可能為空，使用最後一個點
      avgX = data[len - 1].time;
      avgY = getAvgValue(data[len - 1], valueKeys);
    } else {
      avgX /= avgCount;
      avgY /= avgCount;
    }

    // 在目前桶中找到使三角面積最大的點
    const prevX = data[prevIndex].time;
    const prevY = getAvgValue(data[prevIndex], valueKeys);

    let maxArea = -1;
    let maxAreaIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd && j < len; j++) {
      const pointX = data[j].time;
      const pointY = getAvgValue(data[j], valueKeys);

      // 三角面積公式 (外積的絕對值 / 2)
      const area = Math.abs(
        (prevX - avgX) * (pointY - prevY) -
          (prevX - pointX) * (avgY - prevY)
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaIndex = j;
      }
    }

    result.push(data[maxAreaIndex]);
    prevIndex = maxAreaIndex;
  }

  result.push(data[len - 1]); // 始終保留最後一個點
  return result;
}

/**
 * LTTB with explicit null-transition protection for multi-series charts.
 * Undefined cells are ignored because combined charts commonly have staggered
 * timestamps; only an explicit null starts a real gap.
 */
export function lttbDownsamplePreservingGaps<
  T extends { time: number; [key: string]: any }
>(data: T[], targetPoints: number, valueKeys: string[]): T[] {
  const len = data.length;
  if (targetPoints >= len || targetPoints <= 0) return data;

  const required = new Set<number>([0, len - 1]);
  for (const key of valueKeys) {
    let previous: "value" | "gap" | undefined;
    for (let i = 0; i < len; i++) {
      const value = data[i][key];
      if (typeof value === "number" && Number.isFinite(value)) {
        previous = "value";
      } else if (value === null) {
        if (previous === "value") required.add(i);
        previous = "gap";
      }
    }
  }

  let requiredIndices = Array.from(required).sort((a, b) => a - b);
  if (requiredIndices.length >= targetPoints) {
    return requiredIndices.map((index) => data[index]);
  }

  const remaining = targetPoints - requiredIndices.length;
  const sampled = lttbDownsample(data, Math.min(len, remaining + 2), valueKeys);
  const indexByPoint = new Map(data.map((point, index) => [point, index]));
  for (const point of sampled) {
    const index = indexByPoint.get(point);
    if (index !== undefined) required.add(index);
  }

  return Array.from(required)
    .sort((a, b) => a - b)
    .slice(0, targetPoints)
    .map((index) => data[index]);
}

/**
 * 計算資料列中所有值鍵的平均值 (忽略 null/undefined)
 */
function getAvgValue(row: { [key: string]: any }, keys: string[]): number {
  let sum = 0;
  let count = 0;
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) {
      sum += v;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

/**
 * 根據資料量和線條數自動計算最佳降採樣目標點數
 * 回傳 0 表示不需要降採樣
 */
export function calculateAutoMaxPoints(
  dataLength: number,
  lineCount: number
): number {
  if (dataLength <= 0 || lineCount <= 0) return 0;

  const totalCells = dataLength * lineCount;

  // 小資料集不需要降採樣
  if (totalCells < 50_000) return 0;

  // 中等資料集
  if (totalCells < 200_000) {
    return Math.min(dataLength, 1500);
  }

  // 大資料集: 基於線條數動態計算
  const target = Math.max(
    300,
    Math.floor(2000 / Math.sqrt(lineCount))
  );

  return Math.min(dataLength, target);
}
