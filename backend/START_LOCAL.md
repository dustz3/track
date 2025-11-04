# 本地開發服務器啟動指南

## 快速啟動步驟

### 步驟 1：編譯前端文件

在 `track` 目錄下（不是 `backend` 目錄）：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track
node compile.js
```

### 步驟 2：啟動本地開發服務器

在 `backend` 目錄下：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev
```

或者使用 npm script：

```bash
npm run dev
```

### 步驟 3：等待服務器啟動

服務器啟動後，您會看到類似以下的訊息：

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

### 步驟 4：訪問頁面

啟動成功後，訪問以下網址：

- **Basic 頁面**: http://localhost:8888/basic
- **Standard 頁面**: http://localhost:8888/standard
- **健康檢查**: http://localhost:8888/api/health

## 測試 Airtable 查詢

### 輸入測試資料

根據您的 Airtable 資料，輸入：

- **Job No.**: `TM111755`
- **Tracking No.**: `VHILRDLU`

點擊 **STATUS CHECK** 按鈕，應該會顯示從 Airtable 讀取的資料。

## 故障排除

### 問題 1：端口 8888 已被占用

**錯誤訊息**: `Port 8888 is already in use`

**解決方法**：

1. 停止占用端口的程序：
```bash
lsof -ti:8888 | xargs kill -9
```

2. 或使用其他端口：
```bash
netlify dev --port 3000
```

### 問題 2：找不到 netlify 命令

**錯誤訊息**: `command not found: netlify`

**解決方法**：

```bash
npm install -g netlify-cli
```

或使用 npx：

```bash
npx netlify-cli dev
```

### 問題 3：無法連接 Airtable

**錯誤訊息**: `Airtable query error`

**解決方法**：

1. 確認 `.env` 檔案已設定：
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_SHIPMENTS_TABLE`

2. 測試 Airtable 連接：
```bash
node scripts/test-airtable.js TM111755 VHILRDLU
```

### 問題 4：頁面顯示 ERR_CONNECTION_REFUSED

**原因**：服務器沒有啟動

**解決方法**：

1. 確認服務器正在運行：
```bash
lsof -ti:8888
```

2. 檢查服務器日誌是否有錯誤訊息

3. 重新啟動服務器：
```bash
# 停止服務器（Ctrl+C）
# 然後重新執行
netlify dev
```

## 測試腳本

### 測試 Airtable 連接

```bash
node scripts/test-airtable.js [JobNo] [TrackingNo]
```

### 檢查 Airtable 欄位

```bash
node scripts/check-airtable-fields.js
```

## 注意事項

- 確保 `.env` 檔案在 `backend` 目錄下
- 確保 Airtable API Key 和 Base ID 正確
- 服務器啟動後不要關閉終端視窗
- 修改程式碼後，服務器會自動重新載入

