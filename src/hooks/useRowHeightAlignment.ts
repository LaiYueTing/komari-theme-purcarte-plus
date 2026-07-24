import { useEffect, useRef } from "react";

interface RowHeightAlignmentOptions {
  containerSelector: string;
  cardSelector: string;
  tagsSelector: string;
  trafficSelector?: string;
  enabled?: boolean;
}

export const useRowHeightAlignment = ({
  containerSelector,
  cardSelector,
  tagsSelector,
  trafficSelector,
  enabled = true,
}: RowHeightAlignmentOptions) => {
  const rafRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const alignHeights = () => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const cards = Array.from(container.querySelectorAll(cardSelector)) as HTMLElement[];
      if (cards.length === 0) return;

      // 重置所有高度
      cards.forEach(card => {
        const tags = card.querySelector(tagsSelector) as HTMLElement;
        const traffic = trafficSelector ? card.querySelector(trafficSelector) as HTMLElement : null;
        if (tags) tags.style.minHeight = "";
        if (traffic) traffic.style.height = "";
      });

      // 計算每行的卡片
      const rows: HTMLElement[][] = [];
      let currentRow: HTMLElement[] = [];
      let currentTop = cards[0]?.offsetTop;

      cards.forEach(card => {
        if (card.offsetTop !== currentTop) {
          if (currentRow.length > 0) rows.push(currentRow);
          currentRow = [card];
          currentTop = card.offsetTop;
        } else {
          currentRow.push(card);
        }
      });
      if (currentRow.length > 0) rows.push(currentRow);

      // 對每行統一高度
      rows.forEach(row => {
        let maxTagsHeight = 0;
        let maxTrafficHeight = 0;

        row.forEach(card => {
          const tags = card.querySelector(tagsSelector) as HTMLElement;
          const traffic = trafficSelector ? card.querySelector(trafficSelector) as HTMLElement : null;
          if (tags) maxTagsHeight = Math.max(maxTagsHeight, tags.offsetHeight);
          if (traffic) maxTrafficHeight = Math.max(maxTrafficHeight, traffic.offsetHeight);
        });

        row.forEach(card => {
          const tags = card.querySelector(tagsSelector) as HTMLElement;
          const traffic = trafficSelector ? card.querySelector(trafficSelector) as HTMLElement : null;
          if (tags && maxTagsHeight > 0) tags.style.minHeight = `${maxTagsHeight}px`;
          if (traffic && maxTrafficHeight > 0) traffic.style.height = `${maxTrafficHeight}px`;
        });
      });
    };

    const scheduleAlign = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      timeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(alignHeights);
      }, 100);
    };

    // 初始對齊
    rafRef.current = requestAnimationFrame(alignHeights);

    // ResizeObserver 監聽容器大小變化
    const resizeObserver = new ResizeObserver(scheduleAlign);
    const container = document.querySelector(containerSelector);
    if (container) resizeObserver.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      resizeObserver.disconnect();
    };
  }, [containerSelector, cardSelector, tagsSelector, trafficSelector, enabled]);
};
