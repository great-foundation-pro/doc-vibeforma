---
title: Changelog
description: User-facing changes in VibeForma 0.2.x — what was added, changed and fixed.
---

This page summarizes user-facing changes. The authoritative log is [`CHANGELOG.md`](https://github.com/FormaMindPro/vibeforma/blob/main/CHANGELOG.md) in the repository and the GitHub Releases page.

The documentation describes **0.2.4**.

## 0.2.4 — 22 November 2026

### Added

- The local API token is created and saved automatically the first time the API is enabled, including when `config.json` was written by hand with the switch already on.
- If the configured API port (8787) is busy, the service takes a free loopback port and publishes the actual port in `location.json`.

### Fixed

- Audio capture follows the device format — WASAPI at the device rate (mono, then stereo), the legacy host API at its own rate, 16 kHz as the last resort — with windowed-sinc resampling and a single retry.

## 0.2.3 — 20 November 2026

### Changed

- Releases are plain zip archives. The packaged Windows executable and its build were removed; the installed copy is a source copy with `run.cmd`, `main.py` and `.venv`.
- Release archives ship with `SHA256SUMS`; there is no signed manifest.

## 0.2.2

### Added

- `Ctrl+S` saves settings without closing the window, with confirmation in place.
- Rounded corners and a dark title bar for the settings window through DWM; the frameless panel is clipped to a rounded region that is rebuilt after every resize.

### Changed

- The settings window has a stable geometry: it is sized once from the tallest tab, limited to the screen and centered.

## 0.2.0 — 20 November 2026

### Added

- The settings window with a sidebar and sections.
- `--selftest`: imports, model, `test_ru.wav` and recognized text, with exit code 0 or 1.
- `uninstall.cmd` / `uninstall.py`, with `--remove-data` and `--keep-data`.
- Protected hotkey changes: an invalid combination is not saved; a failed listener keeps the previous combination.

### Changed

- Settings apply to the running service without a restart for recording, panel, beeps, hotkey, input device, autostart and paste method.

## Earlier 0.1.x

Verified highlights from the 0.1 line:

- the tray menu and state-colored icon;
- update checks with a release summary and a "What's new" item;
- DPI-aware panel and settings geometry;
- service restart after an update;
- the panel update button;
- log rotation.

## How to read version numbers

VibeForma uses `major.minor.patch`:

- **patch** — fixes and small behavior changes;
- **minor** — new features, including the file transcription planned for 0.3.0;
- **major** — a breaking change, not planned yet.

Release notes name the user-facing changes; internal refactors may appear only in the commit history.

## Where to go next

- [Roadmap](/roadmap/) — what comes next, without dates.
- [Updates](/updates/) — how a release reaches your machine.
- [Known issues and limitations](/known-issues/) — the current boundary.
- [Development](/development/) — the repository and the build.
