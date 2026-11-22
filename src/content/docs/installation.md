---
title: Installation
description: Install VibeForma on Windows — the one-line command, installer parameters, the install transaction, shortcuts, migration and removal.
---

VibeForma installs from a PowerShell script into your user profile. No administrator rights are required, and the installer refuses system directories on purpose.

The requirements are on [System requirements](/requirements/). For the shortest path, use [Quickstart](/quickstart/).

## Install with one command

Open PowerShell and run:

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 | iex
```

The script finds Python, downloads the latest released build, installs it, downloads the model and starts the service.

Only released builds are installed. If there is no release archive, the bootstrap stops with a reason instead of silently substituting the `main` branch.

## Installer parameters

| Parameter | Values | What it does |
|---|---|---|
| `-Model` | `large-v3`, `large-v3-turbo`, `medium`, `small` | Chooses the recognition model instead of asking. |
| `-Target` | a directory path | Installs into this directory instead of `%LOCALAPPDATA%\VibeForma`. |
| `-Cpu` | flag | Forces the CPU (int8) profile instead of trying CUDA. |
| `-DryRun` | flag | Runs checks and prints the plan without changing anything. |
| `-NoRun` | flag | Installs without starting the service. |

To pass parameters, save the script first:

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Model small -Target D:\VibeForma -NoRun
```

## What the installer checks

Before it writes anything, the installer verifies:

- Windows 10 build 1809 or newer.
- x64 or ARM64 architecture.
- Python 3.10–3.14.
- Free disk space for the model plus about 4 GB.
- The target directory: empty, an existing VibeForma installation, or a folder with the installation marker.
- That the target is not a system directory, `Program Files`, a drive root or the root of the user profile.

The first failing step stops the chain. Every step and the tail of an error go to `install.log`.

## The install is a transaction

An installation is not a sequence of unrelated writes:

- Prechecks run before the first change.
- If the first installation fails, the created folder is removed.
- If an existing installation fails during an update, it is restored from the backup.
- A repeated run continues from the failed step, reusing the virtual environment, the model and the configuration when they are intact.

## Choosing a model

The installer offers a dialog with the four models, their sizes and descriptions. On an unattended run it chooses `large-v3-turbo`; on a CPU-only machine it chooses `small`. On an existing installation the model from `config.json` is kept.

The trade-offs are on [Models and languages](/models/).

## Install location

The default is `%LOCALAPPDATA%\VibeForma`. Use `-Target` to install elsewhere, for example `D:\VibeForma`.

The installer refuses protected locations because an app that writes its configuration and models next to itself should not live where Windows expects system files.

## Shortcuts and the app entry

The installer creates shortcuts on the desktop, in the Start menu and in autostart. They launch the app directly through `pythonw.exe main.py` — not through `run.cmd` — so no console window appears.

It also registers the app in **Settings → Apps** without administrator rights. The version is shown in the settings.

## Migration from WhisperDictation

If an older WhisperDictation installation is found, the installer copies `config.json` (including `hotwords`) and the models, and removes the old desktop, autostart and Start menu shortcuts. The old folder itself is copied, not deleted.

## First run

After installation, the service starts and the three-step assistant appears:

1. Interface and recognition language.
2. Microphone with a live level and a test recording.
3. Dictation hotkey, recorded by pressing the keys.

**Skip** writes safe defaults. The assistant can be reopened from the tray and from the settings. The `onboarding_done` flag in `config.json` records that it has been completed.

## Updating

Updates use the same release archive and the same installer. Automatic checks are described on [Updates](/updates/). Your model, dictionary, history and `config.json` are preserved.

## Uninstalling

Run:

```powershell
uninstall.cmd
```

or:

```powershell
python uninstall.py
```

The uninstaller removes shortcuts, the autostart entry, the **Apps** entry and the service files. Models and `config.json` stay by default, so a reinstall starts offline.

| Flag | Effect |
|---|---|
| `--remove-data` | Also removes models and `config.json`. |
| `--keep-data` | Keeps data without asking. |

## If installation fails

1. Read `install.log` in the install directory — it names the failed step and the tail of the error.
2. Run `install.ps1 -DryRun` to see the checks without changes.
3. Check the Python version: 3.10–3.14.
4. Check free disk space: model size plus about 4 GB.
5. Retry the same command. A repeated run continues from the failed step.

More in [Troubleshooting](/troubleshooting/).

## Where to go next

- [Quickstart](/quickstart/) — the first dictation.
- [System requirements](/requirements/) — the factual table.
- [Files and locations](/files-and-paths/) — what the installer writes and where.
- [Updates](/updates/) — how a new version arrives.
