@echo off
title Plataforma E-commerce Multi-Tenant SaaS (Producao)
cls
echo ======================================================================
echo   PLATAFORMA E-COMMERCE MULTI-TENANT (Producao / Node Nitro)
echo ======================================================================
echo.
echo   [1] Vitrine das Lojas:      http://127.0.0.1:3000
echo   [2] Painel do Lojista:      http://127.0.0.1:3000/admin
echo   [3] Painel Master Admin:    http://127.0.0.1:3000/master
echo.
echo   Credencial Master: admin@saas.com / admin123
echo   Credencial Lojista: lojista@demo.com / senha123
echo.
echo ======================================================================
set PORT=3000
set HOST=0.0.0.0
node .output/server/index.mjs
pause

