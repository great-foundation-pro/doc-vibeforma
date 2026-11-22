---
title: Changelog
description: User-facing changes in VibeForma 0.x — what was added, changed and fixed.
---

This page summarizes user-facing changes. The authoritative log is [`CHANGELOG.md`](https://github.com/FormaMindPro/vibeforma/blob/main/CHANGELOG.md) in the repository and the GitHub Releases page.

The documentation describes **0.4.0**.

## 0.4.0 — 22 November 2026

### Added

- **Folder batches.** **Tray → Transcribe folder…** or `--transcribe-folder <dir>` queues every supported file in a folder, top level by default and `--recursive` for subfolders. Outputs land beside each source or mirror the tree under `--out`; an existing output is skipped unless `--force`; one bad file is recorded and the rest continue; cancel stops the current file and the queue. The CLI prints a JSON summary and exits `4` when the folder has nothing to transcribe.
- **A live progress strip** in the panel for a single file and a batch: a moving bar, the current file name, its percent, the batch counter `N/M — P%`, distinct queued/running/paused/done/error states and the error of one file while the batch goes on. A finished result hides after 8 seconds.

### Changed

- **Long files use batched inference.** Files at or above 60 seconds run through `faster_whisper.BatchedInferencePipeline` on the same loaded model, in 600-second blocks, with the same language, VAD, prompt and anti-hallucination settings. New keys `file_batched` (default `true`) and `file_batch_size` (default `8`, kept within 1–16). On the project's test machine a 660-second MP4 ran 5.2× faster than the sequential path; if the batched path fails, the job falls back without duplicates.

### Fixed

- **No popup when the target window changed.** A hotkey dictation that finishes in another window keeps the text in the panel draft with its insert, correct, copy, dictionary and cancel actions when `confirm_focus_change` is on, and goes to the clipboard when it is off. The Tk focus dialog is gone.

## 0.3.0 — 22 November 2026

### Added

- **File transcription.** The same faster-whisper engine takes audio and video files (`mp4`, `mkv`, `mov`, `webm`, `mp3`, `wav`, `m4a`) in addition to the microphone. PyAV decodes the file to 16 kHz mono float32; no external `ffmpeg` binary is needed.
- **TXT, JSON, SRT and VTT output** beside the source file, with `--out` and `--force`; JSON carries the text, language, model, duration and segment timestamps.
- **A file job queue with dictation priority.** One queue and one worker; a dictation pauses the file between segments and resumes it when the service is idle; cancel is cooperative; progress is measured against the file duration.
- **Tray action and panel progress.** **Tray → Transcribe file…** opens a file dialog; the panel shows its own progress line and a finished job offers **Open result folder**.
- **An OpenAI-compatible endpoint.** `POST /v1/audio/transcriptions` takes multipart form data, accepts `Authorization: Bearer` or `X-VibeForma-Token`, answers `json`, `text`, `srt`, `vtt` and `verbose_json`, and points a file longer than `file_max_sync_s` at `/jobs` with `413`.
- **A job API.** `POST /jobs`, `GET /jobs/<id>`, `DELETE /jobs/<id>`, `GET /jobs/<id>/result?format=...`, plus `GET /capabilities` and new `file_mode`, `jobs_running` and `jobs_queued` fields in `GET /health`.
- **A CLI over the named pipe.** `--transcribe` asks the running service over the current user's pipe, prints progress to stderr and the result to stdout (`--json` for a machine-readable answer), with exit codes 0/1/2/3.
- **Launcher and discovery.** `run.cmd` forwards arguments to `main.py`; `location.json` is schema 2 and publishes `launcher`, `python`, `entry`, `pipe`, `formats`, `languages` and the limits without secrets.
- **Config and limits.** `file_roots`, `file_max_mb`, `file_max_s`, `file_max_sync_s`, `job_keep_s` and `file_word_timestamps` join the defaults; an existing `config.json` keeps working.

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
- **minor** — new features, such as file transcription in 0.3.0 and folder batches in 0.4.0;
- **major** — a breaking change, not planned yet.

Release notes name the user-facing changes; internal refactors may appear only in the commit history.

## Where to go next

- [Roadmap](/roadmap/) — what comes next, without dates.
- [Updates](/updates/) — how a release reaches your machine.
- [Known issues and limitations](/known-issues/) — the current boundary.
- [Development](/development/) — the repository and the build.
