# API 連接問題排查

## 問題描述
`https://tailormed-track-preparing.netlify.app/standard` 頁面無法查詢資料

## 檢查結果

### 1. API 端點狀態
- ✅ `/api/health` 正常：返回 `{"status":"ok","airtable":"configured"}`
- ✅ `/api/tracking` 可訪問：返回 `{"success":false,"message":"No record found..."}`

### 2. 可能的原因

#### A. 環境變數問題
雖然 `/api/health` 顯示 `"airtable":"configured"`，但可能：
- `AIRTABLE_SHIPMENTS_TABLE` 設置錯誤（應該是 `Tracking` 而不是 `Shipments`）
- 環境變數在 Netlify Dashboard 中設置不正確

#### B. Airtable 查詢問題
- 欄位名稱不匹配（`Job No.` vs `Job No`）
- 資料格式問題（大小寫、空格等）

#### C. 前端 API URL 問題
- 前端使用 `/api/tracking`（相對路徑）
- Netlify 重定向規則：`/api/tracking` → `/.netlify/functions/tracking`

## 解決步驟

### 步驟 1：確認 Netlify 環境變數
在 Netlify Dashboard → Site settings → Environment variables 確認：

| 變數名稱 | 值 |
|---------|-----|
| `AIRTABLE_API_KEY` | 您的 Airtable API Key |
| `AIRTABLE_BASE_ID` | 您的 Airtable Base ID |
| `AIRTABLE_SHIPMENTS_TABLE` | **必須是 `Tracking`**（不是 `Shipments`） |

### 步驟 2：檢查 Netlify Function 日誌
在 Netlify Dashboard → Functions → tracking → Logs 查看：
- 是否有錯誤訊息
- 查詢的參數是什麼
- Airtable 返回的結果是什麼

### 步驟 3：測試已知的追蹤號碼
使用已知存在的追蹤號碼測試：
- `TM111695 / X73K1UN6`
- `TM111668 / EU5CET6N`

### 步驟 4：檢查 Airtable 表格名稱
確認 Airtable 中的表格名稱是 `Tracking`（不是 `Shipments` 或其他）

### 步驟 5：檢查欄位名稱
確認 Airtable 表格中的欄位名稱：
- Job No 欄位：可能是 `Job No.`、`Job No`、`Order No` 等
- Tracking No 欄位：可能是 `Tracking No.`、`Tracking No` 等

## 測試 API

### 測試健康檢查
```bash
curl https://tailormed-track-preparing.netlify.app/api/health
```

### 測試查詢
```bash
curl "https://tailormed-track-preparing.netlify.app/api/tracking?orderNo=TM111695&trackingNo=X73K1UN6"
```

## 預期結果
- 如果環境變數正確，應該能查詢到資料
- 如果查詢不到，檢查 Netlify Function 日誌中的錯誤訊息

