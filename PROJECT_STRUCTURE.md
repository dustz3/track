# TailorMed track 專案結構說明

## 專案組織原則

### 1. `src/` - 原始碼（Source Code）
- **用途**：所有開發時的原始碼都在這裡
- **包含**：前端模板、樣式、後端程式碼、配置檔案等
- **特點**：這些是您會編輯的檔案

### 2. `dist/` - 編譯輸出（Distribution）
- **用途**：只放前端編譯後的靜態檔案
- **包含**：HTML、CSS、JavaScript、圖片等
- **特點**：這些是部署時需要的檔案，不需要手動編輯

### 3. `backend/` - 後端程式碼
- **用途**：後端 API 相關的程式碼
- **包含**：API 路由、控制器、資料庫、中介層等
- **特點**：這些是後端邏輯，可能需要獨立部署

## 實際的專案結構（已重構）

```
src/Projects/TailorMed/track/
├── frontend/                    # 前端原始碼 ✅
│   ├── Templates/              # Pug 模板
│   │   ├── components/
│   │   │   ├── lookupPanel.pug
│   │   │   ├── resultsPanel.pug
│   │   │   ├── timelineIconLegend.pug
│   │   │   └── timelineVisual.pug
│   │   ├── design_ui.pug
│   │   └── index.pug
│   ├── Styles/                 # Stylus 樣式
│   │   ├── components/
│   │   │   ├── lookupPanel.styl
│   │   │   ├── resultsPanel.styl
│   │   │   ├── timelineIconLegend.styl
│   │   │   └── timelineVisual.styl
│   │   ├── main.styl
│   │   └── variables.styl
│   └── Assets/                 # 靜態資源
│       ├── icon-*.png
│       └── icon-*.svg
│   │   ├── main.styl
│   │   └── variables.styl
│   ├── Assets/                 # 靜態資源（圖片、字體等）
│   └── js/                     # 前端 JavaScript（如果有的話）
│       ├── app.js
│       └── config.js
│
├── backend/                    # 後端原始碼 ✅
│   ├── api/                    # API 路由
│   │   ├── docs/
│   │   └── tests/
│   ├── controllers/            # 控制器
│   ├── database/               # 資料庫相關
│   │   ├── migrations/
│   │   ├── schemas/
│   │   └── seeds/
│   ├── middleware/             # 中介層
│   ├── netlify/                # Netlify Functions（Serverless 後端）
│   │   └── functions/
│   │       └── tracking.js
│   └── netlify.toml            # Netlify 部署配置
│
├── compile.js                  # 前端編譯腳本 ✅
└── package.json                # 專案依賴

dist/Projects/TailorMed/track/  # 編譯輸出（只放前端）
├── index.html                  # 編譯後的 HTML
├── design_ui.html
├── components/                 # 編譯後的組件 HTML
├── css/                        # 編譯後的 CSS
├── images/                     # 複製的圖片資源
└── js/                         # 前端 JavaScript（如果有）
```

## 為什麼這樣組織？

### 1. `src/frontend/` 和 `src/backend/` 分開
- ✅ **清晰的分工**：前端和後端邏輯分開，不會混淆
- ✅ **獨立開發**：前端和後端可以分開開發和測試
- ✅ **各自部署**：前端可以部署到 Netlify，後端可以部署到 Render/Heroku

### 2. `dist/` 只放前端編譯結果
- ✅ **清楚的輸出**：`dist/` 就是前端部署需要的所有檔案
- ✅ **不會混淆**：後端程式碼不會出現在 `dist/` 中
- ✅ **部署簡單**：直接將 `dist/` 部署到 Netlify 即可

### 3. `backend/` 包含所有後端相關
- ✅ **統一管理**：所有後端程式碼都在一個地方
- ✅ **多種部署方式**：
  - `backend/server.js` - Express 伺服器（部署到 Render/Heroku）
  - `backend/netlify/functions/` - Netlify Functions（部署到 Netlify）
- ✅ **共用程式碼**：可以共用資料庫連接、驗證邏輯等

## 編譯流程

### 前端編譯（`compile.js`）
```javascript
src/frontend/Templates/*.pug  →  dist/*.html
src/frontend/Styles/*.styl     →  dist/css/*.css
src/frontend/Assets/*          →  dist/images/*
```

### 後端編譯（不需要）
- 後端程式碼不需要編譯，直接執行即可
- 或者可以建立 `backend/build.js` 來處理後端的打包

## 部署方式

### 前端部署
```bash
# 1. 編譯前端
cd src/Projects/TailorMed/track
node compile.js

# 2. 部署 dist/ 到 Netlify
# Netlify 會自動讀取 dist/Projects/TailorMed/track/
```

### 後端部署

#### 選項 A：Netlify Functions（Serverless）
```bash
# backend/netlify/functions/ 會自動被 Netlify 識別
# 不需要額外編譯，直接部署
```

#### 選項 B：Express 伺服器（傳統）
```bash
# 1. 進入 backend 目錄
cd src/Projects/TailorMed/track/backend

# 2. 安裝依賴
npm install

# 3. 啟動伺服器
npm start

# 4. 部署到 Render/Heroku/Railway
```

## 目前結構 vs 推薦結構

### 目前結構（較混亂）
```
track/
├── Templates/          # 前端
├── Styles/             # 前端
├── Assets/             # 前端
├── backend/            # 後端
│   └── netlify/       # 後端的 Netlify Functions
└── compile.js          # 前端編譯
```

### 推薦結構（更清晰）
```
track/
├── frontend/           # 所有前端相關
│   ├── Templates/
│   ├── Styles/
│   └── Assets/
├── backend/            # 所有後端相關
│   ├── api/
│   ├── controllers/
│   └── netlify/
└── compile.js          # 前端編譯（只編譯 frontend/）
```

## 重構完成 ✅

專案結構已經重構完成，現在：

1. ✅ **前端集中管理**：所有前端相關檔案都在 `frontend/` 目錄下
2. ✅ **後端集中管理**：所有後端相關檔案都在 `backend/` 目錄下
3. ✅ **編譯流程正常**：`compile.js` 已更新，可以正常編譯前端
4. ✅ **結構清晰**：前端和後端完全分離，易於維護

## 編譯測試

```bash
cd src/Projects/TailorMed/track
node compile.js
# ✅ 編譯成功，所有檔案都在 dist/Projects/TailorMed/track/
```

## 下一步

1. **提交變更**：將重構後的結構提交到 git
2. **更新部署配置**：確認 Netlify 部署配置正確
3. **測試部署**：在 Netlify 上測試部署流程

