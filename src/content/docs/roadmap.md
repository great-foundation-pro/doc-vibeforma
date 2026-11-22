---
title: Roadmap
description: What VibeForma is working on now, next and later — without dates or promises.
---

The roadmap states direction, not deadlines. Features move when they are ready and accepted, not when a date says so.

## Now — 0.4.0 :badge[Current]{variant=success}

The current release is a complete local dictation and file transcription tool:

- local recognition with four models and a fixed language;
- toggle and hold-to-talk modes, VAD and a 120-second phrase limit;
- a monitoring panel with streaming, privacy mode, a draft action row and a file progress strip;
- nine settings sections applied to the live service;
- dictionary, snippets, history and statistics;
- **file transcription** of audio and video, folder batches, TXT/JSON/SRT/VTT output and a queue that gives dictation priority;
- a tray menu, autostart and a single-instance lock;
- a CLI with `--transcribe`, `--transcribe-folder` and `--cancel-batch`;
- an optional loopback HTTP API, an OpenAI-compatible endpoint and a job API;
- English and Russian documentation.

## Next — FormaMind and deeper agent workflows :badge[Next]{variant=note}

- **Native FormaMind integration** — voice control of project tasks and a tighter link between the project tool and the voice layer.
- **Project workflows on top of the file mode** — recordings becoming notes, tasks and documents without leaving the machine.

The agent surfaces are in 0.4.0: the named pipe, `location.json` schema 2, the file CLI, the OpenAI-compatible endpoint and the job API. FormaMind itself is in development. The published documentation does not present it as finished.

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
