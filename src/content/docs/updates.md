---
title: Updates
description: How VibeForma checks for updates, offers a release, installs it with SHA256SUMS and rolls back on failure.
---

VibeForma checks GitHub Releases in the background and offers a new version. It does not install anything silently unless you explicitly ask it to.

## When checks happen

| Moment | Detail |
|---|---|
| After start | About 90 seconds after the service starts |
| Recurring | Every `update_interval_h`, 2 hours by default |
| Condition | Only while the service is idle |
| Manual | **Check for updates** in the settings window header |

Since 0.4.3 the running version and a **Check for updates** button sit in the settings window header, on every page. The duplicate check button at the bottom of the System page is gone; the update toggles stay there.

Checks can be turned off in the settings. With checks off, the app never contacts GitHub on its own.

## What happens when a release is found

A new release is **offered**, not installed:

- a blue **Update** button appears on the panel;
- the tray shows the release;
- a notification includes a summary of the release notes;
- **Later** dismisses the offer.

The update is installed only when you accept it, or unconditionally only if `auto_update` is set to `auto` — an explicit choice, not the default.

The update is deferred while a recording is in flight or a file job is unfinished — a single file or a folder batch. The notification names the recording or transcription, and in `auto` mode the update retries by itself once the work completes.

The tray also has a **What's new in …** item that opens the release page.

## How an update is installed

1. VibeForma downloads the release archive and the `SHA256SUMS` file from GitHub.
2. It verifies the archive against `SHA256SUMS` before unpacking: a missing sums file, a missing line or a hash mismatch stops the installation.
3. It keeps a backup of the current installation.
4. It installs the new version with the same installer used for a first install.
5. It restarts the service as a detached `pythonw` process.

Your model, dictionary, history and `config.json` are preserved.

While the state is `updating`, the hotkey and recording are blocked, so an update cannot collide with a dictation.

## Signatures

There is no code-signing certificate and no signed manifest. The release is a plain zip published on GitHub with a `SHA256SUMS` file. VibeForma verifies the checksum, which detects a corrupted download but does not prove who built the archive.

Windows SmartScreen may warn when running the installer or the app. This is expected for an unsigned build.

## Rollback

If the update fails, the previous installation is restored from the backup. If the service does not come back, the backup is the recovery path; `%LOCALAPPDATA%\VibeForma\logs\install.log` names the failed step.

## Manual update

Download the latest release and run the installer again. The installer detects the existing installation, keeps the data and continues from the step that needs work.

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

## Versioning

The current version is 0.5.9. It is shown in the settings window header next to the **Check for updates** button and in `status.json`. Release notes are on the GitHub Releases page.

The documentation describes version 0.5.9. Pages are updated with the product.

## If an update does not finish

1. Check `install.log` in `%LOCALAPPDATA%\VibeForma\logs`.
2. Check free disk space: the new version needs room for the archive and the backup.
3. Check the network and the GitHub status.
4. Restart the app. A repeated install continues from the failed step.
5. If the service does not start, restore from the backup created by the updater.
6. If the folder is left mixed — some files of the old version, some of the new — do a full reset: quit the app, delete the install folder and install again into the same place. The installer treats a missing folder as a fresh install. Steps are on [Installation](/installation/).

More in [Troubleshooting](/troubleshooting/) and [Diagnostics and logs](/diagnostics/).

## Where to go next

- [Installation](/installation/) — the installer and its transaction.
- [Known issues and limitations](/known-issues/) — unsigned builds and other limits.
- [Changelog](/changelog/) — release history.
- [Security](/security/) — checksums, the local API and reporting a vulnerability.
