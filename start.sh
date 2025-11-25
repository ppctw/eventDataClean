#!/bin/bash

echo "🚀 啟動活動報名 Excel 整理系統"
echo "================================"

# 檢查是否已安裝依賴
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安裝後端依賴..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安裝前端依賴..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ 依賴已安裝完成"
echo ""
echo "🔧 啟動後端服務..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "🎨 啟動前端服務..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✅ 系統已啟動！"
echo "📍 前端: http://localhost:5173"
echo "📍 後端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服務"
echo "================================"

# 等待中斷信號
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
