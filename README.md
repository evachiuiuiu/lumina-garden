# LUMINA｜顯化花園

**讓心願，慢慢開花。**

**正式遊玩：** [https://lumina-garden-tfc6.onrender.com/](https://lumina-garden-tfc6.onrender.com/)

LUMINA 是一個以願景書寫、日常小行動與花園養成為核心的繁體中文開源網頁遊戲。種下一個心願，為今天選一件做得到的事，再用花朵記住自己的累積。靈感書房則整理華語與英語創作者的公開資源，搭配可保存的原創練習。

遊戲本身不設帳號；所有進度保存在目前的瀏覽器。專案使用 HTML、CSS、原生 JavaScript 與本機 SVG，無須安裝套件、建置工具、後端或 API 金鑰。

[Render 部署指南](DEPLOYMENT.md) · [資料來源與編輯說明](SOURCES.md) · [MIT 授權](LICENSE)

## 怎樣玩

1. **種下心願。** 選一種心願種子，寫下想靠近的生活，也可以補上一個具體的想像畫面。
2. **收集微光。** 在沒有倒數的輕點遊戲中收集六顆微光，為自己留一段專注的時間。
3. **收下行動卡。** 抽取或改寫一件今天做得到的小事。收下行動卡時，這顆心願獲得 **6 點微光**。
4. **在生活裡實踐。** 完成小行動後回到花園記錄，留下可選填的感受，這顆心願獲得 **1 次成長**。
5. **看見累積。** 心願逐步抽芽、長葉、含苞和開花；休息幾天也會保留原有進度。

每日上限以**每顆心願**計算：準備行動卡可獲得一次微光，記錄已完成的行動可獲得一次成長。重新抽卡、重複點擊或重寫同一天的計畫不會重複加分。日期固定採用 **UTC+8（香港／澳門日曆）**。

| 累積完成的行動 | 花園階段 |
| --- | --- |
| 0 次 | 心願種子 |
| 1 次 | 新芽初生 |
| 3 次 | 枝葉舒展 |
| 5 次 | 含苞待放 |
| 7 次及以上 | 心願開花，仍可繼續累積行動 |

共有 7 種心願主題：學術與成長、愛與連結、豐盛與自由、旅行與探索、身心安定、貓貓安好、我的心願。同時最多種植 6 顆心願；暫時想放下的心願可以移到「珍藏」，保留記錄，之後再種回花園。

花朵象徵記錄下來的付出。願望可以隨新的理解調整，遊戲也不承諾特定結果。

## 靈感書房

首批收錄 2 位華語、3 位英語創作者／作者，提供公開文章、作者網站、出版社介紹與訪談入口。每位都搭配一份 LUMINA 原創練習：

| 創作者／作者 | 來源語言 | 選取的主題 | LUMINA 原創練習 |
| --- | --- | --- | --- |
| 九粒 Jolie | 中文 | 願望澄清、感恩書寫、想像未來 | 把願望寫成今天的一步（約 4 分鐘） |
| 李欣頻 | 中文 | 自我對話、轉念書寫、小步行動 | 換一句能帶你往前的話（約 5 分鐘） |
| Aileen Xu · Lavendaire | 英文 | 生活設計、願景日記、日常習慣 | 理想的普通一天（約 5 分鐘） |
| Roxie Nafousi | 英文 | 願景釐清、行動一致、感謝資源 | 讓願望落地（約 4 分鐘） |
| Gabby Bernstein | 英文 | 動機探索、結果彈性、靈性觀點 | 願望背後的需要（約 3 分鐘） |

練習中的反思與下一步可以存成「**靈感筆記**」，也可連結已有的心願，在「**心願手帳**」回看。**保存筆記不增加微光、成長或已完成日數**；真正完成行動後，仍按花園的流程記錄。

遊戲內的練習步驟、例子與文字由 LUMINA 原創撰寫，以上時間是建議練習用時。來源中的靈性說法保留作者歸屬；本站練習聚焦願望澄清、自我反思與可由自己決定的小行動。部分外部免費資源需要填寫電郵，完整來源與取得方式見 [SOURCES.md](SOURCES.md)。

## 本機啟動

在專案根目錄，用 Python 3 啟動靜態檔案伺服器：

```sh
python3 -m http.server 8000 --directory dist
```

然後開啟 [http://localhost:8000](http://localhost:8000)。遊戲使用 JavaScript modules，請透過 HTTP 預覽；直接雙擊 HTML 檔案可能無法正常載入模組。

正式網站檔案已在 `dist/`，不需要 `npm install` 或建置步驟。

## 部署到 Render

根目錄已提供 [render.yaml](render.yaml)，可在 Render 連接自己的 GitHub 倉庫，使用 **New → Blueprint** 建立靜態網站。若選擇手動建立 Static Site，核心設定如下：

| 設定 | 值 |
| --- | --- |
| 服務類型 | Static Site |
| Build Command | `true`（成功的空操作） |
| Publish Directory | `dist` |
| 環境變數 | `SKIP_INSTALL_DEPS=true` |

Blueprint 使用部署分支的新提交觸發自動部署。完整的 GitHub 準備、Render 表單設定、Fork 部署與額度說明見 [DEPLOYMENT.md](DEPLOYMENT.md)。實際網站網址以你建立的託管服務為準。

## 資料保存與備份

心願、行動、手帳、靈感筆記與偏好設定儲存在瀏覽器的 `localStorage`，鍵名為 `lumina.garden.v1`。本版本沒有帳號或伺服器同步，也不會把這些內容上傳到遊戲後端。點選來源連結時，瀏覽器會前往第三方網站。

資料依網站來源保存；通訊協定、網域或連接埠不同，都會使用不同的儲存空間。私人 Site、Render、GitHub Pages 或本機預覽站之間的進度不會自動互通。清除網站資料、切換瀏覽器／裝置，或結束無痕瀏覽，也可能使原本進度無法繼續使用。[localStorage 的瀏覽器行為說明](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 把花園帶到新網址或新裝置

1. 在原網站打開「心願手帳」，選擇「匯出備份」，保存 JSON 檔案。
2. 到新網站或新裝置的「心願手帳」選擇「匯入備份」。
3. 檢查匯入內容，再確認載入。**匯入會取代該網站目前的進度，並不合併兩份花園**；如果新網站已有要保留的記錄，先另行匯出。

請自行保管備份，並避免將含有私人心願或筆記的 JSON 檔提交到公開倉庫。

同一網站來源下的不同路徑會共用 `localStorage`。若你在同一網域部署多個獨立副本，例如同一個 GitHub Pages 網域下的不同專案，應為不同副本設定不同的 `STORAGE_KEY`；詳見 [部署指南](DEPLOYMENT.md)。

## 專案結構

| 檔案 | 內容 |
| --- | --- |
| [dist/index.html](dist/index.html) | 網站入口 |
| [dist/app.js](dist/app.js) | 頁面、儀式與互動流程 |
| [dist/state.js](dist/state.js) | 本機儲存、備份驗證、每日獎勵與靈感筆記 |
| [dist/content.js](dist/content.js) | 心願主題、行動卡與遊戲引導 |
| [dist/learning-ui.js](dist/learning-ui.js) | 書房篩選、來源卡片、練習與筆記版面 |
| [dist/learning.css](dist/learning.css) | 書房與練習的響應式樣式 |
| [dist/learning-zh.js](dist/learning-zh.js) | 華語創作者、來源與原創練習 |
| [dist/learning-en.js](dist/learning-en.js) | 英語創作者、來源與原創練習 |
| [dist/art.js](dist/art.js) | SVG 花園、植物與成長階段 |
| [dist/style.css](dist/style.css) | 響應式版面與減少動態效果設定 |
| [render.yaml](render.yaml) | Render 靜態網站部署設定 |
| [SOURCES.md](SOURCES.md) | 來源目錄、取得方式與編輯原則 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | GitHub → Render 部署與資料遷移 |

## 修改與貢獻

可以從 `dist/content.js` 修改心願主題與行動文案，或從兩份 `learning-*.js` 維護書房內容。新增創作者時，請提供可追溯的本人、出版社或節目來源，標明取得方式與整理日期，並同步更新 [SOURCES.md](SOURCES.md) 與 `dist/state.js` 的 `PRACTICE_CREATOR_IDS`，讓新作者的練習筆記可正常保存及匯入。練習請使用自己撰寫的步驟與例子，並保留「筆記」與「已完成的行動」各自的用途。

## 授權與致謝

本倉庫的原創程式碼、SVG 圖像與 LUMINA 原創文字依 [MIT License](LICENSE) 提供。

連結指向的第三方文章、影片、書籍、PDF 與課程維持其原有授權及權利，**不因本站收錄而改以 MIT 授權**。收錄作者與來源不表示作者、出版社或平台對 LUMINA 的合作、認可或代言。完整的來源歸屬與原創練習說明見 [SOURCES.md](SOURCES.md)。
