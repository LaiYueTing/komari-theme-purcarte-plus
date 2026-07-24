import { useEffect } from "react";
import { useAppConfig } from "@/config";
import { useIsMobile } from "@/hooks/useMobile";

/**
 * Canvas Nest 連線粒子背景
 *
 * 自帶實作（不依賴外部 CDN），在頁面背景繪製會跟隨滑鼠的連線粒子效果。
 * 僅在桌面端、且於主題設定中啟用時生效。
 */
export function CanvasNest() {
  const { enableCanvasNest, canvasNestColor, canvasNestCount } = useAppConfig();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enableCanvasNest || isMobile) return;

    const color = (canvasNestColor || "128,128,128").trim();
    const count = Math.max(1, Number(canvasNestCount) || 99);

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;z-index:-1;opacity:0.9;pointer-events:none;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    type Dot = { x: number; y: number; xa: number; ya: number; max: number };
    const points: Dot[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      xa: 2 * Math.random() - 1,
      ya: 2 * Math.random() - 1,
      max: 6000,
    }));

    // 滑鼠互動點
    const mouse: { x: number | null; y: number | null; max: number } = {
      x: null,
      y: null,
      max: 20000,
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    let animId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const all = [mouse as unknown as Dot, ...points];
      points.forEach((dot) => {
        dot.x += dot.xa;
        dot.y += dot.ya;
        if (dot.x > width || dot.x < 0) dot.xa *= -1;
        if (dot.y > height || dot.y < 0) dot.ya *= -1;
        ctx.fillStyle = `rgba(${color},0.6)`;
        ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);

        for (let i = 0; i < all.length; i++) {
          const other = all[i];
          if (dot === other || other.x === null || other.y === null) continue;
          const dx = dot.x - other.x;
          const dy = dot.y - other.y;
          const dist = dx * dx + dy * dy;
          if (dist > other.max) continue;
          // 滑鼠範圍內的粒子會被輕微吸引
          if (other === (mouse as unknown as Dot) && dist >= other.max / 2) {
            dot.x -= 0.03 * dx;
            dot.y -= 0.03 * dy;
          }
          const ratio = (other.max - dist) / other.max;
          ctx.beginPath();
          ctx.lineWidth = ratio / 2;
          ctx.strokeStyle = `rgba(${color},${ratio + 0.2})`;
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      canvas.remove();
    };
  }, [enableCanvasNest, isMobile, canvasNestColor, canvasNestCount]);

  return null;
}
