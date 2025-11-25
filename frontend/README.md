# 前端應用程式說明

## 安裝依賴

```bash
npm install
```

## 啟動服務

開發模式：
```bash
npm run dev
```

建置正式版本：
```bash
npm run build
```

預覽正式版本：
```bash
npm run preview
```

## 技術棧

- **React 18**: UI 框架
- **TypeScript**: 型別安全
- **Vite**: 建置工具
- **Axios**: HTTP 請求

## 專案結構

```
frontend/
├── src/
│   ├── main.tsx              # 應用程式入口
│   ├── App.tsx               # 主元件
│   ├── App.css               # 主樣式
│   ├── index.css             # 全域樣式
│   ├── vite-env.d.ts         # Vite 型別定義
│   ├── api/
│   │   └── uploadApi.ts      # API 呼叫函數
│   └── components/
│       ├── FileUpload.tsx    # 檔案上傳元件
│       └── FileUpload.css    # 元件樣式
├── index.html                # HTML 模板
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── package.json
```

## 環境變數

可以建立 `.env` 檔案來設定 API URL：

```
VITE_API_URL=http://localhost:3001
```

如果不設定，預設會使用 `http://localhost:3001`

## 開發注意事項

- 確保後端服務已啟動在 `http://localhost:3001`
- Vite 已配置 proxy，開發時會自動轉發 `/api` 請求到後端
- 支援熱模組替換（HMR），修改程式碼會自動重新載入

## 元件說明

### FileUpload

檔案上傳元件，負責：
- 選擇 Excel 檔案
- 上傳檔案到後端
- 顯示上傳進度
- 下載處理後的檔案
- 錯誤處理

### uploadApi

API 呼叫模組，提供：
- `uploadExcelFile(file, onProgress)`: 上傳檔案
- `downloadBlob(blob, filename)`: 下載檔案
