---
title: Installation
description: Requirements, the quick install command, installer parameters and the install location.
---

## Requirements

- Windows 10 or Windows 11, x64.
- Python 3.10 or newer in `PATH`.

## Quick start

Run in PowerShell:

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 | iex
```

The installer places VibeForma in `%LOCALAPPDATA%\VibeForma`.

## Installer parameters

The installer accepts the following parameters:

- `-Model`
- `-Target`
- `-Cpu`
- `-DryRun`
- `-NoRun`

The reference for what each parameter does is `install.ps1` in the [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma) repository.

## Network

The recognition model is downloaded once, and that download needs the network. After it, dictation works offline; the network is used again for updates.

The default input hotkey is `Ctrl+Alt+Space`.
