# 本地資料庫測試設定指南

## 快速開始

### 步驟 1：安裝 MongoDB

#### macOS (使用 Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows

下載並安裝 MongoDB Community Server：
https://www.mongodb.com/try/download/community

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# 啟動 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 步驟 2：安裝依賴

在 `backend` 目錄下：

```bash
npm install
```

### 步驟 3：設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/tailormed
MONGODB_DB_NAME=tailormed
```

### 步驟 4：建立測試資料

#### 使用 MongoDB Shell

```bash
mongosh
```

然後執行：

```javascript
use tailormed

// 建立 shipments 集合並插入測試資料
db.shipments.insertOne({
  orderNo: "TM111682",
  trackingNo: "GEXVC2YF",
  status: "in_transit",
  origin: "TPE",
  destination: "PVG",
  packageCount: 1,
  weight: "25 KG",
  eta: "2025-10-06 14:30",
  invoiceNo: "INV123456",
  lastUpdate: "2025-10-10 10:16",
  createdAt: new Date(),
  updatedAt: new Date()
})

// 建立 timeline 集合並插入測試資料
db.timeline.insertMany([
  {
    trackingNo: "GEXVC2YF",
    step: 1,
    title: "Order Created",
    date: "2025-10-10",
    time: "10:16",
    status: "completed",
    isEvent: false,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    step: 2,
    title: "Shipment Collected",
    date: "2025-10-10",
    time: "14:30",
    status: "completed",
    isEvent: false,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    step: 3,
    title: "In Transit",
    date: "2025-10-11",
    time: "09:00",
    status: "active",
    isEvent: false,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    title: "Dry ice refilled",
    date: "2025-10-11",
    time: "15:30",
    status: "pending",
    isEvent: true,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    step: 4,
    title: "Import Released",
    date: "TBD",
    time: "TBD",
    status: "pending",
    isEvent: false,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    step: 5,
    title: "Out for Delivery",
    date: "TBD",
    time: "TBD",
    status: "pending",
    isEvent: false,
    createdAt: new Date()
  },
  {
    trackingNo: "GEXVC2YF",
    step: 6,
    title: "Shipment Delivered",
    date: "TBD",
    time: "TBD",
    status: "pending",
    isEvent: false,
    createdAt: new Date()
  }
])
```

#### 使用測試腳本

建立測試資料腳本 `scripts/seed-db.js`：

```javascript
require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../database/connection');

async function seedDatabase() {
  try {
    const db = await connectDatabase();
    
    // 清除舊資料
    await db.collection('shipments').deleteMany({});
    await db.collection('timeline').deleteMany({});
    
    // 插入測試資料
    await db.collection('shipments').insertOne({
      orderNo: "TM111682",
      trackingNo: "GEXVC2YF",
      status: "in_transit",
      origin: "TPE",
      destination: "PVG",
      packageCount: 1,
      weight: "25 KG",
      eta: "2025-10-06 14:30",
      invoiceNo: "INV123456",
      lastUpdate: "2025-10-10 10:16",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await db.collection('timeline').insertMany([
      {
        trackingNo: "GEXVC2YF",
        step: 1,
        title: "Order Created",
        date: "2025-10-10",
        time: "10:16",
        status: "completed",
        isEvent: false,
        createdAt: new Date()
      },
      {
        trackingNo: "GEXVC2YF",
        step: 2,
        title: "Shipment Collected",
        date: "2025-10-10",
        time: "14:30",
        status: "completed",
        isEvent: false,
        createdAt: new Date()
      },
      {
        trackingNo: "GEXVC2YF",
        step: 3,
        title: "In Transit",
        date: "2025-10-11",
        time: "09:00",
        status: "active",
        isEvent: false,
        createdAt: new Date()
      },
      {
        trackingNo: "GEXVC2YF",
        title: "Dry ice refilled",
        date: "2025-10-11",
        time: "15:30",
        status: "pending",
        isEvent: true,
        createdAt: new Date()
      }
    ]);
    
    console.log('✅ 測試資料已建立');
    
  } catch (error) {
    console.error('❌ 建立測試資料失敗:', error);
  } finally {
    await closeDatabase();
  }
}

seedDatabase();
```

執行：

```bash
node scripts/seed-db.js
```

### 步驟 5：測試資料庫連接

```bash
npm run test-db
```

或指定參數：

```bash
node scripts/test-db.js TM111682 GEXVC2YF
```

### 步驟 6：啟動本地開發服務器

在 `backend` 目錄下：

```bash
npm run dev
```

或使用 Netlify CLI：

```bash
netlify dev
```

### 步驟 7：測試頁面

訪問以下網址測試：

- Basic 頁面: `http://localhost:8888/basic`
- Standard 頁面: `http://localhost:8888/standard`

輸入測試資料：
- Job No.: `TM111682`
- Tracking No.: `GEXVC2YF`

## 資料庫結構

### shipments 集合

```javascript
{
  _id: ObjectId,
  orderNo: String,        // 訂單編號
  trackingNo: String,      // 追蹤編號
  status: String,          // 狀態: pending, active, completed, in_transit
  origin: String,          // 起點
  destination: String,    // 終點
  packageCount: Number,   // 包裹數量
  weight: String,          // 重量
  eta: String,            // 預計到達時間
  invoiceNo: String,      // 發票編號
  lastUpdate: String,    // 最後更新時間
  createdAt: Date,
  updatedAt: Date
}
```

### timeline 集合

```javascript
{
  _id: ObjectId,
  trackingNo: String,      // 追蹤編號
  step: Number,           // 步驟編號（可選）
  title: String,          // 標題
  date: String,           // 日期
  time: String,           // 時間
  status: String,         // 狀態: pending, active, completed
  isEvent: Boolean,       // 是否為事件
  createdAt: Date
}
```

## 故障排除

### 問題 1：無法連接 MongoDB

**錯誤訊息**: `MongoNetworkError: connect ECONNREFUSED`

**解決方法**：
1. 確認 MongoDB 正在運行：`brew services list` (macOS) 或 `sudo systemctl status mongod` (Linux)
2. 確認連接字串正確：`mongodb://localhost:27017/tailormed`
3. 檢查防火牆設定

### 問題 2：找不到資料

**錯誤訊息**: `No record found`

**解決方法**：
1. 確認資料已建立：`mongosh` → `use tailormed` → `db.shipments.find()`
2. 確認 orderNo 和 trackingNo 大小寫正確
3. 檢查資料庫名稱是否正確

### 問題 3：找不到模組

**錯誤訊息**: `Cannot find module '../database/connection'`

**解決方法**：
1. 確認 `database/connection.js` 檔案存在
2. 確認已執行 `npm install`
3. 確認在正確的目錄下執行命令

## 下一步

設定完成後，您可以在本地測試 `basic.html` 和 `standard.html` 頁面，它們會從本地 MongoDB 資料庫讀取資料。

