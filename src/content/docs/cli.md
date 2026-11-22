---
title: Command line
description: The VibeForma command line — toggle, cancel, status, file transcription, folder batches, exit codes and the hook command.
---

The installed copy exposes a small command line. It talks to the running service rather than starting a second one.

## Entry points

| Entry | Use |
|---|---|
| `run.cmd` | The shortest path; runs the app with the bundled virtual environment |
| `.venv\Scripts\python.exe main.py` | The explicit Python entry point |

There is no separate executable in 0.4.0: the installed copy is a source copy with `run.cmd`, `main.py` and `.venv`. Use one of the two entries above.

Examples below use `run.cmd`.

## Flags

| Flag | What it does |
|---|---|
| `--toggle` | Starts or stops recording. |
| `--cancel` | Discards the recording or the panel draft. |
| `--status` | Prints the running instance's `status.json`: state, version, pid, timestamp. |
| `--transcribe <file>` | Transcribes one audio or video file over the named pipe. |
| `--transcribe-folder <dir>` | Queues every supported file in a folder as one batch. |
| `--cancel-batch [<id>]` | Stops every unfinished batch, or the named one. |
| `--doctor` | Runs the diagnostic checks and prints `OK` / `WARN` / `FAIL` per line. |
| `--selftest` | Runs imports, loads the model, transcribes `test_ru.wav` and prints the recognized text. |
| `--help` | Prints the whole command contract, including the file and folder options. |

### `--toggle`

```powershell
.\run.cmd --toggle
```

Same as pressing the dictation hotkey: starts or stops recording.

### `--cancel`

```powershell
.\run.cmd --cancel
```

Discards the phrase or the panel draft. Nothing is inserted.

### `--status`

```powershell
.\run.cmd --status
```

Prints the status of the running instance:

| Field | Meaning |
|---|---|
| `state` | idle, recording, processing, paused, updating, error |
| `version` | Product version |
| `pid` | Process ID |
| `ts` | Timestamp |

A response older than 60 seconds is not considered current. `status.json` is a convenience, not a source of truth.

### `--transcribe`

```powershell
.\run.cmd --transcribe "D:\audio\meeting.mp4"
.\run.cmd --transcribe "D:\audio\note.m4a" --format txt --out "D:\text" --json
```

Transcribes one audio or video file. The call goes to the running service over the current user's named pipe and never opens a port. Progress goes to stderr; stdout carries the result path, or a JSON object with `--json`.

| Option | Meaning |
|---|---|
| `--lang <code>` | Recognition language, for example `ru` or `en`; default is the config |
| `--format <name>` | `txt`, `json`, `srt`, `vtt` or `all`; default `srt` |
| `--out <path>` | Write the result there instead of beside the source |
| `--json` | Machine-readable answer on stdout |
| `--force` | Overwrite an existing output file |

### `--transcribe-folder`

```powershell
.\run.cmd --transcribe-folder "D:\audio\podcast" --recursive --format srt --json
```

Queues every supported file in a folder. The top level is used by default; `--recursive` includes subfolders. `--out` mirrors the folder tree under the destination, existing outputs are skipped unless `--force`, and one bad file does not stop the batch. The command prints a JSON summary.

### `--cancel-batch`

```powershell
.\run.cmd --cancel-batch
.\run.cmd --cancel-batch 3f2a1c
```

Stops every unfinished batch, or the batch whose id is named. The current file stops at a segment boundary and the queue does not continue.

### `--doctor`

```powershell
.\run.cmd --doctor
```

Checks Python, dependencies, the model on disk, the CUDA/CPU profile, the microphone, the hotkey, update settings, free disk space and privacy switches. Each line is `OK`, `WARN` or `FAIL`; the exit code is 0 when nothing failed and 1 otherwise.

The report is read-only. It contains no dictated text, no window titles, no hotwords, no dictionary, no history and no HTTP token. The settings window has a **Copy report** button for the same output.

### `--selftest`

```powershell
.\run.cmd --selftest
```

Runs a fixed chain: imports → model → `test_ru.wav` → recognized text. Exit code 0 means the chain passed, 1 means it failed. The WAV is present both in a fresh git clone and in an installed copy.

This is the fastest way to prove that recognition works on a machine, independent of the microphone.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success — the command completed, or the checks passed. |
| 1 | No running instance, a service or job error, a failed check, a failed selftest or an invalid command. |
| 2 | Bad arguments — an unknown option, a missing value, an unknown format or a second input file. |
| 3 | The transcription or the batch was cancelled. |
| 4 | `--transcribe-folder` found nothing to transcribe. |

`--toggle`, `--cancel`, `--status`, `--transcribe` and `--transcribe-folder` require a running service. Without one they return 1. While the model is loading, a file call answers `the model is loading` and exits 1; retry later.

## The hook command

`hook_command` sends the recognized text to your own command:

- the text arrives on **stdin** as UTF-8;
- the command runs **without a shell**, so metacharacters are ordinary characters;
- the timeout is 1–30 seconds (`hook_timeout_s`);
- a failure or timeout is written to the log as a status only;
- insertion is not affected; the hook runs in parallel.

Example: a small Python script that appends the text to a daily note.

```powershell
.\run.cmd --status
```

Then set `hook_command` in `config.json`, for example:

```json
"hook_command": "python C:\\tools\\vibe-hook.py",
"hook_timeout_s": 5
```

Because there is no shell, do not rely on `|`, `>`, `&&` or environment expansion inside the command string. Put the logic in the script.

## Scripting recipes

Start a dictation from a Stream Deck or a script:

```powershell
.\run.cmd --toggle
```

Check whether the service is idle before sending work:

```powershell
.\run.cmd --status
```

Verify a fresh installation without a microphone:

```powershell
.\run.cmd --selftest
```

Collect a support report:

```powershell
.\run.cmd --doctor > doctor.txt
```

Transcribe a recording and keep the answer machine-readable:

```powershell
.\run.cmd --transcribe "D:\audio\call.m4a" --format json --json
```

Queue a folder and read the summary:

```powershell
.\run.cmd --transcribe-folder "D:\audio\inbox" --recursive --json
```

## Where to go next

- [File transcription](/file-transcription/) — the queue, batches and limits.
- [Transcript formats](/formats/) — `--format` and `--out`.
- [Local API](/local-api/) — the HTTP surface.
- [Diagnostics and logs](/diagnostics/) — what `--doctor` checks.
- [Files and locations](/files-and-paths/) — `status.json`, `location.json` and logs.
- [VibeForma in FormaMind](/formamind/) — how the CLI serves an integration.
