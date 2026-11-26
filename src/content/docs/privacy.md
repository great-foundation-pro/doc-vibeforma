---
title: Privacy
description: What stays on your machine, what touches the network, what is written to disk, and how to delete it.
---

VibeForma is local by design: speech recognition runs on your machine, and there is no account, cloud or telemetry.

## What never leaves the machine

- **Audio.** It is captured and recognized on this machine and never uploaded. When you choose to keep it — history audio on, or a system-audio take — the recording stays in a local file.
- **File audio and transcripts.** Files are decoded and recognized locally. A transcript is written beside its source only when you transcribe a file, and it is not uploaded.
- **Recognized text.** It goes to the target window and, if you enable it, to the local history file. It is not uploaded.
- **Dictionary, snippets, hotwords.** They stay in `config.json`.
- **History and statistics.** Both are local files.
- **Logs.** They stay in `logs\` and never contain dictated text.

## When the network is used

The network is used for exactly two purposes:

| Purpose | What is contacted | When |
|---|---|---|
| Model download | The model distribution source; the shared Hugging Face cache is used when present | During installation, or when you switch to a model that is not on disk |
| Update check and download | GitHub Releases | About 90 seconds after start, then every `update_interval_h` (2 hours) while idle, or when you press **Check now** |

Recognition itself makes no network request. With update checks disabled, the app does not contact GitHub on its own.

There is no analytics service, no crash reporting endpoint, no account server and no license check.

## What is written to disk

| File | Contains | Default |
|---|---|---|
| `config.json` | Settings, dictionary, snippets, hotwords, model, language, API token | Always |
| `models\` | The recognition model | Always |
| `logs\` | State changes, insertions with character counts, errors | Always; no dictated text |
| `history.jsonl` | The last 100 dictations with text | Off |
| `history_audio\` | One 16-bit WAV per dictation, next to `history.jsonl`; capped at 200 MiB, the oldest file goes first | Off; only with history on |
| `stats.json` | Four counters per day | Always, numbers only |
| `corrections.json` | Only the words changed by correction learning | When learning is used |
| `location.json` | Paths and the actual API port; no secret | When the service runs |
| `status.json` | State, version, pid, timestamp | When the service runs |
| `service.lock` | Single-instance lock | While running |

## History is opt-in

History is off by default. When you turn it on, it keeps the last 100 dictations in `history.jsonl` next to `config.json`. Turning it off **deletes the file** and the saved sound.

History stores text, application name and direction; it never stores window titles. With `history_audio` on it also stores the WAV of each dictation in `history_audio\` next to `history.jsonl`, and that folder is capped at 200 MiB, the oldest file going first. Deleting a record deletes its WAV, clearing history deletes the saved sound, and turning `history_audio` off removes the sound saved by the previous run.

## Statistics are numbers only

`stats.json` stores dictations, words, characters and seconds per day. It never stores text, words as strings, application names or window titles.

## The clipboard

- The previous clipboard is restored about a second after insertion if nothing new was copied.
- Dictated text is marked as excluded from Windows clipboard history and cloud clipboard (`CanIncludeInClipboardHistory=0`, `CanUploadToCloudClipboard=0`).
- A third-party clipboard manager may still keep the text; the settings warn about this.

## The panel privacy mode

The eye button hides streaming and the last text; the microphone level stays visible. `hud_privacy: true` starts the panel in this mode. The status line disappears after 30 seconds.

## Logs

- Dictated text is never written to the log.
- Window titles are written only with `log_window_titles: true`. By default the log records the window handle and the character count.
- Logs rotate: five files of 1 MB.

## The local API

The API is off by default. When enabled, it listens only on `127.0.0.1`, requires a token on every request, accepts WAV up to 10 MB at most once per second, and deletes the temporary WAV on any outcome.

## Diagnostics

The `--doctor` report is read-only and excludes dictated text, window titles, hotwords, the dictionary, history and the HTTP token. The `--selftest` output is the recognized test phrase from `test_ru.wav`.

## Deleting your data

| To delete | Do this |
|---|---|
| History and its sound | Turn history off (deletes `history.jsonl` and the saved sound), delete a record (deletes its WAV), or turn `history_audio` off (removes the stored sound at the next start) |
| Statistics | Reset on the Statistics tab, or delete `stats.json` |
| Learning data | Delete `corrections.json` |
| Models and settings | Uninstall with `--remove-data`, or delete the install directory |
| Everything | Uninstall with `--remove-data` and delete the remaining folder |

## What VibeForma does not protect against

- A local user with access to your Windows account can read `config.json`, history and statistics.
- A clipboard manager you installed can capture dictated text.
- A screen recorder can capture the panel when privacy mode is off.
- The local API token is stored in plain text in `config.json`; protect the file with Windows account permissions.

## Where to go next

- [Security](/security/) — the threat model and the API.
- [Files and locations](/files-and-paths/) — every file and its format.
- [History](/history/) — the opt-in record of dictations and their sound.
- [Statistics](/statistics/) — counters without text.
