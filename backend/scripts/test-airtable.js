// Airtable 測試腳本
// 使用方式: node scripts/test-airtable.js [JobNo] [TrackingNo]

require('dotenv').config();
const { findShipment, findTimeline, testConnection } = require('../database/airtable');

async function testAirtable() {
  try {
    console.log('🔍 開始測試 Airtable 連接...\n');

    // 測試連接
    const connected = await testConnection();
    if (!connected) {
      console.log('\n❌ 無法連接到 Airtable');
      console.log('💡 請確認以下設定：');
      console.log('   1. AIRTABLE_API_KEY 已設定');
      console.log('   2. AIRTABLE_BASE_ID 已設定');
      console.log('   3. API Key 有正確的權限');
      return;
    }

    // 測試查詢
    const testOrderNo = process.argv[2] || process.env.TEST_ORDER_NO || 'TM111682';
    const testTrackingNo = process.argv[3] || process.env.TEST_TRACKING_NO || 'GEXVC2YF';

    console.log(`\n📦 查詢貨件: Job No.=${testOrderNo}, Tracking No.=${testTrackingNo}\n`);

    // 查詢貨件
    const shipment = await findShipment(testOrderNo, testTrackingNo);
    
    if (shipment) {
      console.log('✅ 找到貨件資料:');
      console.log(JSON.stringify(shipment, null, 2));
    } else {
      console.log('❌ 找不到貨件資料');
      console.log('💡 提示: 請確認 Airtable 中是否有對應的記錄');
      console.log(`   Job No.: ${testOrderNo}`);
      console.log(`   Tracking No.: ${testTrackingNo}`);
    }

    // 查詢時間軸
    const timeline = await findTimeline(testTrackingNo);
    if (timeline && timeline.length > 0) {
      console.log('\n✅ 找到時間軸資料:');
      console.log(JSON.stringify(timeline, null, 2));
    } else {
      console.log('\n❌ 找不到時間軸資料');
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error('\n💡 提示:');
    console.error('1. 確認 .env 檔案已設定 AIRTABLE_API_KEY 和 AIRTABLE_BASE_ID');
    console.error('2. 確認 Airtable Base 中的表格名稱正確');
    console.error('3. 確認欄位名稱與程式碼中的欄位名稱匹配');
  }
}

testAirtable();

