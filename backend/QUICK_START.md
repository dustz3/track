# 快速啟動指南

## 問題：無法連上 localhost:8888/basic

### 解決步驟

#### 步驟 1：編譯前端文件

在終端執行：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track
node compile.js
```

等待看到：`🎉 編譯完成！`

#### 步驟 2：啟動本地開發服務器

在新的終端視窗中執行：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev
```

或使用：

```bash
npm run dev
```

#### 步驟 3：等待服務器啟動

您會看到類似以下的訊息：

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

#### 步驟 4：訪問頁面

服務器啟動後，訪問：

- **Basic 頁面**: http://localhost:8888/basic
- **Standard 頁面**: http://localhost:8888/standard

## 重要提醒

1. **不要關閉終端視窗** - 服務器需要在後台運行
2. **確保 .env 檔案存在** - 在 `backend` 目錄下
3. **如果看到錯誤** - 檢查終端中的錯誤訊息

## 常見問題

### 問題 1：端口已被占用

```bash
# 停止占用端口的程序
lsof -ti:8888 | xargs kill -9

# 然後重新啟動
netlify dev
```

### 問題 2：找不到 basic.html

```bash
# 先編譯前端文件
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track
node compile.js

# 然後啟動服務器
cd ../backend
netlify dev
```

### 問題 3：Airtable 連接失敗

```bash
# 測試 Airtable 連接
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
node scripts/test-airtable.js TM111755 VHILRDLU
```

## 測試資料

根據您的 Airtable：

- **Job No.**: `TM111755`
- **Tracking No.**: `VHILRDLU`

