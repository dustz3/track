// 資料庫連接配置
// 支援本地 MongoDB 和 MongoDB Atlas

const { MongoClient } = require('mongodb');

let client = null;
let db = null;

/**
 * 連接資料庫
 */
async function connectDatabase() {
  if (client && client.topology?.isConnected()) {
    return db;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailormed';
  const dbName = process.env.MONGODB_DB_NAME || 'tailormed';

  try {
    client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('✅ 已連接到資料庫:', mongoUri);
    
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error.message);
    throw error;
  }
}

/**
 * 關閉資料庫連接
 */
async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ 資料庫連接已關閉');
  }
}

/**
 * 查詢貨件資料
 */
async function findShipment(orderNo, trackingNo) {
  const database = await connectDatabase();
  const collection = database.collection('shipments');

  const shipment = await collection.findOne({
    $or: [
      { orderNo: orderNo.toUpperCase() },
      { trackingNo: trackingNo.toUpperCase() }
    ],
    $and: [
      { orderNo: orderNo.toUpperCase() },
      { trackingNo: trackingNo.toUpperCase() }
    ]
  });

  return shipment;
}

/**
 * 查詢時間軸資料
 */
async function findTimeline(trackingNo) {
  const database = await connectDatabase();
  const collection = database.collection('timeline');

  const timeline = await collection
    .find({ trackingNo: trackingNo.toUpperCase() })
    .sort({ date: 1, time: 1 })
    .toArray();

  return timeline;
}

module.exports = {
  connectDatabase,
  closeDatabase,
  findShipment,
  findTimeline,
};

