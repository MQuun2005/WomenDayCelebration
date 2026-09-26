@echo off

REM Build for GitHub Pages
ng build --configuration=production --base-href="/WomenDayCeleration/"

REM Copy 404.html to dist
copy 404.html dist\women-day-celebration\browser\
copy .nojekyll dist\women-day-celebration\browser\

echo Build completed! Ready for GitHub Pages deployment.
echo Copy contents of dist\women-day-celebration\browser\ to your GitHub Pages repository.
pause
