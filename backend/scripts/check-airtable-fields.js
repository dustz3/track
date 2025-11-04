// 檢查 Airtable 表格的欄位名稱
// 使用方式: node scripts/check-airtable-fields.js

require('dotenv').config();
const Airtable = require('airtable');

async function checkFields() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_SHIPMENTS_TABLE || 'Shipments';
    
    if (!apiKey || !baseId) {
      console.error('❌ 請先設定 AIRTABLE_API_KEY 和 AIRTABLE_BASE_ID');
      return;
    }
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    console.log(`🔍 檢查表格: ${tableName}\n`);
    
    // 取得表格的第一筆記錄來查看欄位名稱
    const records = await base(tableName)
      .select({ maxRecords: 1 })
      .firstPage();
    
    if (records.length === 0) {
      console.log('❌ 表格中沒有記錄');
      return;
    }
    
    const record = records[0];
    const fields = record.fields;
    
    console.log('✅ 找到的欄位名稱：\n');
    Object.keys(fields).forEach(fieldName => {
      console.log(`  - ${fieldName}: ${fields[fieldName]}`);
    });
    
    console.log('\n💡 請確認您的 Job No 和 Tracking No 欄位名稱是否在上面列表中');
    
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    if (error.error === 'NOT_FOUND') {
      console.error('💡 提示: 表格名稱可能不正確，請檢查 AIRTABLE_SHIPMENTS_TABLE');
    }
  }
}

checkFields();

