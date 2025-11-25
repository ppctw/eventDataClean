import axios from 'axios';

// API 基礎 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * 上傳 Excel 檔案並取得處理後的檔案
 * @param file - 要上傳的檔案
 * @param onProgress - 上傳進度回調函數
 * @returns Promise<Blob> - 處理後的檔案 Blob
 */
export async function uploadExcelFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    // 建立 FormData 物件
    const formData = new FormData();
    formData.append('file', file);

    // 發送 POST 請求
    const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // 重要：告訴 axios 回應是二進位檔案
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    // 回傳檔案 Blob
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 處理 Axios 錯誤
      if (error.response) {
        // 伺服器回應了錯誤狀態碼
        // 如果回應是 Blob，需要先轉換成文字
        if (error.response.data instanceof Blob) {
          try {
            const text = await error.response.data.text();
            const errorData = JSON.parse(text);
            throw new Error(`上傳失敗: ${error.response.status} - ${errorData.message || errorData.error || error.response.statusText}`);
          } catch (parseError) {
            // 如果無法解析 JSON，使用預設訊息
            throw new Error(`上傳失敗: ${error.response.status} - ${error.response.statusText}`);
          }
        } else {
          throw new Error(`上傳失敗: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        // 請求已發送但沒有收到回應
        throw new Error('無法連接到伺服器，請確認後端服務是否啟動');
      } else {
        // 其他錯誤
        throw new Error(`上傳失敗: ${error.message}`);
      }
    }
    throw error;
  }
}

/**
 * 下載 Blob 檔案
 * @param blob - 要下載的 Blob
 * @param filename - 檔案名稱
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // 建立一個臨時的 URL
  const url = window.URL.createObjectURL(blob);
  
  // 建立一個隱藏的 <a> 元素
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 觸發下載
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
