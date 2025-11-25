# 專案總覽

## 📁 專案結構

```
eventCheckIn_ppc/
│
├── 📄 README.md                    # 主要說明文件
├── 📄 QUICKSTART.md                # 快速啟動指南
├── 📄 EXAMPLE_DATA.md              # Excel 範例資料格式
├── 📄 SYSTEM_FLOW.md               # 系統流程詳細說明
├── 📄 PROJECT_OVERVIEW.md          # 本文件
├── 🔧 start.sh                     # 快速啟動腳本
│
├── 📂 backend/                     # 後端程式碼
│   ├── 📄 README.md                # 後端說明文件
│   ├── 📄 package.json             # 後端依賴配置
│   ├── 📄 .gitignore               # Git 忽略檔案
│   ├── 📂 src/
│   │   ├── 📄 server.js            # Express 伺服器主程式
│   │   ├── 📂 routes/
│   │   │   └── 📄 uploadRoutes.js  # 上傳 API 路由
│   │   └── 📂 services/
│   │       └── 📄 excelService.js  # Excel 處理邏輯
│   └── 📂 uploads/                 # 暫存目錄（自動建立）
│
└── 📂 frontend/                    # 前端程式碼
    ├── 📄 README.md                # 前端說明文件
    ├── 📄 package.json             # 前端依賴配置
    ├── 📄 .gitignore               # Git 忽略檔案
    ├── 📄 index.html               # HTML 模板
    ├── 📄 vite.config.ts           # Vite 配置
    ├── 📄 tsconfig.json            # TypeScript 配置
    ├── 📄 tsconfig.node.json       # Node TypeScript 配置
    └── 📂 src/
        ├── 📄 main.tsx             # React 入口
        ├── 📄 App.tsx              # 主元件
        ├── 📄 App.css              # 主樣式
        ├── 📄 index.css            # 全域樣式
        ├── 📄 vite-env.d.ts        # Vite 型別定義
        ├── 📂 api/
        │   └── 📄 uploadApi.ts     # API 呼叫函數
        └── 📂 components/
            ├── 📄 FileUpload.tsx   # 檔案上傳元件
            └── 📄 FileUpload.css   # 元件樣式
```

## 🎯 核心功能

### 1. 檔案上傳
- 支援 .xlsx 和 .xls 格式
- 檔案大小限制 10MB
- 即時上傳進度顯示

### 2. 資料處理
- 自動依「年級」分組
- 每個年級建立獨立分頁
- 自動判斷手足關係（依家長姓名）
- 整理手足資訊（名稱、性別、年級）

### 3. 檔案下載
- 自動下載處理後的 Excel
- 包含所有年級分頁
- 完整的手足資訊

## 🔧 技術棧

### 後端
- **Node.js**: JavaScript 執行環境
- **Express**: Web 框架
- **Multer**: 檔案上傳中介軟體
- **xlsx**: Excel 檔案處理
- **CORS**: 跨域資源共享

### 前端
- **React 18**: UI 框架
- **TypeScript**: 型別安全
- **Vite**: 快速建置工具
- **Axios**: HTTP 請求庫

## 📊 資料流程

```
1. 使用者上傳 Excel
   ↓
2. 前端驗證檔案格式
   ↓
3. 發送到後端 API
   ↓
4. 後端讀取 Excel
   ↓
5. 轉換為 JSON 格式
   ↓
6. 建立家長對應表
   ↓
7. 依年級分組資料
   ↓
8. 為每筆資料加入手足資訊
   ↓
9. 建立新的 Excel 工作簿
   ↓
10. 為每個年級建立分頁
   ↓
11. 回傳處理後的檔案
   ↓
12. 前端觸發下載
```

## 📝 輸入輸出格式

### 輸入欄位
- 報名序號
- 兒童姓名
- 性別
- 年級
- 學校
- 家長姓名
- 家長行動電話
- 備註

### 輸出欄位（每個年級分頁）
- 項次（該年級內的流水號）
- 報名序號
- 兒童姓名
- 性別
- 年級
- 學校
- **手足名稱**（新增）
- **手足性別**（新增）
- **手足年級**（新增）
- 家長姓名
- 家長行動電話
- 備註

## 🚀 快速開始

### 第一次使用

```bash
# 1. 安裝後端依賴
cd backend
npm install

# 2. 安裝前端依賴
cd ../frontend
npm install
```

### 啟動系統

**方法一：使用啟動腳本**
```bash
chmod +x start.sh
./start.sh
```

**方法二：分別啟動**

終端機 1：
```bash
cd backend
npm run dev
```

終端機 2：
```bash
cd frontend
npm run dev
```

### 訪問系統

- 前端：http://localhost:5173
- 後端：http://localhost:3001

## 📖 文件導覽

| 文件 | 說明 |
|------|------|
| `README.md` | 專案主要說明，包含安裝與使用方式 |
| `QUICKSTART.md` | 快速啟動指南，適合第一次使用 |
| `EXAMPLE_DATA.md` | Excel 範例資料格式與說明 |
| `SYSTEM_FLOW.md` | 系統流程詳細說明，包含程式碼範例 |
| `backend/README.md` | 後端 API 說明 |
| `frontend/README.md` | 前端應用程式說明 |

## 🔍 關鍵程式碼位置

### 後端

| 檔案 | 說明 |
|------|------|
| `backend/src/server.js` | Express 伺服器設定 |
| `backend/src/routes/uploadRoutes.js` | 檔案上傳 API 路由 |
| `backend/src/services/excelService.js` | Excel 處理核心邏輯 |

### 前端

| 檔案 | 說明 |
|------|------|
| `frontend/src/App.tsx` | 主應用程式元件 |
| `frontend/src/components/FileUpload.tsx` | 檔案上傳元件 |
| `frontend/src/api/uploadApi.ts` | API 呼叫函數 |

## 🛠️ 自訂與擴充

### 新增欄位

如果要新增欄位（例如：學校電話），只需修改：

1. **確保 Excel 有該欄位**
2. **修改 `backend/src/services/excelService.js`**
   - 在 `headers` 陣列中加入新欄位名稱
   - 在 `processedItem` 物件中加入新欄位
   - 在 `rows` 陣列中加入新欄位值

詳細說明請參考 `SYSTEM_FLOW.md` 的「如何新增欄位」章節。

### 修改樣式

- 主題色彩：修改 `frontend/src/index.css` 和 `frontend/src/App.css`
- 元件樣式：修改 `frontend/src/components/FileUpload.css`

### 調整檔案大小限制

修改 `backend/src/routes/uploadRoutes.js`：

```javascript
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 改為 20MB
  }
});
```

## ⚠️ 注意事項

1. **欄位名稱必須完全一致**：系統依照欄位名稱讀取資料
2. **家長姓名用於判斷手足**：相同家長姓名視為同一家庭
3. **年級為空會歸類到「未分類」**：建議確保年級欄位有值
4. **暫存檔案會自動清理**：處理完成後會刪除暫存檔案
5. **支援多個手足**：手足資訊會用逗號分隔

## 🐛 常見問題

### Q: 前端無法連接後端？
**A**: 確認後端已啟動在 `http://localhost:3001`，可訪問 `http://localhost:3001/health` 檢查

### Q: 上傳失敗？
**A**: 
- 檢查檔案格式（.xlsx 或 .xls）
- 確認檔案包含所有必要欄位
- 檢查檔案大小是否超過 10MB

### Q: 手足資訊不正確？
**A**: 確認「家長姓名」欄位是否正確填寫，系統依此判斷手足關係

### Q: 某些資料沒有出現在輸出檔案？
**A**: 檢查「年級」欄位，為空的資料會在「未分類」分頁

## 📄 授權

MIT License

## 👨‍💻 開發者

如需協助或有任何問題，請參考各文件或查看程式碼註解。
