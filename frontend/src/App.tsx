import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📊 活動報名 Excel 整理系統</h1>
          <p className="subtitle">上傳報名資料，自動依年級分組並整理手足關係</p>
        </header>
        
        <FileUpload />

        <footer className="footer">
          <div className="info-section">
            <h3>📋 系統說明</h3>
            <ul>
              <li>上傳包含報名資料的 Excel 檔案（.xlsx 或 .xls）</li>
              <li>系統會自動依「年級」分組，每個年級建立一個分頁</li>
              <li>自動判斷手足關係（依據家長姓名）</li>
              <li>輸出整理後的 Excel 檔案供下載</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>📝 必要欄位</h3>
            <div className="fields-grid">
              <span className="field-tag">報名序號</span>
              <span className="field-tag">兒童姓名</span>
              <span className="field-tag">性別</span>
              <span className="field-tag">年級</span>
              <span className="field-tag">學校</span>
              <span className="field-tag">家長姓名</span>
              <span className="field-tag">家長行動電話</span>
              <span className="field-tag">備註</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
