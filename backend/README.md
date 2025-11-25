# 後端 API 說明

## 安裝依賴

```bash
npm install
```

## 啟動服務

開發模式（自動重啟）：
```bash
npm run dev
```

正式模式：
```bash
npm start
```

## API 端點

### POST /api/upload

上傳並處理 Excel 檔案

**請求**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - file: Excel 檔案（.xlsx 或 .xls）

**回應**
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Body: 處理後的 Excel 檔案（二進位）

**錯誤回應**
```json
{
  "error": "錯誤類型",
  "message": "錯誤訊息"
}
```

## 專案結構

```
backend/
├── src/
│   ├── server.js           # 主程式，啟動 Express 伺服器
│   ├── routes/
│   │   └── uploadRoutes.js # 上傳相關路由
│   └── services/
│       └── excelService.js # Excel 處理邏輯
├── uploads/                # 暫存上傳檔案（自動建立）
└── package.json
```

## 環境變數

可選的環境變數：

- `PORT`: 伺服器埠號（預設: 3001）

建立 `.env` 檔案：
```
PORT=3001
```

## 注意事項

- 上傳的檔案會暫存在 `uploads/` 目錄
- 處理完成後會自動清理暫存檔案
- 檔案大小限制為 10MB
