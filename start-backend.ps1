param(
  [int]$Port = 8000
)

$ErrorActionPreference = 'Stop'
Set-Location "$PSScriptRoot\backend"

function Stop-ExistingBackend {
  param([int]$TargetPort)

  $processes = Get-CimInstance Win32_Process -Filter "Name = 'python.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.CommandLine.Contains('uvicorn main:app') -and
      $_.CommandLine.Contains("--port $TargetPort")
    }

  foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  }
}

try {
  $pythonPath = Join-Path $PWD '.venv\Scripts\python.exe'
  if (!(Test-Path $pythonPath)) {
    throw "Missing backend virtual environment Python at $pythonPath"
  }

  Stop-ExistingBackend -TargetPort $Port

  Write-Host "Starting backend on http://127.0.0.1:$Port" -ForegroundColor Cyan
  & $pythonPath -m uvicorn main:app --host 127.0.0.1 --port $Port
}
catch {
  Write-Host "Backend failed to start: $($_.Exception.Message)" -ForegroundColor Red
  throw
}