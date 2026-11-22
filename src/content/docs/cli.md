---
title: Command line
description: The VibeForma command line — toggle, cancel, status, doctor and selftest, exit codes and the hook command.
---

The installed copy exposes a small command line. It talks to the running service rather than starting a second one.

## Entry points

| Entry | Use |
|---|---|
| `run.cmd` | The shortest path; runs the app with the bundled virtual environment |
| `.venv\Scripts\python.exe main.py` | The explicit Python entry point |

An older README mentions `VibeForma.exe`. There is no separate executable in 0.2.4: the installed copy is a source copy with `run.cmd`, `main.py` and `.venv`. Use one of the two entries above.

Examples below use `run.cmd`.

## Flags

| Flag | What it does |
|---|---|
| `--toggle` | Starts or stops recording. |
| `--cancel` | Discards the recording or the panel draft. |
| `--status` | Prints the running instance's `status.json`: state, version, pid, timestamp. |
| `--doctor` | Runs the diagnostic checks and prints `OK` / `WARN` / `FAIL` per line. |
| `--selftest` | Runs imports, loads the model, transcribes `test_ru.wav` and prints the recognized text. |

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
| 1 | No running instance, a failed check, a failed selftest or an invalid command. |

`--toggle`, `--cancel` and `--status` require a running service. Without one they return 1.

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

## Where to go next

- [Local API](/local-api/) — the HTTP surface.
- [Diagnostics and logs](/diagnostics/) — what `--doctor` checks.
- [Files and locations](/files-and-paths/) — `status.json`, `location.json` and logs.
- [VibeForma in FormaMind](/formamind/) — how the CLI serves an integration.
