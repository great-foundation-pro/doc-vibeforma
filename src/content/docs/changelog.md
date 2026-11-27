---
title: Changelog
description: User-facing changes in every VibeForma release — new features, fixes and the limits we name honestly.
---

This page summarizes the user-facing changes in VibeForma releases. Release notes are also published on the GitHub Releases page.



## 0.5.3 — 27 November 2026

### Added
- **The system-audio recordings folder is a setting.** The Recording tab shows the folder
  system-audio takes are written to, with the active path, and offers "Change…" (folder picker),
  "Open" and "Default" (`Documents\VibeForma\Recordings`). An unusable folder is rejected with a
  localized message before a take starts; the WAV, TXT and SRT of a take land in the chosen folder.

### Fixed
- **A busy clipboard no longer eats the phrase.** The copy of the recognized text retries
  for a short moment when another program holds the clipboard and, if it still fails, ends
  the insert with an explicit error status; the text stays in the history for a manual
  re-insert.
- **Holding `Esc` cancels once.** Autorepeat presses no longer spawn dozens of parallel
  cancel threads; the watcher keeps a single cancel in flight.
- **Recording stops safely and the sound monitor comes back.** Stopping no longer races the
  audio writer; the live system-audio monitor revives after a device failure and partial
  failures are reported honestly.
- **Hand-written hotkey aliases start the service.** `control+alt+space` or `win+escape` in
  `config.json` are normalized through one shared keymap.
- **The installer survives Cyrillic and special-character paths**, reads child output as
  UTF-8, expands `~/VibeForma` to the home folder, guards locale placeholders and gives
  CUDA driver mismatches their own hints.
- **A failed update rolls back to the old installation**: the previous marker is snapshotted
  into the backup, the backup survives a failed restore, and the venv is rebuilt from the
  restored requirements.
- **Uninstall finds shortcuts at odd paths**: `-like` wildcard metacharacters are escaped.

### Changed
- CI measures coverage on a Python matrix (3.10–3.14) with a threshold; root modules are
  covered by strict mypy; the installer stays a thin entry under 400 lines.

## 0.5.2 — 26 November 2026

### Fixed
- **Insertion no longer races the hotkey.** VibeForma waits for `Ctrl+Alt+Space` to be
  released before pasting, re-checks the target window, and leaves the text on the
  clipboard as the manual fallback when the wait times out; the previous clipboard is
  restored after a successful paste again.

## 0.5.1 — 26 November 2026

### Added

- **A system-audio take is recorded to files.** With the sound source set to **System audio**, the take is written as a 16-bit, 16 kHz mono WAV into the recordings folder — `Documents\VibeForma\Recordings` by default, a date subfolder, the file named by the take's start time — and on stop TXT and SRT are queued beside it. The path appears on the panel's status line for the whole take, and a notification repeats it. Nothing is inserted, and dictation history and statistics stay untouched. A folder that cannot be written is reported before the take starts. Live subtitles and the 30-second capture buffer are unchanged.
- **A take clock on the panel.** A monospaced clock sits in a fixed-width column left of the level bar and appears only during a take. A microphone take with a limit (`continuous: false`) counts down to `max_record_s` with a minus sign and turns amber under 30 seconds and red under 10; continuous dictation and a system-audio take count elapsed time in neutral color. Hovering says which time it shows, and the digits never shift the line below.
- **Recognition quality presets.** **Settings → Recording** gains **Recognition quality** right under the sound source: **Normal (recommended)** — beam 5 with the 0.0 → 0.2 temperature fallback; **Accurate** — beam 10 at temperature 0, slower; **Fast** — beam 1 at temperature 0, quicker but weaker on a complex phrase. The choice is stored as `quality_preset` and read when the final dictation pass starts, so a saved change applies to the next phrase without a restart. It is the only quality control of that pass: there is no separate temperature setting. File transcription and live subtitles keep their own settings.
- **Local model folders.** **Settings → Model & language** lists CT2 model folders with their name, path and a validity mark, and marks the current one. **Add folder** refuses a folder without `model.bin`; **Use** switches through the existing progress dialog, and a failed switch keeps the model that was in use; **Remove from the list** deletes only the record and never a file; **Return to the built-in** selects a catalog model again. The list lives in `config.json` as `model_folders` (absolute paths, up to 20), survives a restart, and a manual path in `model` keeps working.
- **A saved model folder survives a switch.** With `model_keep_old: false` only downloaded models inside `models\` are deleted. A folder you added is never a deletion target: an absolute path, a `..` step, another drive or a link leading outside is refused.
- **"Recognize more precisely" for one history entry.** The history window offers the button for exactly one selected entry whose WAV is still on disk; without the sound it stays disabled with the reason. The pass decodes the WAV again in the background with beam 10 at temperature 0 while the table stays usable, and replaces the entry's text and confidence. A failed, empty or unreadable pass leaves the entry as it was.
- **A complete uninstall.** `uninstall.cmd --remove-data` removes what the installer and the application created — the `vibeforma\` package, `mcp.cmd`, the requirements files, history and its sound, statistics, `status.json`, `location.json`, corrections, the top-level `.py` files and `.venv` — and leaves the folder ready for a fresh install. `--keep-data` keeps models, configuration, logs, history, statistics and corrections; files that belong to you stay and are named on screen.

## 0.5.0 — 25 November 2026

### Added

- **Live subtitles for system audio.** With the sound source set to **System audio**, the panel shows the last one or two phrases while a film, a video or a call plays. Nothing is inserted into the active window, and the same hotkey stops the take. A partial covers the last 10 seconds and refreshes at most every 4 seconds; the capture buffer is capped at 30 seconds, so a take can run for hours without growing. On music an invented phrase can still reach the plate: a live partial carries no engine readings, so only a short stop list and a repetition loop are filtered.
- **"Recognize more precisely" for a doubtful draft.** When the final pass ran at a temperature above zero or the phrase looks uncertain, the panel offers **Recognize more precisely**: the same recording is decoded again with beam 10 at temperature 0 and replaces the draft. **Restore previous** returns the exact earlier text and highlighting. A confident phrase does not get the button. A long doubtful take offers it when history audio is on, because the whole recording is needed.
- **Text cleanup, off by default.** With `text_cleanup` on, numbers and dates are written as digits for Russian and English (through wetext), filler words — "эээ", "ну", "как бы", "um", "you know" — are removed where it is safe, and a capital letter starts the text and every sentence. Punctuation still comes from Whisper. Protected fragments — `snake_case`, `camelCase`, dotted paths, URLs, e-mail addresses, Windows paths and text in backticks — stay byte for byte. There is no settings tab yet; the key lives in `config.json`.
- **Continuous dictation without the 120-second cap.** `continuous` is on by default. A long take is cut at a pause of 400 ms after at least one second of speech, or at 30 seconds with the last 300 ms carried into the next chunk. Chunks are recognized by the final pass, joined without repeated words at the seams and inserted once. With `continuous: false`, `max_record_s` stops a phrase as before.
- **Dictionary terms reach every window.** Terms now go through the engine's `hotwords` parameter on every 30-second window, not only into the first prompt. The target form is used, and up to 223 tokens are selected by correction frequency instead of an alphabetical cut. The same path serves dictation, live partials and file transcription.
- **Application profiles.** `app_profiles` binds a dictionary and snippets to a process name and/or a window-title fragment. The profile is chosen by the window that will receive the text, overlays the global dictionary and snippets without duplicates, and is edited in **Settings → Dictionary** (up to 50 profiles).
- **Voice actions.** The list `actions` runs a command through `hook_command`, switches the model, or starts an external agent when a whole phrase matches. Matching comes after the dictionary and snippets; a triggered action is not inserted as text; a failed command still inserts the phrase and writes the exit code to the log.
- **History with sound, and retranscription of the last record.** `history_audio` keeps a 16-bit WAV of each dictation in `history_audio/` next to `history.jsonl`. The folder is capped at 200 MiB, the oldest file goes first, and deleting a record deletes its WAV. **Tray → Retranscribe last** asks for a prompt, can use another model and puts the new text in the panel draft.
- **Punctuation presets for all 26 menu languages.** Every language in the recognition menu now has its own prompt preset with punctuation and capitalization guidance, written in that language.
- **A language hint.** When the pinned language scores below 50% and another language scores at least 50%, the panel shows "looks like X (..%), Y selected (..%)" for 20 seconds. The pinned language does not change.
- **A model from a folder.** `model` accepts a path to a converted CT2 folder. VibeForma loads it with `local_files_only`, checks `model.bin`, `config.json`, `tokenizer.json` and the vocabulary, and refuses a broken folder with a named error instead of downloading a different model.
- **The batched path is guarded like the sequential one.** A batched segment over the thresholds is re-decoded sequentially on its own slice of the block; a warning names the segment, and the replacement passes the same post-filter. A 600-second block seam carries the last 200 characters of the previous block, so a name given in the first block survives the second one; the prompt does not grow.
- **Context for the next phrase, off by default.** With `dictation_context` on, the tail of the previous phrase (160 characters) and the text selected in the target window (up to 400 characters) go into `hotwords`, so names are spelled the same way.
- **A hallucination guard.** A stop list of typical invented phrases in Russian and English, a `no_speech_prob` threshold of 0.6, a compression-ratio check of 1.35 on non-speech and a 2-second silence threshold drop invented text on silence and music before it reaches the panel or the transcript. A loop the engine reads as speech is kept with a warning.
- **Confidence is kept.** Every segment carries `avg_logprob`, `compression_ratio`, `no_speech_prob` and `temperature`; every word carries `probability`. JSON and `verbose_json` publish them. A doubtful phrase stays in the panel draft with its doubtful words underlined instead of being pasted blindly; **Insert** still pastes it.
- **The agent contract carries the engine.** `/jobs`, `/v1/audio/transcriptions`, the CLI and the MCP tools accept `prompt`, `word_timestamps` and `clip_timestamps` and report the values applied. `verbose_json` follows the OpenAI schema with segment readings and a top-level `words[]` with `probability`.
- **Subtitle cues follow sentences.** SRT and VTT are cut by word timings: a sentence end or a pause of 0.6 seconds closes a cue, and a seam between engine windows no longer splits a sentence. Without word timings the previous behavior stands.

### Fixed

- **Word timings no longer fail a file.** An `IndexError` from `find_alignment` in faster-whisper 1.2.1 is caught per block; the block is retried without word timestamps, the warning is logged, and segments already emitted are not repeated.

### Limits

- **Silero punctuation is not included.** The model is licensed CC BY-NC-SA 4.0 (non-commercial); the decision is recorded in ADR 0001. Punctuation stays with Whisper, numbers with wetext.
- **A live subtitle can invent text on music.** A live partial has no `no_speech_prob` or compression ratio, so only a short stop list and a repetition loop are filtered.
- **The system-audio mode does not write a file yet.** A system take feeds live subtitles and is not saved as a transcript; file output for it is planned for a later release.
- **Text cleanup has no settings tab yet**, and it does not convert a small single numeral outside a recognized phrase: "пять рублей" stays words.
- **Continuous dictation has a memory guard.** If recognition falls behind and the buffer reaches 240 seconds, the buffered backlog is dropped with a warning in the log. It is not the old phrase cap: `max_record_s` stays out of the way while continuous dictation is on.

## 0.4.5 — 24 November 2026

### Added

- **An AI agent can use the local transcriber over MCP.** `app\mcp.cmd` starts a stdio MCP server that finds the running service through `location.json`, reads the token from `config.json` and offers three tools: `vibeforma_capabilities`, `vibeforma_transcribe_file` and `vibeforma_job_status`. Transcription queues the file through `/jobs` and returns the text when the job finishes. No listener is added and the requests are pinned to `http://127.0.0.1` with redirects refused.
- **Settings show the connection facts.** The new section **AI and automation** displays the loopback endpoint, the MCP launcher and two copy buttons: the key and a ready connection block for a local AI client. The key itself stays in `config.json`.

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
