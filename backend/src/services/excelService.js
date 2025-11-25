import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 處理 Excel 檔案的主函數
 * @param {string} inputPath - 輸入檔案路徑
 * @returns {Promise<string>} - 輸出檔案路徑
 */
export async function processExcelFile(inputPath) {
  try {
    // 1. 讀取 Excel 檔案
    const workbook = XLSX.readFile(inputPath);
    
    // 2. 取得第一個工作表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 3. 將工作表轉換為 JSON 格式
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`讀取到 ${rawData.length} 筆資料`);
    
    // 4. 檢查資料是否為空
    if (!rawData || rawData.length === 0) {
      throw new Error('Excel 檔案中沒有資料，請確認檔案內容');
    }
    
    // 5. 清理欄位名稱（移除換行符、空格等）並重新對應資料
    const cleanedData = rawData.map(row => {
      const cleanedRow = {};
      for (const [key, value] of Object.entries(row)) {
        // 清理欄位名稱：移除 \r\n, \n, \r 和多餘空格
        const cleanKey = key.replace(/[\r\n]+/g, '').trim();
        cleanedRow[cleanKey] = value;
      }
      return cleanedRow;
    });
    
    // 6. 檢查必要欄位並顯示可用欄位
    const firstRow = cleanedData[0];
    const availableColumns = Object.keys(firstRow);
    console.log('Excel 中的欄位（已清理）:', availableColumns);
    
    // 必要欄位列表
    const requiredColumns = ['兒童姓名', '性別', '年級', '學校', '家長姓名', '家長行動電話'];
    const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.warn('警告：缺少以下欄位:', missingColumns);
      console.warn('系統將繼續處理，但這些欄位的資料會是空值');
    }

    // 7. 處理資料：依年級分組並加入手足資訊
    const { gradeSheets, allStudents } = processExcelData(cleanedData);

    // 8. 建立新的工作簿
    const newWorkbook = XLSX.utils.book_new();

    // 9. 建立「總表」分頁（放在第一個）
    const summarySheet = createSummarySheet(allStudents);
    XLSX.utils.book_append_sheet(newWorkbook, summarySheet, '總表');
    console.log(`建立分頁: 總表, 共 ${allStudents.length} 筆資料`);

    // 10. 為每個年級建立一個工作表
    for (const [grade, students] of Object.entries(gradeSheets)) {
      // 建立工作表名稱（Excel 工作表名稱有長度限制）
      const sheetName = grade.substring(0, 31); // Excel 限制 31 字元
      
      // 將資料轉換為工作表
      const ws = XLSX.utils.aoa_to_sheet(students);
      
      // 加入到工作簿
      XLSX.utils.book_append_sheet(newWorkbook, ws, sheetName);
      
      console.log(`建立分頁: ${sheetName}, 共 ${students.length - 1} 筆資料`);
    }

    // 11. 輸出檔案
    const outputPath = path.join(__dirname, '../../uploads', `processed-${Date.now()}.xlsx`);
    XLSX.writeFile(newWorkbook, outputPath);

    console.log(`處理完成，輸出檔案: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('處理 Excel 時發生錯誤:', error);
    console.error('錯誤詳情:', error.message);
    console.error('錯誤堆疊:', error.stack);
    
    // 提供更友善的錯誤訊息
    if (error.message.includes('Cannot read')) {
      throw new Error('Excel 檔案格式錯誤或檔案損壞，請確認檔案是否正確');
    }
    throw error;
  }
}

/**
 * 處理 Excel 資料：依年級分組並加入手足資訊
 * @param {Array} rawData - 原始資料陣列
 * @returns {Object} - 包含年級分組資料和所有學生資料
 */
function processExcelData(rawData) {
  // 1. 建立家長對應表，用於判斷手足關係
  const parentMap = buildParentMap(rawData);

  // 2. 依年級分組，並收集所有處理過的學生資料
  const gradeGroups = {};
  const allStudents = []; // 收集所有學生資料

  rawData.forEach((item, index) => {
    // 取得年級，若為空則歸類到「未分類」
    const grade = item['年級'] ? String(item['年級']).trim() : '未分類';

    // 初始化該年級的陣列
    if (!gradeGroups[grade]) {
      gradeGroups[grade] = [];
    }

    // 取得手足資訊
    const siblings = getSiblings(item, parentMap);

    // 組裝該筆資料
    const processedItem = {
      項次: gradeGroups[grade].length + 1, // 年級內的項次
      報名序號: item['報名序號'] || '',
      兒童姓名: item['兒童姓名'] || '',
      性別: item['性別'] || '',
      年級: item['年級'] || '',
      學校: item['學校'] || '',
      手足名稱: siblings.names.join(', ') || '無',
      手足性別: siblings.genders.join(', ') || '無',
      手足年級: siblings.grades.join(', ') || '無',
      家長姓名: item['家長姓名'] || '',
      家長行動電話: item['家長行動電話'] || '',
      備註: item['備註'] || ''
    };

    gradeGroups[grade].push(processedItem);
    allStudents.push(processedItem); // 加入到總表
  });

  // 3. 將每個年級的資料轉換為二維陣列格式（用於 Excel 輸出）
  const gradeSheets = {};

  for (const [grade, students] of Object.entries(gradeGroups)) {
    // 建立標題列
    const headers = [
      '項次',
      '報名序號',
      '兒童姓名',
      '性別',
      '年級',
      '學校',
      '手足名稱',
      '手足性別',
      '手足年級',
      '家長姓名',
      '家長行動電話',
      '備註'
    ];

    // 建立資料列
    const rows = students.map(student => [
      student.項次,
      student.報名序號,
      student.兒童姓名,
      student.性別,
      student.年級,
      student.學校,
      student.手足名稱,
      student.手足性別,
      student.手足年級,
      student.家長姓名,
      student.家長行動電話,
      student.備註
    ]);

    // 合併標題列和資料列
    gradeSheets[grade] = [headers, ...rows];
  }

  return { gradeSheets, allStudents };
}

/**
 * 建立總表分頁
 * 將所有學生資料依報名序號排序
 * @param {Array} allStudents - 所有學生資料
 * @returns {Object} - Excel 工作表物件
 */
function createSummarySheet(allStudents) {
  // 1. 依報名序號排序（正排序）
  const sortedStudents = [...allStudents].sort((a, b) => {
    const numA = parseInt(a.報名序號) || 0;
    const numB = parseInt(b.報名序號) || 0;
    return numA - numB;
  });

  // 2. 重新編號項次
  const studentsWithNewIndex = sortedStudents.map((student, index) => ({
    ...student,
    項次: index + 1 // 總表的項次從 1 開始
  }));

  // 3. 建立標題列
  const headers = [
    '項次',
    '報名序號',
    '兒童姓名',
    '性別',
    '年級',
    '學校',
    '手足名稱',
    '手足性別',
    '手足年級',
    '家長姓名',
    '家長行動電話',
    '備註'
  ];

  // 4. 建立資料列
  const rows = studentsWithNewIndex.map(student => [
    student.項次,
    student.報名序號,
    student.兒童姓名,
    student.性別,
    student.年級,
    student.學校,
    student.手足名稱,
    student.手足性別,
    student.手足年級,
    student.家長姓名,
    student.家長行動電話,
    student.備註
  ]);

  // 5. 合併標題列和資料列，轉換為工作表
  const sheetData = [headers, ...rows];
  return XLSX.utils.aoa_to_sheet(sheetData);
}

/**
 * 建立家長對應表
 * 用於快速查詢同一個家長的所有孩子
 * @param {Array} rawData - 原始資料
 * @returns {Map} - 家長姓名 -> 孩子陣列的對應表
 */
function buildParentMap(rawData) {
  const parentMap = new Map();

  rawData.forEach(item => {
    const parentName = item['家長姓名'];
    
    // 若家長姓名為空，則跳過
    if (!parentName || String(parentName).trim() === '') {
      return;
    }

    const trimmedParentName = String(parentName).trim();

    // 初始化該家長的孩子陣列
    if (!parentMap.has(trimmedParentName)) {
      parentMap.set(trimmedParentName, []);
    }

    // 加入孩子資訊
    parentMap.get(trimmedParentName).push({
      兒童姓名: item['兒童姓名'] || '',
      性別: item['性別'] || '',
      年級: item['年級'] || ''
    });
  });

  return parentMap;
}

/**
 * 取得某個孩子的手足資訊
 * @param {Object} currentChild - 當前孩子的資料
 * @param {Map} parentMap - 家長對應表
 * @returns {Object} - 手足資訊 { names: [], genders: [], grades: [] }
 */
function getSiblings(currentChild, parentMap) {
  const parentName = currentChild['家長姓名'];
  const currentChildName = currentChild['兒童姓名'];

  // 若家長姓名為空，則無手足
  if (!parentName || String(parentName).trim() === '') {
    return { names: [], genders: [], grades: [] };
  }

  const trimmedParentName = String(parentName).trim();
  const allChildren = parentMap.get(trimmedParentName) || [];

  // 過濾掉當前孩子，剩下的就是手足
  const siblings = allChildren.filter(child => child.兒童姓名 !== currentChildName);

  // 整理手足資訊
  const names = siblings.map(s => s.兒童姓名);
  const genders = siblings.map(s => s.性別);
  const grades = siblings.map(s => s.年級);

  return { names, genders, grades };
}
