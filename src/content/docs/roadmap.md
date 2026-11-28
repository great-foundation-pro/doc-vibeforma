---
title: Roadmap
description: What VibeForma is working on now, next and later — without dates or promises.
---

The roadmap states direction, not deadlines. Features move when they are ready and accepted, not when a date says so.

## Now — 0.5.9 :badge[Current]{variant=success}

The current release is a complete local dictation and file transcription tool:

- local recognition with four models, 26 language presets and a fixed language with a hint when it looks wrong;
- recognition quality presets — **Normal (recommended)**, **Accurate** and **Fast** — and local CT2 model folders kept in a list, with a folder that is never deleted on a switch;
- toggle and hold-to-talk modes, VAD and continuous dictation without the 120-second cap;
- a guard against invented endings: a trailing "to be continued" line and an invented subtitle credit are cut when the sound does not support them, and a phrase you really said stays;
- audible start and stop cues through the default output device, with both checkboxes on by default;
- live subtitles for system audio, and a system-audio take recorded to a WAV with TXT and SRT beside it;
- a take clock on the panel, text cleanup, doubtful-word highlighting and **Recognize more precisely**;
- a monitoring panel with streaming, privacy mode, a draft action row and a file progress strip;
- nine settings sections applied to the live service;
- dictionary with application profiles, snippets, history with optional sound and per-entry re-recognition, and statistics;
- **file transcription** of audio and video, folder batches, TXT/JSON/SRT/VTT output and a queue that gives dictation priority;
- a tray menu, autostart and a single-instance lock;
- a CLI with `--transcribe`, `--transcribe-folder`, `--prompt`, `--words`, `--clip` and `--cancel-batch`;
- an optional loopback HTTP API, an OpenAI-compatible endpoint and a job API;
- an MCP server (`mcp.cmd`) that hands an AI agent `vibeforma_capabilities`, `vibeforma_transcribe_file` and `vibeforma_job_status` over stdio;
- an uninstaller whose `--remove-data` leaves the install folder ready for a fresh install;
- English and Russian documentation.

## Next — FormaMind and deeper agent workflows :badge[Next]{variant=note}

- **Native FormaMind integration** — voice control of project tasks and a tighter link between the project tool and the voice layer.
- **Project workflows on top of the file mode** — recordings becoming notes, tasks and documents without leaving the machine.

The agent surfaces: the named pipe, `location.json` schema 2, the file CLI, the OpenAI-compatible endpoint and the job API (0.4.0); the MCP server joined them in 0.4.5. FormaMind itself is in development. The published documentation does not present it as finished.

## Later :badge[Later]{variant=caution}

Later work is not specified. Candidates are named only when a card exists and the scope is accepted. There are no dates.

## Not planned :badge[Out of scope]{variant=danger}

These are out of scope for the dictation product:

- speaker diarization;
- translation;
- video subtitles;
- cloud recognition;
- parallel transcription of several files at once;
- meetings, summaries, teams and billing;
- mobile apps;
- macOS and Linux versions.

## How to follow progress

- [Changelog](/changelog/) — what has shipped.
- [GitHub Releases](https://github.com/FormaMindPro/vibeforma/releases) — archives and release notes.
- [Known issues and limitations](/known-issues/) — the current boundary.

## Where to go next

- [VibeForma in FormaMind](/formamind/) — the integration direction.
- [Comparison](/comparison/) — how other tools cover what is not here yet.
- [Updates](/updates/) — how a release arrives.
- [Contributing](/contributing/) — how to take part.
