# Quick Deployment Script for ClearMargin Blog

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ClearMargin Blog - Deployment Prep" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository at: https://github.com/new" -ForegroundColor White
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit - ClearMargin Blog'" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Go to: https://vercel.com/new" -ForegroundColor Cyan
Write-Host "   - Import your GitHub repository" -ForegroundColor Cyan
Write-Host "   - Add environment variables:" -ForegroundColor Cyan
Write-Host "     * NEXTAUTH_URL=https://your-app.vercel.app" -ForegroundColor Yellow
Write-Host "     * NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>" -ForegroundColor Yellow
Write-Host "     * DATABASE_URL=file:./prod.db" -ForegroundColor Yellow
Write-Host ""
Write-Host "For Turso (recommended):" -ForegroundColor Cyan
Write-Host "   - Install Turso CLI: irm https://get.tur.so/install.ps1 | iex" -ForegroundColor Yellow
Write-Host "   - Create database: turso db create clearmargin-blog" -ForegroundColor Yellow
Write-Host "   - Get URL: turso db show clearmargin-blog --url" -ForegroundColor Yellow
Write-Host "   - Get token: turso db tokens create clearmargin-blog" -ForegroundColor Yellow
Write-Host "   - Install packages: npm install @libsql/client @prisma/adapter-libsql" -ForegroundColor Yellow
Write-Host ""
Write-Host "See DEPLOYMENT-GUIDE.md for detailed instructions!" -ForegroundColor Green
Write-Host ""
