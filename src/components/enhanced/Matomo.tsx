import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppConfig } from "@/config/hooks";

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

/**
 * Matomo 網站分析整合
 *
 * 依設定動態注入 Matomo 追蹤腳本，並在單頁應用（SPA）路由切換時
 * 手動觸發頁面瀏覽追蹤（trackPageView），確保前端路由變更也能被統計。
 *
 * 需在「PurCart Plus 主題設定 → 增強功能」中填寫 Matomo 伺服器位址與網站 ID
 * 並啟用後才會生效。
 */
export function Matomo() {
  const { matomoUrl, matomoSiteId } = useAppConfig();
  const location = useLocation();
  const initialized = useRef(false);

  // 初始化追蹤腳本（僅注入一次）
  useEffect(() => {
    if (initialized.current) return;

    const url = (matomoUrl || "").trim();
    const siteId = (matomoSiteId || "").trim();
    if (!url || !siteId) return;

    // 確保結尾帶斜線，方便拼接 matomo.php / matomo.js
    const baseUrl = url.endsWith("/") ? url : `${url}/`;

    const _paq = (window._paq = window._paq || []);
    _paq.push(["enableLinkTracking"]);
    _paq.push(["setTrackerUrl", `${baseUrl}matomo.php`]);
    _paq.push(["setSiteId", siteId]);

    const d = document;
    const g = d.createElement("script");
    const s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = `${baseUrl}matomo.js`;
    s.parentNode?.insertBefore(g, s);

    initialized.current = true;
    // 首次頁面瀏覽由下方路由追蹤 effect 處理
  }, [matomoUrl, matomoSiteId]);

  // SPA 路由切換時追蹤頁面瀏覽
  useEffect(() => {
    if (!window._paq) return;
    window._paq.push(["setCustomUrl", window.location.href]);
    window._paq.push(["setDocumentTitle", document.title]);
    window._paq.push(["trackPageView"]);
  }, [location.pathname, location.search]);

  return null;
}
