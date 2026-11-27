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
| Dictation into any Windows application, including an editor or a FormaMind window | Works in 0.4.0 |
| Local recognition with faster-whisper | Works |
| Dictionary and snippets for project vocabulary | Works |
| Command line: `--toggle`, `--cancel`, `--status`, `--transcribe`, `--transcribe-folder`, `--doctor`, `--selftest` | Works |
| Local HTTP API on `127.0.0.1` | Works when enabled |
| `hook_command` — send recognized text to your own command | Works when configured |
| File transcription for video and podcasts, including folder batches | Works in 0.4.0 |
| Native FormaMind integration | In development |

The honest summary: VibeForma works as a dictation tool and as a local file transcription tool. FormaMind is in development, and the native bridge between them is not finished.

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

- check `GET /health` for state, version, model, language and the file queue;
- send a short WAV to `POST /transcribe` with the `X-VibeForma-Token` header;
- send an audio or video file to the OpenAI-compatible `POST /v1/audio/transcriptions`;
- queue a long file with `POST /jobs` and read the result from `GET /jobs/<id>/result`.

The API is loopback-only and requires the token. Details: [Local API](/local-api/).

### Drive the service from the command line

`--toggle`, `--cancel` and `--status` talk to the running instance. A script can start a dictation, cancel it or read the state without touching the UI. Details: [Command line](/cli/).

## What is being built

- **Native FormaMind integration** — voice control of project tasks and a tighter connection between the project tool and the voice layer.
- **Project workflows on top of the file mode** — turning recordings into project notes, tasks and documents without leaving the local machine.

The agent surfaces are in 0.4.0: the named pipe, `location.json` schema 2, `--transcribe` and `--transcribe-folder`, the OpenAI-compatible endpoint and the job API. What remains is the native FormaMind bridge; the [roadmap](/roadmap/) states it without dates, and the published documentation does not promise it as available.

## What this means for you today

- If you want **local dictation on Windows**, VibeForma is ready now. Start with [Quickstart](/quickstart/).
- If you want **video and podcast transcription**, 0.5.5 does it locally, including a whole folder as a batch. See [File transcription](/file-transcription/).
- If you are **building an integration**, the CLI, the named pipe, the OpenAI-compatible endpoint and the job API are usable today. See [AI agents and integrations](/agents/).

## Where to go next

- [Command line](/cli/) — the flags and the hook.
- [Local API](/local-api/) — the loopback endpoint.
- [Roadmap](/roadmap/) — what comes next, without dates.
- [Known issues and limitations](/known-issues/) — what is not available.
