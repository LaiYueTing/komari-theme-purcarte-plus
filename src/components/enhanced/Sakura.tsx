import { useEffect } from "react";
import { useAppConfig } from "@/config";
import { useIsMobile } from "@/hooks/useMobile";

declare global {
  interface Window {
    Sakura?: new (selector: string, options?: unknown) => { stop?: (graceful?: boolean) => void };
  }
}

const SAKURA_CSS = "https://cdn.jsdelivr.net/npm/sakura-js@1.1.1/dist/sakura.min.css";
const SAKURA_JS = "https://cdn.jsdelivr.net/npm/sakura-js@1.1.1/dist/sakura.min.js";

/**
 * 櫻花飄落特效
 *
 * 動態載入 sakura-js 並在 body 上初始化，僅在桌面端、且於主題設定中啟用時生效。
 */
export function Sakura() {
  const { enableSakura } = useAppConfig();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enableSakura || isMobile) return;

    let cancelled = false;
    let instance: { stop?: (graceful?: boolean) => void } | null = null;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = SAKURA_CSS;
    document.head.appendChild(link);

    const init = () => {
      if (cancelled || !window.Sakura) return;
      try {
        instance = new window.Sakura("body");
      } catch {
        /* 初始化失敗則忽略 */
      }
    };

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SAKURA_JS}"]`
    );
    if (window.Sakura) {
      init();
    } else if (script) {
      script.addEventListener("load", init);
    } else {
      script = document.createElement("script");
      script.src = SAKURA_JS;
      script.async = true;
      script.addEventListener("load", init);
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      try {
        instance?.stop?.(true);
      } catch {
        /* ignore */
      }
      script?.removeEventListener("load", init);
      link.remove();
      // 清掉殘留的花瓣節點
      document.querySelectorAll(".sakura").forEach((el) => el.remove());
    };
  }, [enableSakura, isMobile]);

  return null;
}
