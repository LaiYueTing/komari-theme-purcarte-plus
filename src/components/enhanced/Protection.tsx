import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "@/services/api";
import { useLocale, useAppConfig } from "@/config/hooks";

export function Protection() {
  const { t } = useLocale();
  const { protectionLogoUrl, protectionLogoShape } = useAppConfig();
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [alertReason, setAlertReason] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    apiService
      .getUserInfo()
      .then((data) => {
        setIsLoggedIn(data?.logged_in ?? false);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const triggerRedirect = useCallback(() => {
    window.open("about:blank", "_self");
  }, []);

  const showCustomAlert = useCallback(
    (reason: string) => {
      if (isAlertShown) return;
      setIsAlertShown(true);
      setAlertReason(reason);
      setOverlayVisible(true);
      redirectTimerRef.current = setTimeout(triggerRedirect, 3000);
    },
    [isAlertShown, triggerRedirect]
  );

  const handleClose = useCallback(() => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    triggerRedirect();
  }, [triggerRedirect]);

  useEffect(() => {
    if (isLoggedIn !== false) return;

    // 新增使用者選取：無樣式
    const style = document.createElement("style");
    style.innerHTML = `* { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }`;
    document.head.appendChild(style);

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showCustomAlert(t("enhanced.protection.contextMenu"));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      let reason = "";

      if (e.key === "F12") reason = t("enhanced.protection.f12");
      else if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      )
        reason = t("enhanced.protection.ctrlShift", { key: e.key.toUpperCase() });
      else if (e.ctrlKey && e.key.toUpperCase() === "U")
        reason = t("enhanced.protection.ctrlU");
      else if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "S")
        reason = t("enhanced.protection.ctrlCmdS");
      else if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "P")
        reason = t("enhanced.protection.ctrlCmdP");
      else if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "A")
        reason = t("enhanced.protection.ctrlCmdA");
      else if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "C")
        reason = t("enhanced.protection.ctrlCmdC");
      else if (
        isMac &&
        e.metaKey &&
        e.altKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      )
        reason = t("enhanced.protection.cmdOption", { key: e.key.toUpperCase() });

      if (reason) {
        e.preventDefault();
        showCustomAlert(reason);
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showCustomAlert(t("enhanced.protection.copy"));
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showCustomAlert(t("enhanced.protection.drag"));
    };

    const handleBeforePrint = () => {
      showCustomAlert(t("enhanced.protection.print"));
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("dragstart", handleDragStart);
    window.addEventListener("beforeprint", handleBeforePrint);

    // 開發者工具偵測
    const detectInterval = setInterval(() => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - start > 100) {
        showCustomAlert(t("enhanced.protection.devTools"));
      }

      if (
        (navigator as any).webdriver ||
        /HeadlessChrome/.test(navigator.userAgent)
      ) {
        showCustomAlert(t("enhanced.protection.headless"));
      }
    }, 500);

    // DOM 篡改偵測
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node as Element;
            const txt = ((el.id || "") + " " + (el.className || "")).toLowerCase();
            if (/supercopy|copy|extension|tamper/i.test(txt)) {
              showCustomAlert(t("enhanced.protection.domInjection"));
            }
          }
        });
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("beforeprint", handleBeforePrint);
      clearInterval(detectInterval);
      observer.disconnect();
      if (style.parentNode) style.parentNode.removeChild(style);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [isLoggedIn, showCustomAlert, t]);

  // 如果已登入或仍在檢查，則不渲染任何內容。
  if (isLoggedIn !== false) return null;

  return (
    <div
      id="custom-alert-overlay"
      className="custom-alert-overlay"
      style={{
        display: overlayVisible ? "flex" : "none",
        opacity: overlayVisible ? 1 : 0,
      }}>
      <div
        id="custom-alert-modal"
        className="custom-alert-modal"
        style={{ transform: overlayVisible ? "scale(1)" : "scale(0.95)" }}>
        <div className="bubble-header">
          <h3 className="bubble-title">
            {protectionLogoUrl && (
              <img
                src={protectionLogoUrl}
                className={protectionLogoShape === "original" ? "bubble-logo-image bubble-logo-original" : "bubble-logo-image"}
                alt="logo"
              />
            )}
            {t("enhanced.protection.warning")}
          </h3>
          <button className="bubble-close" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>
        <div
          className="bubble-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ marginBottom: "1rem" }}>
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div className="alert-reason-container">
            <p className="alert-reason-text">{alertReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
