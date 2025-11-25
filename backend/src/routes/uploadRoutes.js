import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processExcelFile } from '../services/excelService.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 設定 multer 用於檔案上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 使用時間戳記避免檔名衝突
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 檔案過濾器：只接受 Excel 檔案
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('只接受 .xlsx 或 .xls 格式的檔案'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制 10MB
  }
});

/**
 * POST /api/upload
 * 上傳並處理 Excel 檔案
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '請上傳檔案' });
    }

    console.log('收到檔案:', req.file.originalname);
    
    // 取得過濾選項和排序選項
    const filterOptions = {
      hideCancelled: req.body.hideCancelled === 'true',
      hideNoNumber: req.body.hideNoNumber === 'true',
      sortBy: req.body.sortBy || 'registrationNumber'
    };
    console.log('過濾選項:', filterOptions);

    // 處理 Excel 檔案
    const outputPath = await processExcelFile(req.file.path, filterOptions);

    // 讀取處理後的檔案
    const fileBuffer = fs.readFileSync(outputPath);

    // 設定 HTTP Header 讓瀏覽器下載檔案
    const filename = `processed_${Date.now()}.xlsx`;
    const encodedFilename = encodeURIComponent('整理後的報名資料.xlsx');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Length', fileBuffer.length);

    // 傳送檔案
    res.send(fileBuffer);

    // 清理暫存檔案
    setTimeout(() => {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        console.log('已清理暫存檔案');
      } catch (err) {
        console.error('清理檔案時發生錯誤:', err);
      }
    }, 1000);

  } catch (error) {
    console.error('處理檔案時發生錯誤:', error);
    
    // 清理上傳的檔案
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: '處理檔案失敗',
      message: error.message
    });
  }
});

export default router;
