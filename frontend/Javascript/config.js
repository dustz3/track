// API 配置
// 自動檢測環境：如果是 localhost 使用本地 API，否則使用 Netlify Functions API
// Netlify Functions 會自動處理 /api/* 路徑，轉發到 /.netlify/functions/tracking
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8888/api'
  : '/api';

// 匯出配置
window.CONFIG = {
  API_BASE_URL
};









