@echo off
echo ==============================================
echo   Deploying WomenDayCelebration to GitHub Pages
echo ==============================================

REM 1. Get current git remote
for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i

REM 2. Build for GitHub Pages
call npm run build -- --configuration=production --base-href="/WomenDayCelebration/"

REM 3. Copy 404.html and .nojekyll
copy /y 404.html dist\women-day-celebration\browser\
copy /y .nojekyll dist\women-day-celebration\browser\

REM 4. Deploy isolated dist to gh-pages branch
cd dist\women-day-celebration\browser
git init
git add -A
git commit -m "Deploy WomenDayCelebration to GitHub Pages"
git remote add origin %REMOTE_URL% 2>nul
git push -f origin master:gh-pages
cd ..\..\..

echo.
echo ==============================================
echo   Deployment Complete!
echo   Website URL: https://mquun2005.github.io/WomenDayCelebration/
echo ==============================================
pause
