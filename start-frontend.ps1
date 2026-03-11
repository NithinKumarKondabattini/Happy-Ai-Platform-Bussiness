param(
  [int]$Port = 3000,
  [int]$ApiPort = 8000
)

$ErrorActionPreference = 'Stop'
Set-Location "$PSScriptRoot\frontend"

function Resolve-NodeBinary {
  $candidates = @(
    (Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
    'C:\Program Files\nodejs\node.exe',
    'C:\Program Files (x86)\nodejs\node.exe',
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "Node.js was not found. Install Node.js or add it to PATH."
}

function Resolve-NpmCommand {
  $candidates = @(
    (Get-Command npm.cmd -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
    'C:\Program Files\nodejs\npm.cmd',
    'C:\Program Files (x86)\nodejs\npm.cmd',
    "$env:LOCALAPPDATA\Programs\nodejs\npm.cmd"
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "npm.cmd was not found. Install Node.js or add it to PATH."
}

function Stop-ExistingFrontend {
  $processes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and ($_.CommandLine.Contains('dev-server.js') -or $_.CommandLine.Contains('next\\dist\\bin\\next'))
    }

  foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  }
}

try {
  $nodePath = Resolve-NodeBinary
  $npmPath = Resolve-NpmCommand
  $envLocalPath = Join-Path $PWD '.env.local'
  $envLocalContent = "NEXT_PUBLIC_API_URL=/api`r`nNEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:$ApiPort`r`n"
  [System.IO.File]::WriteAllText($envLocalPath, $envLocalContent, (New-Object System.Text.UTF8Encoding($false)))

  if (Test-Path .\.next) {
    Remove-Item .\.next -Recurse -Force -ErrorAction SilentlyContinue
  }

  Stop-ExistingFrontend

  if (!(Test-Path .\node_modules)) {
    & $npmPath install --no-audit --no-fund
  }

  if (!(Test-Path .\dev-server.js)) {
    throw "Missing frontend dev entrypoint: frontend\dev-server.js"
  }

  Write-Host "Starting frontend on http://127.0.0.1:$Port" -ForegroundColor Cyan
  $env:PORT = "$Port"
  $env:HOST = '127.0.0.1'
  & $nodePath .\dev-server.js
}
catch {
  Write-Host "Frontend failed to start: $($_.Exception.Message)" -ForegroundColor Red
  throw
}
