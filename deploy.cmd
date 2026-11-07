@echo off
title Deploy Lojio - Git ^& Vercel Cloud
cls
echo ======================================================================
echo   ENVIANDO ATUALIZACOES PARA DEPLOY (GitHub / Vercel)
echo ======================================================================
echo.
git add -A
git commit -m "feat: checkout transparente Mercado Pago, polling pix e correcoes de producao"
git push origin main
echo.
echo ======================================================================
echo   [OK] Deploy enviado com sucesso! O Vercel iniciara a publicacao.
echo ======================================================================
pause

