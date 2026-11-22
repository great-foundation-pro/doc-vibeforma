---
title: Glossary
description: VibeForma terms in English and Russian — short definitions for the words used across the documentation.
---

Terms are listed with the English and Russian forms used in the app and in these pages. Where the interface uses an English label on both locales, that is noted.

| Term | По-русски | Meaning |
|---|---|---|
| ASR | Распознавание речи | Automatic speech recognition — turning audio into text. |
| Whisper | Whisper | The open speech-recognition model family VibeForma builds on. |
| faster-whisper | faster-whisper | The local implementation of Whisper used by VibeForma. |
| Model | Модель | A recognition model file: `large-v3`, `large-v3-turbo`, `medium`, `small`. |
| VAD | VAD (определение речи) | Voice activity detection — decides whether a frame contains speech. |
| Hotkey | Горячая клавиша | The global key combination that starts and stops dictation. |
| Toggle mode | Режим toggle | Press once to start, press again to stop. |
| Hold to talk | Режим удержания | Hold the hotkey while speaking, release to stop. |
| Panel / HUD | Панель | The small monitoring window with level, VAD and streamed text. |
| Tray | Трей | The Windows notification-area icon and its menu. |
| Insertion | Вставка | Placing recognized text at the cursor in the target window. |
| Paste method | Метод вставки | `Shift+Insert` (default) or `Ctrl+V`. |
| Clipboard restore | Возврат буфера | Returning the previous clipboard about a second after insertion. |
| Dictionary | Словарь | Term → replacement pairs, up to 500. |
| Hotwords | Личные термины | Terms always included in the recognition prompt. |
| Snippet | Сниппет | A spoken trigger replaced by a prepared text block. |
| History | История | The optional local record of the last 100 dictations. |
| Statistics | Статистика | Local counters of dictations, words, characters and seconds. |
| Hook | Хук, `hook_command` | A user command that receives recognized text on stdin. |
| File transcription | Транскрибация файлов | Recognizing an audio or video file instead of the microphone. |
| Folder batch | Пакет папки | A queue of media files from one folder, processed one at a time. |
| Job | Задача | One queued file; its state and progress are exposed by `/jobs`. |
| Transcript | Расшифровка | The text result, written as TXT, JSON, SRT or VTT. |
| SRT / VTT | SRT / VTT | Subtitle formats with timecodes. |
| Named pipe | Именованный канал | The per-user local channel the CLI uses without a port or token. |
| Local API | Локальный API | The optional HTTP listener on `127.0.0.1`. |
| Loopback | Loopback | The local interface `127.0.0.1`; traffic does not leave the machine. |
| Token | Токен | The secret required by the local API, stored in `config.json`. |
| `location.json` | `location.json` | The discovery file with the actual API port; no secret inside. |
| `status.json` | `status.json` | The service state file: state, version, pid, timestamp. |
| Onboarding | Онбординг, помощник настройки | The three-step first-run assistant. |
| SHA256SUMS | `SHA256SUMS` | The checksum file that verifies a release archive. |
| Endonym | Эндоним | A language name written in that language, for example Русский. |
| FormaMind | FormaMind | The project tool for which VibeForma is the voice layer. |
| MIT | MIT | The open-source license of VibeForma. |

## Where to go next

- [What is VibeForma?](/introduction/) — the product in two minutes.
- [Settings reference](/settings-reference/) — keys and defaults.
- [Files and locations](/files-and-paths/) — the files named above.
- [FAQ](/faq/) — short answers to common questions.
