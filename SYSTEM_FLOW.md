# 系統流程說明

## 整體架構

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   使用者    │ ──────> │   前端      │ ──────> │   後端      │
│  (瀏覽器)   │ <────── │  (React)    │ <────── │  (Node.js)  │
└─────────────┘         └─────────────┘         └─────────────┘
                              │                        │
                              │                        │
                              v                        v
                        上傳 Excel              處理 Excel
                        下載結果                回傳檔案
```

## 詳細流程

### 1. 使用者上傳檔案

```
使用者操作：
1. 開啟網頁 (http://localhost:5173)
2. 點擊「選擇檔案」
3. 選擇 Excel 檔案 (.xlsx 或 .xls)
4. 點擊「上傳並處理」

前端處理：
- FileUpload 元件接收檔案
- 驗證檔案格式（只接受 .xlsx 或 .xls）
- 顯示檔案資訊（名稱、大小）
```

### 2. 前端發送請求

```javascript
// frontend/src/api/uploadApi.ts

// 建立 FormData
const formData = new FormData();
formData.append('file', file);

// 發送 POST 請求到後端
axios.post('http://localhost:3001/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  responseType: 'blob',  // 重要：告訴 axios 回應是二進位檔案
  onUploadProgress: (progressEvent) => {
    // 更新上傳進度
  }
});
```

### 3. 後端接收檔案

```javascript
// backend/src/routes/uploadRoutes.js

// 使用 multer 中介軟體接收檔案
router.post('/upload', upload.single('file'), async (req, res) => {
  // req.file 包含上傳的檔案資訊
  // 檔案暫存在 backend/uploads/ 目錄
});
```

### 4. 後端處理 Excel

```javascript
// backend/src/services/excelService.js

處理步驟：
1. 讀取 Excel 檔案
   └─> 使用 xlsx.readFile()

2. 轉換為 JSON 格式
   └─> 使用 xlsx.utils.sheet_to_json()

3. 建立家長對應表
   └─> 以「家長姓名」為 key，孩子陣列為 value
   └─> 用於快速查詢手足關係

4. 依年級分組
   └─> 遍歷所有資料
   └─> 依「年級」欄位分類
   └─> 年級為空則歸類到「未分類」

5. 為每筆資料加入手足資訊
   └─> 查詢同一家長的其他孩子
   └─> 整理手足名稱、性別、年級
   └─> 用逗號分隔多個手足

6. 建立新的 Excel 工作簿
   └─> 為每個年級建立一個分頁
   └─> 加入標題列
   └─> 寫入資料列

7. 輸出檔案
   └─> 使用 xlsx.writeFile()
   └─> 儲存到 backend/uploads/
```

### 5. 後端回傳檔案

```javascript
// 設定 HTTP Header
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition', 'attachment; filename="整理後的報名資料.xlsx"');

// 讀取檔案並回傳
const fileBuffer = fs.readFileSync(outputPath);
res.send(fileBuffer);

// 清理暫存檔案
setTimeout(() => {
  fs.unlinkSync(inputPath);   // 刪除上傳的檔案
  fs.unlinkSync(outputPath);  // 刪除處理後的檔案
}, 1000);
```

### 6. 前端接收並下載

```javascript
// frontend/src/api/uploadApi.ts

// 接收 Blob 格式的檔案
const blob = response.data;

// 建立下載連結
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = '整理後的報名資料.xlsx';

// 觸發下載
link.click();

// 清理
window.URL.revokeObjectURL(url);
```

## 資料處理邏輯

### 手足判斷演算法

```javascript
// 1. 建立家長對應表
parentMap = {
  '王大華': [
    { 兒童姓名: '王小明', 性別: '男', 年級: '三年級' },
    { 兒童姓名: '王小美', 性別: '女', 年級: '一年級' }
  ],
  '李大明': [
    { 兒童姓名: '李小華', 性別: '男', 年級: '二年級' }
  ]
}

// 2. 查詢手足
function getSiblings(currentChild, parentMap) {
  const parent = currentChild['家長姓名'];
  const allChildren = parentMap.get(parent);
  
  // 過濾掉當前孩子
  const siblings = allChildren.filter(
    child => child.兒童姓名 !== currentChild['兒童姓名']
  );
  
  return {
    names: siblings.map(s => s.兒童姓名),    // ['王小美']
    genders: siblings.map(s => s.性別),      // ['女']
    grades: siblings.map(s => s.年級)        // ['一年級']
  };
}
```

### 年級分組邏輯

```javascript
// 依年級分組
const gradeGroups = {};

rawData.forEach(item => {
  const grade = item['年級'] || '未分類';
  
  if (!gradeGroups[grade]) {
    gradeGroups[grade] = [];
  }
  
  gradeGroups[grade].push(item);
});

// 結果：
// {
//   '一年級': [...],
//   '二年級': [...],
//   '三年級': [...],
//   '未分類': [...]
// }
```

## 錯誤處理

### 前端錯誤處理

```javascript
try {
  const blob = await uploadExcelFile(file);
  // 成功
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // 伺服器回應錯誤（4xx, 5xx）
    } else if (error.request) {
      // 請求已發送但沒有回應（網路問題）
    } else {
      // 其他錯誤
    }
  }
}
```

### 後端錯誤處理

```javascript
// 檔案類型驗證
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (['.xlsx', '.xls'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('只接受 .xlsx 或 .xls 格式'), false);
  }
};

// 路由錯誤處理
try {
  const outputPath = await processExcelFile(req.file.path);
  res.send(fileBuffer);
} catch (error) {
  res.status(500).json({
    error: '處理檔案失敗',
    message: error.message
  });
}
```

## 如何新增欄位

假設要新增「學校電話」欄位：

### 1. 確保 Excel 有該欄位

```
報名序號  兒童姓名  ...  學校電話    備註
001      王小明    ...  02-12345678
```

### 2. 修改後端處理邏輯

```javascript
// backend/src/services/excelService.js

// 在 processExcelData 函數中
const headers = [
  '項次',
  '報名序號',
  // ... 其他欄位
  '學校',
  '學校電話',  // 新增
  '手足名稱',
  // ... 其他欄位
];

const rows = students.map(student => [
  student.項次,
  student.報名序號,
  // ... 其他欄位
  student.學校,
  student.學校電話,  // 新增
  student.手足名稱,
  // ... 其他欄位
]);
```

### 3. 修改資料組裝

```javascript
const processedItem = {
  項次: gradeGroups[grade].length + 1,
  報名序號: item['報名序號'] || '',
  // ... 其他欄位
  學校: item['學校'] || '',
  學校電話: item['學校電話'] || '',  // 新增
  手足名稱: siblings.names.join(', ') || '無',
  // ... 其他欄位
};
```

完成！不需要修改前端程式碼。
