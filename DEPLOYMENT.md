# 在 Render 部署 LUMINA

LUMINA 是純前端遊戲，頁面、程式和 SVG 素材都放在 `dist/`。本版本沒有後端、資料庫、套件相依或 API 金鑰；Render 使用 **Static Site** 類型即可。遊戲進度由使用者自己的瀏覽器保存。

## 1. 準備 GitHub 公開倉庫

建立一個公開 GitHub 倉庫，將專案的公開版本放在倉庫根目錄。至少保留以下檔案：

- `dist/` 全部正式遊戲檔案。
- `render.yaml`、`package.json`、`.gitignore`。
- `README.md`、`DEPLOYMENT.md`、`SOURCES.md` 與 `LICENSE`。

若從其他託管平台匯出，請用乾淨的公開副本建立 Git 歷史；排除私人託管設定、原有 `.git/`、環境檔、個人備份、瀏覽器測試資料與登入資訊。`.gitignore` 只避免新增被忽略的檔案，並不會移除已經追蹤的內容或歷史版本。

根目錄的 `LICENSE` 採用 MIT。公開 GitHub 倉庫與開源授權是兩件事，授權文件讓其他人知道如何使用、修改和散布原始碼。[GitHub 授權說明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

`package.json` 的 `private: true` 只是防止誤發佈到 npm，不會讓 GitHub 倉庫變成私人，也不影響本專案的 MIT 授權。

## 2. 使用隨附 Blueprint 部署

1. 將公開版本推送到 GitHub 的部署分支，例如 `main`。
2. 登入 [Render Dashboard](https://dashboard.render.com/)，選擇 **New → Blueprint**。
3. 連接 GitHub，選取你剛建立的倉庫。
4. 選擇要部署的分支，Blueprint Path 使用根目錄的 `render.yaml`。
5. 檢查預覽：應只有一個名為 `lumina-garden` 的 Static Site，不應出現資料庫或常駐伺服器。
6. 按 **Deploy Blueprint**，等待部署成功，再使用 Render 顯示的實際 `onrender.com` 網址開啟遊戲。

此流程依據 [Render Blueprint 設定說明](https://render.com/docs/infrastructure-as-code)。Blueprint 與其中的服務只需建立一次；之後在同一倉庫更新程式即可。

### 隨附設定的含義

| 設定 | 值 | 用途 |
| --- | --- | --- |
| `type` | `web` | Render Blueprint 對網站的服務分類 |
| `runtime` | `static` | 靜態網站，由 CDN 提供檔案 |
| `buildCommand` | `"true"` | 執行成功的空操作，保留已完成的 `dist/` |
| `staticPublishPath` | `./dist` | 只發佈正式網站目錄 |
| `autoDeployTrigger` | `commit` | 部署分支每次提交後自動重新部署 |
| `SKIP_INSTALL_DEPS` | `"true"` | 跳過不需要的自動套件安裝 |

Blueprint 規格要求非 Docker 服務提供 `buildCommand`，所以這裡使用字串 `"true"`，不留空，也不執行不存在的 `npm run build`。沒有 `startCommand`、埠號或 `region` 設定。`repo` 與 `branch` 留給連接 Blueprint 時選擇的倉庫和分支。[Blueprint 欄位規格](https://render.com/docs/blueprint-spec)

Render 預設會嘗試安裝靜態網站的相依套件；`SKIP_INSTALL_DEPS=true` 是官方支援的略過方式。[Static Sites 說明](https://render.com/docs/static-sites)

## 3. 也可手動建立 Static Site

如果你偏好使用表單設定，選 **New → Static Site**，連接同一個 GitHub 倉庫，填入：

| 表單欄位 | 值 |
| --- | --- |
| Name | `lumina-garden`，或你想使用的服務名稱 |
| Branch | 你的部署分支，例如 `main` |
| Root Directory | 留空，使用倉庫根目錄 |
| Build Command | `true` |
| Publish Directory | `dist` |
| Environment Variable | `SKIP_INSTALL_DEPS` = `true` |
| Auto-Deploy | On Commit |

最後按 **Create Static Site**。Blueprint 與手動表單是兩種建立方式，為同一個正式網站選擇其中一種即可。[Render Static Sites](https://render.com/docs/static-sites)

## 4. 更新與其他人自行部署

本專案 Blueprint 使用 `autoDeployTrigger: commit`。當部署分支有新提交，Render 會依該分支重新發佈 `dist/`。如果你只想手動發佈，可把這個欄位改成字串 `off` 後同步 Blueprint。

其他開發者建議先 Fork 倉庫，再連接自己的 Fork；之後即可自行修改內容、控制發佈。

以下只是 **待替換的部署連結格式**，不是已建立的倉庫或正式按鈕。請把 `YOUR_FORK_OWNER` 和 `YOUR_FORK_REPOSITORY` 替換成真實 Fork 資訊後才使用：

```text
https://render.com/deploy?repo=https://github.com/YOUR_FORK_OWNER/YOUR_FORK_REPOSITORY
```

若未來提供直接部署原始倉庫的公開按鈕，Render 官方建議為該模板設定 `autoDeployTrigger: off`，避免原始倉庫的後續提交自動更新所有使用者部署的副本。[Deploy to Render Button](https://render.com/docs/deploy-to-render)

## 5. 進度保存與更換網址

瀏覽器會把每個網站來源的資料分開保存。通訊協定、網域或連接埠不同，都有自己的 `localStorage`。從私人 Site、本機預覽、GitHub Pages 或其他網址移到 Render 時，原本的花園進度不會自動出現；同一來源內的不同路徑則共用儲存空間。[MDN：localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

1. 在原網站的手帳頁面匯出 JSON 備份。
2. 在新的 Render 網址開啟遊戲並匯入備份。
3. 確認匯入內容後再取代新網址下的本機進度。

匯入會取代新網站目前的進度，不會合併兩份花園；如果新網站已有需要保留的記錄，請先另行匯出。備份包含心願、行動、手帳與靈感筆記，應由使用者自行保存；它不屬於公開原始碼。清除網站資料、無痕視窗結束或換裝置都可能讓本機進度無法繼續使用，請定期匯出需要保留的花園。

如果你在同一網域的不同路徑部署多個獨立副本，例如同一個 GitHub Pages 網域下的多個專案，請在各副本的 `dist/state.js` 使用不同的 `STORAGE_KEY`，避免它們共用 `lumina.garden.v1` 下的進度。更換鍵名後也需透過備份遷移原有資料。

## 6. 使用額度與本機預覽

Render 靜態網站可免費部署，會使用工作區每月的對外流量與建置管線額度；實際額度、超額處理與價格以你的 Render 工作區為準。這個專案不需要 Free Web Service 或資料庫，也不需要套用伺服器休眠的運作方式。[Render 免費方案](https://render.com/docs/free)

本機預覽可在專案根目錄執行：

```sh
python3 -m http.server 8000 --directory dist
```

接著開啟 `http://localhost:8000`。請透過 HTTP 伺服器預覽，讓瀏覽器能正常載入 JavaScript modules。

## 官方參考文件

- [Static Sites](https://render.com/docs/static-sites)
- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Render Blueprints](https://render.com/docs/infrastructure-as-code)
- [Deploy to Render Button](https://render.com/docs/deploy-to-render)
- [Deploy for Free](https://render.com/docs/free)
- [GitHub：Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

設定查閱日期：2026-11-06。
