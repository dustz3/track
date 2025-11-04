# 除錯指南：localhost:8888 拒絕連線

## 問題診斷

如果您看到 "拒絕連線" 或 "ERR_CONNECTION_REFUSED"，這表示服務器沒有運行。

## 解決步驟

### 步驟 1：確認您在正確的目錄

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
pwd
# 應該顯示：.../track/backend
```

### 步驟 2：檢查必要文件

```bash
ls -la .env netlify.toml netlify/functions/tracking.js
# 這三個文件都應該存在
```

### 步驟 3：確認編譯文件存在

```bash
ls -la ../../../../../dist/Projects/TailorMed/track/basic.html
# 應該看到 basic.html 文件
```

### 步驟 4：啟動服務器（在前台運行）

**重要：請在終端中執行，不要使用後台模式**

```bash
netlify dev
```

**觀察輸出：**

- 如果成功，會看到：`◈ Server now ready on http://localhost:8888`
- 如果有錯誤，會顯示具體的錯誤訊息

### 步驟 5：如果看到錯誤訊息

常見錯誤及解決方法：

#### 錯誤 1：找不到模組

```
Error: Cannot find module 'xxx'
```

**解決：**
```bash
npm install
```

#### 錯誤 2：端口被占用

```
Port 8888 is already in use
```

**解決：**
```bash
lsof -ti:8888 | xargs kill -9
netlify dev
```

#### 錯誤 3：路徑問題

```
ENOENT: no such file or directory
```

**解決：**
```bash
# 先編譯前端文件
cd ..
node compile.js

# 然後啟動服務器
cd backend
netlify dev
```

#### 錯誤 4：Airtable 連接錯誤

```
Airtable API Key 和 Base ID 必須設定
```

**解決：**
```bash
# 確認 .env 檔案存在且內容正確
cat .env | grep AIRTABLE
```

## 測試服務器

### 方法 1：檢查端口

```bash
lsof -i:8888
# 如果服務器運行中，應該會看到 netlify 或 node 進程
```

### 方法 2：測試健康檢查端點

```bash
curl http://localhost:8888/api/health
# 如果服務器運行中，應該會返回 JSON 回應
```

### 方法 3：訪問頁面

在瀏覽器中訪問：
- http://localhost:8888/basic
- http://localhost:8888/api/health

## 完整啟動流程

```bash
# 1. 進入 backend 目錄
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend

# 2. 確認環境設定
cat .env | grep AIRTABLE

# 3. 啟動服務器（在前台運行，不要關閉終端）
netlify dev

# 4. 等待看到 "Server now ready"

# 5. 訪問頁面
# http://localhost:8888/basic
```

## 重要提醒

1. **不要關閉終端視窗** - 服務器需要持續運行
2. **在前台運行** - 這樣才能看到錯誤訊息
3. **如果有錯誤** - 複製完整的錯誤訊息告訴我

