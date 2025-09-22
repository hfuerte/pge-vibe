#!/bin/bash

# PGE Vibe - Build and Start Script
# This script builds and starts both the Spring Boot backend and React frontend

echo "🚀 Starting PGE Vibe Application..."

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven to continue."
    exit 1
fi

# Check if Node.js/npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js to continue."
    exit 1
fi

echo "📦 Building Spring Boot backend..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd ui
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed!"
    exit 1
fi

echo "🏗️ Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# Go back to root directory
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Starting applications..."
echo "   Backend will run on: http://localhost:8181"
echo "   Frontend will run on: http://localhost:3000"
echo "   H2 Console: http://localhost:8181/h2-console"
echo ""
echo "Press Ctrl+C to stop both applications"
echo ""

# Start backend in background with Tesseract library path
echo "🔧 Starting Spring Boot backend..."
MAVEN_OPTS="-Djava.library.path=/opt/homebrew/lib:/opt/homebrew/Cellar/tesseract/5.5.1/lib" mvn spring-boot:run &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start frontend in background
echo "⚛️ Starting React frontend..."
cd ui
npm start &
FRONTEND_PID=$!

# Go back to root
cd ..

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Applications stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait