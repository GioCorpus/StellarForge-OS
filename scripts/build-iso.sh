#!/bin/bash
# STELLARFORGE: Arch Linux ISO generation script for Dyson Swarm OS
# Author: Giovanny Anthony Corpus Bernal
# Year: 2026

set -euo pipefail

# Configuration variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ISO_NAME="stellarforge-os"
ISO_VERSION="1.0.0"
OUTPUT_DIR="$PROJECT_ROOT/build"
ISO_OUTPUT="$OUTPUT_DIR/${ISO_NAME}-${ISO_VERSION}.iso"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    local deps=("archiso" "pacman" "git" "mkarchiso")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "Missing dependency: $dep"
            exit 1
        fi
    done
    
    log_success "All dependencies found"
}

# Create build directory structure
setup_build_dirs() {
    log_info "Setting up build directories..."
    
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$PROJECT_ROOT/iso/profile"
    mkdir -p "$PROJECT_ROOT/iso/work"
    mkdir -p "$PROJECT_ROOT/iso/out"
    
    log_success "Build directories created"
}

# Generate Arch Linux profile configuration
generate_profile() {
    log_info "Generating Arch Linux profile configuration..."
    
    cat > "$PROJECT_ROOT/iso/profile/profiledef.sh" << 'EOF'
#!/usr/bin/env bash
# STELLARFORGE: Arch Linux profile definition for Dyson Swarm OS

iso_name="stellarforge-os"
iso_label="STELLARFORGE"
iso_publisher="GioCorpus"
iso_application="StellarForge OS - Dyson Swarm Control System"
iso_version="1.0.0"
install_dir="stellarforge"
bootmodes=('uefi-x64.systemd-boot' 'bios.syslinux.mbr' 'bios.syslinux.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
EOF

    # Generate packages.x86_64
    cat > "$PROJECT_ROOT/iso/profile/packages.x86_64" << 'EOF'
# STELLARFORGE: Base system packages
base
linux
linux-firmware
systemd
systemd-ukify

# Network and connectivity
networkmanager
openssh
wireless_tools
wpa_supplicant

# Development tools
git
vim
nano
base-devel
rust
python
python-pip
nodejs
npm

# Quantum and scientific computing
qiskit
numpy
scipy
matplotlib
jupyterlab

# System monitoring
htop
iotop
nethogs
prometheus
grafana

# Security
ufw
fail2ban
cryptsetup

# Filesystems
btrfs-progs
ext4progs
xfsprogs
dosfstools
ntfs-3g

# Boot and firmware
efibootmgr
grub
os-prober

# Additional utilities
curl
wget
rsync
unzip
tar
gzip
EOF

    # Generate pacman.conf
    cat > "$PROJECT_ROOT/iso/profile/pacman.conf" << 'EOF'
[options]
HoldPkg     = pacman glibc
Architecture = auto
CheckSpace
SigLevel    = Required DatabaseOptional
LocalFileSigLevel = Optional

[core]
Server = https://mirror.rackspace.com/archlinux/$repo/os/$arch
Server = https://mirrors.kernel.org/archlinux/$repo/os/$arch

[extra]
Server = https://mirror.rackspace.com/archlinux/$repo/os/$arch
Server = https://mirrors.kernel.org/archlinux/$repo/os/$arch

[community]
Server = https://mirror.rackspace.com/archlinux/$repo/os/$arch
Server = https://mirrors.kernel.org/archlinux/$repo/os/$arch

[multilib]
Server = https://mirror.rackspace.com/archlinux/$repo/os/$arch
Server = https://mirrors.kernel.org/archlinux/$repo/os/$arch
EOF

    log_success "Profile configuration generated"
}

# Generate custom AI scripts and configurations
generate_customizations() {
    log_info "Generating custom StellarForge OS configurations..."
    
    # Create airootfs structure
    mkdir -p "$PROJECT_ROOT/iso/profile/airootfs/etc/systemd/system"
    mkdir -p "$PROJECT_ROOT/iso/profile/airootfs/opt/stellarforge"
    mkdir -p "$PROJECT_ROOT/iso/profile/airootfs/home/stellarforge"
    
    # Generate systemd service for StellarForge kernel
    cat > "$PROJECT_ROOT/iso/profile/airootfs/etc/systemd/system/stellarforge.service" << 'EOF'
[Unit]
Description=StellarForge OS Kernel Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/stellarforge
ExecStart=/opt/stellarforge/kernel/target/debug/stellarforge-kernel
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    # Generate quantum service
    cat > "$PROJECT_ROOT/iso/profile/airootfs/etc/systemd/system/stellarforge-quantum.service" << 'EOF'
[Unit]
Description=StellarForge Quantum Processing Service
After=network.target stellarforge.service

[Service]
Type=simple
User=stellarforge
WorkingDirectory=/opt/stellarforge/quantum
ExecStart=/usr/bin/python3 -m stellarforge.quantum
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    # Generate API service
    cat > "$PROJECT_ROOT/iso/profile/airootfs/etc/systemd/system/stellarforge-api.service" << 'EOF'
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
EOF

    # Generate dashboard service
    cat > "$PROJECT_ROOT/iso/profile/airootfs/etc/systemd/system/stellarforge-dashboard.service" << 'EOF'
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
EOF

    # Create installation script
    cat > "$PROJECT_ROOT/iso/profile/airootfs/root/customize_airootfs.sh" << 'EOF'
#!/bin/bash
# STELLARFORGE: Custom AI rootfs customization script

set -euo pipefail

# Create stellarforge user
useradd -m -s /bin/bash stellarforge
echo "stellarforge:stellarforge" | chpasswd

# Install Rust toolchain
su - stellarforge -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y"
su - stellarforge -c "source ~/.cargo/env && rustup default stable"

# Install Python dependencies
pip install qiskit numpy scipy matplotlib flask flask-socketio pydantic

# Install Node.js dependencies
su - stellarforge -c "npm install -g @types/node typescript"
su - stellarforge -c "npm install"

# Enable services
systemctl enable stellarforge.service
systemctl enable stellarforge-quantum.service
systemctl enable stellarforge-api.service
systemctl enable stellarforge-dashboard.service
systemctl enable NetworkManager

# Configure firewall
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 5000/tcp

# Set up MOTD
cat > /etc/motd << 'MOTD'

██████╗ ██████╗ ███████╗██████╗  █████╗ ██╗     ██╗     ██╗███╗   ██╗███████╗
██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██║     ██║████╗  ██║██╔════╝
██║   ██║██████╔╝█████╗  ██████╔╝███████║██║     ██║     ██║██╔██╗ ██║███████╗
██║   ██║██╔══██╗██╔══╝  ██╔══██╗██╔══██║██║     ██║     ██║██║╚██╗██║╚════██║
╚██████╔╝██║  ██║███████╗██║  ██║██║  ██║███████╗███████╗██║██║ ╚████║███████║
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

Welcome to StellarForge OS - Dyson Swarm Control System
Author: Giovanny Anthony Corpus Bernal
Year: 2026

System Status: Quantum-Enhanced • Photonic Network • Dyson Swarm Ready

Getting Started:
  • SSH: stellarforge@localhost
  • Dashboard: http://localhost:3000
  • API: http://localhost:5000
  • Documentation: /opt/stellarforge/docs

MOTD

EOF

    chmod +x "$PROJECT_ROOT/iso/profile/airootfs/root/customize_airootfs.sh"
    
    log_success "Custom configurations generated"
}

# Build the ISO
build_iso() {
    log_info "Building StellarForge OS ISO..."
    
    cd "$PROJECT_ROOT/iso"
    
    # Clean previous builds
    rm -rf work out
    
    # Build the ISO
    mkarchiso -v -w work -o out profile/
    
    # Move to output directory
    if [ -f "out/${ISO_NAME}-${ISO_VERSION}-x86_64.iso" ]; then
        mv "out/${ISO_NAME}-${ISO_VERSION}-x86_64.iso" "$ISO_OUTPUT"
        log_success "ISO built successfully: $ISO_OUTPUT"
        
        # Generate checksum
        sha256sum "$ISO_OUTPUT" > "${ISO_OUTPUT}.sha256"
        log_success "Checksum generated: ${ISO_OUTPUT}.sha256"
    else
        log_error "ISO build failed"
        exit 1
    fi
}

# Main execution
main() {
    log_info "Starting StellarForge OS ISO generation..."
    
    check_dependencies
    setup_build_dirs
    generate_profile
    generate_customizations
    build_iso
    
    log_success "StellarForge OS ISO generation completed!"
    log_info "ISO location: $ISO_OUTPUT"
    log_info "Checksum location: ${ISO_OUTPUT}.sha256"
}

# Handle script arguments
case "${1:-}" in
    "clean")
        log_info "Cleaning build directories..."
        rm -rf "$PROJECT_ROOT/iso/work" "$PROJECT_ROOT/iso/out" "$OUTPUT_DIR"
        log_success "Clean completed"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [clean|help]"
        echo "  clean  - Clean all build directories"
        echo "  help   - Show this help message"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
