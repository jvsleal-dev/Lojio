@echo off
title Plataforma E-commerce Multi-Tenant SaaS
cls
echo ======================================================================
echo   PLATAFORMA E-COMMERCE MULTI-TENANT (Nuxt 3 + Prisma + SQLite)
echo ======================================================================
echo.
echo   [1] Vitrine das Lojas (Storefront):
echo       http://127.0.0.1:3000
echo       - Moda Urbana:   http://127.0.0.1:3000/?tenant=modaurbana
echo       - TechZone:      http://127.0.0.1:3000/?tenant=techzone
echo       - Café Gourmet:  http://127.0.0.1:3000/?tenant=cafegourmet
echo.
echo   [2] Painel do Lojista (Merchant Admin):
echo       http://127.0.0.1:3000/admin
echo       - Login: lojista@demo.com  (senha: senha123)
echo.
echo   [3] PAINEL MASTER / SUPERADMIN (Dono da Plataforma):
echo       http://127.0.0.1:3000/master
echo       - Login: admin@saas.com    (senha: admin123)
echo.
echo ======================================================================
echo   Iniciando o servidor de desenvolvimento...
echo ======================================================================
node node_modules/nuxt/bin/nuxt.mjs dev
pause
