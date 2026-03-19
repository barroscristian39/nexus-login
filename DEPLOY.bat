@echo off
REM Script de Deploy para Windows (Git Simples)

echo.
echo ========================================
echo  ENVIANDO PARA GITHUB
echo ========================================
echo.

cd /d "c:\Users\barro\OneDrive\Desktop\nexus-login"

echo [1/4] Verificando status...
git status

echo.
echo [2/4] Adicionando arquivos...
git add .

echo.
echo [3/4] Fazendo commit...
git commit -m "Deploy: Adicionar scripts e configuracoes"

echo.
echo [4/4] Enviando para GitHub...
git push origin main

echo.
echo ========================================
echo  CONCLUIDO!
echo ========================================
echo.
pause
