#!/bin/bash

echo '正在检验代码风格...'
pnpm exec tsc
echo '正在构建Web页面...'
pnpm exec vite build
echo '正在构建应用...'
pnpm exec electron-builder
