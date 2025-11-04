# Basic 和 Standard 頁面設定指南

## 快速開始

要讓 `basic.html` 和 `standard.html` 可以實際查詢資料，您需要：

### 步驟 1：確認後端 API 位置

您的後端 API 在哪裡？
- ✅ **Render**: `https://tailormed-tracking-api.onrender.com`
- ✅ **Heroku**: `https://your-app.herokuapp.com`
- ✅ **自建服務器**: `https://api.yourdomain.com`
- ✅ **其他**: 請提供完整 URL

### 步驟 2：設定 Netlify 環境變數

在 Netlify Dashboard 設定環境變數：

1. 前往您的 Netlify 網站
2. 點擊 **Site settings** → **Environment variables**
3. 新增以下環境變數：

#### 必要設定：

```
BACKEND_API_URL = https://your-backend-api-url.com
```

#### 可選設定（如果需要 API 金鑰）：

```
BACKEND_API_KEY = your-api-key-here
```

### 步驟 3：確認後端 API 格式

您的後端 API 應該支援以下端點：

```
GET /api/tracking?orderNo=TM111682&trackingNo=GEXVC2YF
```

**回應格式應該如下：**

```json
{
  "success": true,
  "data": {
    "orderNo": "TM111682",
    "trackingNo": "GEXVC2YF",
    "status": "in_transit",
    "eta": "2025-10-06 14:30",
    "lastUpdate": "2025-10-10 10:16",
    "timeline": [
      {
        "step": 1,
        "title": "Order Created",
        "time": "2025-10-10 10:16",
        "status": "completed",
        "isEvent": false
      },
      {
        "step": 2,
        "title": "Shipment Collected",
        "time": "2025-10-10 14:30",
        "status": "completed",
        "isEvent": false
      },
      {
        "title": "Dry ice refilled",
        "time": "2025-10-11 15:30",
        "status": "pending",
        "isEvent": true
      }
    ]
  }
}
```

### 步驟 4：測試

1. **部署到 Netlify**：
   - 將程式碼推送到 Git
   - Netlify 會自動部署

2. **測試查詢**：
   - 訪問 `https://your-site.netlify.app/basic`
   - 輸入測試資料：
     - Job No.: `TM111682`
     - Tracking No.: `GEXVC2YF`
   - 點擊 **STATUS CHECK**

3. **檢查結果**：
   - 如果成功，會顯示貨件資訊和 timeline
   - 如果失敗，會顯示錯誤訊息

## 本地測試

### 安裝 Netlify CLI

```bash
npm install -g netlify-cli
```

### 設定本地環境變數

在 `backend` 目錄下建立 `.env` 檔案：

```env
BACKEND_API_URL=https://your-backend-api-url.com
BACKEND_API_KEY=your-api-key-here
```

### 啟動本地開發服務器

在 `backend` 目錄下：

```bash
netlify dev
```

訪問 `http://localhost:8888/basic` 或 `http://localhost:8888/standard`

## 故障排除

### 問題 1：顯示 "Backend service unavailable"

**原因**：Netlify Function 無法連接到後端 API

**解決方法**：
1. 確認 `BACKEND_API_URL` 環境變數已正確設定
2. 確認後端 API 可以從外部訪問
3. 檢查 Netlify Function 日誌（Site → Functions → tracking → Logs）

### 問題 2：顯示 "No record found"

**原因**：後端 API 找不到對應的記錄

**解決方法**：
1. 確認輸入的 Job No. 和 Tracking No. 正確
2. 確認後端資料庫中有對應的記錄
3. 檢查後端 API 是否正常運作

### 問題 3：顯示 mock 資料

**原因**：沒有設定 `BACKEND_API_URL` 環境變數

**解決方法**：
1. 在 Netlify Dashboard 設定 `BACKEND_API_URL`
2. 重新部署網站

### 問題 4：CORS 錯誤

**原因**：後端 API 不允許來自 Netlify 的請求

**解決方法**：
1. 在後端 API 設定 CORS，允許來自 Netlify 網站的請求
2. 或使用 Netlify Function 作為代理（已自動處理）

## 下一步

設定完成後，您的 `basic.html` 和 `standard.html` 就可以實際查詢資料了！

如果有任何問題，請檢查：
- Netlify Function 日誌
- 後端 API 日誌
- 瀏覽器開發者工具（Console 和 Network）

