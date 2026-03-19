# Script para adicionar variáveis ao Vercel
Set-Location "c:\Users\barro\OneDrive\Desktop\nexus-login"

$vars = @{
    'DATABASE_URL' = 'postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    'DIRECT_URL' = 'postgresql://neondb_owner:npg_GU96HpKPCNSv@ep-restless-poetry-ac9f475c.sa-east-1.aws.neon.tech/neondb?sslmode=require'
    'JWT_SECRET' = 'nexus_prod_secret_key_2026'
}

foreach ($var in $vars.GetEnumerator()) {
    Write-Host "Adding $($var.Key)..."
    # Pipe the value directly to vercel env add
    $var.Value | & vercel env add $var.Key production --force 2>&1
    Start-Sleep -Seconds 2
}

Write-Host "Done! All env vars added to Vercel."
Write-Host "Now redeploying..."
& vercel --prod --force 2>&1
