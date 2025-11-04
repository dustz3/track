// 本地 API 服務器 - 測試 Airtable 連接
const http = require('http');
const url = require('url');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// 載入 Airtable 模組
const { findShipment, findTimeline } = require('./database/airtable');

const PORT = process.env.PORT || 3001; // 使用 3001 避免與其他服務衝突

// 創建 HTTP 服務器
const server = http.createServer(async (req, res) => {
  // 設置 CORS 標頭
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 處理 OPTIONS 請求（CORS preflight）
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 解析 URL
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  console.log(`\n[${new Date().toISOString()}] ${req.method} ${pathname}`);

  try {
    // Health check 端點
    if (pathname === '/api/health' || pathname === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'TailorMed Local API Server',
        airtable: process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID ? 'configured' : 'not configured'
      }));
      return;
    }

    // Tracking 查詢端點
    if (pathname === '/api/tracking' || pathname === '/api/tracking-public' || pathname === '/tracking') {
      const { orderNo, trackingNo } = query;

      console.log('📋 查詢參數:', { orderNo, trackingNo });

      // 驗證參數
      if (!orderNo || !trackingNo) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Both orderNo and trackingNo are required'
        }));
        return;
      }

      // 查詢 Airtable
      console.log('🔍 開始查詢 Airtable...');
      console.log('  AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'SET' : 'NOT SET');
      console.log('  AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'NOT SET');
      console.log('  AIRTABLE_SHIPMENTS_TABLE:', process.env.AIRTABLE_SHIPMENTS_TABLE || 'NOT SET');

      try {
        const shipment = await findShipment(orderNo, trackingNo);

        if (!shipment) {
          console.log('❌ 查詢結果：找不到資料');
          res.writeHead(404);
          res.end(JSON.stringify({
            success: false,
            message: 'No record found. Please verify the tracking number.'
          }));
          return;
        }

        console.log('✅ 查詢成功！');
        console.log('  Order No:', shipment.orderNo);
        console.log('  Tracking No:', shipment.trackingNo);
        console.log('  Origin:', shipment.origin);
        console.log('  Destination:', shipment.destination);

        // 查詢 Timeline（傳遞 shipment._raw 給 findTimeline）
        const timeline = await findTimeline(trackingNo, shipment._raw || shipment);
        console.log('  Timeline 事件數:', timeline ? timeline.length : 0);

        // 返回結果（排除 _raw 欄位，避免 JSON 序列化問題）
        const { _raw, ...shipmentWithoutRaw } = shipment;
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: {
            ...shipmentWithoutRaw,
            transportType: shipment.transportType || '', // 確保包含 transportType
            timeline: (timeline || []).map((item) => ({
              step: item.step,
              title: item.title,
              time: item.time || item.date,
              status: item.status || 'pending',
              isEvent: item.isEvent || false,
              date: item.date,
              isOrderCompleted: item.isOrderCompleted || false, // 包含訂單完成狀態
            })),
          }
        }));

      } catch (error) {
        console.error('❌ 查詢錯誤:', error.message);
        console.error('Stack:', error.stack);
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          message: 'Internal server error',
          error: error.message
        }));
      }

      return;
    }

    // 404 - 找不到端點
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not found',
      message: `Endpoint ${pathname} not found`
    }));

  } catch (error) {
    console.error('❌ 服務器錯誤:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }));
  }
});

// 啟動服務器
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 本地 API 服務器已啟動');
  console.log('='.repeat(60));
  console.log(`📍 服務器地址: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Tracking API: http://localhost:${PORT}/api/tracking?orderNo=TM111755&trackingNo=VHILRDLU`);
  console.log('='.repeat(60));
  console.log('\n📋 環境變數檢查:');
  console.log('  AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? '✅ SET' : '❌ NOT SET');
  console.log('  AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || '❌ NOT SET');
  console.log('  AIRTABLE_SHIPMENTS_TABLE:', process.env.AIRTABLE_SHIPMENTS_TABLE || '❌ NOT SET');
  console.log('\n💡 按 Ctrl+C 停止服務器\n');
});

// 處理錯誤
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被佔用，請使用其他端口或停止佔用該端口的程序`);
  } else {
    console.error('❌ 服務器錯誤:', error);
  }
  process.exit(1);
});

