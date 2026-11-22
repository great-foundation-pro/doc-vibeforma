---
title: VibeForma in FormaMind
description: How VibeForma works as the voice layer of FormaMind — what works today, what is being built, and what is honestly not ready.
---

VibeForma and FormaMind are two parts of one system.

- **FormaMind** is the project tool: it holds projects, tasks and the work around them.
- **VibeForma** is the voice layer: it turns speech into text for code, documents, video and podcasts.

The idea is simple: instead of switching between a project tool and a separate dictation app, you speak into the work you are already doing.

## Why a voice layer

FormaMind is used at full power when text arrives at the speed of thought:

- **Vibe-coding** — dictating instructions, comments, commit messages and documentation into an editor or an AI assistant.
- **Writing** — drafts, specifications, replies and notes spoken instead of typed.
- **Video and podcasts** — turning recordings into text that can be searched, quoted and reused.

VibeForma exists to make that layer local, predictable and always available: one hotkey, no account, no upload.

## What works today

| Capability | Status |
|---|---|
| Dictation into any Windows application, including an editor or a FormaMind window | Works in 0.2.4 |
| Local recognition with faster-whisper | Works |
| Dictionary and snippets for project vocabulary | Works |
| Command line: `--toggle`, `--cancel`, `--status`, `--doctor`, `--selftest` | Works |
| Local HTTP API on `127.0.0.1` | Works when enabled |
| `hook_command` — send recognized text to your own command | Works when configured |
| File transcription for video and podcasts | Not in 0.2.4; planned for 0.3.0 |
| Native FormaMind integration | In development |

The honest summary: VibeForma already works as a dictation tool. FormaMind is in development, and the native bridge between them is not finished.

## How to use VibeForma with a project tool today

### Dictate into the editor

1. Open the FormaMind window, an editor or an AI assistant.
2. Put the cursor in the input field.
3. Press `Ctrl+Alt+Space` and speak.
4. The text is inserted into the window that was active at the hotkey.

Add project names and terms to the [dictionary](/dictionary/) so they are recognized and written consistently.

### Send text to a command

`hook_command` receives the recognized text on stdin as UTF-8, runs without a shell and has a timeout of 1–30 seconds. A failure is written to the log as a status and does not affect insertion. This is the simplest way to feed a local script, a note file or an agent harness.

### Call the local API

With the API enabled, a local tool can:

- check `GET /health` for state, version, model and language;
- send a WAV file to `POST /transcribe` with the `X-VibeForma-Token` header.

The API is loopback-only, rate-limited and accepts WAV up to 10 MB. Details: [Local API](/local-api/).

### Drive the service from the command line

`--toggle`, `--cancel` and `--status` talk to the running instance. A script can start a dictation, cancel it or read the state without touching the UI. Details: [Command line](/cli/).

## What is being built

- **File transcription (0.3.0)** — a second input into the same engine: a file instead of a microphone. Planned outputs are TXT, JSON, SRT and VTT, with timecodes, a job queue, pause and resume, and priority for live dictation. This is the piece that turns video and podcast recordings into text inside the same workflow.
- **Agent and harness surfaces** — a named pipe, an extended `location.json`, a `--transcribe` CLI path and an OpenAI-compatible transcription endpoint.
- **Native FormaMind integration** — voice control of project tasks and a tighter connection between the project tool and the voice layer.

These are plans, not shipped features. The [roadmap](/roadmap/) states them without dates, and the published documentation does not promise them as available.

## What this means for you today

- If you want **local dictation on Windows**, VibeForma is ready now. Start with [Quickstart](/quickstart/).
- If you want **video and podcast transcription**, it is not in 0.2.4. Watch the [roadmap](/roadmap/) or use a file transcription tool in the meantime.
- If you are **building an integration**, the CLI, the hook and the local API are usable today; the file and agent surfaces are being designed for 0.3.0.

## Where to go next

- [Command line](/cli/) — the flags and the hook.
- [Local API](/local-api/) — the loopback endpoint.
- [Roadmap](/roadmap/) — what comes next, without dates.
- [Known issues and limitations](/known-issues/) — what is not available.
