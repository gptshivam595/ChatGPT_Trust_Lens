param(
  [string]$FrontendUrl = "",
  [string]$BackendUrl = ""
)

$ErrorActionPreference = "Stop"

function Test-HttpOk {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 20

  if ($response.StatusCode -lt 200 -or $response.StatusCode -gt 299) {
    throw "$Name returned HTTP $($response.StatusCode)"
  }

  Write-Output "$Name OK: HTTP $($response.StatusCode)"
}

if (-not $FrontendUrl -and -not $BackendUrl) {
  throw "Provide -FrontendUrl, -BackendUrl, or both."
}

if ($FrontendUrl) {
  $frontend = $FrontendUrl.TrimEnd("/")
  Test-HttpOk -Url $frontend -Name "Frontend"
}

if ($BackendUrl) {
  $backend = $BackendUrl.TrimEnd("/")
  Test-HttpOk -Url "$backend/health" -Name "Backend /health"
  Test-HttpOk -Url "$backend/ready" -Name "Backend /ready"
}
