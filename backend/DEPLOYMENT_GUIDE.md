# Basic 和 Standard 頁面部署指南

## 概述

要讓 `basic.html` 和 `standard.html` 可以實際查詢資料，需要配置 Netlify Function 連接真實的資料來源。

## 目前狀態

目前 Netlify Function (`netlify/functions/tracking.js`) 只返回 mock 資料。要啟用真實查詢，有以下幾種方式：

## 方式 1：連接外部 API（推薦）

如果您的後端服務部署在 Render、Heroku 或其他平台：

### 步驟 1：更新 Netlify Function

編輯 `netlify/functions/tracking.js`，取消註解並修改以下部分：

```javascript
// 範例：連接到 Render 後端 API
const renderApiUrl = process.env.RENDER_API_URL || 'https://your-backend-api.onrender.com';
const response = await fetch(`${renderApiUrl}/api/tracking?orderNo=${orderNo}&trackingNo=${trackingNo}`);
const data = await response.json();
return { statusCode: 200, headers, body: JSON.stringify(data) };
```

### 步驟 2：設定環境變數

在 Netlify Dashboard：
1. 前往 Site settings → Environment variables
2. 新增 `RENDER_API_URL` = `https://your-backend-api.onrender.com`

## 方式 2：直接在 Netlify Function 中連接資料庫

### 步驟 1：安裝資料庫驅動程式

在 `backend` 目錄下建立 `package.json`：

```json
{
  "name": "tailormed-track-backend",
  "version": "1.0.0",
  "dependencies": {
    "mongodb": "^6.0.0"
  }
}
```

### 步驟 2：更新 Netlify Function

在 `netlify/functions/tracking.js` 中：

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event, context) => {
  // ... CORS 處理 ...
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection('shipments');
    
    const shipment = await collection.findOne({
      orderNo: orderNo,
      trackingNo: trackingNo
    });
    
    if (!shipment) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No record found'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: shipment
      })
    };
  } catch (error) {
    // ... 錯誤處理 ...
  } finally {
    await client.close();
  }
};
```

### 步驟 3：設定環境變數

在 Netlify Dashboard 設定：
- `MONGODB_URI` = `mongodb+srv://user:password@cluster.mongodb.net/`
- `MONGODB_DB_NAME` = `tailormed`

## 方式 3：使用 Netlify 環境變數連接現有服務

### 步驟 1：確認您的後端 API 端點

例如：
- Render: `https://tailormed-tracking-api.onrender.com`
- 自建服務器: `https://api.yourdomain.com`

### 步驟 2：更新 Netlify Function

編輯 `netlify/functions/tracking.js`：

```javascript
// 處理 /api/tracking-public 端點
if (path.includes('/api/tracking-public')) {
  let orderNo, trackingNo;
  
  // 從 query parameters 取得（GET 請求）
  if (httpMethod === 'GET') {
    orderNo = queryStringParameters?.orderNo;
    trackingNo = queryStringParameters?.trackingNo;
  }
  
  // 驗證參數
  if (!orderNo || !trackingNo) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Missing parameters',
        message: 'Both orderNo and trackingNo are required'
      })
    };
  }
  
  // 連接後端 API
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'https://your-backend-api.com';
    const apiUrl = `${backendUrl}/api/tracking?orderNo=${encodeURIComponent(orderNo)}&trackingNo=${encodeURIComponent(trackingNo)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': process.env.BACKEND_API_KEY ? `Bearer ${process.env.BACKEND_API_KEY}` : undefined
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No record found'
          })
        };
      }
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Backend API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}
```

### 步驟 3：設定 Netlify 環境變數

在 Netlify Dashboard 設定：
- `BACKEND_API_URL` = `https://your-backend-api.com`
- `BACKEND_API_KEY` = `your-api-key` (如果需要)

## 測試

### 本地測試

1. 安裝 Netlify CLI：
```bash
npm install -g netlify-cli
```

2. 在 `backend` 目錄下啟動本地開發服務器：
```bash
netlify dev
```

3. 訪問 `http://localhost:8888/basic` 或 `http://localhost:8888/standard`

4. 輸入測試資料：
- Job No.: `TM111682`
- Tracking No.: `GEXVC2YF`

### 部署測試

1. 將程式碼推送到 Git
2. Netlify 會自動部署
3. 訪問您的 Netlify URL：`https://your-site.netlify.app/basic`

## 注意事項

1. **CORS 設定**：確保後端 API 允許來自 Netlify 網站的請求
2. **API 金鑰**：如果使用 API 金鑰，請妥善保管，不要提交到 Git
3. **錯誤處理**：確保所有錯誤情況都有適當的處理
4. **速率限制**：考慮實作速率限制以防止濫用

## 下一步

選擇適合您的方式後，更新 `netlify/functions/tracking.js` 並設定相應的環境變數。

