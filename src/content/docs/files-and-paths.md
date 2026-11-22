---
title: Files and locations
description: Where VibeForma keeps its configuration, models, logs, history, statistics, status and locks.
---

All VibeForma files live in the install directory. The default is `%LOCALAPPDATA%\VibeForma`; `-Target` can move it.

## The layout

| Path | What it is | Format |
|---|---|---|
| `config.json` | Settings, dictionary, snippets, hotwords, model, language, API token | JSON |
| `models\<name>\` | The recognition model | Model files |
| `logs\` | Rotating logs | Text |
| `history.jsonl` | The last 100 dictations, when history is on | JSON Lines |
| `stats.json` | Daily counters | JSON |
| `corrections.json` | Words changed by correction learning | JSON |
| `location.json` | Discovery file for local tools | JSON |
| `status.json` | Current service state | JSON |
| `service.lock` | Single-instance lock | Lock file |
| `install.log` | Installer and updater steps | Text |
| `test_ru.wav` | Test phrase for `--selftest` | WAV |
| `.venv\` | The Python virtual environment | Directory |
| `main.py`, `run.cmd` | The application entry points | Python / batch |
| `uninstall.cmd`, `uninstall.py` | The uninstaller | Batch / Python |

## config.json

The single configuration file. It holds:

- recording, appearance and system settings;
- the dictionary and snippets;
- `hotwords`;
- the selected model and language;
- the local API switch, port and token;
- `onboarding_done`.

It is written atomically through a temporary file and `os.replace`, so a crash does not leave a broken configuration.

The API token is a secret. Do not paste `config.json` into an issue; redact the token.

## Models

`models\<name>` inside the service folder is the first place VibeForma looks for a model. If it is absent, the shared Hugging Face cache is tried, then a fresh download.

Deleting a model folder forces a download the next time that model is selected.

## Logs

`logs\` keeps five files of 1 MB each, rotated. Dictated text is never written to the log. Window titles are written only with `log_window_titles: true`; by default only the window handle and the character count appear.

The tray has a **Logs folder** item that opens the directory.

## History and statistics

| File | Contains | Deleting it |
|---|---|---|
| `history.jsonl` | Text, characters, application, direction, timestamp | Removes the history; dictation keeps working |
| `stats.json` | Four counters per day | Resets statistics; history is not affected |

History is off by default, and turning it off deletes its file. Statistics store numbers only.

## location.json

Published by the service so local tools can find it without guessing:

| Field | Meaning |
|---|---|
| `schema` | The file schema version |
| `app` | Application name |
| `version` | Product version |
| `config` | Path to the configuration |
| `api` | `on`, `off` or `error` |
| `port` | The actual port the API listens on |

There is no secret in this file. The token stays in `config.json`.

## status.json

Written on every state change. It contains state, version, pid and timestamp. It is a convenience for scripts, not a source of truth; a response older than 60 seconds is not trusted.

## service.lock

The single-instance lock. It prevents a second service from starting and fighting over the microphone, the hotkey and the API port.

## install.log

The installer and updater write each step and the tail of an error here. It is the first file to read when installation or an update fails.

## Temporary files

`POST /transcribe` writes a temporary WAV named `_http_in_*.wav` and deletes it on any outcome. Audio is not kept after recognition.

## Backup and removal

- **Back up** `config.json`, `models\`, and — if you need them — `history.jsonl`, `stats.json`, `corrections.json`.
- **Uninstall** removes shortcuts, autostart and service files; models and `config.json` stay unless `--remove-data` is passed.
- **A clean reset** is a reinstall with `--remove-data`, or deleting the install directory after uninstalling.

## Where to go next

- [Settings reference](/settings-reference/) — the keys inside `config.json`.
- [Privacy](/privacy/) — which files contain what.
- [Diagnostics and logs](/diagnostics/) — how to read the logs.
- [Local API](/local-api/) — `location.json` and the token.
