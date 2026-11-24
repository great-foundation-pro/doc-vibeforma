---
title: Changelog
description: User-facing changes in VibeForma 0.4.4 — verified release archives and updates that wait for file work.
---

This page summarizes the user-facing changes in VibeForma releases. Release notes are also published on the GitHub Releases page.

## 0.4.4 — 24 November 2026

### Added

- **The release archive is verified before anything is unpacked.** The app downloads `SHA256SUMS` together with the release zip, checks the hash and hands the verified local files to the bootstrap through `VIBEFORMA_UPDATE_ZIP` and `VIBEFORMA_UPDATE_SUMS`, never through the command line. `install.ps1` verifies the archive on its own download path too, and a missing sums file, a missing line or a mismatch stops the install before unpacking.
- **Updates wait for file work.** An update is deferred while a recording is in flight or a file job is unfinished — a single file or a folder batch; in `auto` mode it retries by itself once the work completes. The deferred text and the notification name the recording or transcription.
- **Release notes come from the changelog.** The release workflow writes the current version's section into `RELEASE_NOTES.md` and attaches it as the GitHub release body, so a release is never published empty.

### Changed

- **A source checkout says so.** Running from a git checkout (a `pyproject.toml` beside `app/`, no install marker) shows a clear `source_checkout` state instead of installing a release zip over the sources; an installed copy updates as before.
- The updates documentation page describes the job-aware deferral and the checksum check before unpacking.

### Fixed

- **A failed relaunch no longer tears the service down.** The service shuts down only after the new process really started; when the spawn fails it keeps running and reports a failed install, and the interpreter is looked up in the installed copy and then in the parent dev clone.

## 0.4.3 — 23 November 2026

### Added

- **The update check is always in sight.** The settings window header carries the running version and a **Check for updates** button next to it on every page. A click checks GitHub and answers right in the window: the latest version, an available release with **Download** and **Later**, a network failure, or a request to wait while a recording finishes. **Download** runs the same installation command as before and restarts the app; **Later** dismisses the offer until the next check. The duplicate check button at the bottom of the System page is gone; the update toggles stay.

## 0.4.2 — 23 November 2026

### Fixed

- **Rare 10–20 s waits before the final text are gone.** A live partial now reads only the last 10 seconds of the take and decodes greedily at one temperature, so it no longer holds the engine lock for the whole growing buffer. The final dictation pass keeps beam 5 and a two-step temperature fallback (0.0 and 0.2) instead of six steps. Each partial's duration is logged: above 2 s as `Slow partial`, otherwise at debug level. File mode keeps its full temperature fallback and its behavior is unchanged.

## 0.4.1 — 23 November 2026

### Added

- **System audio capture.** With `"audio_source": "system"` in `config.json`, the hotkey records what the computer plays instead of the microphone, and the same hotkey stops the take. The default output is captured through its WASAPI loopback — Bluetooth, USB and HDMI outputs included, not only the on-board jack — so a YouTube video or a film can be transcribed. Silence auto-stop and live partial text are off in this mode; `max_record_s` still applies. If the loopback is unavailable, a clear notification appears instead of an empty result. The **Sound source** switch (Microphone / System audio) is on the Settings window's Record tab.
- **An audio device refresh.** When Windows re-creates an audio endpoint while the service runs, the cached device table is re-read once and the same capture plans are retried, so a 48 kHz WASAPI take comes back without restarting the application. The log line now names the host API (`api=Windows WASAPI`) next to the device and rate.

### Changed

- **The speech band is kept whole.** The resampler from a device rate to 16 kHz now uses 127 taps with a Kaiser beta of 10 instead of 25/8: flat to 6 kHz, aliases from 9 kHz suppressed (previously a 9 kHz tone folded to 7 kHz at -13.7 dB).
- **The VAD keeps the beginning of a phrase.** `speech_pad_ms` grows from 30 to 400 and `min_silence_duration_ms` from 250 to 1000, so the first word and the closing punctuation survive in both dictation and file mode.

## 0.4.0 — 22 November 2026

### Added

- **Folder batches.** **Tray → Transcribe folder…** or `--transcribe-folder <dir>` queues every supported file in a folder, top level by default and `--recursive` for subfolders. Outputs land beside each source or mirror the tree under `--out`; an existing output is skipped unless `--force`; one bad file is recorded and the rest continue; cancel stops the current file and the queue. The CLI prints a JSON summary and exits `4` when the folder has nothing to transcribe.
- **A live progress strip** in the panel for a single file and a batch: a moving bar, the current file name, its percent, the batch counter `N/M — P%`, distinct queued/running/paused/done/error states and the error of one file while the batch goes on. A finished result hides after 8 seconds.
- **Batched inference for long files.** Files at or above 60 seconds run through `faster_whisper.BatchedInferencePipeline` on the same loaded model, in 600-second blocks, with the same language, VAD, prompt and anti-hallucination settings. The keys `file_batched` (default `true`) and `file_batch_size` (default `8`, kept within 1–16) control it. On the project's test machine a 660-second MP4 ran 5.2× faster than the sequential path; if the batched path fails, the job falls back without duplicates.
- **Focus-change safeguard.** A hotkey dictation that finishes in another window keeps the text in the panel draft with its insert, correct, copy, dictionary and cancel actions when `confirm_focus_change` is on, and goes to the clipboard when it is off.

## How to read version numbers

VibeForma uses `major.minor.patch`:

- **patch** — fixes and small behavior changes;
- **minor** — new features;
- **major** — a breaking change, not planned yet.

Release notes name the user-facing changes; internal refactors may appear only in the commit history.

## Where to go next

- [Roadmap](/roadmap/) — what comes next, without dates.
- [Updates](/updates/) — how a release reaches your machine.
- [Known issues and limitations](/known-issues/) — the current boundary.
- [Development](/development/) — the repository and the build.
