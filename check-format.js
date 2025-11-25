import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== 檢查範本.xlsx 的手足資料格式 ===\n');

const workbook = XLSX.readFile(path.join(__dirname, '範本.xlsx'));
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

// 嘗試不同的起始列
for (let skipRows = 0; skipRows <= 5; skipRows++) {
  const data = XLSX.utils.sheet_to_json(firstSheet, { range: skipRows });
  
  if (data.length > 0) {
    const columns = Object.keys(data[0]);
    
    // 檢查是否有手足相關欄位
    const siblingColumns = columns.filter(col => 
      col.includes('手足') || col.includes('兄弟') || col.includes('姊妹')
    );
    
    if (siblingColumns.length > 0) {
      console.log(`✓ 在第 ${skipRows + 1} 列找到手足欄位`);
      console.log('手足相關欄位:', siblingColumns);
      console.log('\n前 3 筆資料的手足欄位內容：');
      
      data.slice(0, 3).forEach((row, idx) => {
        console.log(`\n--- 第 ${idx + 1} 筆 ---`);
        siblingColumns.forEach(col => {
          console.log(`${col}: ${row[col]}`);
        });
      });
      
      break;
    }
  }
}

console.log('\n=== 檢查範本2.xlsx 的期望輸出格式 ===\n');

const workbook2 = XLSX.readFile(path.join(__dirname, '範本2.xlsx'));
const firstSheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
const data2 = XLSX.utils.sheet_to_json(firstSheet2);

if (data2.length > 0) {
  const columns2 = Object.keys(data2[0]);
  console.log('所有欄位:', columns2);
  
  const siblingColumns2 = columns2.filter(col => 
    col.includes('手足') || col.includes('兄弟') || col.includes('姊妹')
  );
  
  console.log('\n手足相關欄位:', siblingColumns2);
  console.log('\n前 3 筆資料範例：');
  
  data2.slice(0, 3).forEach((row, idx) => {
    console.log(`\n--- 第 ${idx + 1} 筆 ---`);
    siblingColumns2.forEach(col => {
      console.log(`${col}: ${row[col]}`);
    });
  });
}
