---
title: Diagnostics and logs
description: The --doctor checks, the --selftest chain, the error catalog and what to attach to a support report.
---

VibeForma has two diagnostic commands, a structured error catalog and rotating logs. Together they answer "is this machine able to dictate?" without guessing.

## `--doctor`

Run it in any of three ways:

```powershell
.\run.cmd --doctor
```

- from the tray: **Diagnostics**;
- from the settings: **System → Diagnostics**.

### What it checks

| Check | What a failure means |
|---|---|
| Python | The interpreter is missing or outside the supported range. |
| Dependencies | A required package is missing or broken. |
| Model on disk | The selected model is not present; dictation will fail or download. |
| CUDA / CPU profile | CUDA was expected but is unavailable; the CPU profile must be used. |
| Microphone | No input device, or the device cannot be opened. |
| Hotkey | The combination cannot be registered, usually because another app owns it. |
| Update settings | The update configuration is inconsistent. |
| Disk space | Not enough room for the model or an update. |
| Privacy switches | A privacy-related setting is in an unexpected state. |

Each line is `OK`, `WARN` or `FAIL`. The exit code is 0 when nothing failed and 1 otherwise. A warning is a fact to know, not always a blocker.

### What the report contains

The report is read-only. It contains no:

- dictated text;
- window titles;
- `hotwords`;
- dictionary entries;
- history records;
- HTTP token.

The settings window has a **Copy report** button for the same output. You can attach it to an issue safely, but read it once before posting.

## `--selftest`

```powershell
.\run.cmd --selftest
```

The chain is fixed:

1. imports;
2. load the model;
3. read `test_ru.wav`;
4. recognize it and print the text.

Exit code 0 means the chain passed; 1 means it failed. `test_ru.wav` is present both in a fresh git clone and in an installed copy.

This is the fastest proof that recognition works on the machine, independent of the microphone and the hotkey. If `--selftest` passes but dictation does not, the problem is in capture, the hotkey or insertion — not in the model.

## The error catalog

Every user-facing error in the app has:

- a code;
- a plain message;
- a next action.

The messages are localized. The raw exception text goes only to the log, never to the UI. When you report an error, include the code: it identifies the branch without a screenshot.

## Logs

| Item | Detail |
|---|---|
| Folder | `logs\` in the install directory |
| Rotation | Five files of 1 MB each |
| Dictated text | Never written |
| Window titles | Only with `log_window_titles: true`; by default only the handle and character count |
| Open from the app | Tray → **Logs folder** |

A typical line records a state change, an insertion with the character count, or a failure with its code.

## `status.json`

The service writes `status.json` on every state change:

| Field | Meaning |
|---|---|
| `state` | idle, recording, processing, paused, updating, error |
| `version` | Product version |
| `pid` | Process ID |
| `timestamp` | When the state was written |

It is a convenience for scripts, not a source of truth. A response older than 60 seconds is not trusted.

## What to attach to a report

1. The `--doctor` report.
2. The last part of the current log file, from the moment the problem started.
3. The error code shown in the UI, if there was one.
4. Steps that reproduce the problem.
5. Windows version and whether the machine has an NVIDIA GPU.

Redact the API token and any personal text before posting. The doctor report already excludes both.

## If the app does not start at all

1. Run `run.cmd --doctor` from a terminal and read the first `FAIL`.
2. Read `install.log` in `%LOCALAPPDATA%\VibeForma\logs`.
3. Run `--selftest` to separate a model problem from a startup problem.
4. Reinstall with the same installer; it continues from the failed step.

More in [Troubleshooting](/troubleshooting/).

## Where to go next

- [Troubleshooting](/troubleshooting/) — symptoms and fixes.
- [Known issues and limitations](/known-issues/) — documented limits.
- [Command line](/cli/) — flags and exit codes.
- [Files and locations](/files-and-paths/) — logs, `status.json` and `install.log`.
