# Run ONCE from the project root:
#   powershell -ExecutionPolicy Bypass -File .\setup_frontend.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (Test-Path "$root\frontend") {
    Write-Host "frontend folder already exists - delete it first if you want to regenerate." -ForegroundColor Yellow
    exit 1
}

Write-Host "1/3 Generating Angular app (if asked about usage data, type N + Enter)..." -ForegroundColor Cyan
& ng.cmd new frontend --routing --style=css --skip-git --defaults
if ($LASTEXITCODE -ne 0) { throw "ng new failed" }

Write-Host "2/3 Copying your custom files into frontend..." -ForegroundColor Cyan
Copy-Item -Recurse -Force "$root\frontend_overlay\*" "$root\frontend\"

Write-Host "3/3 Enabling HttpClient in app.config.ts..." -ForegroundColor Cyan
$cfg = "$root\frontend\src\app\app.config.ts"
$text = Get-Content $cfg -Raw
if ($text -notmatch "provideHttpClient") {
    $text = "import { provideHttpClient } from '@angular/common/http';`r`n" + $text
    $text = $text -replace "providers:\s*\[", "providers: [`r`n    provideHttpClient(),"
    Set-Content -Path $cfg -Value $text -Encoding UTF8
}
Write-Host "Done. Frontend is ready." -ForegroundColor Green
