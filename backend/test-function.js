// 測試 Netlify Function 執行環境
const path = require('path');
const fs = require('fs');

// 模擬 Netlify Function 的環境變數載入
function loadEnvVars() {
  const envPaths = [
    path.resolve(__dirname, '.env'), // backend/.env
    path.resolve(__dirname, '../../../../.env'), // repository root/.env
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log('✅ 已載入 .env 檔案:', envPath);
      return;
    }
  }
  console.log('⚠️ 未找到 .env 檔案');
}

// 載入環境變數
loadEnvVars();

console.log('\n📋 環境變數檢查:');
console.log(
  'AIRTABLE_API_KEY:',
  process.env.AIRTABLE_API_KEY
    ? 'SET (' + process.env.AIRTABLE_API_KEY.substring(0, 15) + '...)'
    : 'NOT SET'
);
console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'NOT SET');
console.log(
  'AIRTABLE_SHIPMENTS_TABLE:',
  process.env.AIRTABLE_SHIPMENTS_TABLE || 'NOT SET'
);

// 測試載入 Airtable 模組
console.log('\n📦 測試載入 Airtable 模組...');
const airtablePath = path.resolve(__dirname, 'database/airtable');
console.log('Module path:', airtablePath);
console.log('Module exists:', fs.existsSync(airtablePath + '.js'));

try {
  delete require.cache[require.resolve(airtablePath)];
  const airtableConnection = require(airtablePath);
  console.log('✅ Airtable 模組載入成功');
  console.log('Functions:', Object.keys(airtableConnection));

  // 測試查詢
  console.log('\n🔍 測試查詢...');
  (async () => {
    try {
      const { findShipment } = airtableConnection;
      const shipment = await findShipment('TM111755', 'VHILRDLU');
      if (shipment) {
        console.log('✅ 查詢成功！');
        console.log('Order No:', shipment.orderNo);
        console.log('Tracking No:', shipment.trackingNo);
        console.log('Origin:', shipment.origin);
        console.log('Destination:', shipment.destination);
      } else {
        console.log('❌ 查詢失敗：找不到資料');
      }
    } catch (error) {
      console.error('❌ 查詢錯誤:', error.message);
      console.error('Stack:', error.stack);
    }
  })();
} catch (error) {
  console.error('❌ 模組載入失敗:', error.message);
  console.error('Stack:', error.stack);
}
