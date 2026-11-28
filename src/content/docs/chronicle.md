---
title: VibeForma chronicle
description: From the first 0.1.0 release to 0.5.9 — dates, releases and turning points.
---

VibeForma appeared on 20 November 2026 and went through thirty-two releases in eight days, from the first sound to 0.5.9. This page is the spine of the blog: a short chronology that every post in the series points back to.

The release dates are real. The posts were published on 28 November 2026 as a retrospective, assembled from the CHANGELOG, logs and sources rather than written on each release day. That is the honest version: the reader sees both the date of the event and the date of the telling.

## 20 November — the first sound

**0.1.0–0.2.4.** Local dictation: hotkey, microphone, Whisper, text inserted into the active window. The language is pinned exactly (0.1.1), 26 languages in the menu, a panel with level and live previews, settings applied live, tray, installer, CUDA/CPU. By the evening — `--doctor`, dictionary, history, a transactional installer and the first 34 tests.

[Post: “The first sound”](/blog/2026-11-28-02-the-first-sound/)

## 21 November — the site

The documentation opens at vibeforma.pro: five sections, English and Russian, a blog and a development journal.

[Post: “The site as the other half”](/blog/2026-11-28-03-the-site-as-the-other-half/)

## 22 November — files and batches

**0.3.0–0.4.0.** The same engine takes files: mp4, mkv, mov, webm, mp3, wav, m4a; TXT, JSON, SRT, VTT; a queue with dictation priority; an OpenAI-compatible endpoint and a job API. Folder batches and a batched pass for long files.

[Post: “Files: a second entrance”](/blog/2026-11-28-04-files-a-second-entrance/)

## 23 November — system audio and speed

**0.4.1–0.4.3.** System audio capture through WASAPI loopback, live subtitles, a 127-tap resampler, VAD with 400 ms padding. The rare 10–20 second waits before the final text are gone. The update check moves into the settings header.

[Post: “Hearing what the computer hears”](/blog/2026-11-28-06-hearing-what-the-computer-hears/) · [“Speed”](/blog/2026-11-28-05-speed-without-the-wait/)

## 24 November — trust in updates and agents

**0.4.4–0.4.5.** SHA-256 of the archive before unpacking, updates wait for recordings and file work, release notes come from the CHANGELOG. An MCP server with three tools for local agents.

[Post: “Files: a second entrance”](/blog/2026-11-28-04-files-a-second-entrance/)

## 25 November — the big 0.5.0 release

Live subtitles of system audio, continuous dictation, confidence and a draft, text cleanup, application profiles, history with sound, voice actions, 26 punctuation languages, a language hint, CT2 folders, sentence-level SRT/VTT, WER/CER.

[Posts: “A long thought”](/blog/2026-11-28-07-a-long-thought/) · [“The model that doubts”](/blog/2026-11-28-08-the-model-that-doubts/) · [“Your words”](/blog/2026-11-28-09-your-words/)

## 26–27 November — the polish

**0.5.1–0.5.5.** The recordings folder, local model folders, model updates by consent, waiting for the hotkey release, an installer that survives Cyrillic and special paths, a Hugging Face revision check.

[Post: “Your words”](/blog/2026-11-28-09-your-words/)

## 28 November — the invented ending

**0.5.6–0.5.9.** The guard against an invented ending: stop list, VAD, word duration, pace. 0.5.8 fixes the window offset on long takes so the cut does not take real words with it. 0.5.9 makes the start and stop cues audible through the output device and adds invented subtitle credits to the stop list.

[Post: “To be continued does not follow”](/blog/2026-11-28-10-to-be-continued-does-not-follow/)

## The series

1. [The voice that stays with you](/blog/2026-11-28-01-the-voice-that-stays/) — the idea.
2. [The first sound](/blog/2026-11-28-02-the-first-sound/) — 0.1.0–0.2.4.
3. [The site as the other half](/blog/2026-11-28-03-the-site-as-the-other-half/) — 21 November.
4. [Files: a second entrance](/blog/2026-11-28-04-files-a-second-entrance/) — 0.3.0–0.4.0, 0.4.5.
5. [Speed: why the text waited twenty seconds](/blog/2026-11-28-05-speed-without-the-wait/) — 0.4.0–0.4.2.
6. [Hearing what the computer hears](/blog/2026-11-28-06-hearing-what-the-computer-hears/) — 0.4.1–0.5.1.
7. [A long thought does not break](/blog/2026-11-28-07-a-long-thought/) — 0.5.0.
8. [The model that doubts](/blog/2026-11-28-08-the-model-that-doubts/) — 0.5.0.
9. [Your words](/blog/2026-11-28-09-your-words/) — 0.5.0–0.5.5.
10. [To be continued does not follow](/blog/2026-11-28-10-to-be-continued-does-not-follow/) — 0.5.6–0.5.8.
