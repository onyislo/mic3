#!/usr/bin/env pwsh
# Deployment script for Vercel

Write-Host "🔧 Preparing deployment to Vercel..." -ForegroundColor Blue

# Clean up any previous builds
if (Test-Path -Path "dist") {
    Write-Host "🗑️ Cleaning previous build files..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force dist
}

# Run build
Write-Host "🏗️ Building project..." -ForegroundColor Cyan
npm run build

# Verify build output
if (-not (Test-Path -Path "dist")) {
    Write-Host "❌ Build failed - no dist folder found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Magenta
vercel --prod

Write-Host "✅ Deployment process completed!" -ForegroundColor Green
