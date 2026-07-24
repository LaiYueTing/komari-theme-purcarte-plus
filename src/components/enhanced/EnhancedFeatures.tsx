import { useEffect } from "react";
import { useAppConfig } from "@/config";
import { WelcomeBubble } from "./WelcomeBubble";
import { FinanceWidget } from "./FinanceWidget";
import { EarthGlobe } from "./EarthGlobe";
import { ScrollHelpers } from "./ScrollHelpers";
import { Protection } from "./Protection";
import { Matomo } from "./Matomo";
import { CanvasNest } from "./CanvasNest";
import { Sakura } from "./Sakura";
import { Live2D } from "./Live2D";
import { fetchGeoInfo } from "./useUserGeo";
import "./enhanced.css";

export function EnhancedFeatures() {
  const {
    enableWelcomeBubble,
    enableFinanceWidget,
    enableEarthGlobe,
    enableScrollHelpers,
    enableProtection,
    enableMatomo,
    enableCanvasNest,
    enableSakura,
    enableLive2D,
  } = useAppConfig();

  // 當歡迎氣泡關閉但地球元件開啟時，預先取得使用者位置
  // 因為地球元件需要使用者位置來置中地球視角和顯示使用者標記
  useEffect(() => {
    if (!enableWelcomeBubble && enableEarthGlobe) {
      fetchGeoInfo();
    }
  }, [enableWelcomeBubble, enableEarthGlobe]);

  return (
    <>
      {enableWelcomeBubble && <WelcomeBubble />}
      {enableFinanceWidget && <FinanceWidget />}
      {enableEarthGlobe && <EarthGlobe />}
      {enableScrollHelpers && <ScrollHelpers />}
      {enableProtection && <Protection />}
      {enableMatomo && <Matomo />}
      {enableCanvasNest && <CanvasNest />}
      {enableSakura && <Sakura />}
      {enableLive2D && <Live2D />}
    </>
  );
}

/**
 * 用於 private-unauthenticated 狀態下的簡化版本
 * 只渲染 Protection 元件
 */
export function EnhancedFeaturesPrivate() {
  const { enableProtection, enableMatomo } = useAppConfig();

  return (
    <>
      {enableProtection && <Protection />}
      {enableMatomo && <Matomo />}
    </>
  );
}
