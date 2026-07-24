<div align="center">

<img width="900" src="./preview.png" alt="PurCarte Theme Preview">

## ✨ PurCarte-Plus ✨

一款為 [Komari](https://github.com/komari-monitor/komari) 設計的磨砂玻璃風格個人化增強版主題

</div>

---

> [!WARNING]
> ### 🚨 使用前請務必閱讀
> **本專案是個人興趣驅動的開源作品，不是商業產品，不是外包專案，更不欠任何人**
>
> - 我只針對 **我自己發現的問題**、**我自己用著不爽的地方**、**我自己喜歡的方向** 進行開發和修復
> - 我沒有義務相容每一種裝置、每一個瀏覽器、每一個奇葩環境
> - 我不會因為你「不用但是喜歡到處說不行」就去改任何東西
> - **覺得有 BUG？** 善意回饋我很歡迎；陰陽怪氣、到處抹黑，恕不奉陪
>
> **開源 ≠ 免費客服 ≠ 有求必應。尊重是雙向的**

---

> [!NOTE]
> 本主題在 [原作者:Montia37 v1.2.5](https://github.com/Montia37/komari-theme-purcarte/releases/tag/v1.2.5) 版本基礎上進行二次開發的主題，且是在 Claude 的輔助下完成
>
> 本主題的增強功能（歡迎氣泡、資產統計、3D 地球、訪客保護等）源自 [KomariBeautify](https://github.com/YoungYannick/KomariBeautify) 自訂程式碼版本（後台 自訂頭部 & 自訂 Body），後為便於使用與維護整合至本主題包中
> 
> **此版本肯定不會滿足所有人的需求，我只針對我發現的問題，我用著不好的，或者喜歡的方向開發，如果介意，請使用原版**

## 🆕 相比原版增強了什麼

<details>
<summary><b>✨ 新增功能</b></summary>

- **歡迎氣泡 (WelcomeBubble)** — 左下角展示訪客 IP、地理位置及 ISP 資訊，支援自訂站點名稱與 Logo
- **資產統計 (FinanceWidget)** — 標題列入口按鈕（延遲總覽左側），檢視伺服器總價值、月均支出、剩餘價值，支援多幣別匯率換算與交易溢價計算，交易對話框支援分享連結（自動產生含搜尋+交易參數的 URL 並複製到剪貼簿，接收方開啟連結自動搜尋伺服器、載入交易參數與貨幣單位）及匯出為圖片（自動處理毛玻璃背景，確保匯出圖片文字清晰可讀），交易對話框標籤與備註標籤採用多顏色模式（複用伺服器卡片的標籤顏色池）
- **3D 地球 (EarthGlobe)** — 標題列入口按鈕（延遲總覽左側），整合 globe.gl 視覺化節點地理分布，支援淺色與深色模式獨立貼圖/背景、「偽點亮全球」展示模式
- **全域延遲總覽 (PingOverview)** — 同時展示所有伺服器和監測節點的延遲資料，支援時間範圍篩選、伺服器排序、分組篩選與統計連動，監測節點排序由後台設定控制（支援按 ID/權重/名稱/目標/類型排序以及自訂順序，同時作用於延遲總覽和伺服器詳情頁）
- **捲動輔助 (ScrollHelpers)** — 頁面右下角回到頂部/底部按鈕
- **多語言支援 (i18n)** — 整合 i18next 國際化框架，標題列內建語言切換器，支援簡中/繁中/英/日/印尼五種語言，增強元件（歡迎氣泡、資產統計、交易面板、3D 地球、訪客保護）全面接入 i18n
- **訪客保護 (Protection)** — 對未登入使用者啟用反偵錯保護，禁止右鍵選單與開發者工具（預設停用，可於後台開啟）
- **進階搜尋 (AdvancedSearch)** — 多條件搜尋對話框，支援統一全文模糊搜尋（一個輸入框搜尋 UUID/名稱/CPU/系統/地區/分組/標籤等 13 個欄位，AND/OR 邏輯）、布林/列舉下拉（帶滑動動畫）、價格與 CPU 核心數精確/範圍雙模式切換（預設範圍搜尋，可切換精確比對）、價格貨幣選擇與匯率自動轉換（支援 CNY/USD/HKD/EUR/GBP/JPY，自動按即時匯率跨幣別比對）、價格免費切換、日期精確/範圍、記憶體/磁碟/流量範圍+單位選擇、交換空間關閉搜尋開關（搜尋 swap=0 的節點），輸入校正（失焦時自動更正非法負數/零值），搜尋參數同步至 URL 實現連結分享，後台可設定開關；開啟進階搜尋時自動隱藏普通搜尋列

</details>

<details>
<summary><b>🎨 UI/UX 改進</b></summary>

- **背景系統增強** — 支援圖片/影片/純色三種背景模式互斥切換，支援多張隨機背景圖（逗號分隔）、淺色與深色模式獨立設定（豎線分隔）、行動端獨立背景
- **底列增強** — 支援隱藏原始內容、伺服器運行時間計時器（可自訂模板）、自訂多行內容（支援 Markdown 連結與圖片）
- **到期/上線時間顯示控制** — 網格、表格、緊湊三種檢視模式獨立控制到期時間與上線時間的顯示（顯示/隱藏全部/隱藏未設定）
- **離線節點增強** — 離線節點顯示「最後上線: X 分鐘前」相對時間，而非僅顯示「離線」
- **標籤自動解析** — 自動解析 `public_remark`（分號分隔）為視覺化標籤，支援自訂顏色池
- **Logo 樣式控制** — 標題列 Logo、歡迎氣泡 Logo、訪客保護彈窗 Logo 均支援圓形固定縮放（32×32）和原圖等比縮放（32×自適應）兩種樣式，因應非正方形 Logo
- **統一捲軸樣式** — 全域 Webkit 捲軸自動適配淺色與深色模式
- **行動端最佳化** — 修復懸浮球遮擋、網速數值換行錯位等行動端問題
- **多分組標籤支援** — 打破單節點單分組限制，支援解析 `group` 欄位（英文分號`;`分隔）為多個分組標籤，首頁及延遲總覽頁面均支援按多分組靈活篩選顯示 ***注意: 此功能目前僅在本主題包有效***

</details>

<details>
<summary><b>⚙️ 設定與架構</b></summary>

- **前端設定編輯** — 支援管理員登入後透過標題列按鈕直接編輯主題設定，無需進入後台
- **多語言設定宣告** — `komari-theme.json` 支援中/繁/英/日/印尼五語言
- **localStorage 設定** — 檢視、外觀等偏好設定可儲存到瀏覽器本機，也可強制使用後台設定
- **JSON-RPC2 API 轉接** — 支援 Komari >=1.0.7 的 JSON-RPC2 API，涵蓋節點資料、即時狀態、負載/延遲歷史、使用者認證、公開設定等全部資料介面
- **自訂 UI 文字** — 視覺化編輯器自訂介面文字，無需手動填寫設定
- **向後相容** — 舊版 `enableVideoBackground` 自動對應為新版 `backgroundMode`

</details>

<details>
<summary><b>🐛 Bug 修復</b></summary>

- 修復部分裝置/環境下 React error #130 崩潰問題（設定空值覆蓋預設值）
- 新增前端設定面板 richtext 型別設定項支援（底列自訂內容等多行輸入框可正常渲染）
- 修復進入探針後伺服器卡片閃爍問題（WebSocket 資料未到達時的離線誤判）
- 修復多檢視下伺服器節點長名稱溢出不換行問題
- 修復載入動畫不垂直置中問題

</details>

## 🚀 快速開始

### 安裝與啟用

1.  前往 [Releases](https://github.com/YoungYannick/komari-theme-purcarte-plus/releases) 頁面下載最新的 `komari-theme-purcarte-plus.zip` 檔案。
2.  進入 Komari 後台，上傳 `zip` 壓縮包並啟用本主題。

> [!NOTE]
>
> 本主題支援透過 Komari 後台或前端進行詳細設定，所有可用選項如下

<details>
<summary><b>前端管理開關</b></summary>

- **是否在登入時顯示設定編輯按鈕** (`isShowConfigEditButtonInLogined`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將在登入時在標題列最右側顯示設定編輯按鈕，方便管理員進行主題設定

</details>

<details>
<summary><b>樣式調整</b></summary>

- **主要內容寬度** (`mainWidth`)
  - **型別:** `number`
  - **預設值:** `85`
  - **說明:** 調整主要內容的最大寬度，單位為視口寬度的百分比（vw），建議值為 80-90

- **桌面端背景圖片連結** (`backgroundImage`)
  - **型別:** `string`
  - **預設值:** `/assets/default-background-image.jpg`
  - **說明:** 支援多張背景圖片或圖片 api，使用「,」分割，使用「|」分隔淺色模式和深色模式，填寫單個則同時用於淺色與深色模式

- **行動端背景圖片連結** (`backgroundImageMobile`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 行動端背景圖片連結，與桌面端一樣區分淺色與深色模式，留空則使用桌面端背景

- **背景模式** (`backgroundMode`)
  - **型別:** `select`
  - **可選項:** `image`, `video`, `solidColor`
  - **預設值:** `image`
  - **說明:** 選擇背景模式：image（圖片背景）、video（影片背景）、solidColor（純色背景）

- **純色背景顏色值** (`solidColorBackground`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 純色背景顏色值，支援 rgb（如 `rgb(255,0,0)`）、rgba（如 `rgba(255,0,0,0.5)`）、hex（如 `#ff0000`）、顏色單字（如 `red`），僅在背景模式為 solidColor 時生效

- **桌面端影片背景連結** (`videoBackgroundUrl`)
  - **型別:** `string`
  - **預設值:** `/assets/LanternRivers_1080p15fps2Mbps3s.mp4`
  - **說明:** 影片背景連結，使用「|」分隔淺色模式和深色模式，填寫單個則同時用於淺色與深色模式，建議使用無聲影片，且影片檔案較大時可能會影響載入速度

- **行動端影片背景連結** (`videoBackgroundUrlMobile`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 行動端影片背景連結，多個使用「,」分割，與桌面端一樣區分淺色與深色模式，留空則使用桌面端影片

- **背景對齊方式** (`backagroundAlignment`)
  - **型別:** `string`
  - **預設值:** `cover,top`
  - **說明:** 調整背景圖片和影片的對齊方式，使用「,」分隔背景大小和位置兩個屬性，背景大小可選 cover（覆蓋）,contain（包含）,fill（填滿）；背景位置可選 center（置中）,top（頂部）,bottom（底部）,left（左側）,right（右側），eg: cover,top

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
  - **說明:** 調整模糊背景色，推薦 rgba 顏色值（eg: rgba(255, 255, 255, 0.5)|rgba(0, 0, 0, 0.5)），使用「|」分隔淺色模式和深色模式的顏色值，填寫單個則同時用於淺色與深色模式

- **啟用標籤透明背景** (`enableTransparentTags`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後標籤將使用較為透明的背景色，當背景情況複雜導致標籤難以辨識時建議關閉

- **標籤預設顏色清單** (`tagDefaultColorList`)
  - **型別:** `string`
  - **預設值:** `lime,cyan,pink,crimson,iris,violet,plum,indigo,blue,jade,mint,grass,teal,sky,red,ruby,tomato,orange,amber,yellow,green,purple,gold,bronze,brown,gray,mauve,slate`
  - **說明:** 標籤預設顏色清單，展示的標籤將按順序套用該顏色池，逗號分隔（可用的顏色清單請參考：[Radix Color](https://www.radix-ui.com/themes/docs/theme/color)，改完沒有生效則表示填寫有誤）

- **預設主題顏色** (`selectThemeColor`)
  - **型別:** `select`
  - **可選項:** `gray`, `gold`, `bronze`, `brown`, `yellow`, `amber`, `orange`, `tomato`, `red`, `ruby`, `crimson`, `pink`, `plum`, `purple`, `violet`, `iris`, `indigo`, `blue`, `cyan`, `teal`, `jade`, `green`, `grass`, `lime`, `mint`, `sky`
  - **預設值:** `violet`
  - **說明:** 設定預設主題顏色，顏色對照請參考：[Radix Color](https://www.radix-ui.com/themes/docs/theme/color)

</details>

<details>
<summary><b>瀏覽器本機儲存設定</b></summary>

- **啟用 localStorage 設定** (`enableLocalStorage`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將優先使用使用者瀏覽器本機設定的檢視和外觀設定。關閉後將強制使用下方的主題設定，本機可調整但重新整理即恢復

- **桌面端預設展示檢視** (`selectedDefaultView`)
  - **型別:** `select`
  - **可選項:** `grid`, `table`, `compact`
  - **預設值:** `grid`
  - **說明:** 設定預設展示檢視為網格、表格或緊湊型

- **預設外觀** (`selectedDefaultAppearance`)
  - **型別:** `select`
  - **可選項:** `system`, `light`, `dark`
  - **預設值:** `system`
  - **說明:** 設定預設外觀為淺色、深色或系統主題

- **狀態卡片顯示控制** (`statusCardsVisibility`)
  - **型別:** `string`
  - **預設值:** `currentTime:true,currentOnline:true,regionOverview:true,trafficOverview:true,networkSpeed:true`
  - **說明:** 控制狀態卡片的顯示與隱藏，格式為 卡片名稱:顯示狀態（true/false），多個卡片使用逗號分隔，支援的卡片名稱包括 currentTime（目前時間）, currentOnline（目前線上）, regionOverview（點亮地區）, trafficOverview（流量概覽）, networkSpeed（網路速率）

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
  - **說明:** circle: 圓形固定縮放（32×32）；original: 原圖等比縮放（高 32px，寬度自適應），因應 Logo 不是正方形的情況

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
  - **說明:** 啟用後在標題列顯示進階搜尋按鈕（取代普通搜尋列），支援多條件篩選、URL 參數同步等功能

- **啟用管理按鈕** (`enableAdminButton`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設在標題列右側顯示管理按鈕

- **啟用檢視模式切換** (`enableViewModeSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示檢視模式切換按鈕（網格/表格/緊湊）

- **啟用全域延遲監測總覽** (`enablePingOverview`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示全域延遲監測總覽入口按鈕，關閉後 /ping-overview 頁面也將無法存取

- **啟用主題顏色模式切換** (`enableThemeColorSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示主題顏色模式切換按鈕（淺色/深色/跟隨系統）

- **啟用語言切換** (`enableLanguageSwitcher`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在標題列顯示語言切換按鈕

- **語言切換** — 標題列內建語言切換按鈕，支援簡體中文、繁體中文、English、日本語、Bahasa Indonesia 五種語言，選擇後自動儲存到瀏覽器

- **資產統計 & 3D 地球入口** — 標題列內建資產統計和 3D 地球按鈕（位於延遲總覽按鈕左側），行動端整合到漢堡選單中，受後台 `enableFinanceWidget` 和 `enableEarthGlobe` 設定控制

</details>

<details>
<summary><b>底列設定</b></summary>

- **底列樣式** (`selectedFooterStyle`)
  - **型別:** `select`
  - **可選項:** `fixed`, `levitation`, `followContent`, `hidden`
  - **預設值:** `followContent`
  - **說明:** 設定底列樣式為 fixed（固定）, levitation（懸浮）, followContent（跟隨內容）或 hidden（隱藏）

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
  - **說明:** 自訂底列內容，支援直接換行，也相容 ${n} 分割多行，支援 Markdown 格式的連結 `[文字](連結)` 和圖片 `![描述](圖片連結)`

</details>

<details>
<summary><b>內容設定</b></summary>

- **啟用 JSON-RPC2 API 轉接** (`enableJsonRPC2Api`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在支援的 Komari 版本（>=1.0.7）優先使用 JSON-RPC2 API 取得資料，以提升相容性和效能，若出現問題請關閉此選項

- **是否在標題列中顯示統計資訊** (`isShowStatsInHeader`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將在標題列中顯示統計資訊，僅在大螢幕桌面端有效，當標題列空間不足時將恢復原統計列位置

- **合併分組列與統計列** (`mergeGroupsWithStats`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後分組列將合併到統計列中，並以下拉選單形式展示

- **啟用統計列** (`enableStatsBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示統計列

- **啟用排序控制** (`enableSortControl`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後在統計列加入排序控制下拉選單選項，分別對流量上下行和網速上下行進行升降排序，僅在啟用統計列時有效

- **啟用離線節點置後顯示** (`isOfflineNodesBehind`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後離線節點將被自動置後顯示

- **啟用分組列** (`enableGroupedBar`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示分組列

- **預設選擇展示分組** (`defaultSelectedGroup`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 設定預設選擇展示的分組，填寫後端設定的分組名，留空則預設展示「全部」分組

- **行動端預設展示檢視** (`selectMobileDefaultView`)
  - **型別:** `select`
  - **可選項:** `grid`, `table`, `compact`
  - **預設值:** `grid`
  - **說明:** 設定行動端預設展示檢視為網格、表格或緊湊型

- **啟用 SWAP 顯示** (`enableSwap`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後預設顯示 SWAP 資訊

- **預覽詳情的延遲圖表時間範圍** (`pingChartTimeInPreview`)
  - **型別:** `number`
  - **預設值:** `1`
  - **說明:** 設定卡片右上角彈窗詳情和表格下拉詳情中延遲圖表的時間範圍，單位為小時，建議值為 1-24，時間範圍太大容易導致頁面卡頓

- **是否在卡片中顯示硬體資訊列** (`isShowHWBarInCard`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在節點卡片中標題列之下顯示硬體資訊列（CPU、記憶體和硬碟總量）

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
  - **說明:** 控制網格檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定/離線）

- **表格檢視 - 到期時間顯示** (`tableExpiredAtDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制表格檢視中到期時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定）

- **表格檢視 - 上線時間顯示** (`tableUptimeDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制表格檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定/離線）

- **緊湊檢視 - 到期時間顯示** (`compactExpiredAtDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制緊湊檢視中到期時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定）

- **緊湊檢視 - 上線時間顯示** (`compactUptimeDisplay`)
  - **型別:** `select`
  - **可選項:** `show`, `hideAll`, `hideUnset`
  - **預設值:** `hideUnset`
  - **說明:** 控制緊湊檢視中上線時間的顯示：show（顯示）、hideAll（隱藏全部）、hideUnset（隱藏未設定/離線）

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
  - **預設值:** `true`
  - **說明:** 啟用後延遲圖表將使用 EWMA 平滑演算法消除毛刺和突變值

- **啟用連線斷點** (`enableConnectBreaks`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後圖表中的曲線將會跨過斷點形成連續的線條，並使用半透明的垂直參考線來標記斷點位置

- **延遲圖表最大渲染點數** (`pingChartMaxPoints`)
  - **型別:** `number`
  - **預設值:** `0`
  - **說明:** 設定延遲圖表的最大渲染點數，0 表示使用自動智慧降採樣（根據資料量和線條數自動計算最佳點數，使用 LTTB 演算法保留視覺形狀），設定正整數則強制使用該值

- **監測節點排序方式** (`monitorNodeSortMode`)
  - **型別:** `select`
  - **可選項:** `id_asc`, `id_desc`, `weight_asc`, `weight_desc`, `name_asc`, `name_desc`, `target_asc`, `target_desc`, `type_asc`, `type_desc`, `custom`
  - **預設值:** `weight_asc`
  - **說明:** 設定延遲總覽頁面和伺服器詳情頁延遲監測的監測節點排序方式。選擇自訂後在下方輸入框填寫節點名稱

- **監測節點自訂排序** (`monitorNodeCustomOrder`)
  - **型別:** `richtext`
  - **預設值:** `(空)`
  - **說明:** 僅在排序方式為「自訂」時生效。每行填寫一個監測節點名稱（與後台設定的名稱一致），按填寫順序排序。未列出的節點將按 ID 正序排列在最後

</details>

<details>
<summary><b>UI 自訂</b></summary>

- **自訂 UI 文字（實驗性，不推薦手動填寫任何東西）** (`customTexts`)
  - **型別:** `string`
  - **預設值:** `(空)`
  - **說明:** 使用 key:value,key2:value2 的格式自訂 UI 文字，value 使用 URL 編碼以避免特殊符號。推薦使用管理員登入後的編輯功能而不是手動填寫此項，以避免格式錯誤導致的問題

</details>

<details>
<summary><b>增強功能</b></summary>

- **啟用歡迎氣泡** (`enableWelcomeBubble`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在頁面左下角顯示歡迎氣泡，展示訪客的 IP、位置、瀏覽器等資訊

- **歡迎氣泡站點名稱** (`welcomeBubbleSiteName`)
  - **型別:** `string`
  - **預設值:** `阿米諾斯`
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
  - **說明:** 啟用後將在標題列顯示資產統計入口按鈕，可檢視伺服器總價值、月均支出、剩餘價值等資訊，並支援伺服器交易計算

- **啟用地球元件** (`enableEarthGlobe`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在標題列顯示 3D 地球入口按鈕，可檢視伺服器地理分布

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
  - **預設值:** `//upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg`
  - **說明:** 地球元件淺色模式的地球貼圖連結

- **地球元件深色模式地球貼圖** (`earthDarkGlobeImage`)
  - **型別:** `string`
  - **預設值:** `//upload.wikimedia.org/wikipedia/commons/b/b3/Solarsystemscope_texture_8k_earth_nightmap.jpg`
  - **說明:** 地球元件深色模式的地球貼圖連結

- **啟用偽點亮全球效果** (`enableSoloPlay`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後地球元件將使用假資料實現點亮全球

- **啟用捲動輔助按鈕** (`enableScrollHelpers`)
  - **型別:** `switch`
  - **預設值:** `true`
  - **說明:** 啟用後將在頁面右下角顯示捲動到頂部/底部輔助按鈕

- **啟用訪客保護** (`enableProtection`)
  - **型別:** `switch`
  - **預設值:** `false`
  - **說明:** 啟用後將對未登入使用者啟用反偵錯保護，禁止右鍵選單、開發者工具等操作

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

## 📁 專案結構

<details>
<summary><b>點擊展開完整目錄樹</b></summary>

```
komari-theme-purcarte-plus/
├── public/                                  # 靜態資源目錄
│   └── assets/
│       ├── default-background-image.jpg     # 預設桌面端背景圖片
│       ├── LanternRivers_1080p15fps2Mbps3s.mp4  # 預設影片背景
│       ├── logo.png                         # 站點 Logo
│       ├── pwa-icon.png                     # PWA 應用圖示
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
│   │   ├── PingOverview.tsx                 # 全域延遲監測總覽頁面
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
│   │   │   ├── Header.tsx                   # 標題列（Logo、標題、搜尋、檢視切換、資產統計、3D 地球、延遲總覽、主題切換、語言切換、管理入口）
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
│   │       ├── ServerTradeModal.tsx          # 伺服器交易計算彈窗
│   │       ├── AdvancedSearchModal.tsx       # 進階搜尋對話框（多條件篩選、URL 同步）
│   │       ├── AdvancedSearchModal.css       # 進階搜尋對話框樣式
│   │       ├── EarthGlobe.tsx               # 3D 地球元件入口（延遲載入，入口在標題列）
│   │       ├── GlobeRenderer.tsx            # Globe.gl 3D 地球渲染器
│   │       ├── ScrollHelpers.tsx            # 捲動到頂部/底部輔助按鈕
│   │       ├── Protection.tsx               # 訪客反偵錯保護（禁止右鍵、開發者工具等）
│   │       ├── emojiMap.ts                  # 國家代碼 → Emoji/座標 對照表
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
│   │   ├── useNodeCommons.ts                # 節點通用工具 Hook（狀態判斷、運行時間、顏色對應）
│   │   ├── useAdvancedSearch.ts             # 進階搜尋狀態管理 Hook（URL 同步、校驗、搜尋執行）
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
│   │   └── advancedSearch.ts                # 進階搜尋型別定義（搜尋狀態、篩選器、校驗）
│   │
│   └── utils/                               # 工具函式
│       ├── index.ts                         # 工具模組統一匯出（cn、formatBytes 等）
│       ├── formatHelper.ts                  # 資料格式化（位元組、運行時間、流量限制）
│       ├── chartHelper.ts                   # 圖表工具（OKLCH 顏色產生、標籤格式化）
│       ├── converters.ts                    # 型別轉換工具（NodeStats ↔ RpcNodeStatus）
│       ├── regionHelper.ts                  # 地區 Emoji → 名稱對應
│       ├── localeUtils.ts                   # 國際化工具（深度物件合併、扁平化還原）
│       ├── osImageHelper.ts                 # 作業系統 Logo 查找工具
│       ├── downsample.ts                    # LTTB 降採樣演算法與自動降採樣點數計算
│       └── RecordHelper.tsx                 # 圖表資料處理（削峰、插值、空值填補）
│
├── index.html                               # HTML 入口檔案（含 PWA 中繼資料）
├── komari-theme.json                        # Komari 主題設定宣告檔案（定義後台可設定項）
├── preview.png                              # 主題預覽截圖
├── package.json                             # 專案相依套件與指令稿定義
├── package-lock.json                        # npm 相依套件鎖定檔案
├── yarn.lock                                # Yarn 相依套件鎖定檔案
├── vite.config.ts                           # Vite 建置設定（React + Tailwind 外掛）
├── tailwind.config.ts                       # Tailwind CSS 設定
├── tsconfig.json                            # TypeScript 根設定
├── tsconfig.app.json                        # TypeScript 應用編譯設定
├── tsconfig.node.json                       # TypeScript Node 編譯設定
├── eslint.config.js                         # ESLint 程式碼檢查設定
├── components.json                          # shadcn/ui 元件設定
├── .gitignore                               # Git 忽略規則
├── LICENSE                                  # MIT 開源授權條款
└── README.md                                # 專案說明文件
```

</details>

## 🛠️ 本機開發

1.  **複製儲存庫**

    ```bash
    git clone https://github.com/YoungYannick/komari-theme-purcarte-plus.git
    cd komari-theme-purcarte-plus
    ```

2.  **安裝相依套件**

    ```bash
    yarn install
    ```

3.  **啟動開發伺服器**

    ```bash
    yarn dev
    ```

4.  在瀏覽器中開啟 `http://localhost:5173` (或 Vite 提示的其他連接埠) 即可進行預覽和偵錯。

## 🔗 相關專案

| 專案 | 說明 |
|------|------|
| [KomariBeautify](https://github.com/YoungYannick/KomariBeautify) | 本主題增強功能的前身，透過 Komari 後台自訂程式碼（後台 自訂頭部 & 自訂 Body）實現，無需替換主題即可使用 |
| [Komari Virtualizer](https://github.com/YoungYannick/Komari_Virtualizer) | 基於 Flask 的 Komari 虛擬探針模擬器，在實體 VPS 資源有限時模擬多個探針用戶端，輕鬆實現「點亮全球」 |

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 授權。