import { useEffect } from "react";
import { useAppConfig } from "@/config";
import { useIsMobile } from "@/hooks/useMobile";

declare global {
  interface Window {
    L2Dwidget?: { init: (config: unknown) => void };
  }
}

const L2D_JS = "https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js";
const DEFAULT_MODEL =
  "https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json";

/**
 * Live2D 看板娘
 *
 * 動態載入 live2d-widget 並以指定模型初始化，僅在桌面端、且於主題設定中啟用時生效。
 */
export function Live2D() {
  const { enableLive2D, live2dModelUrl } = useAppConfig();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enableLive2D || isMobile) return;

    let cancelled = false;

    const init = () => {
      if (cancelled || !window.L2Dwidget) return;
      try {
        window.L2Dwidget.init({
          model: { jsonPath: live2dModelUrl || DEFAULT_MODEL, scale: 1 },
          display: {
            position: "right",
            width: 150,
            height: 300,
            hOffset: 10,
            vOffset: 0,
          },
          mobile: { show: false },
          react: { opacityDefault: 0.7, opacityOnHover: 0.2 },
          log: false,
        });
      } catch {
        /* 初始化失敗則忽略 */
      }
    };

    const cleanupWidget = () => {
      document
        .querySelectorAll("#live2d-widget, #live2dcanvas, canvas#live2d")
        .forEach((el) => el.remove());
    };

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${L2D_JS}"]`
    );
    if (window.L2Dwidget) {
      init();
    } else if (script) {
      script.addEventListener("load", init);
    } else {
      script = document.createElement("script");
      script.src = L2D_JS;
      script.async = true;
      script.addEventListener("load", init);
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", init);
      cleanupWidget();
    };
  }, [enableLive2D, isMobile, live2dModelUrl]);

  return null;
}
