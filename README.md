<div align="center">

<img width="2560" src="./preview.png" alt="PurCarte Theme Preview">

# PurCarte-Plus

一款為 [Komari](https://github.com/komari-monitor/komari) 設計的磨砂玻璃風格個人化增強版主題

</div>

---

> [!NOTE]
> 本主題在 [原作者:Montia37 v1.2.5](https://github.com/Montia37/komari-theme-purcarte/releases/tag/v1.2.5) 版本基礎上進行二次開發，並在 Codex 的輔助下完成

---

## 📝 更新總結

[UPDATES](./UPDATES.md)

---

## 🚀 快速開始

### 安裝與啟用

1.  前往 [Releases](https://github.com/LaiYueTing/komari-theme-purcarte-plus/releases) 頁面下載最新的 `komari-theme-purcarte-plus.zip` 檔案
2.  進入 Komari 後台，上傳 `zip` 壓縮包並啟用本主題

### 可用設定

<details>
<summary><b>前端管理開關</b></summary>

- **是否在登入時顯示設定編輯按鈕** (`isShowConfigEditButtonInLogined`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將在登入時於標題列最右側顯示設定編輯按鈕，方便管理員進行主題設定

</details>

<details>
<summary><b>瀏覽器本機儲存設定</b></summary>

- **啟用 localStorage 設定** (`enableLocalStorage`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將優先使用使用者瀏覽器本機設定的檢視與外觀設定。關閉後將強制使用下方的主題設定（含桌面／行動端預設檢視），本機可調整但重新整理即恢復

</details>

<details>
<summary><b>樣式調整</b></summary>

- **主要內容寬度** (`mainWidth`)
  - **型別:** `number`
  - **預設值:** `85`
  - **說明:** 調整主要內容的最大寬度，單位為視窗寬度的百分比（vw），建議值為 80-90

- **背景模式** (`backgroundMode`)
  - **型別:** `select`
  - **可選項:** `image`, `video`, `solidColor`
  - **預設值:** `image`
  - **說明:** 選擇背景模式：image（圖片背景）、video（影片背景）、solidColor（純色背景）

- **桌面端背景圖片連結** (`backgroundImage`)
  - **型別:** `string`
  - **預設值:** `/assets/default-background-image.png`
  - **說明:** 支援多張背景圖片或圖片 api，使用「,」分割，多項會按偽隨機順序輪換；使用「|」分隔淺色模式與深色模式，填寫單個則同時用於淺深模式

- **行動端背景圖片連結** (`backgroundImageMobile`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 行動端背景圖片連結，多個使用「,」分割並按偽隨機順序輪換，與桌面端一樣區分淺深模式，留空則使用桌面端背景

- **純色背景顏色值** (`solidColorBackground`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 純色背景顏色值，支援 rgb（如 `rgb(255,0,0)`）、rgba（如 `rgba(255,0,0,0.5)`）、hex（如 `#ff0000`）、顏色單字（如 `red`），僅在背景模式為 solidColor 時生效

- **桌面端影片背景連結** (`videoBackgroundUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/LanternRivers_1080p15fps2Mbps3s.mp4`
  - **說明:** 影片背景連結，多個使用「,」分割並按偽隨機順序輪換；使用「|」分隔淺色模式與深色模式，填寫單個則同時用於淺深模式，建議使用無聲影片，且影片檔案較大時可能會影響載入速度

- **行動端影片背景連結** (`videoBackgroundUrlMobile`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 行動端影片背景連結，多個使用「,」分割並按偽隨機順序輪換，與桌面端一樣區分淺深模式，留空則使用桌面端影片

- **背景對齊方式** (`backgroundAlignment`)
  - **型別:** `string`
  - **預設值:** `cover,top`
  - **說明:** 調整背景圖片與影片的對齊方式，使用「,」分隔背景大小與位置兩個屬性，背景大小可選 cover（覆蓋）、contain（包含）、fill（填充）；背景位置可選 center（置中）、top（頂部）、bottom（底部）、left（左側）、right（右側），eg: cover,top

- **啟用磨砂玻璃效果** (`enableBlur`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將使主要容器擁有磨砂玻璃效果

- **磨砂玻璃模糊值** (`blurValue`)
  - **型別:** `number`
  - **預設值:** `5`
  - **說明:** 調整模糊值大小，數值越大模糊效果越明顯，建議值為 5-20，為 0 則表示不啟用模糊效果

- **磨砂玻璃背景色** (`blurBackgroundColor`)
  - **型別:** `string`
  - **預設值:** `rgba(255, 255, 255, 0.5)|rgba(0, 0, 0, 0.5)`
  - **說明:** 調整模糊背景色，推薦 rgba 顏色值（eg: rgba(255, 255, 255, 0.5)|rgba(0, 0, 0, 0.5)），使用「|」分隔淺色模式與深色模式的顏色值，填寫單個則同時用於淺深模式

- **啟用標籤透明背景** (`enableTransparentTags`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後標籤將使用較為透明的背景色，當背景情況複雜導致標籤難以辨識時建議關閉

- **標籤預設顏色清單** (`tagDefaultColorList`)
  - **型別:** `string`
  - **預設值:** `lime,cyan,pink,crimson,iris,violet,plum,indigo,blue,jade,mint,grass,teal,sky,red,ruby,tomato,orange,amber,yellow,green,purple,gold,bronze,brown,gray,mauve,slate`
  - **說明:** 標籤預設顏色清單，展示的標籤將按順序調用該顏色池，逗號分隔（可用的顏色清單請參考：[Radix Color](https://www.radix-ui.com/themes/docs/theme/color)，改完沒有生效則說明填寫有誤）

- **免費標籤文字** (`freeTag`)
  - **型別:** `string`
  - **預設值:** `白嫖中`
  - **說明:** 用於識別免費／白嫖節點的標籤文字。資產統計的排除免費標籤、進階搜尋的搜尋免費都會按此文字精確比對節點 `tags`（分號分隔）

- **全域字型** (`globalFontFamily`)
  - **型別:** `string`
  - **預設值:** `'Harmony Hans', 'Noto Sans TC', 'Noto Sans SC', Ubuntu, ...（HarmonyOS/思源黑體堆疊）`
  - **說明:** 全域字型的 font-family 堆疊，依序回退。系統會依序嘗試 Harmony Hans、Noto Sans TC、Ubuntu、Mac/Windows 系統字型等。多個字型用逗號分隔，含空格的字型名需用單引號包裹。留空則使用主題預設字型

- **自訂 @font-face CSS** (`customFontFaceCss`)
  - **型別:** `richtext`
  - **預設值:** `（載入 Harmony Hans 的 @font-face）`
  - **說明:** 原樣注入的 @font-face CSS，用於載入未安裝在系統中的外部字型（如 Harmony Hans）。定義後需在「全域字型」中引用對應的字型名稱。留空則不載入外部字型

- **預設主題顏色** (`selectThemeColor`)
  - **型別:** `select`
  - **可選項:** `gray`, `gold`, `bronze`, `brown`, `yellow`, `amber`, `orange`, `tomato`, `red`, `ruby`, `crimson`, `pink`, `plum`, `purple`, `violet`, `iris`, `indigo`, `blue`, `cyan`, `teal`, `jade`, `green`, `grass`, `lime`, `mint`, `sky`
  - **預設值:** `violet`
  - **說明:** 設定預設主題顏色，顏色對照請參考：[Radix Color](https://www.radix-ui.com/themes/docs/theme/color)

- **預設外觀** (`selectedDefaultAppearance`)
  - **型別:** `select`
  - **可選項:** `system`, `light`, `dark`
  - **預設值:** `system`
  - **說明:** 設定預設外觀為淺色、深色或跟隨系統主題

</details>

<details>
<summary><b>標題列設定</b></summary>

- **標題列樣式** (`selectedHeaderStyle`)
  - **型別:** `select`
  - **可選項:** `fixed`, `levitation`
  - **預設值:** `fixed`
  - **說明:** 設定標題列樣式為 fixed（固定）或 levitation（懸浮）

- **啟用標題列左側 Logo** (`enableLogo`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設在標題列左側顯示 Logo

- **Logo 圖片連結** (`logoUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/logo.png`
  - **說明:** Logo 圖片連結（eg: `https://test.com/logo.png`）

- **標題列 Logo 樣式** (`logoShape`)
  - **型別:** `select`
  - **可選項:** `circle`, `original`
  - **預設值:** `circle`
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應），應對 Logo 不是正方形的情況

- **啟用標題列標題** (`enableTitle`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設在頂列左側顯示標題

- **標題列標題文字** (`titleText`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 標題列左側顯示的文字（留空則使用站點標題）

- **啟用搜尋按鈕** (`enableSearchButton`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設在標題列右側顯示搜尋按鈕

- **啟用進階搜尋** (`enableAdvancedSearch`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示進階搜尋按鈕（替代普通搜尋列），支援多條件篩選、URL 參數同步等功能

- **啟用管理按鈕** (`enableAdminButton`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設在標題列右側顯示管理按鈕

- **啟用檢視模式切換** (`enableViewModeSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示檢視模式切換按鈕（網格／表格／緊湊）

- **啟用延遲總覽** (`enablePingOverview`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示延遲總覽入口按鈕，關閉後 /ping-overview 頁面也將無法存取

- **啟用主題顏色模式切換** (`enableThemeColorSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示主題顏色模式切換按鈕（淺色／深色／跟隨系統）

- **啟用語言切換** (`enableLanguageSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示語言切換按鈕

- **語言切換** — 標題列內建語言切換按鈕，支援簡體中文、繁體中文、English、日本語、Bahasa Indonesia 五種語言，選擇後自動儲存到瀏覽器

- **資產統計 & 3D 地球入口** — 標題列內建資產統計與 3D 地球按鈕（位於延遲總覽按鈕左側），行動端整合到漢堡選單中，受後台 `enableFinanceWidget` 與 `enableEarthGlobe` 設定控制；網格、緊湊、表格檢視中的金額標籤也可懸浮／點擊查看到期時間、帳單金額、計費週期與剩餘價值，並可直接開啟伺服器交易彈窗

</details>

<details>
<summary><b>內容設定</b></summary>

- **啟用 JSON-RPC2 API 轉接** (`enableJsonRPC2Api`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在支援的 Komari 版本優先使用新版介面取得節點、負載與 Ping 資料，並相容 Komari 1.2.6 及後續預發布版本的獨立指標保留策略；舊版本會自動回退

- **啟用統計列** (`enableStatsBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示統計列

- **啟用排序控制** (`enableSortControl`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在統計列添加排序控制下拉選單選項，分別對流量上下行與網速上下行進行升降排序，僅在啟用統計列時有效

- **狀態卡片顯示控制** (`statusCardsVisibility`)
  - **型別:** `string`
  - **預設值:** `currentTime:true,currentOnline:true,regionOverview:true,trafficOverview:true,networkSpeed:true,assetValue:true,monthlyExpense:true`
  - **說明:** 控制狀態卡片的顯示與隱藏，格式為 卡片名稱:顯示狀態（true/false），多個卡片使用逗號分隔；也可在狀態列的「狀態顯示設定」中分別切換

- **是否在標題列中顯示統計資訊** (`isShowStatsInHeader`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將在標題列中顯示統計資訊（僅在大螢幕桌面端有效）

- **啟用分組列** (`enableGroupedBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示分組列

- **合併分組列與統計列** (`mergeGroupsWithStats`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後分組列將合併到統計列中，並以下拉選單形式展示

- **預設選擇展示分組** (`defaultSelectedGroup`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 設定預設選擇展示的分組，填寫後端設定的分組名，留空則預設展示「所有」分組

- **啟用離線節點置後顯示** (`isOfflineNodesBehind`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後離線節點將被自動置後顯示

- **桌面端預設展示檢視** (`selectedDefaultView`)
  - **型別:** `select`
  - **可選項:** `grid`, `table`, `compact`
  - **預設值:** `grid`
  - **說明:** 設定預設展示檢視為網格、表格或緊湊型

- **行動端預設展示檢視** (`selectMobileDefaultView`)
  - **型別:** `select`
  - **可選項:** `grid`, `table`, `compact`
  - **預設值:** `grid`
  - **說明:** 設定行動端預設展示檢視為網格、表格或緊湊型

- **啟用 SWAP 顯示** (`enableSwap`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示 SWAP 資訊

- **是否在卡片中顯示硬體資訊列** (`isShowHWBarInCard`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在節點卡片中標題列之下顯示硬體資訊列（CPU、記憶體與硬碟總量）

- **是否在流量進度條下方顯示數值** (`isShowValueUnderProgressBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在記憶體、SWAP、硬碟佔用情況進度條下方顯示實際佔用數值

- **流量進度條樣式** (`selectTrafficProgressStyle`)
  - **型別:** `select`
  - **可選項:** `circular`, `linear`
  - **預設值:** `circular`
  - **說明:** 設定流量進度條樣式為 circular（環形）或 linear（線形）

- **啟用列表檢視進度條** (`enableListItemProgressBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後列表檢視中將會顯示進度條來表示使用率

- **網格檢視 - 到期時間顯示** (`gridExpiredAtDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制網格檢視中到期時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定）

- **網格檢視 - 上線時間顯示** (`gridUptimeDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制網格檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定／離線）

- **表格檢視 - 到期時間顯示** (`tableExpiredAtDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制表格檢視中到期時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定）

- **表格檢視 - 上線時間顯示** (`tableUptimeDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制表格檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定／離線）

- **緊湊檢視 - 到期時間顯示** (`compactExpiredAtDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制緊湊檢視中到期時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定）

- **緊湊檢視 - 上線時間顯示** (`compactUptimeDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制緊湊檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定／離線）

</details>

<details>
<summary><b>底列設定</b></summary>

- **底列樣式** (`selectedFooterStyle`)
  - **型別:** `select`
  - **可選項:** `fixed`, `levitation`, `followContent`, `hidden`
  - **預設值:** `followContent`
  - **說明:** 設定底列樣式為 fixed（固定）、levitation（懸浮）、followContent（跟隨內容）或 hidden（隱藏）

- **隱藏底列原始內容** (`hideFooterOriginal`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將隱藏底列中的 'Powered by Komari Monitor | Theme by PurCarte-Plus' 內容

- **啟用伺服器運行時間** (`enableServerUptime`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將在底列顯示伺服器運行時間計時器

- **伺服器啟動時間（UTC+8）** (`serverStartTime`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 格式: 年,月,日,時,分,秒（eg: 2025,11,5,20,30,5 表示 2025 年 11 月 5 日 20 時 30 分 5 秒），留空則不顯示

- **運行時間顯示模板** (`serverUptimeTemplate`)
  - **型別:** `string`
  - **預設值:** `已不穩定運行 {days} 天 {hours} 小時 {minutes} 分鐘 {seconds} 秒`
  - **說明:** 自訂運行時間的顯示格式，可用變數: {days}（天）、{hours}（時）、{minutes}（分）、{seconds}（秒），自由排列組合（eg: Running {days}d {hours}h {minutes}m {seconds}s）

- **底列自訂內容** (`footerCustomContent`)
  - **型別:** `richtext`
  - **預設值:** `(空)`
  - **說明:** 自訂底列內容，支援直接換行，也相容 ${n} 分割多行，支援 Markdown 格式的連結 `[文字](連結)` 與圖片 `![描述](圖片連結)`；支援 `${hash}` 或 `${version}`

</details>

<details>
<summary><b>Instance 設定</b></summary>

- **啟用 Instance 詳情資訊** (`enableInstanceDetail`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示 Instance 詳情

- **啟用延遲圖表** (`enablePingChart`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示延遲圖表

- **啟用平滑** (`enableCutPeak`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後延遲圖表將使用 EWMA 平滑演算法消除毛刺與突變值

- **啟用連線斷點** (`enableConnectBreaks`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後圖表中的曲線將會跨過斷點形成連續的線條，並使用半透明的垂直參考線來標記斷點位置；該開關僅影響圖表渲染，不參與丟包率計算，丟包率使用伺服器端回傳的監測任務統計值

- **預覽詳情的延遲圖表時間範圍** (`pingChartTimeInPreview`)
  - **型別:** `number`
  - **預設值:** `1`
  - **說明:** 設定卡片右上角彈窗詳情與表格下拉詳情中延遲圖表的時間範圍，單位為小時，建議值為 1-24，時間範圍太大容易導致頁面卡頓

- **延遲圖表最大渲染點數** (`pingChartMaxPoints`)
  - **型別:** `number`
  - **預設值:** `0`
  - **說明:** 設定延遲圖表普通資料點的最大渲染數量，0 表示根據資料量與線條數自動計算；查詢首尾邊界與斷點標記始終保留，因此最終點數可能少量超過該值

- **監測節點排序方式** (`monitorNodeSortMode`)
  - **型別:** `select`
  - **可選項:** `id_asc`, `id_desc`, `weight_asc`, `weight_desc`, `name_asc`, `name_desc`, `target_asc`, `target_desc`, `type_asc`, `type_desc`, `custom`
  - **預設值:** `weight_asc`
  - **說明:** 設定延遲總覽頁面與伺服器詳情頁延遲監測的監測節點排序方式。選擇自訂後在下方輸入框填寫節點名稱

- **監測節點自訂排序** (`monitorNodeCustomOrder`)
  - **型別:** `richtext`
  - **預設值:** `(空)`
  - **說明:** 僅在排序方式為「自訂」時生效。每行填寫一個監測節點名稱（與後台設定的名稱一致），按填寫順序排序。未列出的節點將按 ID 升序排列在最後

</details>

<details>
<summary><b>增強功能</b></summary>

- **啟用歡迎氣泡** (`enableWelcomeBubble`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在頁面左下角顯示歡迎氣泡，展示訪客的 IP、位置、瀏覽器等資訊

- **歡迎氣泡站點名稱** (`welcomeBubbleSiteName`)
  - **型別:** `string`
  - **預設值:** `訪客資訊`
  - **說明:** 歡迎氣泡標題列顯示的站點名稱，留空則使用站點標題

- **歡迎氣泡 Logo** (`welcomeBubbleLogoUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/logo.png`
  - **說明:** 歡迎氣泡標題列的 Logo 圖片連結，留空則不展示

- **歡迎氣泡 Logo 樣式** (`welcomeBubbleLogoShape`)
  - **型別:** `select`
  - **可選項:** `circle`, `original`
  - **預設值:** `circle`
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應）

- **啟用資產統計** (`enableFinanceWidget`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在標題列顯示資產統計入口按鈕，可查看伺服器總價值、月均支出、剩餘價值等資訊，並支援伺服器交易計算；首頁三種檢視中的金額標籤會同步提供資產 Tooltip 與交易入口，狀態列可顯示總價值、剩餘總價值與月均支出，貨幣單位與免費標籤排除規則均跟隨資產統計面板即時更新

- **啟用地球元件** (`enableEarthGlobe`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在標題列顯示 3D 地球入口按鈕，可查看伺服器地理分布

- **地球元件 Logo** (`earthGlobeLogoUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/logo.png`
  - **說明:** 地球元件中使用者位置標記的 Logo 圖片連結，留空則顯示 YOU 文字標記

- **地球元件 Logo 樣式** (`earthGlobeLogoShape`)
  - **型別:** `select`
  - **可選項:** `circle`, `original`
  - **預設值:** `circle`
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應）

- **地球元件淺色模式背景圖** (`earthLightBgImage`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 地球元件淺色模式的背景圖片連結，留空則使用透明背景

- **地球元件深色模式背景圖** (`earthDarkBgImage`)
  - **型別:** `string`
  - **預設值:** `//upload.wikimedia.org/wikipedia/commons/6/60/ESO_-_Milky_Way.jpg`
  - **說明:** 地球元件深色模式的背景圖片連結，留空則使用透明背景

- **地球元件淺色模式地球貼圖** (`earthLightGlobeImage`)
  - **型別:** `string`
  - **預設值:** `//upload.wikimedia.org/.../earth_daymap.jpg`
  - **說明:** 地球元件淺色模式的地球貼圖連結

- **地球元件深色模式地球貼圖** (`earthDarkGlobeImage`)
  - **型別:** `string`
  - **預設值:** `//upload.wikimedia.org/.../earth_nightmap.jpg`
  - **說明:** 地球元件深色模式的地球貼圖連結

- **啟用偽點亮全球效果** (`enableSoloPlay`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後地球元件將使用假資料實現點亮全球

- **啟用捲動輔助按鈕** (`enableScrollHelpers`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在頁面右下角顯示捲動到頂部／底部輔助按鈕

- **啟用自訂滑鼠游標** (`enableCustomCursor`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將使用自訂圖片作為滑鼠游標，可點擊元素顯示指標游標，文字輸入框保留系統文字游標。建議使用 32×32 以內的 PNG/CUR 圖片，過大將無法顯示

- **一般游標圖片** (`cursorNormalUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/normal.png`
  - **說明:** 一般狀態下的滑鼠游標圖片連結，僅在啟用自訂滑鼠游標時生效

- **點擊游標圖片** (`cursorPointerUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/pointer.png`
  - **說明:** 可點擊元素（連結、按鈕等）的滑鼠游標圖片連結，僅在啟用自訂滑鼠游標時生效

- **啟用連線粒子背景** (`enableCanvasNest`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 在頁面背景顯示跟隨滑鼠的連線粒子動畫，僅桌面端生效

- **連線粒子顏色** (`canvasNestColor`)
  - **型別:** `string`
  - **預設值:** `128,128,128`
  - **說明:** 連線粒子的 RGB 顏色，格式為 R,G,B（如 128,128,128），僅在啟用連線粒子背景時生效

- **連線粒子數量** (`canvasNestCount`)
  - **型別:** `number`
  - **預設值:** `99`
  - **說明:** 連線粒子的數量，數值越大越密集（也越耗效能），僅在啟用連線粒子背景時生效

- **啟用櫻花飄落特效** (`enableSakura`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 在頁面上顯示飄落的櫻花花瓣，僅桌面端生效

- **啟用 Live2D 看板娘** (`enableLive2D`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 在頁面右下角顯示 Live2D 看板娘角色，僅桌面端生效

- **Live2D 模型連結** (`live2dModelUrl`)
  - **型別:** `string`
  - **預設值:** `https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json`
  - **說明:** Live2D 模型的 model.json 連結，僅在啟用 Live2D 看板娘時生效

- **啟用 Matomo 網站分析** (`enableMatomo`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將注入 Matomo 追蹤腳本，並在單頁應用路由切換時自動統計頁面瀏覽。需同時填寫下方的伺服器位址與網站 ID

- **Matomo 伺服器位址** (`matomoUrl`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** Matomo 實例的訪問位址（eg: https://matomo.example.com/），腳本將由此位址載入 matomo.js 與 matomo.php

- **Matomo 網站 ID** (`matomoSiteId`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** Matomo 後台中對應站點的網站 ID（Site ID），通常為數字，eg: 1

- **啟用公告** (`enableAnnouncement`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後進入頁面時顯示一個帶半透明遮罩的公告彈窗

- **公告彈窗 Logo** (`announcementLogoUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/logo.png`
  - **說明:** 公告彈窗標題列的 Logo 圖片連結，留空則不展示；也支援 `${info}`、`${warning}`、`${important}` 圓形 SVG 佔位符

- **公告彈窗 Logo 樣式** (`announcementLogoShape`)
  - **型別:** `select`
  - **可選項:** `circle`, `original`
  - **預設值:** `circle`
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應）。特殊 SVG 佔位符始終以圓形展示

- **公告標題內容** (`announcementTitle`)
  - **型別:** `string`
  - **預設值:** `溫馨提示`
  - **說明:** 公告彈窗的標題內容，支援 `${hash}` 或 `${version}`

- **公告主內容** (`announcementContent`)
  - **型別:** `richtext`
  - **預設值:** `(空)`
  - **說明:** 公告彈窗的主內容，支援普通文字、HTML、`${hash}`/`${version}` 與基礎 Markdown（標題、列表、粗體、斜體、刪除線、連結、圖片、行內程式碼、程式碼區塊、表格、`---` 分隔線、`>` 引用、`> [!xxx]` 提示區塊、`::: details 點擊展開 ... :::` 折疊區塊）

- **啟用訪客保護** (`enableProtection`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將對未登入使用者啟用反除錯保護，禁止右鍵選單、開發者工具等操作

- **訪客保護彈窗 Logo** (`protectionLogoUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/logo.png`
  - **說明:** 訪客保護彈窗標題列的 Logo 圖片連結，留空則不展示

- **訪客保護彈窗 Logo 樣式** (`protectionLogoShape`)
  - **型別:** `select`
  - **可選項:** `circle`, `original`
  - **預設值:** `circle`
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應）

</details>

<details>
<summary><b>UI 自訂</b></summary>

- **自訂 UI 文字（實驗性，不推薦手動填寫任何東西）** (`customTexts`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 使用 key:value,key2:value2 的格式自訂 UI 文字，value 使用 URL 編碼以避免特殊符號。推薦使用管理員登入後的編輯功能而不是手動填寫此項，以避免格式錯誤導致的問題

</details>

---

## 📁 專案結構

<details>
<summary><b>點擊展開完整目錄樹</b></summary>

```
komari-theme-purcarte-plus/
├── public/                                  # 靜態資源目錄
│   └── assets/
│       ├── default-background-image.png     # 預設桌面端背景圖片
│       ├── LanternRivers_1080p15fps2Mbps3s.mp4  # 預設影片背景
│       ├── logo.png                         # 站點 Logo
│       ├── pwa-icon.png                     # PWA 應用圖示
│       ├── normal.png                       # 自訂一般滑鼠游標
│       ├── pointer.png                      # 自訂點擊滑鼠游標
│       ├── flags/                           # 國家/地區旗幟 SVG 圖示集（250+）
│       └── logo/                            # 作業系統與服務 Logo 圖示集（30+）
│
├── src/                                     # 原始碼目錄
│   ├── main.tsx                             # 應用入口，掛載 React 根元件，註冊 Router/Theme/Config/Data 等 Provider
│   ├── vite-env.d.ts                        # Vite 環境型別宣告
│   ├── index.css                            # 全域 CSS 樣式
│   ├── palette-rgb.css                      # Radix 主題色 RGB 調色盤變數定義
│   │
│   ├── pages/                               # 頁面元件
│   │   ├── Home.tsx                         # 首頁儀表板，展示統計列、節點網格/表格/緊湊檢視
│   │   ├── Private.tsx                      # 私有站點未認證提示頁
│   │   ├── NotFound.tsx                     # 404 頁面
│   │   ├── PingOverview.tsx                 # 延遲總覽頁面
│   │   └── instance/                        # Instance 詳情頁
│   │       ├── index.tsx                    # Instance 頁面入口與路由包裝
│   │       ├── Instance.tsx                 # Instance 詳情主檢視（基本資訊、系統指標、網路狀態）
│   │       ├── LoadCharts.tsx               # CPU/負載 歷史圖表
│   │       └── PingChart.tsx                # 延遲/丟包 歷史圖表
│   │
│   ├── components/                          # 元件目錄
│   │   ├── DynamicContent.tsx               # 動態背景內容處理（圖片/影片背景切換與主題適配）
│   │   ├── loading.tsx                      # 載入動畫元件
│   │   ├── Loading.css                      # 載入動畫樣式
│   │   │
│   │   ├── ui/                              # 基礎 UI 元件庫（基於 Radix UI）
│   │   │   ├── avatar.tsx                   # 頭像元件
│   │   │   ├── button.tsx                   # 按鈕元件
│   │   │   ├── card.tsx                     # 卡片容器元件
│   │   │   ├── chart.tsx                    # 圖表包裝元件（整合 Recharts）
│   │   │   ├── dropdown-menu.tsx            # 下拉選單元件
│   │   │   ├── dropdown-menu.css            # 下拉選單樣式
│   │   │   ├── input.tsx                    # 輸入框元件
│   │   │   ├── progress-bar.tsx             # 線性進度條元件
│   │   │   ├── progress-circle.tsx          # 環形進度條元件
│   │   │   ├── scroll-area.tsx              # 可捲動區域元件
│   │   │   ├── select.tsx                   # 下拉選擇元件
│   │   │   ├── select.css                   # 下拉選擇動畫樣式
│   │   │   ├── sonner.tsx                   # Toast 通知元件（整合 Sonner）
│   │   │   ├── switch.tsx                   # 開關切換元件
│   │   │   ├── tag.tsx                      # 標籤/徽章元件
│   │   │   ├── textarea.tsx                 # 多行文字輸入元件
│   │   │   ├── tips.tsx                     # 提示氣泡元件
│   │   │   └── tooltip.tsx                  # 工具提示元件（含 ScrollableTooltip 可捲動提示框）
│   │   │
│   │   ├── sections/                        # 頁面區塊元件
│   │   │   ├── Header.tsx                   # 標題列（Logo、標題、搜尋、檢視切換、資產統計、3D地球、延遲總覽、主題切換、語言切換、管理入口）
│   │   │   ├── LanguageSwitcher.tsx          # 語言切換元件（i18next 多語言切換）
│   │   │   ├── Footer.tsx                   # 底列（自訂內容、伺服器運行時間、Markdown 渲染）
│   │   │   ├── Flag.tsx                     # 國家旗幟展示元件
│   │   │   ├── NodeGrid.tsx                 # 節點網格檢視（卡片式佈局）
│   │   │   ├── NodeCompact.tsx              # 節點緊湊檢視（精簡列表）
│   │   │   ├── NodeDisplay.tsx              # 節點詳細資訊展示（彈窗/側欄詳情）
│   │   │   ├── NodeTable.tsx                # 節點表格檢視（可展開行詳情）
│   │   │   └── StatsBar/                    # 統計列元件集
│   │   │       ├── index.tsx                # 統計列主元件（線上/離線/流量/網速等聚合統計）
│   │   │       ├── types.ts                 # 統計列型別定義
│   │   │       ├── StatChips.tsx            # 統計資料卡片（目前時間、線上數、地區、流量、網速）
│   │   │       ├── GroupSelector.tsx         # 分組篩選選擇器
│   │   │       ├── SortToggleMenu.tsx        # 排序選項選單
│   │   │       └── StatsToggleMenu.tsx       # 統計卡片顯示/隱藏控制選單
│   │   │
│   │   ├── settings/                        # 設定面板元件
│   │   │   ├── SettingsPanel.tsx             # 主題設定面板（管理員使用）
│   │   │   ├── SettingItem.tsx              # 單項設定控制項（switch/select/string/number/richtext）
│   │   │   ├── i18nHelper.ts               # 設定項 i18n 多語言物件解析工具
│   │   │   ├── EditButton.tsx               # 設定編輯按鈕（標題列觸發入口）
│   │   │   └── CustomTextsEditor.tsx        # 自訂 UI 文字視覺化編輯器
│   │   │
│   │   └── enhanced/                        # 增強功能元件集（KomariBeautify）
│   │       ├── EnhancedFeatures.tsx         # 增強功能總入口（統一管理各增強元件的掛載）
│   │       ├── WelcomeBubble.tsx             # 歡迎氣泡（展示訪客 IP、地理位置、瀏覽器資訊）
│   │       ├── FinanceWidget.tsx             # 資產統計面板（伺服器總價值、月均支出、剩餘價值，入口在標題列）
│   │       ├── FinancePriceTag.tsx           # 首頁金額標籤資產 Tooltip 與伺服器交易入口
│   │       ├── ServerTradeModal.tsx          # 伺服器交易計算彈窗
│   │       ├── AnnouncementModal.tsx         # 公告彈窗（遮罩、Logo、富文本內容）
│   │       ├── AdvancedSearchModal.tsx       # 進階搜尋對話框（多條件篩選、URL同步）
│   │       ├── AdvancedSearchModal.css       # 進階搜尋對話框樣式
│   │       ├── EarthGlobe.tsx               # 3D 地球元件入口（懶載入，入口在標題列）
│   │       ├── GlobeRenderer.tsx            # Globe.gl 3D 地球渲染器
│   │       ├── ScrollHelpers.tsx            # 捲動到頂部/底部輔助按鈕
│   │       ├── Protection.tsx               # 訪客反除錯保護（禁止右鍵、開發者工具等）
│   │       ├── CanvasNest.tsx               # 連線粒子背景特效
│   │       ├── Sakura.tsx                   # 櫻花飄落特效
│   │       ├── Live2D.tsx                    # Live2D 看板娘
│   │       ├── Matomo.tsx                    # Matomo 網站分析整合
│   │       ├── emojiMap.ts                  # 國家代碼 → Emoji/座標 映射表
│   │       ├── useUserGeo.ts                # 使用者地理位置偵測 Hook（多 API 回退策略）
│   │       ├── useExchangeRates.ts          # 匯率取得與貨幣轉換 Hook
│   │       ├── financeUtils.ts              # 資產計算工具函式（價格轉換、估值計算）
│   │       └── enhanced.css                 # 增強功能專用樣式
│   │
│   ├── config/                              # 設定管理
│   │   ├── default.ts                       # 預設設定值與 ConfigOptions 型別定義
│   │   ├── ConfigContext.ts                 # 設定 React Context 定義
│   │   ├── ConfigProvider.tsx               # 設定 Provider（從後端 API 載入設定並合併預設值）
│   │   ├── hooks.ts                         # 設定相關 Hooks（useAppConfig、useLocale — 橋接 i18next）
│   │   ├── locales.ts                       # 國際化文案（中文預設值 & TypeScript 型別定義）
│   │   └── index.ts                         # 設定模組統一匯出
│   │
│   ├── i18n/                                # i18next 國際化設定
│   │   ├── config.ts                        # i18next 初始化（LanguageDetector + 資源註冊）
│   │   └── locales/                         # 多語言翻譯檔案
│   │       ├── zh_CN.json                   # 簡體中文
│   │       ├── zh_TW.json                   # 繁體中文
│   │       ├── en.json                      # English
│   │       ├── ja_JP.json                   # 日本語
│   │       └── id_ID.json                   # Bahasa Indonesia
│   │
│   ├── contexts/                            # React Context 提供者
│   │   ├── NodeDataContext.tsx              # 節點資料 Context（REST/RPC API 資料取得與快取）
│   │   ├── LiveDataContext.tsx              # 即時資料 Context（WebSocket 即時推送）
│   │   └── ThemeContext.tsx                 # 主題 Context（淺色/深色/跟隨系統）
│   │
│   ├── hooks/                               # 自訂 Hooks
│   │   ├── useLoadCharts.ts                 # CPU/負載 歷史圖表資料取得 Hook
│   │   ├── usePingChart.ts                  # 延遲/丟包 歷史圖表資料取得 Hook
│   │   ├── useNodeCommons.ts                # 節點通用工具 Hook（狀態判斷、運行時間、顏色映射）
│   │   ├── useAdvancedSearch.ts             # 進階搜尋狀態管理 Hook（URL同步、校驗、搜尋執行）
│   │   ├── useAdvancedSearchFilter.ts       # 進階搜尋過濾邏輯（純函式，多條件比對）
│   │   ├── useTooltipScrollLock.ts          # 圖表 Tooltip 捲動鎖定 Hook（wheel 事件 + 位置凍結）
│   │   ├── useTheme.ts                      # 主題管理 Hook（切換淺色/深色/自動模式）
│   │   └── useMobile.ts                     # 行動端響應式偵測 Hook
│   │
│   ├── services/                            # 服務層
│   │   └── api.ts                           # API 服務類（Komari 後端 REST 與 JSON-RPC2 通訊）
│   │
│   ├── types/                               # TypeScript 型別定義
│   │   ├── node.d.ts                        # 節點資料結構型別（NodeData、NodeStats、ApiResponse 等）
│   │   ├── rpc.d.ts                         # JSON-RPC2 回應型別
│   │   ├── LiveData.ts                      # WebSocket 即時資料流型別
│   │   └── advancedSearch.ts                # 進階搜尋型別定義（搜尋狀態、過濾器、校驗）
│   │
│   └── utils/                               # 工具函式
│       ├── index.ts                         # 工具模組統一匯出（cn、formatBytes 等）
│       ├── formatHelper.ts                  # 資料格式化（位元組、運行時間、流量限制）
│       ├── trafficLimit.ts                  # 流量閾值無限顯示識別
│       ├── metricRetention.ts               # 新舊 Komari 指標保留期解析與存取範圍限制
│       ├── chartHelper.ts                   # 圖表工具（OKLCH 顏色生成、標籤格式化）
│       ├── converters.ts                    # 型別轉換工具（NodeStats ↔ RpcNodeStatus）
│       ├── regionHelper.ts                  # 地區 Emoji → 名稱映射
│       ├── localeUtils.ts                   # 國際化工具（深度物件合併、扁平化還原）
│       ├── contentRender.ts                 # 普通文字/HTML/基礎 Markdown 內容渲染工具
│       ├── tagHelper.ts                     # 標籤解析與免費標籤比對工具
│       ├── osImageHelper.ts                 # 作業系統 Logo 查找工具
│       ├── downsample.ts                    # LTTB 降採樣演算法與自動降採樣點數計算
│       └── RecordHelper.tsx                 # 圖表資料處理（削峰、插值、空值填充）
│
├── index.html                               # HTML 入口檔案（含 PWA 中繼資料）
├── komari-theme.json                        # Komari 主題設定宣告檔案（定義後台可設定項）
├── preview.png                              # 主題預覽截圖
├── package.json                             # 專案相依與腳本定義
├── package-lock.json                        # npm 相依鎖定檔案
├── yarn.lock                                # Yarn 相依鎖定檔案
├── vite.config.ts                           # Vite 建置設定（React + Tailwind 外掛）
├── tailwind.config.ts                       # Tailwind CSS 設定
├── tsconfig.json                            # TypeScript 根設定
├── tsconfig.app.json                        # TypeScript 應用編譯設定
├── tsconfig.node.json                       # TypeScript Node 編譯設定
├── eslint.config.js                         # ESLint 程式碼檢查設定
├── components.json                          # shadcn/ui 元件設定
├── .gitignore                               # Git 忽略規則
├── LICENSE                                  # MIT 開源授權
├── UPDATES.MD                               # 更新總結文件
└── README.md                                # 專案說明文件
```

</details>

---

## 🛠️ 本機開發

1.  **複製倉庫**

    ```bash
    git clone https://github.com/LaiYueTing/komari-theme-purcarte-plus.git
    cd komari-theme-purcarte-plus
    ```

2.  **安裝相依**

    ```bash
    yarn install
    ```

3.  **啟動開發伺服器**

    ```bash
    yarn dev
    ```

4.  在瀏覽器中開啟 `http://localhost:5173`（或 Vite 提示的其他埠）即可進行預覽與除錯

## 🔗 相關專案

| 專案 | 說明 |
|------|------|
| [KomariBeautify](https://github.com/YoungYannick/KomariBeautify) | 本主題增強功能的前身，透過 Komari 後台自訂程式碼（後台 自訂頭部 & 自訂 Body）實現，無需替換主題即可使用 |
| [Komari Virtualizer](https://github.com/YoungYannick/Komari_Virtualizer) | 基於 Flask 的 Komari 虛擬探針模擬器，在實體 VPS 資源有限時模擬多個探針客戶端，輕鬆實現「點亮全球」 |

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權
