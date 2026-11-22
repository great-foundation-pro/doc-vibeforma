---
title: Settings reference
description: Every VibeForma setting by section — key, default, values and effect.
---

This page lists the settings the 0.2.4 source and documentation name explicitly. A UI setting without a documented key still lives in `config.json`, but this page does not invent a key name for it.

Defaults are the values a fresh installation writes.

## Recording

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Input device | stored in `config.json` | system default | a Windows input device | The microphone VibeForma captures. |
| Hold to talk | `hold_to_talk` | `false` | `true` / `false` | `true` — hold the hotkey while speaking; `false` — press to start and stop. |
| Silence before the phrase ends | `silence_ms` | `2000` | milliseconds | How long a pause ends the phrase. |
| Maximum phrase length | `max_record_s` | `120` | seconds | A hard stop for a long phrase. |
| Partial transcription interval | `partial_every_s` | `1.5` | seconds | How often partial text is streamed to the panel. |
| Start beep | `beep_on` | — | `true` / `false` | A sound when recording starts. |
| End beep | `beep_off` | — | `true` / `false` | A sound when recording stops. |
| Paste method | `paste_method` | `Shift+Insert` | `Shift+Insert`, `Ctrl+V` | How the text is inserted. |
| Restore clipboard | `restore_clipboard` | on | `true` / `false` | Return the previous clipboard about one second after insertion. |
| Exclude from clipboard history | `clipboard_exclude_history` | on | `true` / `false` | Mark dictated text as excluded from Windows clipboard history and cloud clipboard. |
| Notify with text | `notify_text` | `false` | `true` / `false` | Show the dictated phrase in a notification instead of only the character count. |

## Keyboard shortcuts

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Dictation hotkey | `hotkey` | `Ctrl+Alt+Space` | a key combination | Starts and stops dictation. The only editable key. |
| Other keys | — | fixed | — | `Esc`, `Ctrl+Enter`, `Shift+Insert`, `Ctrl+F`, `Ctrl+S`, `Delete`, `Ctrl+A` are fixed. |

## Model and language

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Model | `model` | `large-v3-turbo` | `large-v3`, `large-v3-turbo`, `medium`, `small` | The recognition model. |
| Keep the previous model | `model_keep_old` | — | `true` / `false` | Leaves the old model on disk after a switch. |
| Recognition language | `language` | chosen at first run | one of 26 codes | The exact language the model recognizes. No `auto`. |
| Personal terms | `hotwords` | empty | list of terms | Terms always included in the recognition prompt. |

## Dictionary and snippets

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Dictionary | stored with settings | empty | up to 500 term → replacement pairs | Recognition terms and post-recognition replacements. |
| Snippets | stored with settings | empty | up to 500 trigger → text pairs | Spoken triggers expanded after recognition. |
| Correction learning | `corrections.json` | empty | changed words only | Suggestions based on repeated corrections. |

## History

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| History | stored in `config.json` | off | on / off | Records the last 100 dictations. Turning it off deletes `history.jsonl`. |

## Statistics

Statistics have no settings. They count dictations, words, characters and seconds per day and store numbers in `stats.json`.

## Appearance

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Panel transparency | `hud_alpha` | — | alpha value | How transparent the panel is. |
| Automatic growth | `hud_autogrow` | — | `true` / `false` | The panel grows with the draft text. |
| Start in privacy mode | `hud_privacy` | `false` | `true` / `false` | Hides streaming and the last text from the start. |
| Show panel | `hud` | on | `true` / `false` | Whether the panel is shown. |

## System

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Autostart | stored in `config.json` | chosen at install | on / off | Starts the service with Windows. |
| Update checks | stored in `config.json` | on | on / off | Background checks of GitHub Releases. |
| Check interval | `update_interval_h` | `2` | hours | How often a check runs while idle. |
| Automatic install | `auto_update` | off | `auto` or off | `auto` installs a found release without asking. |
| Local API | stored in `config.json` | off | on / off | Starts the loopback HTTP listener. |
| API port | port setting | `8787` | a port number | The preferred port; a busy port falls back to a free loopback port. |
| API token | stored in `config.json` | generated on first enable | secret string | Required by `POST /transcribe`. |
| Log window titles | `log_window_titles` | `false` | `true` / `false` | Adds target window titles to the log. Off by default; only the handle and character count are logged. |
| Onboarding completed | `onboarding_done` | `false` | `true` / `false` | Whether the three-step assistant has been completed. |

## Automation

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Hook command | `hook_command` | empty | a command line | Receives recognized text on stdin, without a shell. |
| Hook timeout | `hook_timeout_s` | — | 1–30 seconds | How long the hook may run. A timeout is logged as a status. |

## Where settings live

`config.json` in the install directory, next to the executable entry (`run.cmd`, `main.py`) and the `.venv` folder. See [Files and locations](/files-and-paths/).

Settings are saved with `Ctrl+S` in the settings window. Most apply to the running service immediately; a model change runs through a progress dialog.

## Where to go next

- [Settings](/settings/) — the sections in context.
- [Files and locations](/files-and-paths/) — paths and formats.
- [Command line](/cli/) — flags that act on the running service.
- [Local API](/local-api/) — the API settings.
