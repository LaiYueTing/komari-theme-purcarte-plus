import { type ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import type { PublicInfo } from "@/types/node.d";
import { ConfigContext } from "./ConfigContext";
import { DEFAULT_CONFIG, type ConfigOptions, type SiteStatus } from "./default";
import { apiService, getWsService } from "@/services/api";
import Loading from "@/components/loading";
import { defaultTexts, otherTexts } from "./locales";
import { mergeTexts, deepMerge } from "@/utils/localeUtils";

// 設定提供者屬性型別
interface ConfigProviderProps {
  children: ReactNode;
}

/**
 * 設定提供者元件，用於將設定傳遞給子元件
 */
export function ConfigProvider({ children }: ConfigProviderProps) {
  const [publicSettings, setPublicSettings] = useState<PublicInfo | null>(null);
  const [config, setConfig] = useState<ConfigOptions | null>(null);
  const [siteStatus, setSiteStatus] = useState<SiteStatus>("public");
  const [previewConfig, setPreviewConfig] =
    useState<Partial<ConfigOptions> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadConfig = async () => {
    try {
      const { status, publicInfo } = await apiService.checkSiteStatus();
      setSiteStatus(status);
      setPublicSettings(publicInfo);

      let mergedConfig: ConfigOptions;
      if (publicInfo) {
        const rawSettings =
          (publicInfo.theme_settings as Partial<ConfigOptions>) || {};
        // 從後端設定中過濾掉 undefined/null 值，以防止
        // 覆蓋 DEFAULT_CONFIG 的預設值（修復 React 錯誤 #130）
        // 對於 string 型別的設定項，允許空字串通過（使用者可能故意清空）
        const themeSettings = Object.fromEntries(
          Object.entries(rawSettings).filter(
            ([k, v]) => v !== undefined && v !== null && (v !== "" || typeof DEFAULT_CONFIG[k as keyof ConfigOptions] === "string")
          )
        ) as Partial<ConfigOptions>;
        mergedConfig = {
          ...DEFAULT_CONFIG,
          ...themeSettings,
          titleText:
            themeSettings.titleText ||
            publicInfo.sitename ||
            DEFAULT_CONFIG.titleText,
        };
        // 向後相容：舊版 enableVideoBackground: true → backgroundMode: "video"
        if (
          !themeSettings.backgroundMode &&
          (rawSettings as Record<string, unknown>).enableVideoBackground === true
        ) {
          mergedConfig.backgroundMode = "video";
        }
      } else {
        mergedConfig = DEFAULT_CONFIG;
      }
      setConfig(mergedConfig);

      // Initialize RPC
      if (mergedConfig.enableJsonRPC2Api) {
        const versionInfo = await apiService.getVersion();
        if (versionInfo && versionInfo.version) {
          const match = versionInfo.version.match(/(\d+)\.(\d+)\.(\d+)/);
          if (match) {
            const [, major, minor, patch] = match.map(Number);
            if (
              major > 1 ||
              (major === 1 && minor > 0) ||
              (major === 1 && minor === 0 && patch >= 7)
            ) {
              apiService.useRpc = true;
              getWsService().useRpc = true;
              console.log("RPC has been enabled for API and WebSocket.");
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to initialize site:", error);
      setConfig(DEFAULT_CONFIG);
      setSiteStatus("private-unauthenticated");
    } finally {
      setLoading(false);
      setTimeout(() => setIsLoaded(true), 300);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const activeCustomTexts = previewConfig?.customTexts ?? config?.customTexts;
  const texts = useMemo(() => {
    const baseTexts = activeCustomTexts
      ? mergeTexts(defaultTexts, activeCustomTexts)
      : defaultTexts;
    return deepMerge(baseTexts, otherTexts);
  }, [activeCustomTexts]);

  const updatePreviewConfig = useCallback((newConfig: Partial<ConfigOptions>) => {
    setPreviewConfig(newConfig);
  }, []);

  const reloadConfig = useCallback(async () => {
    setLoading(true);
    await loadConfig();
  }, []);

  const activeConfig = useMemo(
    () =>
      previewConfig
        ? { ...(config || DEFAULT_CONFIG), ...previewConfig }
        : config || DEFAULT_CONFIG,
    [config, previewConfig]
  );

  if (!isLoaded || !config) {
    return (
      <Loading text="載入設定中 ..." className={!loading ? "fade-out" : ""} />
    );
  }

  return (
    <ConfigContext.Provider
      value={{
        ...activeConfig,
        titleText: config?.titleText || DEFAULT_CONFIG.titleText,
        publicSettings,
        siteStatus,
        texts,
        previewConfig,
        updatePreviewConfig,
        reloadConfig,
      }}>
      {children}
    </ConfigContext.Provider>
  );
}
