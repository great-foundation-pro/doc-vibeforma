---
title: Installation
description: Install VibeForma on Windows — the one-line command, installer parameters, the install transaction, shortcuts, removal and reinstalling into the same place.
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

## First run

After installation, the service starts and the three-step assistant appears:

1. Interface and recognition language.
2. Microphone with a live level and a test recording.
3. Dictation hotkey, recorded by pressing the keys.

**Skip** writes safe defaults. The assistant can be reopened from the tray and from the settings. The `onboarding_done` flag in `config.json` records that it has been completed.

## Updating

Updates use the same release archive and the same installer. Automatic checks are described on [Updates](/updates/). Your model, dictionary, history and `config.json` are preserved.

## Uninstalling and reinstalling

VibeForma lives in a single folder: the code, the virtual environment, the model and your data. There is no system service, driver or shared library elsewhere. Removal is therefore predictable, and a full reset — delete the folder, install again into the same place — is a supported repair, not a workaround.

### Before you remove anything

1. **Quit the app.** Right-click the tray icon and choose **Exit**. While the service runs, Windows keeps `pythonw.exe` and the DLLs in `.venv` open, and the folder is deleted only partly. If the tray does not respond, end `pythonw.exe` in Task Manager or restart the PC.
2. **Keep the evidence if something failed.** `logs\install.log` and `logs\service.log` name the failed step and the tail of the error, and they disappear with the folder. Copy them somewhere first.
3. **Decide about your data.** `config.json` holds settings, hotwords, dictionary and snippets; `models\` holds the model; `history.jsonl` and `stats.json` hold records. The model is the expensive part to download again.

### Uninstall with the uninstaller

```powershell
cd "$env:LOCALAPPDATA\VibeForma"
.\uninstall.cmd
```

`python uninstall.py` does the same when the virtual environment is already broken. `uninstall.cmd` uses a Python installed outside the install folder when one is available: Windows keeps the folder's own `.venv` interpreter locked while it runs.

The uninstaller asks for confirmation and removes the desktop, Start menu and Startup shortcuts, the **Settings → Apps** entry and everything the installer and the service created — except your data, which stays unless you pass `--remove-data`.

| Flag | Effect |
|---|---|
| `--remove-data` | Also removes your data: `models\`, `config.json`, `logs\`, `history.jsonl`, `history_audio\`, `stats.json` and `corrections.json`. |
| `--keep-data` | Keeps your data without asking. |
| `--yes` | Skips the confirmation prompt — for a script. |

By default models and `config.json` stay. To reuse them, move them aside, delete the remaining folder, reinstall and put them back before the first start — see **Reinstall into the same folder**.

**With `--remove-data` nothing of the installation stays.** The product files and the runtime state — `status.json`, `location.json`, `service.lock`, `mcp.cmd`, the requirements files and the `vibeforma\` package among them — are removed in every mode; `--remove-data` adds your data. Then the folder itself is deleted when it is empty, and the installer accepts that path as a fresh install: the folder is missing, not half-deleted. Files you put in the folder yourself stay; the folder then is not empty, and the installer refuses it until they are removed. A `.py` file at the top level counts as the application's own — keep your own scripts elsewhere.

### Delete the folder

To remove the installation by hand — or to delete the data the uninstaller kept — delete the install directory: `%LOCALAPPDATA%\VibeForma` unless you installed with `-Target`.

Inside it:

| Item | What it is |
|---|---|
| `main.py`, `run.cmd`, `vibeforma\`, `.venv` | The application and its Python environment |
| `config.json` | Settings, hotwords, dictionary and snippets |
| `models\` | The downloaded recognition model |
| `history.jsonl`, `history_audio\` | Dictation history, if it was enabled |
| `stats.json` | Counters, if statistics were enabled |
| `corrections.json` | Learned dictionary corrections, if dictionary learning was used |
| `logs\` | `install.log`, `service.log` and their rotated copies |

Outside it:

| Location | What stays | What happens |
|---|---|---|
| Desktop, Start menu, Startup | `VibeForma.lnk` | A reinstall recreates them. Without one, delete them: the Startup copy would point at a missing target at every logon. |
| `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\VibeForma` | The **Settings → Apps** entry | A reinstall rewrites it. Without one, the Uninstall button there points at a deleted `uninstall.cmd`; run the uninstaller before deleting the folder to remove it. |
| `%LOCALAPPDATA%\VibeForma\location.json` | The discovery file for forms and agents | With the default target the uninstaller removes it with the folder. With a custom `-Target` it stays here although the app lives elsewhere; it is rewritten at the next service start, and a stale file points at an `install_dir` that no longer exists. |
| `%USERPROFILE%\.cache\huggingface`, `%LOCALAPPDATA%\pip\Cache` | Shared download caches | Harmless. They only save a download next time. |
| System Python 3.10–3.14 | The prerequisite | Untouched by removal, and needed for a reinstall. |

### Reinstall into the same folder

A missing or empty folder is a **fresh install** for the installer — the state `uninstall.cmd --remove-data` leaves behind. It copies the application, creates `.venv`, installs the dependencies, downloads the model and writes a new `config.json`. Nothing of the old installation is reused or mixed in — which is exactly why this is the cleanest repair after a broken update.

1. Quit the app.
2. Copy `logs\install.log` and `logs\service.log` aside if you are investigating the failure.
3. Optional: move `models\` to another disk so the model is not downloaded again. If you also keep `config.json`, the same model is selected; otherwise pass `-Model` with its name, or the installer picks its default.
4. Delete the install folder completely. An empty folder is accepted; a partly deleted one is not — see below.
5. Install again into the same place:

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Target "$env:LOCALAPPDATA\VibeForma"
```

Without `-Target` the installer uses `%LOCALAPPDATA%\VibeForma`; an interactive run asks for the folder and accepts the old path.

6. Put `models\` back before the first start if you moved it aside. The installer skips the download when `models\<model>\model.bin` is already there.
7. Start the app. The installer starts the service at the end unless it ran with `-NoRun`; otherwise use the desktop shortcut or `.\run.cmd`.

**Why the installer may refuse the folder.** It accepts a missing folder, an empty one, or an existing VibeForma installation — the `.vibeforma-install.json` marker, or `run.cmd` together with `main.py`. A partly deleted folder that still holds `models\` and `config.json` is none of these, and the installer stops with "the target folder is not empty and does not look like a VibeForma install" instead of writing into it. Finish the deletion or choose a new folder.

**What is lost.** Settings, hotwords, dictionary and snippets (`config.json`), history and statistics unless you kept the files, and the model unless it is in the shared Hugging Face cache or you saved `models\`. Nothing else is tied to the folder: the new install is complete on its own.

### Starting and restarting

- After an install or a reinstall the service is already running; look for the tray icon.
- To restart it, choose **Exit** in the tray and start the desktop shortcut or `.\run.cmd` again. A second launch does not create a second copy: it asks the running instance to show the panel.
- Autostart starts the service with Windows and is toggled in **Settings → System**. A reinstall recreates the autostart shortcut.
- If the service does not come up after a reinstall, read `logs\service.log` and run `.\run.cmd --doctor`; see [Diagnostics and logs](/diagnostics/).

### When a full reset will not help

Deleting the folder repairs what lives inside it: files half-written by an interrupted update, a broken `.venv`, a mix of versions. It does not repair the environment around it, and a clean folder meets the same wall when:

- Python is missing, older than 3.10 or newer than 3.14;
- disk space is short of the model plus about 4 GB;
- antivirus, a proxy or a firewall blocks `pip` or the model download;
- the CUDA driver does not match the installed build;
- GitHub is unreachable.

Read `install.log` first — it names the failed step and the tail of the error. `install.ps1 -DryRun` shows the checks without changes, and `.\run.cmd --doctor` checks the machine. A failed in-place update already restores the previous version, so a normal reinstall is worth one attempt before the reset.

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
