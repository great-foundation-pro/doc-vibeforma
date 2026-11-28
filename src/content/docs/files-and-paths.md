---
title: Files and locations
description: Where VibeForma keeps its configuration, models, logs, history, statistics, status and locks.
---

Most VibeForma files live in the install directory. The default is `%LOCALAPPDATA%\VibeForma`; `-Target` can move it. System-audio recordings are the exception: they are written to your Documents folder by default.

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
- the file-mode limits and roots;
- `onboarding_done`.

It is written atomically through a temporary file and `os.replace`, so a crash does not leave a broken configuration.

The API token is a secret. Do not paste `config.json` into an issue; redact the token.

## Models

`models\<name>` inside the service folder is the first place VibeForma looks for a model. If it is absent, the shared Hugging Face cache is tried, then a fresh download.

Deleting a model folder forces a download the next time that model is selected.

A folder added to the local list in **Settings → Model & language** is a user file wherever it stands: a model switch never deletes it, `model_keep_old: false` removes only downloaded models inside `models\`, and a complete removal leaves it in place.

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
| `schema` | The file schema version; `2` adds the file-mode fields |
| `app` | Application name (`vibeforma`) |
| `version` | Product version |
| `launcher`, `python`, `entry` | The three ways to start the app |
| `install_dir`, `config`, `app_dir` | Paths a local tool may need |
| `pid`, `updated` | The writing process and a Unix timestamp |
| `file_mode` | `true` once the named pipe listens, `false` while loading |
| `formats`, `languages` | What the running build accepts |
| `max_file_mb`, `max_file_s`, `max_sync_s` | The limits in force |
| `pipe` | Present only when the pipe is listening |
| `api` | `on`, `off` or `error` |
| `port` | The actual port the API listens on |

There is no secret in this file. The token stays in `config.json`.

## File transcription outputs

A transcript is written beside its source file by default, with the source stem and the format extension (`meeting.mp4` → `meeting.srt`). `--out` names another file or folder; for a folder batch it mirrors the tree under the destination. An existing output is skipped unless `--force` is passed.

TXT, JSON, SRT and VTT are described on [Transcript formats](/formats/). The API answers in the response body and writes no files.

## System audio recordings

A take with the sound source set to **System audio** is recorded, and its files are not part of the installation:

| Path | What it is | Format |
|---|---|---|
| `<system_recordings_dir>\<date>\<HH-MM-SS>.wav` | The take's sound, 16-bit, 16 kHz mono | WAV |
| The same name with `.txt` | The transcript queued on stop | Text |
| The same name with `.srt` | The same transcript as subtitles | SRT |

`system_recordings_dir` is empty by default, which means `Documents\VibeForma\Recordings` — the Windows Documents folder, which a redirected or OneDrive profile moves along with your other documents. The folder is set in **Settings → Recording**: the field shows the effective path, **Change…** picks another folder and **Default** returns to the default; an empty key follows the Documents folder. A date subfolder is created per day and the file is named by the take's start time; a second take in the same second gets a numeric suffix instead of overwriting. A folder that cannot be used is reported before the take starts.

The WAV, TXT and SRT are your files: a complete removal of the installation leaves them where they are, as it leaves every transcript produced by a file job.

## status.json

Written on every state change. It contains state, version, pid and timestamp. It is a convenience for scripts, not a source of truth; a response older than 60 seconds is not trusted.

## service.lock

The single-instance lock. It prevents a second service from starting and fighting over the microphone, the hotkey and the API port.

## install.log

The installer and updater write each step and the tail of an error to `%LOCALAPPDATA%\VibeForma\logs\install.log` — outside the install folder when `-Target` moves it, so a reinstall or a deleted folder does not take it. It is the first file to read when installation or an update fails.

## Temporary files

`POST /transcribe` writes a temporary WAV named `_http_in_*.wav` and deletes it on any outcome. `POST /v1/audio/transcriptions` and `POST /jobs` use `_file_in_*` and `_file_job_*` files in the logs folder for an uploaded body and delete them when done. Audio is not kept after recognition.

## Backup and removal

- **Back up** `config.json`, `models\`, and — if you need them — `history.jsonl`, `stats.json`, `corrections.json`. Transcripts are ordinary files next to their sources; back them up with those folders. System-audio recordings live in the recordings folder and are backed up like any other document.
- **Uninstall** from the tray or with `uninstall.cmd` removes shortcuts, autostart and the **Apps** entry. `--keep-data` keeps models, configuration, logs, history, statistics and corrections; `--remove-data` removes them too.
- **A complete removal is `uninstall.cmd --remove-data`.** It removes what the installer and the application created — the `vibeforma\` package, `mcp.cmd`, the requirements files, history and its sound, statistics, `status.json`, `location.json`, corrections, the top-level `.py` files and `.venv` — and leaves the folder ready for a fresh install. A file that is not the application's stays and is named on screen. System-audio recordings, transcripts and model folders you added are user files outside the folder and stay as well. If `-Target` placed the installation elsewhere, `%LOCALAPPDATA%\VibeForma\location.json` stands outside the folder and is rewritten at the next launch.
- **A clean reset** is deleting the folder and installing again into the same place — a missing or empty folder is a fresh install. The full procedure is on [Installation](/installation/).

## Where to go next

- [Settings reference](/settings-reference/) — the keys inside `config.json`.
- [Privacy](/privacy/) — which files contain what.
- [Diagnostics and logs](/diagnostics/) — how to read the logs.
- [Local API](/local-api/) — `location.json` and the token.
