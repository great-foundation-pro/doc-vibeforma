---
title: Known issues and limitations
description: What VibeForma 0.5.0 does not do, which limits are deliberate, and which issues are known.
---

This page is the honest boundary of the product. Some limits are deliberate design choices; some are known issues; some are out of scope.

## Platform

| Limit | Detail |
|---|---|
| Windows only | Windows 10 build 1809+ or Windows 11, x64 or ARM64. There is no macOS, Linux, iOS or Android version. |
| One instance | A single service runs at a time (`service.lock`). A second launch asks the running instance to show the panel. |
| GPU profiles | VibeForma ships an NVIDIA CUDA profile and a CPU profile. Other GPU vendors are not a documented profile. |

## Recognition

| Limit | Detail |
|---|---|
| No automatic language detection | The language is fixed in the settings and applies until you change it. |
| One language per phrase | No mid-phrase switching and no translation. |
| 26 menu codes | The menu offers 26 language codes; the model supports about 99 languages. The menu is not the model's full list. |
| No diarization | VibeForma does not separate speakers. |
| 120-second cap only when continuous is off | Continuous dictation is on by default; with `continuous: false`, a recording stops at `max_record_s` (120 s). |
| Continuous backlog cap | If recognition falls behind and continuous dictation buffers 240 s, the buffered backlog is dropped with a warning in the log. It is a memory guard, not the phrase limit. |
| Punctuation comes from Whisper | Silero is not included: its model is CC BY-NC-SA 4.0 (non-commercial), recorded in ADR 0001. Numbers may be converted by wetext when text cleanup is on. |
| Live subtitles can invent text on music | A live partial carries no `no_speech_prob` or compression ratio; only a short stop list and a repetition loop are filtered. |

## File transcription

| Limit | Detail |
|---|---|
| One file at a time | A folder batch is a queue, not parallel processing. |
| Local disks only | UNC shares and network paths are refused; `file_roots` can narrow the allowed roots. |
| Default limits | 4096 MB per file and 6 hours of duration; both are config keys. |
| No overwrite by default | An existing output is skipped unless `--force` is passed. |
| Recorded batch failures | A bad file or a duplicate output name is recorded as an error; the rest of the batch continues. |
| Word timings are off | `file_word_timestamps` adds them to JSON and enables sentence cues in SRT/VTT; it is off by default. |
| System audio is subtitles, not a file | A system-audio take feeds live subtitles and is not saved as a transcript yet. |
| Long-file speed depends on hardware | The batched path helps on CUDA; a CPU-only machine is slower. |

## Installation and updates

| Limit | Detail |
|---|---|
| Unsigned build | There is no code-signing certificate or signed manifest. Windows SmartScreen may warn. |
| Checksums, not signatures | Releases ship with `SHA256SUMS`; a checksum detects corruption, not authorship. |
| No silent update by default | A release is offered; automatic installation only with `auto_update: auto`. |
| Python required | The installer needs Python 3.10–3.14 on the machine. |

## Data and history

| Limit | Detail |
|---|---|
| History cap | The last 100 dictations. |
| No history export | The table has no export action. |
| Dictionary and snippet cap | Up to 500 pairs each. |
| Clipboard managers | A third-party clipboard manager may keep dictated text even though Windows clipboard history and cloud sync are excluded. |
| Undo window | `Ctrl+Z` works only within 30 seconds and in the same window. |

## Local API

| Limit | Detail |
|---|---|
| Off by default | The API does not listen until you enable it. |
| Loopback only | No remote access. |
| 10 MB WAV | `/transcribe` takes one short recording per request. |
| One request per second | A faster client gets `429`. |
| Idle only | A dictation has priority; a busy service returns `409`. |
| Synchronous file cap | `/v1/audio/transcriptions` stops at `file_max_sync_s` (900 s); longer files go to `/jobs`. |

## Out of scope

These are not planned as part of the dictation product:

- speaker diarization;
- translation;
- burning subtitles into video;
- cloud recognition;
- parallel transcription of several files at once;
- meetings, summaries, teams and billing;
- mobile apps.

## Known environment issues

- **Bluetooth headsets** can switch to a low-quality hands-free profile. If recognition quality drops, use a wired or USB microphone.
- **Hotkey conflicts** with another application prevent registration. Choose another combination in the settings.
- **Antivirus** may flag an unsigned installer. Verify the checksum and allow the file only if you trust the source.
- **Very weak CPUs** make large models slow. Use `small` or `large-v3-turbo`, or a machine with CUDA.
- **Disk space** must hold the model plus working room; an update needs space for the archive and the backup.

## Where to go next

- [Troubleshooting](/troubleshooting/) — what to do about a symptom.
- [Roadmap](/roadmap/) — what may change.
- [Comparison](/comparison/) — where other tools cover these gaps.
- [FAQ](/faq/) — short answers.
