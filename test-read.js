import XLSX from 'xlsx';

console.log('=== 讀取範本.xlsx ===');
const workbook1 = XLSX.readFile('/Users/jo/eventDataClean/範本.xlsx');
console.log('工作表名稱:', workbook1.SheetNames);

const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
const data1 = XLSX.utils.sheet_to_json(sheet1);
console.log('資料筆數:', data1.length);
console.log('第一筆資料的欄位:', Object.keys(data1[0]));
console.log('第一筆資料內容:', data1[0]);

console.log('\n=== 讀取範本2.xlsx ===');
const workbook2 = XLSX.readFile('/Users/jo/eventDataClean/範本2.xlsx');
console.log('工作表名稱:', workbook2.SheetNames);

const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
const data2 = XLSX.utils.sheet_to_json(sheet2);
console.log('資料筆數:', data2.length);
console.log('第一筆資料的欄位:', Object.keys(data2[0]));
console.log('第一筆資料內容:', data2[0]);
