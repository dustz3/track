# 啟動服務器指南

## 重要：請在您的終端執行

由於 `netlify dev` 需要在前台運行才能看到完整的輸出和錯誤訊息，請在您的終端中執行：

### 步驟 1：開啟終端

### 步驟 2：執行以下命令

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev
```

### 步驟 3：觀察輸出

**正常啟動時，您會看到：**

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

**如果有錯誤，您會看到：**

- 錯誤訊息
- 警告訊息
- 路徑問題
- 依賴問題

## 常見問題

### 問題 1：找不到 netlify 命令

```bash
npm install -g netlify-cli
```

### 問題 2：端口被占用

```bash
lsof -ti:8888 | xargs kill -9
```

### 問題 3：依賴問題

```bash
npm install
```

### 問題 4：路徑問題

確認您在正確的目錄：
```bash
pwd
# 應該顯示：.../track/backend
```

## 啟動成功後

訪問以下網址：

- **Basic 頁面**: http://localhost:8888/basic
- **Standard 頁面**: http://localhost:8888/standard
- **健康檢查**: http://localhost:8888/api/health

## 測試資料

根據您的 Airtable：

- **Job No.**: `TM111755`
- **Tracking No.**: `VHILRDLU`

## 提示

- **不要關閉終端視窗** - 服務器需要持續運行
- **如果看到錯誤** - 請複製錯誤訊息告訴我
- **Ctrl+C** - 可以停止服務器

