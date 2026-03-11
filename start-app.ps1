param(
  [int]$FrontendPort = 3000,
  [int]$BackendPort = 8000
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$backendJob = $null

function Normalize-ProcessPathEnvironment {
  $pathValue = [System.Environment]::GetEnvironmentVariable('Path', 'Process')
  $upperPathValue = [System.Environment]::GetEnvironmentVariable('PATH', 'Process')

  if (-not [string]::IsNullOrEmpty($pathValue) -and -not [string]::IsNullOrEmpty($upperPathValue)) {
    if ($upperPathValue -notin @($null, '', $pathValue)) {
      $pathValue = "$pathValue;$upperPathValue"
    }
    [System.Environment]::SetEnvironmentVariable('Path', $pathValue, 'Process')
    [System.Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
  }
}

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

function Test-PortListening {
  param([int]$Port)

  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $asyncResult = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
    $connected = $asyncResult.AsyncWaitHandle.WaitOne(1000, $false)
    if (-not $connected) {
      return $false
    }
    $client.EndConnect($asyncResult)
    return $true
  }
  catch {
    return $false
  }
  finally {
    $client.Dispose()
  }
}

try {
  Normalize-ProcessPathEnvironment
  Stop-ExistingBackend -TargetPort $BackendPort

  $backendDir = Join-Path $root 'backend'
  $pythonPath = Join-Path $backendDir '.venv\Scripts\python.exe'

  if (!(Test-Path $pythonPath)) {
    throw "Missing backend virtual environment Python at $pythonPath"
  }

  Write-Host "Starting backend on http://127.0.0.1:$BackendPort" -ForegroundColor Cyan
  $backendJob = Start-Job -ScriptBlock {
    param($TargetDir, $PythonExe, $Port)
    Set-Location $TargetDir
    & $PythonExe -m uvicorn main:app --host 127.0.0.1 --port $Port
  } -ArgumentList $backendDir, $pythonPath, $BackendPort

  $backendReady = $false
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1

    if (Test-PortListening -Port $BackendPort) {
      $backendReady = $true
      break
    }

    if ($backendJob.State -in @('Failed', 'Completed', 'Stopped')) {
      break
    }
  }

  if (-not $backendReady) {
    Write-Host 'Backend did not start successfully.' -ForegroundColor Red
    if ($backendJob) {
      Receive-Job -Job $backendJob -Keep | Out-Host
    }
    throw "Backend was not listening on port $BackendPort"
  }

  Write-Host "Backend docs: http://127.0.0.1:$BackendPort/docs" -ForegroundColor Green
  Write-Host "Starting frontend on http://127.0.0.1:$FrontendPort" -ForegroundColor Cyan
  Write-Host 'Keep this window open while using the app.' -ForegroundColor Yellow

  & (Join-Path $root 'start-frontend.ps1') -Port $FrontendPort -ApiPort $BackendPort
}
finally {
  if ($backendJob) {
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -Force -ErrorAction SilentlyContinue
  }
}
