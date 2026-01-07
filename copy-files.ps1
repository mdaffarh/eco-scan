# EcoScan Migration Helper Script
# Run this script from Project/frontend directory

Write-Host "🚀 EcoScan - Copy Remaining Files Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$sourceRoot = "..\src\pages"
$targetRoot = ".\app"

# Copy Home.css
Write-Host "📄 Copying Home.css..." -ForegroundColor Yellow
Copy-Item "$sourceRoot\HomePage\Home.css" -Destination "$targetRoot\home\Home.css" -Force
Write-Host "✅ Home.css copied" -ForegroundColor Green

# Copy Scan page files
Write-Host "📄 Copying Scan page..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$targetRoot\scan" -Force | Out-Null
Copy-Item "$sourceRoot\ScanPage\Scan.jsx" -Destination "$targetRoot\scan\page.jsx" -Force
Copy-Item "$sourceRoot\ScanPage\Scan.css" -Destination "$targetRoot\scan\Scan.css" -Force
Write-Host "✅ Scan page copied" -ForegroundColor Green

# Copy Result page files
Write-Host "📄 Copying Result page..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$targetRoot\result" -Force | Out-Null
Copy-Item "$sourceRoot\ResultPage\Result.jsx" -Destination "$targetRoot\result\page.jsx" -Force
Copy-Item "$sourceRoot\ResultPage\Result.css" -Destination "$targetRoot\result\Result.css" -Force
Write-Host "✅ Result page copied" -ForegroundColor Green

# Copy About page files
Write-Host "📄 Copying About page..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$targetRoot\about" -Force | Out-Null
Copy-Item "$sourceRoot\AboutPage\About.jsx" -Destination "$targetRoot\about\page.jsx" -Force
Copy-Item "$sourceRoot\AboutPage\About.css" -Destination "$targetRoot\about\About.css" -Force
Write-Host "✅ About page copied" -ForegroundColor Green

# Copy public assets
Write-Host "📄 Copying public assets..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path ".\public" -Force | Out-Null
Copy-Item "..\public\*" -Destination ".\public\" -Recurse -Force
Write-Host "✅ Public assets copied" -ForegroundColor Green

Write-Host ""
Write-Host "✨ All files copied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to manually update these files:" -ForegroundColor Yellow
Write-Host "  1. app/scan/page.jsx - Replace React Router with Next.js Router" -ForegroundColor Yellow
Write-Host "  2. app/result/page.jsx - Replace React Router with Next.js Router" -ForegroundColor Yellow
Write-Host "  3. app/about/page.jsx - Add Navbar import and 'use client'" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm install" -ForegroundColor White
Write-Host "  2. Update the copied page.jsx files (see MIGRATION_GUIDE.md)" -ForegroundColor White
Write-Host "  3. npm run dev" -ForegroundColor White
Write-Host ""
