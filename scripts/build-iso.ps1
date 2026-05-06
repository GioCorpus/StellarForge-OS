# STELLARFORGE: PowerShell ISO generation script for Dyson Swarm OS
# Author: Giovanny Anthony Corpus Bernal
# Year: 2026

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("build", "clean", "help")]
    [string]$Action = "build"
)

# Configuration variables
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$IsoName = "stellarforge-os"
$IsoVersion = "1.0.0"
$OutputDir = Join-Path $ProjectRoot "build"
$IsoOutput = Join-Path $OutputDir "${IsoName}-${IsoVersion}.iso"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

# Logging functions
function Write-LogInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Check dependencies
function Test-Dependencies {
    Write-LogInfo "Checking dependencies..."
    
    $requiredTools = @("git", "python", "node", "npm")
    $missingTools = @()
    
    foreach ($tool in $requiredTools) {
        try {
            $null = Get-Command $tool -ErrorAction Stop
        }
        catch {
            $missingTools += $tool
        }
    }
    
    if ($missingTools.Count -gt 0) {
        Write-LogError "Missing dependencies: $($missingTools -join ', ')"
        Write-LogInfo "Please install missing tools and try again"
        exit 1
    }
    
    Write-LogSuccess "All dependencies found"
}

# Create build directory structure
function Initialize-BuildDirectories {
    Write-LogInfo "Setting up build directories..."
    
    $directories = @(
        $OutputDir,
        (Join-Path $ProjectRoot "iso\profile"),
        (Join-Path $ProjectRoot "iso\work"),
        (Join-Path $ProjectRoot "iso\out")
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-LogSuccess "Build directories created"
}

# Generate Windows-specific build configuration
function New-WindowsBuildConfig {
    Write-LogInfo "Generating Windows build configuration..."
    
    $profileDir = Join-Path $ProjectRoot "iso\profile"
    
    # Create build configuration
    $config = @{
        name = $IsoName
        version = $IsoVersion
        description = "StellarForge OS - Dyson Swarm Control System"
        author = "GioCorpus"
        build_date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        output_dir = $OutputDir
    }
    
    $config | ConvertTo-Json | Out-File -FilePath (Join-Path $profileDir "build.json") -Encoding UTF8
    
    Write-LogSuccess "Windows build configuration generated"
}

# Generate project structure for ISO
function New-IsoStructure {
    Write-LogInfo "Generating ISO project structure..."
    
    $isoStructureDir = Join-Path $ProjectRoot "iso\stellarforge"
    
    # Create directory structure
    $directories = @(
        "kernel",
        "quantum",
        "api",
        "dashboard",
        "scripts",
        "docs",
        "config"
    )
    
    foreach ($dir in $directories) {
        $fullPath = Join-Path $isoStructureDir $dir
        if (-not (Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        }
    }
    
    # Copy project files
    $sourceDirs = @("kernel", "quantum", "api", "dashboard")
    foreach ($dir in $sourceDirs) {
        $source = Join-Path $ProjectRoot $dir
        $destination = Join-Path $isoStructureDir $dir
        
        if (Test-Path $source) {
            Copy-Item -Path $source -Destination $destination -Recurse -Force
        }
    }
    
    Write-LogSuccess "ISO project structure generated"
}

# Generate installation scripts
function New-InstallationScripts {
    Write-LogInfo "Generating installation scripts..."
    
    $isoStructureDir = Join-Path $ProjectRoot "iso\stellarforge"
    
    # Generate install.bat for Windows
    $installBat = @"
@echo off
REM STELLARFORGE: Windows installation script for Dyson Swarm OS
REM Author: Giovanny Anthony Corpus Bernal
REM Year: 2026

echo ==========================================
echo StellarForge OS Installation
echo Dyson Swarm Control System
echo ==========================================
echo.

REM Check administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Administrator privileges required
    pause
    exit /b 1
)

echo Installing StellarForge OS components...
echo.

REM Install Rust
echo [1/6] Installing Rust...
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
call "%USERPROFILE%\.cargo\env.bat"

REM Install Python dependencies
echo [2/6] Installing Python dependencies...
pip install qiskit numpy scipy matplotlib flask flask-socketio pydantic

REM Install Node.js dependencies
echo [3/6] Installing Node.js dependencies...
cd /d "%~dp0dashboard"
npm install

REM Build kernel
echo [4/6] Building StellarForge kernel...
cd /d "%~dp0kernel"
cargo build --release

REM Set up services
echo [5/6] Setting up services...
sc create StellarForgeKernel binPath= "%~dp0kernel\target\release\stellarforge-kernel.exe"
sc create StellarForgeQuantum binPath= "python.exe %~dp0quantum\main.py"
sc create StellarForgeAPI binPath= "python.exe %~dp0api\app.py"
sc create StellarForgeDashboard binPath= "node.exe %~dp0dashboard\src\index.js"

REM Configure firewall
echo [6/6] Configuring firewall...
netsh advfirewall firewall add rule name="StellarForge API" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="StellarForge Dashboard" dir=in action=allow protocol=TCP localport=3000

echo.
echo ==========================================
echo Installation completed successfully!
echo ==========================================
echo.
echo Access points:
echo   Dashboard: http://localhost:3000
echo   API: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
"@
    
    $installBat | Out-File -FilePath (Join-Path $isoStructureDir "install.bat") -Encoding ASCII
    
    # Generate install.sh for Linux
    $installSh = @"
#!/bin/bash
# STELLARFORGE: Linux installation script for Dyson Swarm OS
# Author: Giovanny Anthony Corpus Bernal
# Year: 2026

set -euo pipefail

echo "=========================================="
echo "StellarForge OS Installation"
echo "Dyson Swarm Control System"
echo "=========================================="
echo

# Check root privileges
if [[ $EUID -ne 0 ]]; then
    echo "ERROR: Root privileges required"
    exit 1
fi

echo "Installing StellarForge OS components..."
echo

# Install system dependencies
echo "[1/8] Installing system dependencies..."
apt-get update
apt-get install -y curl build-essential python3 python3-pip nodejs npm rustc cargo

# Install Rust toolchain
echo "[2/8] Installing Rust toolchain..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

# Install Python dependencies
echo "[3/8] Installing Python dependencies..."
pip3 install qiskit numpy scipy matplotlib flask flask-socketio pydantic

# Install Node.js dependencies
echo "[4/8] Installing Node.js dependencies..."
cd dashboard && npm install && cd ..

# Build kernel
echo "[5/8] Building StellarForge kernel..."
cd kernel && cargo build --release && cd ..

# Create stellarforge user
echo "[6/8] Creating stellarforge user..."
useradd -m -s /bin/bash stellarforge
echo "stellarforge:stellarforge" | chpasswd

# Set up services
echo "[7/8] Setting up services..."
cp scripts/*.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable stellarforge-kernel
systemctl enable stellarforge-quantum
systemctl enable stellarforge-api
systemctl enable stellarforge-dashboard

# Configure firewall
echo "[8/8] Configuring firewall..."
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 5000/tcp

echo
echo "=========================================="
echo "Installation completed successfully!"
echo "=========================================="
echo
echo "Access points:"
echo "  Dashboard: http://localhost:3000"
echo "  API: http://localhost:5000"
echo
echo "Services have been enabled and will start on boot."
"@
    
    $installSh | Out-File -FilePath (Join-Path $isoStructureDir "install.sh") -Encoding UTF8
    
    Write-LogSuccess "Installation scripts generated"
}

# Generate systemd service files
function New-ServiceFiles {
    Write-LogInfo "Generating systemd service files..."
    
    $scriptsDir = Join-Path $ProjectRoot "scripts"
    
    # StellarForge kernel service
    $kernelService = @"
[Unit]
Description=StellarForge OS Kernel Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/stellarforge/kernel
ExecStart=/opt/stellarforge/kernel/target/release/stellarforge-kernel
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
"@
    
    $kernelService | Out-File -FilePath (Join-Path $scriptsDir "stellarforge-kernel.service") -Encoding UTF8
    
    # StellarForge quantum service
    $quantumService = @"
[Unit]
Description=StellarForge Quantum Processing Service
After=network.target stellarforge-kernel.service

[Service]
Type=simple
User=stellarforge
WorkingDirectory=/opt/stellarforge/quantum
ExecStart=/usr/bin/python3 -m stellarforge.quantum
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
"@
    
    $quantumService | Out-File -FilePath (Join-Path $scriptsDir "stellarforge-quantum.service") -Encoding UTF8
    
    # StellarForge API service
    $apiService = @"
[Unit]
Description=StellarForge API Service
After=network.target stellarforge-quantum.service

[Service]
Type=simple
User=stellarforge
WorkingDirectory=/opt/stellarforge/api
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
"@
    
    $apiService | Out-File -FilePath (Join-Path $scriptsDir "stellarforge-api.service") -Encoding UTF8
    
    # StellarForge dashboard service
    $dashboardService = @"
[Unit]
Description=StellarForge Dashboard Service
After=network.target stellarforge-api.service

[Service]
Type=simple
User=stellarforge
WorkingDirectory=/opt/stellarforge/dashboard
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
"@
    
    $dashboardService | Out-File -FilePath (Join-Path $scriptsDir "stellarforge-dashboard.service") -Encoding UTF8
    
    Write-LogSuccess "Systemd service files generated"
}

# Create ISO using PowerShell
function New-IsoImage {
    Write-LogInfo "Creating ISO image..."
    
    try {
        # Check if Windows ADK is available for ISO creation
        $adkPath = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows Kits\Installed Roots" -ErrorAction SilentlyContinue
        
        if ($adkPath) {
            Write-LogInfo "Using Windows ADK for ISO creation"
            # Use oscdimg from Windows ADK
            $oscimgPath = Join-Path $adkPath.KitsRoot10 "Assessment and Deployment Kit\Deployment Tools\*\oscdimg.exe"
            $oscimgPath = Resolve-Path $oscimgPath | Select-Object -First 1
            
            $isoSource = Join-Path $ProjectRoot "iso\stellarforge"
            
            & $oscimgPath.Path -m -o -u2 -udfver102 -bootdata:2#p0,e,b"$isoSource\boot\etfsboot.com"#$p0,e,b"$isoSource\boot\etfsboot.com" $isoSource $IsoOutput
        }
        else {
            Write-LogWarning "Windows ADK not found, creating compressed archive instead"
            # Create a zip file as fallback
            $isoSource = Join-Path $ProjectRoot "iso\stellarforge"
            $zipOutput = Join-Path $OutputDir "${IsoName}-${IsoVersion}.zip"
            
            Compress-Archive -Path $isoSource -DestinationPath $zipOutput -Force
            $IsoOutput = $zipOutput
        }
        
        Write-LogSuccess "ISO/Archive created: $IsoOutput"
        
        # Generate checksum
        $hash = Get-FileHash -Path $IsoOutput -Algorithm SHA256
        $hash.Hash | Out-File -FilePath "${IsoOutput}.sha256" -Encoding UTF8
        Write-LogSuccess "Checksum generated: ${IsoOutput}.sha256"
    }
    catch {
        Write-LogError "ISO creation failed: $($_.Exception.Message)"
        exit 1
    }
}

# Main execution
function Start-BuildProcess {
    Write-LogInfo "Starting StellarForge OS ISO generation..."
    
    Test-Dependencies
    Initialize-BuildDirectories
    New-WindowsBuildConfig
    New-IsoStructure
    New-InstallationScripts
    New-ServiceFiles
    New-IsoImage
    
    Write-LogSuccess "StellarForge OS ISO generation completed!"
    Write-LogInfo "Output location: $IsoOutput"
    Write-LogInfo "Checksum location: ${IsoOutput}.sha256"
}

# Clean build artifacts
function Clear-BuildArtifacts {
    Write-LogInfo "Cleaning build directories..."
    
    $pathsToRemove = @(
        (Join-Path $ProjectRoot "iso\work"),
        (Join-Path $ProjectRoot "iso\out"),
        (Join-Path $ProjectRoot "iso\stellarforge"),
        $OutputDir
    )
    
    foreach ($path in $pathsToRemove) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force
        }
    }
    
    Write-LogSuccess "Clean completed"
}

# Show help
function Show-Help {
    Write-Host "StellarForge OS ISO Generation Script" -ForegroundColor $Colors.White
    Write-Host "Usage: .\build-iso.ps1 [Action]" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor $Colors.Yellow
    Write-Host "  build  - Build the ISO (default)" -ForegroundColor $Colors.White
    Write-Host "  clean  - Clean all build directories" -ForegroundColor $Colors.White
    Write-Host "  help   - Show this help message" -ForegroundColor $Colors.White
}

# Main script execution
switch ($Action) {
    "build" {
        Start-BuildProcess
    }
    "clean" {
        Clear-BuildArtifacts
    }
    "help" {
        Show-Help
    }
    default {
        Write-LogError "Unknown action: $Action"
        Show-Help
        exit 1
    }
}
