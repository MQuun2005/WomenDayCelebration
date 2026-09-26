@echo off
echo ==============================================
echo   Deploying WomenDayCelebration to GitHub Pages
echo ==============================================

REM 1. Build for GitHub Pages
call npm run build -- --configuration=production --base-href="/WomenDayCelebration/"

REM 2. Copy 404.html and .nojekyll
copy /y 404.html dist\women-day-celebration\browser\
copy /y .nojekyll dist\women-day-celebration\browser\

REM 3. Deploy to gh-pages branch
git --work-tree=dist/women-day-celebration/browser checkout --orphan gh-pages
git --work-tree=dist/women-day-celebration/browser add --all
git commit -m "Deploy to GitHub Pages"
git push -f origin gh-pages
git checkout -f main

echo.
echo ==============================================
echo   Deployment Complete!
echo   Website URL: https://mquun2005.github.io/WomenDayCelebration/
echo ==============================================
pause
