# 逐步操作指南

## 步驟 1：開啟終端

在您的電腦上開啟終端（Terminal）應用程式。

## 步驟 2：進入 backend 目錄

複製並貼上以下命令到終端：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
```

按 Enter 執行。

## 步驟 3：確認您在正確的目錄

執行以下命令確認：

```bash
pwd
```

應該顯示：`/Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend`

## 步驟 4：啟動服務器

執行以下命令：

```bash
netlify dev
```

按 Enter 執行。

## 步驟 5：等待服務器啟動

您會看到類似以下的輸出：

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

**重要：不要關閉終端視窗，服務器需要持續運行。**

## 步驟 6：測試頁面

服務器啟動後，在瀏覽器中訪問：

- **Basic 頁面**: http://localhost:8888/basic
- **Standard 頁面**: http://localhost:8888/standard

## 步驟 7：測試查詢

在頁面中輸入：

- **Job No.**: `TM111755`
- **Tracking No.**: `VHILRDLU`

點擊 **STATUS CHECK** 按鈕。

應該會顯示從 Airtable 讀取的資料。

## 如果遇到問題

### 問題 1：看到錯誤訊息

**請複製完整的錯誤訊息告訴我**，我可以幫您解決。

### 問題 2：端口被占用

執行以下命令停止占用端口的程序：

```bash
lsof -ti:8888 | xargs kill -9
```

然後重新執行 `netlify dev`。

### 問題 3：找不到命令

執行以下命令安裝 Netlify CLI：

```bash
npm install -g netlify-cli
```

### 問題 4：依賴問題

執行以下命令安裝依賴：

```bash
npm install
```

## 停止服務器

當您完成測試後，在終端中按 `Ctrl+C` 可以停止服務器。

## 完整命令列表

```bash
# 1. 進入目錄
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend

# 2. 啟動服務器
netlify dev

# 3. 等待看到 "Server now ready"

# 4. 在瀏覽器中訪問 http://localhost:8888/basic
```

