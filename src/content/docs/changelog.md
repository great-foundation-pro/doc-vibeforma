---
title: Changelog
description: User-facing changes in VibeForma 0.4.0 — what the release adds.
---

This page summarizes the user-facing changes in VibeForma 0.4.0. Release notes are also published on the GitHub Releases page.

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
