---
title: Introduction
description: What VibeForma is, how dictation works, and what comes with the application.
---

VibeForma is a local voice dictation tool for Windows. Press a hotkey, speak, and the text appears where the cursor is.

**From voice vibe to sharp form.**

## How dictation works

1. Press the input hotkey — `Ctrl+Alt+Space` by default.
2. Speak.
3. The recognized text is inserted at the cursor.

Recognition uses faster-whisper and runs on your machine. The network is needed once, to download the recognition model, and later for updates. The recognition language is fixed in the settings.

VibeForma recognizes speech in about 99 languages.

## What comes with the application

- An interface in English and Russian.
- A monitoring panel, a tray icon and autostart.
- Settings grouped in tabs: Recording; Model & language; Dictionary; History; Appearance; System.
- A dictionary with import, export and preview.
- A history that is off by default; when enabled, it keeps the last 100 dictations in `history.jsonl`.
- Switching the recognition model.
- Automatic updates from a plain zip checked against SHA256SUMS, with a backup and rollback.
- Log rotation.

## Where to go next

- [Installation](/installation/) — requirements and the installer.
- [Usage](/usage/) — hotkey, settings, dictionary and history.
- [Privacy](/privacy/) — what stays on your machine and when the network is used.
- [Troubleshooting](/troubleshooting/) — what to check when something does not work.

The source code is in the [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma) repository under the MIT license.
