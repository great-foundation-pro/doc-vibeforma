---
title: Roadmap
description: What VibeForma is working on now, next and later — without dates or promises.
---

The roadmap states direction, not deadlines. Features move when they are ready and accepted, not when a date says so.

## Now — 0.2.4 :badge[Current]{variant=success}

The current release is a complete local dictation tool:

- local recognition with four models and a fixed language;
- toggle and hold-to-talk modes, VAD and a 120-second phrase limit;
- a monitoring panel with streaming, privacy mode and a draft action row;
- nine settings sections applied to the live service;
- dictionary, snippets, history and statistics;
- a tray menu, autostart and a single-instance lock;
- a CLI and an optional loopback HTTP API;
- English and Russian documentation.

## Next — 0.3.0 :badge[Next]{variant=note}

**File transcription** is the next feature: a second input into the same recognition engine, a file instead of a microphone.

Planned scope:

- audio and video files, decoded locally;
- output in TXT, JSON, SRT and VTT with timecodes;
- a job queue with pause, resume and priority for live dictation;
- a tray item **Transcribe file…** and a progress line in the panel;
- `--transcribe` on the command line;
- an OpenAI-compatible transcription endpoint and a job API;
- an extended `location.json` and a named pipe for local harnesses;
- settings for file roots, size and duration limits, and job retention.

The feature is being built. The documentation pages for file transcription, formats and agents are reserved but not published until the release is accepted.

## Next — agents and FormaMind :badge[Next]{variant=note}

- **Agent surfaces** — a stable local contract for harnesses that need to transcribe files and read results.
- **Native FormaMind integration** — voice control of project tasks and a tighter link between the project tool and the voice layer.

FormaMind itself is in development. The published documentation does not present it as finished.

## Later :badge[Later]{variant=caution}

Later work is not specified. Candidates are named only when a card exists and the scope is accepted. There are no dates.

## Not planned :badge[Out of scope]{variant=danger}

These are out of scope for the dictation product:

- speaker diarization;
- translation;
- video subtitles;
- cloud recognition;
- batch processing of file queues;
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
