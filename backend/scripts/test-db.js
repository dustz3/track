// 本地資料庫測試腳本
// 使用方式: node scripts/test-db.js

require('dotenv').config();
const { connectDatabase, closeDatabase, findShipment, findTimeline } = require('../database/connection');

async function testDatabase() {
  try {
    console.log('🔍 開始測試資料庫連接...\n');

    // 連接資料庫
    await connectDatabase();
    console.log('✅ 資料庫連接成功\n');

    // 測試查詢
    const testOrderNo = process.argv[2] || 'TM111682';
    const testTrackingNo = process.argv[3] || 'GEXVC2YF';

    console.log(`📦 查詢貨件: Order No.=${testOrderNo}, Tracking No.=${testTrackingNo}\n`);

    // 查詢貨件
    const shipment = await findShipment(testOrderNo, testTrackingNo);
    
    if (shipment) {
      console.log('✅ 找到貨件資料:');
      console.log(JSON.stringify(shipment, null, 2));
    } else {
      console.log('❌ 找不到貨件資料');
      console.log('💡 提示: 請確認資料庫中是否有對應的記錄');
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
    console.error('1. 確認 MongoDB 正在運行');
    console.error('2. 確認 MONGODB_URI 環境變數設定正確');
    console.error('3. 本地測試: mongodb://localhost:27017/tailormed');
    console.error('4. MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/');
  } finally {
    await closeDatabase();
  }
}

testDatabase();

