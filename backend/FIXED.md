# 問題已修正

## 問題

Netlify 要求 `publish` 路徑必須相對於 repository root，但之前的配置使用了相對路徑超出了 repository root。

## 解決方案

### 方案 1：已在 repository root 建立 netlify.toml

已在 `/Users/arieshsieh/Develop/Development/netlify.toml` 建立配置文件。

### 方案 2：使用 backend 目錄下的配置文件

如果要在 backend 目錄下執行，需要使用 `--config` 參數：

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev --config netlify.toml
```

## 推薦方法

### 方法 1：從 repository root 執行（推薦）

```bash
cd /Users/arieshsieh/Develop/Development
netlify dev
```

### 方法 2：從 backend 目錄執行（使用 --config）

```bash
cd /Users/arieshsieh/Develop/Development/src/Projects/TailorMed/track/backend
netlify dev --config netlify.toml
```

## 測試

執行命令後，應該會看到：

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
```

然後訪問：
- http://localhost:8888/basic
- http://localhost:8888/standard

