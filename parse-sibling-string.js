/**
 * 解析手足資料字串
 * 輸入格式：小明（男, 二年級）、小美（女, 四年級）
 * 輸出：{ names: ['小明', '小美'], genders: ['男', '女'], grades: ['二年級', '四年級'] }
 */
function parseSiblingString(siblingStr) {
  // 如果是空值或「無」，返回空陣列
  if (!siblingStr || siblingStr === '無' || siblingStr.trim() === '') {
    return { names: [], genders: [], grades: [] };
  }

  const names = [];
  const genders = [];
  const grades = [];

  // 使用正則表達式找出所有符合「姓名（性別, 年級）」格式的手足
  // 支援全形和半形括號
  const pattern = /([^、，,]+?)[（(]([^,，]+?)[,，]\s*([^）)]+?)[）)]/g;
  
  let match;
  while ((match = pattern.exec(siblingStr)) !== null) {
    const [, name, gender, grade] = match;
    names.push(name.trim());
    genders.push(gender.trim());
    grades.push(grade.trim());
  }

  return { names, genders, grades };
}

// 測試範例
console.log('=== 測試手足資料解析 ===\n');

const testCases = [
  '小明（男, 二年級）、小美（女, 四年級）',
  '溫新（男, 三年級）、溫柔知（女, 大班）',
  '張小強（男, 一年級）',
  '無',
  '',
  '李大華(男,五年級)，李小華(女,三年級)',
];

testCases.forEach((test, idx) => {
  console.log(`測試 ${idx + 1}: "${test}"`);
  const result = parseSiblingString(test);
  console.log('結果:', result);
  console.log('');
});

// 匯出函數
export { parseSiblingString };
