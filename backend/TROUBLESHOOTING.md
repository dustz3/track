# 故障排除指南

## 問題：無法連上 localhost:8888/basic

### 檢查清單

#### 1. 端口檢查

端口 8888 可能沒有問題。檢查：

```bash
# 檢查端口是否被占用
lsof -i:8888

# 如果被占用，停止它
lsof -ti:8888 | xargs kill -9
```

#### 2. 服務器啟動檢查

**問題可能是服務器沒有正確啟動。**請按照以下步驟：

##### 步驟 A：確認目錄

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
pwd
# 應該顯示：.../track/backend
```

##### 步驟 B：檢查文件

```bash
ls -la .env netlify.toml
# 應該看到這兩個檔案
```

##### 步驟 C：啟動服務器

```bash
netlify dev
```

**重要：** 您應該看到類似以下的輸出：

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

**如果沒有看到這個訊息，服務器就沒有啟動成功。**

#### 3. 常見錯誤

##### 錯誤 1：找不到 netlify 命令

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 或使用 npx
npx netlify-cli dev
```

##### 錯誤 2：路徑問題

```bash
# 確認您在正確的目錄
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend

# 確認 netlify.toml 存在
ls -la netlify.toml
```

##### 錯誤 3：環境變數問題

```bash
# 確認 .env 檔案存在
ls -la .env

# 確認內容正確（至少要有 AIRTABLE_API_KEY 和 AIRTABLE_BASE_ID）
cat .env | grep AIRTABLE
```

##### 錯誤 4：編譯問題

```bash
# 先編譯前端文件
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track
node compile.js

# 確認 basic.html 存在
ls -la dist/Projects/TailorMed/track/basic.html
```

#### 4. 使用不同端口

如果端口 8888 有問題，可以嘗試其他端口：

```bash
netlify dev --port 3000
```

然後訪問：http://localhost:3000/basic

#### 5. 檢查服務器日誌

啟動服務器時，注意終端中的錯誤訊息。常見錯誤：

- `Cannot find module` - 缺少依賴，執行 `npm install`
- `Port already in use` - 端口被占用
- `Invalid configuration` - netlify.toml 有問題
- `ENOENT: no such file or directory` - 路徑問題

## 快速測試

### 測試 1：檢查文件是否存在

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
ls -la .env netlify.toml package.json
```

### 測試 2：測試 Airtable 連接

```bash
node scripts/test-airtable.js TM111755 VHILRDLU
```

### 測試 3：檢查編譯文件

```bash
ls -la ../../../../dist/Projects/TailorMed/track/basic.html
```

### 測試 4：手動啟動服務器

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev
```

**觀察終端輸出，看是否有錯誤訊息。**

## 如果還是無法連接

請告訴我：

1. 執行 `netlify dev` 時終端顯示什麼訊息？
2. 是否有任何錯誤訊息？
3. 服務器是否顯示 "Server now ready"？

這樣我可以更準確地幫您解決問題。

