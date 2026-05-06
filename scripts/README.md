# STELLARFORGE: ISO Generation Scripts

Author: Giovanny Anthony Corpus Bernal  
Year: 2026  
License: MIT

## Overview

This directory contains scripts for generating StellarForge OS ISO images for Dyson Swarm deployment. The scripts support both Linux (Bash) and Windows (PowerShell) environments.

## Scripts

### `build-iso.sh` (Linux/Bash)

Arch Linux ISO generation script using `mkarchiso` for creating bootable StellarForge OS images.

**Prerequisites:**
- Arch Linux system
- `archiso` package
- `mkarchiso` tool
- Root privileges

**Usage:**
```bash
# Build ISO (default)
./build-iso.sh

# Clean build directories
./build-iso.sh clean

# Show help
./build-iso.sh help
```

**Features:**
- Automated Arch Linux profile generation
- Custom StellarForge OS packages and configurations
- Systemd services for kernel, quantum, API, and dashboard
- Custom MOTD and user setup
- SHA256 checksum generation

### `build-iso.ps1` (Windows/PowerShell)

Windows PowerShell script for creating StellarForge OS deployment packages and ISO images.

**Prerequisites:**
- Windows 10/11 with PowerShell 5.1+
- Git, Python, Node.js, NPM
- Optional: Windows ADK for ISO creation

**Usage:**
```powershell
# Build ISO (default)
.\build-iso.ps1

# Clean build directories
.\build-iso.ps1 clean

# Show help
.\build-iso.ps1 help
```

**Features:**
- Cross-platform project structure generation
- Installation scripts for both Windows and Linux
- Systemd service file generation
- Compressed archive creation (fallback if ADK unavailable)

## Generated Components

### Systemd Services

The scripts generate the following systemd services:

1. **stellarforge-kernel.service** - Core StellarForge kernel service
2. **stellarforge-quantum.service** - Quantum processing service  
3. **stellarforge-api.service** - Flask API service
4. **stellarforge-dashboard.service** - React dashboard service

### Installation Scripts

#### `install.bat` (Windows)
- Administrator privilege check
- Rust toolchain installation
- Python/Node.js dependency setup
- Windows service creation
- Firewall configuration

#### `install.sh` (Linux)
- Root privilege check
- System dependency installation (apt-based)
- User creation and permissions
- Systemd service setup
- UFW firewall configuration

### Directory Structure

```
stellarforge/
├── kernel/          # Rust kernel source
├── quantum/          # Python quantum modules
├── api/              # Flask API
├── dashboard/        # React TypeScript dashboard
├── scripts/          # Service and configuration files
├── docs/             # Documentation
└── config/           # Configuration files
```

## Configuration

### Arch Linux Profile

The Bash script generates a complete Arch Linux profile with:

- **Base packages**: Linux kernel, systemd, network tools
- **Development tools**: Rust, Python, Node.js, Git
- **Quantum computing**: Qiskit, NumPy, SciPy, Matplotlib
- **Monitoring tools**: Prometheus, Grafana, htop, iotop
- **Security**: UFW, fail2ban, cryptsetup

### Custom Rootfs

Custom AI rootfs includes:
- StellarForge user creation
- Development environment setup
- Service enablement
- Firewall configuration
- Custom MOTD with ASCII art

## Build Process

### Linux (Arch Linux)

1. **Dependency Check**: Verify required tools are installed
2. **Directory Setup**: Create build directories
3. **Profile Generation**: Create Arch Linux profile configuration
4. **Customization**: Generate custom rootfs and services
5. **ISO Build**: Use `mkarchiso` to create bootable ISO
6. **Checksum**: Generate SHA256 checksum for verification

### Windows

1. **Dependency Check**: Verify development tools are available
2. **Directory Setup**: Create build directories
3. **Project Structure**: Copy and organize source files
4. **Script Generation**: Create installation scripts
5. **Service Files**: Generate systemd service configurations
6. **ISO Creation**: Create ISO using Windows ADK or compressed archive

## Output

### Linux
- Location: `build/stellarforge-os-1.0.0.iso`
- Checksum: `build/stellarforge-os-1.0.0.iso.sha256`

### Windows
- Location: `build/stellarforge-os-1.0.0.iso` (if ADK available)
- Fallback: `build/stellarforge-os-1.0.0.zip`
- Checksum: `build/stellarforge-os-1.0.0.sha256`

## Deployment

### Bootable USB (Linux)
```bash
# Flash ISO to USB
sudo dd if=stellarforge-os-1.0.0.iso of=/dev/sdX bs=4M status=progress
```

### Bootable USB (Windows)
Use Rufus or similar tool to flash the ISO to USB drive.

### Virtual Machine
Import the ISO into VMware, VirtualBox, or Hyper-V for testing.

## Security Notes

- All services run with minimal privileges
- Firewall rules restrict access to necessary ports only
- User accounts created with secure defaults
- SSH keys should be configured post-installation

## Troubleshooting

### Common Issues

1. **Missing Dependencies**: Ensure all required tools are installed
2. **Permission Errors**: Run scripts with appropriate privileges
3. **Build Failures**: Check available disk space and system resources
4. **Service Failures**: Verify service configurations and dependencies

### Logs

- Linux: Check `journalctl -u stellarforge-*` for service logs
- Windows: Check Event Viewer for service status

## Contributing

When modifying scripts:
1. Maintain cross-platform compatibility
2. Update documentation
3. Test in both Linux and Windows environments
4. Follow existing code style and conventions

## License

This project is licensed under the MIT License. See LICENSE file for details.
