// 設定型別定義
export interface ConfigOptions {
    isShowConfigEditButtonInLogined: boolean; // 是否在登入時顯示設定編輯按鈕
    mainWidth: number; // 主內容寬度百分比
    backgroundImage: string; // 桌面端背景圖片 URL
    backgroundImageMobile: string; // 行動端背景圖片 URL
    backgroundMode: BackgroundMode; // 背景模式：純色/圖片/影片
    solidColorBackground: string; // 純色背景顏色值（支援 rgb/rgba/hex/顏色單字）
    videoBackgroundUrl: string; // 桌面端影片背景 URL
    videoBackgroundUrlMobile: string; // 行動端影片背景 URL
    backgroundAlignment: string; // 背景對齊方式
    blurValue: number; // 磨砂玻璃模糊值
    blurBackgroundColor: string; // 磨砂玻璃背景顏色
    enableTransparentTags: boolean; // 是否啟用標籤透明背景
    tagDefaultColorList: string; // 標籤預設顏色清單
    selectThemeColor: ColorType; // 預設主題顏色
    globalFontFamily: string; // 全域字型 font-family 堆疊
    customFontFaceCss: string; // 自訂 @font-face CSS（用於載入外部字型）
    enableLocalStorage: boolean; // 是否啟用本機儲存
    selectedDefaultView: ViewModeType; // 預設檢視模式
    selectedDefaultAppearance: AppearanceType; // 預設外觀模式
    statusCardsVisibility: string; // 狀態卡片顯示控制
    selectedHeaderStyle: HeaderStyle; // 標題列樣式
    enableLogo: boolean; // 是否啟用 Logo
    logoUrl: string; // Logo 圖片 URL
    logoShape: LogoShapeType; // 標題列 Logo 樣式
    enableTitle: boolean; // 是否啟用標題
    titleText: string; // 標題文字
    enableSearchButton: boolean; // 是否啟用搜尋按鈕
    enableAdvancedSearch: boolean; // 是否啟用進階搜尋
    enableAdminButton: boolean; // 是否啟用管理員按鈕
    enableViewModeSwitcher: boolean; // 是否在標題列顯示檢視模式切換
    enablePingOverview: boolean; // 是否在標題列顯示全域延遲監測總覽入口
    enableThemeColorSwitcher: boolean; // 是否在標題列顯示主題顏色模式切換
    enableLanguageSwitcher: boolean; // 是否在標題列顯示語言切換
    selectedFooterStyle: FooterStyle; // 頁尾樣式
    hideFooterOriginal: boolean; // 是否隱藏底列原始內容（Powered by ...）
    enableServerUptime: boolean; // 是否啟用伺服器運行時間顯示
    serverStartTime: string; // 伺服器啟動時間（UTC+8），格式: "年,月,日,時,分,秒"
    serverUptimeTemplate: string; // 運行時間顯示模板
    footerCustomContent: string; // 底列自訂內容（換行分割多行，支援 markdown 連結和圖片，{year} 會替換為目前年份）
    enableJsonRPC2Api: boolean; // 是否啟用 JSON-RPC2 API 轉接
    isShowStatsInHeader: boolean; // 是否在標題列中顯示統計資訊
    mergeGroupsWithStats: boolean; // 是否在統計列中合併分組
    enableStatsBar: boolean; // 是否啟用統計列
    enableSortControl: boolean; // 是否啟用排序控制
    isOfflineNodesBehind: boolean; // 是否啟用離線節點置後顯示
    enableGroupedBar: boolean; // 是否啟用分組列
    defaultSelectedGroup: string; // 預設選擇展示分組
    selectMobileDefaultView: ViewModeType; // 行動端預設展示檢視
    enableSwap: boolean; // 是否啟用 SWAP 顯示
    pingChartTimeInPreview: number; // 預覽詳情的延遲圖表時間範圍，單位為小時
    enableInstanceDetail: boolean; // 是否啟用實例詳情
    enablePingChart: boolean; // 是否啟用延遲圖表
    enableCutPeak: boolean; // 是否啟用平滑
    enableConnectBreaks: boolean; // 是否啟用連線斷點
    pingChartMaxPoints: number; // 延遲圖表最大點數
    monitorNodeSortMode: MonitorNodeSortMode; // 監測節點排序方式
    monitorNodeCustomOrder: string; // 監測節點自訂排序（換行分割名稱）
    isShowHWBarInCard: boolean; // 是否在卡片中顯示硬體資訊列
    isShowValueUnderProgressBar: boolean; // 是否在流量進度條下方顯示數值
    selectTrafficProgressStyle: "circular" | "linear"; // 流量進度條樣式
    enableListItemProgressBar: boolean; // 是否啟用列表檢視進度條
    gridExpiredAtDisplay: DisplayMode; // 網格檢視到期時間顯示模式
    gridUptimeDisplay: DisplayMode; // 網格檢視上線時間顯示模式
    tableExpiredAtDisplay: DisplayMode; // 表格檢視到期時間顯示模式
    tableUptimeDisplay: DisplayMode; // 表格檢視上線時間顯示模式
    compactExpiredAtDisplay: DisplayMode; // 緊湊檢視到期時間顯示模式
    compactUptimeDisplay: DisplayMode; // 緊湊檢視上線時間顯示模式
    customTexts: string; // 自訂 UI 文字
    // 增強功能開關
    enableWelcomeBubble: boolean; // 是否啟用歡迎氣泡
    enableFinanceWidget: boolean; // 是否啟用資產統計
    enableEarthGlobe: boolean; // 是否啟用地球元件
    enableScrollHelpers: boolean; // 是否啟用捲動輔助按鈕
    enableCustomCursor: boolean; // 是否啟用自訂滑鼠游標
    cursorNormalUrl: string; // 一般狀態滑鼠游標圖片 URL
    cursorPointerUrl: string; // 可點擊狀態滑鼠游標圖片 URL
    enableProtection: boolean; // 是否啟用自訂警告保護
    protectionLogoUrl: string; // 訪客保護彈窗 Logo 圖片 URL
    protectionLogoShape: LogoShapeType; // 訪客保護彈窗 Logo 樣式
    // Matomo 網站分析設定
    enableMatomo: boolean; // 是否啟用 Matomo 網站分析
    matomoUrl: string; // Matomo 伺服器位址（如 https://matomo.example.com/）
    matomoSiteId: string; // Matomo 網站 ID（Site ID）
    // 歡迎氣泡設定
    welcomeBubbleSiteName: string; // 歡迎氣泡站點名稱
    welcomeBubbleLogoUrl: string; // 歡迎氣泡 Logo 圖片 URL
    welcomeBubbleLogoShape: LogoShapeType; // 歡迎氣泡 Logo 樣式
    // 地球元件設定
    earthGlobeLogoUrl: string; // 地球元件 Logo 圖片 URL
    earthGlobeLogoShape: LogoShapeType; // 地球元件 Logo 樣式
    earthLightBgImage: string; // 地球元件淺色模式背景圖
    earthDarkBgImage: string; // 地球元件深色模式背景圖
    earthLightGlobeImage: string; // 地球元件淺色模式地球貼圖
    earthDarkGlobeImage: string; // 地球元件深色模式地球貼圖
    enableSoloPlay: boolean; // 是否啟用偽點亮全球效果
    // 視覺特效
    enableCanvasNest: boolean; // 是否啟用連線粒子背景
    canvasNestColor: string; // 連線粒子顏色（R,G,B）
    canvasNestCount: number; // 連線粒子數量
    enableSakura: boolean; // 是否啟用櫻花飄落特效
    enableLive2D: boolean; // 是否啟用 Live2D 看板娘
    live2dModelUrl: string; // Live2D 模型 JSON URL
}

// 預設設定值
export const DEFAULT_CONFIG: ConfigOptions = {
    isShowConfigEditButtonInLogined: false,
    mainWidth: 85,
    backgroundImage: "/assets/default-background-image.png",
    backgroundImageMobile: "",
    backgroundMode: "image",
    solidColorBackground: "",
    videoBackgroundUrl: "/assets/LanternRivers_1080p15fps2Mbps3s.mp4",
    videoBackgroundUrlMobile: "",
    backgroundAlignment: "cover,top",
    blurValue: 5,
    blurBackgroundColor: "rgba(255, 255, 255, 0.5)|rgba(0, 0, 0, 0.5)",
    enableTransparentTags: true,
    tagDefaultColorList:
        "lime,cyan,pink,crimson,iris,violet,plum,indigo,blue,jade,mint,grass,teal,sky,red,ruby,tomato,orange,amber,yellow,green,purple,gold,bronze,brown,gray,mauve,slate",
    selectThemeColor: "violet",
    globalFontFamily:
        "'Harmony Hans', 'Noto Sans TC', 'Noto Sans SC', Ubuntu, -apple-system, BlinkMacSystemFont, 'PingFang TC', 'PingFang SC', 'Microsoft JhengHei', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    customFontFaceCss:
        "@font-face {\n    font-family: 'Harmony Hans';\n    src: url(https://cdn.jsdelivr.net/gh/IKKI2000/harmonyos-fonts/fonts/HarmonyOS_Sans_TC/HarmonyOS_Sans_TC_Medium.woff2) format('woff2');\n    font-display: swap;\n}",
    enableLocalStorage: true,
    selectedDefaultView: "grid",
    selectedDefaultAppearance: "system",
    statusCardsVisibility:
        "currentTime:true,currentOnline:true,regionOverview:true,trafficOverview:true,networkSpeed:true",
    selectedHeaderStyle: "fixed",
    enableLogo: true,
    logoUrl: "/assets/logo.png",
    logoShape: "circle",
    enableTitle: true,
    titleText: "",
    enableSearchButton: true,
    enableAdvancedSearch: true,
    enableAdminButton: true,
    enableViewModeSwitcher: true,
    enablePingOverview: true,
    enableThemeColorSwitcher: true,
    enableLanguageSwitcher: true,
    selectedFooterStyle: "followContent",
    hideFooterOriginal: false,
    enableServerUptime: false,
    serverStartTime: "",
    serverUptimeTemplate:
        "已不穩定運行 {days} 天 {hours} 小時 {minutes} 分鐘 {seconds} 秒",
    footerCustomContent: "",
    enableJsonRPC2Api: true,
    isShowStatsInHeader: false,
    mergeGroupsWithStats: false,
    enableStatsBar: true,
    enableSortControl: true,
    isOfflineNodesBehind: false,
    enableGroupedBar: true,
    defaultSelectedGroup: "",
    selectMobileDefaultView: "grid",
    enableSwap: true,
    pingChartTimeInPreview: 1,
    enableInstanceDetail: true,
    enablePingChart: true,
    enableCutPeak: true,
    enableConnectBreaks: false,
    pingChartMaxPoints: 0,
    monitorNodeSortMode: "weight_asc",
    monitorNodeCustomOrder: "",
    isShowHWBarInCard: true,
    isShowValueUnderProgressBar: true,
    selectTrafficProgressStyle: "circular",
    enableListItemProgressBar: true,
    gridExpiredAtDisplay: "hideUnset",
    gridUptimeDisplay: "hideUnset",
    tableExpiredAtDisplay: "hideUnset",
    tableUptimeDisplay: "hideUnset",
    compactExpiredAtDisplay: "hideUnset",
    compactUptimeDisplay: "hideUnset",
    customTexts: "",
    // 增強功能開關
    enableWelcomeBubble: true,
    enableFinanceWidget: true,
    enableEarthGlobe: true,
    enableScrollHelpers: true,
    enableCustomCursor: true,
    cursorNormalUrl: "/assets/normal.png",
    cursorPointerUrl: "/assets/pointer.png",
    enableProtection: false,
    protectionLogoUrl: "/assets/logo.png",
    protectionLogoShape: "circle",
    // Matomo 網站分析設定
    enableMatomo: false,
    matomoUrl: "",
    matomoSiteId: "",
    // 歡迎氣泡設定
    welcomeBubbleSiteName: "訪客資訊",
    welcomeBubbleLogoUrl: "/assets/logo.png",
    welcomeBubbleLogoShape: "circle",
    // 地球元件設定
    earthGlobeLogoUrl: "/assets/logo.png",
    earthGlobeLogoShape: "circle",
    earthLightBgImage: "",
    earthDarkBgImage:
        "//upload.wikimedia.org/wikipedia/commons/6/60/ESO_-_Milky_Way.jpg",
    earthLightGlobeImage:
        "//upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg",
    earthDarkGlobeImage:
        "//upload.wikimedia.org/wikipedia/commons/b/b3/Solarsystemscope_texture_8k_earth_nightmap.jpg",
    enableSoloPlay: false,
    // 視覺特效
    enableCanvasNest: true,
    canvasNestColor: "128,128,128",
    canvasNestCount: 99,
    enableSakura: true,
    enableLive2D: true,
    live2dModelUrl:
        "https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json",
};
// 定義顏色型別
export type ColorType =
    | "ruby"
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "yellow"
    | "amber"
    | "orange"
    | "tomato"
    | "red"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "lime"
    | "mint"
    | "sky";
export const allColors: ColorType[] = [
    "ruby",
    "gray",
    "gold",
    "bronze",
    "brown",
    "yellow",
    "amber",
    "orange",
    "tomato",
    "red",
    "crimson",
    "pink",
    "plum",
    "purple",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "green",
    "grass",
    "lime",
    "mint",
    "sky",
];

export type AppearanceType = "light" | "dark" | "system";
export const allAppearance: AppearanceType[] = ["light", "dark", "system"];

export type ViewModeType = "grid" | "table" | "compact";
export const allViewModes: ViewModeType[] = ["grid", "table", "compact"];

export type SiteStatus =
    | "public"
    | "private-unauthenticated"
    | "private-authenticated"
    | "authenticated";

export type HeaderStyle = "fixed" | "levitation";
export type FooterStyle = "fixed" | "levitation" | "followContent" | "hidden";
export type DisplayMode = "show" | "hideAll" | "hideUnset";
export type BackgroundMode = "solidColor" | "image" | "video";
export type MonitorNodeSortMode =
    | "name_asc"
    | "name_desc"
    | "id_asc"
    | "id_desc"
    | "weight_asc"
    | "weight_desc"
    | "target_asc"
    | "target_desc"
    | "type_asc"
    | "type_desc"
    | "custom";
export type LogoShapeType = "circle" | "original";
