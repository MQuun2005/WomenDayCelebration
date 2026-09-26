#!/bin/bash

# Build for GitHub Pages
ng build --configuration=production --base-href="/WomenDayCeleration/"

# Copy 404.html to dist
cp 404.html dist/women-day-celebration/browser/
cp .nojekyll dist/women-day-celebration/browser/

echo "Build completed! Ready for GitHub Pages deployment."
echo "Copy contents of dist/women-day-celebration/browser/ to your GitHub Pages repository."
