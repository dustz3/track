# Airtable 連接設定指南

## 快速開始

### 步驟 1：取得 Airtable API Key

1. 前往 https://airtable.com/account
2. 在 **API** 區塊找到 **Personal access tokens**
3. 點擊 **Create new token**
4. 設定 token 名稱（例如：TailorMed Tracking）
5. 選擇權限：
   - Scopes: `data.records:read`（至少需要讀取權限）
   - Access: 選擇您的 Base
6. 複製 API Key（只會顯示一次，請妥善保管）

### 步驟 2：取得 Base ID

1. 前往您的 Airtable Base
2. 查看 Base URL：`https://airtable.com/appXXXXXXXXXXXXXX`
3. `app` 後面的字串就是 Base ID（例如：`appXXXXXXXXXXXXXX`）

### 步驟 3：確認表格和欄位名稱

#### Shipments 表格欄位

您的 Airtable Base 應該有一個表格（預設名稱：`Shipments`），包含以下欄位：

| 欄位名稱（程式碼會嘗試匹配） | 說明 | 範例 |
|-------------------------|------|------|
| `Job No` 或 `Order No` 或 `JobNo` | 訂單編號 | TM111682 |
| `Tracking No` 或 `TrackingNo` | 追蹤編號 | GEXVC2YF |
| `Status` 或 `status` | 狀態 | in_transit |
| `Origin` 或 `origin` | 起點 | TPE |
| `Destination` 或 `destination` | 終點 | PVG |
| `Package Count` 或 `PackageCount` 或 `Packages` | 包裹數量 | 1 |
| `Weight` 或 `weight` | 重量 | 25 KG |
| `ETA` 或 `eta` 或 `Estimated Arrival` | 預計到達時間 | 2025-10-06 14:30 |
| `Invoice No` 或 `InvoiceNo` 或 `Invoice` | 發票編號 | INV123456 |
| `MAWB` 或 `mawb` | 主提單號 | - |
| `Last Update` 或 `LastUpdate` 或 `Updated` | 最後更新時間 | 2025-10-10 10:16 |

#### Timeline 表格欄位

另一個表格（預設名稱：`Timeline`），包含以下欄位：

| 欄位名稱（程式碼會嘗試匹配） | 說明 | 範例 |
|-------------------------|------|------|
| `Tracking No` 或 `TrackingNo` | 追蹤編號 | GEXVC2YF |
| `Step` 或 `step` 或 `Step Number` | 步驟編號 | 1 |
| `Title` 或 `title` 或 `Status` | 標題 | Order Created |
| `Date` 或 `date` | 日期 | 2025-10-10 |
| `Time` 或 `time` | 時間 | 10:16 |
| `Status` 或 `status` | 狀態 | completed |
| `Is Event` 或 `IsEvent` 或 `Event` | 是否為事件 | false |

### 步驟 4：安裝依賴

在 `backend` 目錄下：

```bash
npm install
```

### 步驟 5：設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# Airtable 設定
AIRTABLE_API_KEY=your-airtable-api-key-here
AIRTABLE_BASE_ID=your-airtable-base-id-here

# 如果表格名稱不同，可以設定
# AIRTABLE_SHIPMENTS_TABLE=YourShipmentsTable
# AIRTABLE_TIMELINE_TABLE=YourTimelineTable
```

### 步驟 6：測試連接

執行測試腳本：

```bash
npm run test-airtable
```

或指定參數：

```bash
node scripts/test-airtable.js TM111682 GEXVC2YF
```

### 步驟 7：啟動本地開發服務器

在 `backend` 目錄下：

```bash
npm run dev
```

或使用 Netlify CLI：

```bash
netlify dev
```

### 步驟 8：測試頁面

訪問以下網址測試：

- Basic 頁面: `http://localhost:8888/basic`
- Standard 頁面: `http://localhost:8888/standard`

輸入 Airtable 中的真實資料：
- Job No.: （從 Airtable Shipments 表格）
- Tracking No.: （從 Airtable Shipments 表格）

## 欄位名稱對應

如果您的 Airtable 欄位名稱與預設不同，程式碼會自動嘗試匹配以下名稱：

### Shipments 表格

- **Job No**: `Job No`, `Order No`, `JobNo`
- **Tracking No**: `Tracking No`, `TrackingNo`
- **Status**: `Status`, `status`
- **Origin**: `Origin`, `origin`
- **Destination**: `Destination`, `destination`
- **Package Count**: `Package Count`, `PackageCount`, `Packages`
- **Weight**: `Weight`, `weight`
- **ETA**: `ETA`, `eta`, `Estimated Arrival`
- **Invoice No**: `Invoice No`, `InvoiceNo`, `Invoice`
- **MAWB**: `MAWB`, `mawb`
- **Last Update**: `Last Update`, `LastUpdate`, `Updated`, `Updated At`

### Timeline 表格

- **Tracking No**: `Tracking No`, `TrackingNo`
- **Step**: `Step`, `step`, `Step Number`
- **Title**: `Title`, `title`, `Status`, `status`
- **Date**: `Date`, `date`
- **Time**: `Time`, `time`
- **Status**: `Status`, `status`
- **Is Event**: `Is Event`, `IsEvent`, `Event`

## 故障排除

### 問題 1：無法連接 Airtable

**錯誤訊息**: `Airtable API Key 和 Base ID 必須設定在環境變數中`

**解決方法**：
1. 確認 `.env` 檔案已建立並包含 `AIRTABLE_API_KEY` 和 `AIRTABLE_BASE_ID`
2. 確認 API Key 正確（從 https://airtable.com/account 取得）
3. 確認 Base ID 正確（從 Base URL 取得）

### 問題 2：找不到資料

**錯誤訊息**: `No record found`

**解決方法**：
1. 確認 Airtable 中確實有對應的記錄
2. 確認 `Job No` 和 `Tracking No` 欄位名稱正確
3. 確認資料大小寫一致（程式碼會自動轉換為大寫）
4. 檢查 Airtable Base 的權限設定

### 問題 3：欄位名稱不匹配

**錯誤訊息**: 資料顯示但不完整

**解決方法**：
1. 確認 Airtable 欄位名稱與程式碼中的欄位名稱匹配
2. 可以在 `database/airtable.js` 中調整欄位名稱對應
3. 或使用環境變數設定表格名稱

### 問題 4：權限錯誤

**錯誤訊息**: `401 Unauthorized` 或 `403 Forbidden`

**解決方法**：
1. 確認 API Key 有正確的權限
2. 確認 API Key 有權限讀取指定的 Base
3. 重新建立 API Key 並確保選擇正確的 Scopes

## 下一步

設定完成後，您可以在本地（127.0.0.1）測試 `basic.html` 和 `standard.html` 頁面，它們會從 Airtable 讀取真實資料。

## 提示

- 如果欄位名稱不同，可以在 `database/airtable.js` 中調整欄位映射
- 建議在 Airtable 中使用統一的欄位命名規範
- 測試時可以先使用 `test-airtable.js` 腳本確認連接和資料查詢是否正常

