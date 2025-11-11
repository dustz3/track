// API 配置
// 自動檢測環境：如果是 localhost 使用本地 API，否則使用 Netlify Functions API
// Netlify Functions 會自動處理 /api/* 路徑，轉發到 /.netlify/functions/tracking
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = isLocal
  ? 'http://localhost:8888/.netlify/functions' // 或本地 Netlify dev URL
  : '/.netlify/functions';

window.CONFIG = { API_BASE_URL };









