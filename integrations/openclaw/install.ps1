$ErrorActionPreference = 'Stop'

$installerUrl = 'https://openclaw.ai/install.ps1'
$gitDir = if ([string]::IsNullOrWhiteSpace($env:OPENCLAW_GIT_DIR)) {
    Join-Path $HOME '.local\share\nationalistacademy\openclaw'
} else {
    $env:OPENCLAW_GIT_DIR
}

$tempInstaller = Join-Path ([System.IO.Path]::GetTempPath()) ("openclaw-install-{0}.ps1" -f [guid]::NewGuid().ToString('N'))

try {
    Write-Host "Downloading the official OpenClaw installer..."
    Invoke-WebRequest -Uri $installerUrl -OutFile $tempInstaller

    Write-Host "Installing the Git checkout into: $gitDir"
    Write-Host "Onboarding and gateway setup are intentionally left for a separate, manual step."

    & $tempInstaller -InstallMethod git -GitDir $gitDir -NoOnboard

    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) {
        throw "OpenClaw installer failed with exit code $LASTEXITCODE."
    }

    Write-Host "Installer finished. Check the CLI in a new terminal with: openclaw --version"
}
finally {
    if (Test-Path -LiteralPath $tempInstaller) {
        Remove-Item -LiteralPath $tempInstaller -Force
    }
}
