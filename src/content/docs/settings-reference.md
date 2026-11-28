---
title: Settings reference
description: Every VibeForma setting by section — key, default, values and effect.
---

This page lists the settings the 0.5.8 source and documentation name explicitly. A UI setting without a documented key still lives in `config.json`, but this page does not invent a key name for it.

Defaults are the values a fresh installation writes.

## Recording

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Input device | `input_device` | empty | a device-name fragment | The microphone VibeForma captures. |
| Sound source | `audio_source` | `microphone` | `microphone`, `system` | `system` captures the default output through its WASAPI loopback, feeds live subtitles and writes the take to a WAV with TXT and SRT beside it. |
| Recognition quality | `quality_preset` | `normal` | `normal`, `accurate`, `fast` | The final dictation pass: `normal` — beam 5 with a 0.0 → 0.2 temperature fallback; `accurate` — beam 10 at temperature 0; `fast` — beam 1 at temperature 0. Read at the next final pass, so saving applies without a restart. An old config without the key and an unknown value read as `normal`. File transcription and live subtitles keep their own settings; no separate temperature key exists. |
| System recordings folder | `system_recordings_dir` | empty | a folder path | **Settings → Recording**: where a system-audio take writes its WAV, TXT and SRT. The field shows the effective path, **Change…** picks a folder and **Default** returns to `Documents\VibeForma\Recordings`; an empty key follows the Documents folder. A date subfolder is created per day. A folder that cannot be written is reported before the take starts. |
| Hold to talk | `hold_to_talk` | `false` | `true` / `false` | `true` — hold the hotkey while speaking; `false` — press to start and stop. |
| Continuous dictation | `continuous` | `true` | `true` / `false` | No phrase cap: a take is cut at a pause of 400 ms after 1 s of speech or every 30 s, and inserted once. `false` restores `max_record_s`. If recognition falls behind and 240 s accumulate, the buffered backlog is dropped with a log entry — a memory guard, not a phrase limit. |
| Silence before the phrase ends | `silence_ms` | `2000` | milliseconds | How long a pause ends the phrase. |
| Maximum phrase length | `max_record_s` | `120` | seconds | A hard stop for a long phrase, used when `continuous` is off. |
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
| Model | `model` | `large-v3-turbo` | `large-v3`, `large-v3-turbo`, `medium`, `small`, or a path to a CT2 folder | The recognition model. A folder is loaded with `local_files_only`; a broken folder is refused instead of downloading another model. |
| Local model folders | `model_folders` | empty | up to 20 `{name, path}` records | CT2 folders listed in **Settings → Model & language**; paths are absolute. Validity is `model.bin` present, computed when the list is drawn. A folder is never a deletion target. |
| Keep the previous model | `model_keep_old` | — | `true` / `false` | Leaves the old model on disk after a switch. Only downloaded models inside `models\` can be removed; an absolute path, a `..` step, another drive or a link leading outside is refused. |
| Recognition language | `language` | chosen at first run | one of 26 codes | The exact language the model recognizes. No `auto`. |
| Personal terms | `hotwords` | empty | list of terms | Your terms and the dictionary terms share a 223-token hotword budget on every 30-second window. |
| Dictation context | `dictation_context` | `false` | `true` / `false` | Adds the previous phrase (tail of 160 characters) and the target window's selected text (up to 400 characters) to `hotwords` for the next take only. Off: nothing is read. |

## Dictionary and snippets

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Dictionary | stored with settings | empty | up to 500 term → replacement pairs | Recognition terms and post-recognition replacements. |
| Snippets | stored with settings | empty | up to 500 trigger → text pairs | Spoken triggers expanded after recognition. |
| Application profiles | `app_profiles` | empty | up to 50 profiles | A profile binds `{name, process, window, dictionary, snippets}` to an app; chosen by the window that receives the text, it overlays the global lists without duplicates. |
| Correction learning | `corrections.json` | empty | changed words only | Suggestions based on repeated corrections. |

## Text processing

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Cleanup | `text_cleanup` | `false` | `true` / `false` | Converts numbers and dates to digits for Russian and English (wetext), removes filler words and fixes capitalization. Punctuation stays with Whisper; protected fragments (`snake_case`, `camelCase`, paths, URLs, e-mail, backticks) stay byte for byte. No settings tab yet. |

## History

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| History | `history` | `false` | `true` / `false` | Records the last 100 dictations. Turning it off deletes `history.jsonl` and saved sound. |
| History with sound | `history_audio` | `false` | `true` / `false` | With history on, keeps a 16-bit WAV per dictation in `history_audio/`; the folder is capped at 200 MiB, oldest first, and deleting a record deletes its WAV. A record with its WAV can be re-recognized by **Recognize more precisely** in the history window. No settings tab yet. |

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
| API token | stored in `config.json` | generated on first enable | secret string | Required by every API request. |
| Log window titles | `log_window_titles` | `false` | `true` / `false` | Adds target window titles to the log. Off by default; only the handle and character count are logged. |
| Onboarding completed | `onboarding_done` | `false` | `true` / `false` | Whether the three-step assistant has been completed. |

## File transcription

These keys live in `config.json`; the settings window has no separate tab for them.

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Allowed roots | `file_roots` | empty | list of folders | Empty allows every local fixed or removable disk; a list restricts file jobs to those roots. |
| Maximum file size | `file_max_mb` | `4096` | megabytes | A larger file is refused. |
| Maximum duration | `file_max_s` | `21600` | seconds | A longer file is refused. |
| Synchronous API limit | `file_max_sync_s` | `900` | seconds | Longer files must use `/jobs` instead of `/v1/audio/transcriptions`. |
| Job retention | `job_keep_s` | `86400` | seconds | How long a finished job stays in memory. |
| Word timestamps | `file_word_timestamps` | `false` | `true` / `false` | Adds word-level timings to JSON output. |
| Include subfolders | `file_folder_recursive` | `false` | `true` / `false` | The tray folder dialog walks subfolders. |
| Batched long files | `file_batched` | `true` | `true` / `false` | Files at or above 60 seconds use the batched inference path. |
| Batch size | `file_batch_size` | `8` | 1–16 | Blocks per batched pass. |

## Automation

| Setting | Key | Default | Values | Effect |
|---|---|---|---|---|
| Hook command | `hook_command` | empty | a command line | Receives recognized text on stdin, without a shell. |
| Hook timeout | `hook_timeout_s` | `5` | 1–30 seconds | How long the hook may run. A timeout is logged as a status. |
| Voice actions | `actions` | empty | up to 200 entries | `{trigger, kind}` with `kind` `command`, `model` or `agent`; `model` needs `model`, `agent` needs `command`. A whole phrase, matched after the dictionary and snippets, runs the action instead of being inserted; a failed command still inserts the phrase and logs the exit code. |

## Where settings live

`config.json` in the install directory, next to the executable entry (`run.cmd`, `main.py`) and the `.venv` folder. See [Files and locations](/files-and-paths/).

Settings are saved with `Ctrl+S` in the settings window. Most apply to the running service immediately; a model change runs through a progress dialog.

## Where to go next

- [Settings](/settings/) — the sections in context.
- [Files and locations](/files-and-paths/) — paths and formats.
- [Command line](/cli/) — flags that act on the running service.
- [File transcription](/file-transcription/) — the file keys in context.
- [Local API](/local-api/) — the API settings.
