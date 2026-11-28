---
title: Local API
description: The optional loopback HTTP API — enabling it, the token, /health, /capabilities, file transcription, the job API, limits and status codes.
---

VibeForma can expose a small HTTP API for local tools. It is **off by default**. When enabled, it listens only on `127.0.0.1` and requires a token.

This is the technical bridge for editors, scripts and agents — the surface FormaMind can use without a cloud account. An MCP-capable client can skip the raw HTTP: the bundled MCP server (`mcp.cmd`) wraps this API — see [AI agents and integrations](/agents/).

![The System tab with the local API switch for external forms.](../../assets/docs/app/settings-system-en.png)

*Settings → System: the local API switch.*
## Enable the API

1. Open **Settings → System**.
2. Turn on the local API.
3. VibeForma creates and saves the API token automatically on the first enable.
4. The listener starts on the live service without a restart.

If the token is missing, the server does not start. The failure is fail-closed: no token, no listener.

## Address and port

| Item | Value |
|---|---|
| Bind address | `127.0.0.1` only |
| Default port | `8787` |
| Busy port | A free loopback port is taken automatically |
| Discovery | `location.json` publishes the actual port |
| Reachable from another machine | No |

Tools should read `location.json` instead of assuming 8787:

```json
{
  "schema": 2,
  "app": "vibeforma",
  "version": "0.5.9",
  "config": "C:\\Users\\you\\AppData\\Local\\VibeForma\\config.json",
  "api": "on",
  "port": 8787,
  "file_mode": true,
  "pipe": "\\\\.\\pipe\\VibeForma-you",
  "formats": ["txt", "json", "srt", "vtt"],
  "max_file_mb": 4096,
  "max_file_s": 21600,
  "max_sync_s": 900
}
```

The file contains no secret. The token stays in `config.json`. The full schema is on [AI agents and integrations](/agents/).

## Authentication

Every request must carry the token:

```
X-VibeForma-Token: <token>
```

The file endpoint also accepts the OpenAI-style header:

```
Authorization: Bearer <token>
```

The comparison is constant-time (`hmac.compare_digest`). A missing or wrong token returns `401`.

Read the token from `config.json` in your client; never hard-code it into a shared script or commit it.

## Endpoints

### `GET /health`

Reports the service state:

| Field | Meaning |
|---|---|
| `ok` | Whether the service is healthy |
| `app` | Application name |
| `api` | API state (`1` while listening) |
| `port` | Actual listening port |
| `version` | Product version |
| `model` | Loaded model |
| `language` | Recognition language |
| `state` | idle, recording, processing, paused, updating, error |
| `file_mode` | `true` when the file queue is ready, `loading` while the model loads |
| `model_loading` | The inverse of readiness |
| `dictation_priority` | Always `true`: live dictation wins |
| `jobs_running`, `jobs_queued` | The file queue |

### `GET /capabilities`

Repeats the discovery facts for a harness that found no `location.json`: `file_mode`, `word_timestamps`, `formats`, `models`, `languages`, `max_file_mb`, `max_file_s`, `max_sync_s`, `pipe`, `launcher`, `python`, `entry`, the declared `prompt` and `clip_timestamps`, and the queue counters. It answers `503` while the model is still loading.

### `POST /transcribe`

Transcribes one short WAV recording.

| Requirement | Value |
|---|---|
| Method and path | `POST /transcribe` |
| Header | `X-VibeForma-Token` |
| Content type | `audio/wav` |
| Body | WAV bytes |
| Maximum size | 10 MB |
| Rate | At most one request per second |
| Service state | Only while the service is free; a dictation has priority |

On success the response carries the recognized text as JSON. A temporary WAV named `_http_in_*.wav` is created in the logs folder and deleted on any outcome.

### `POST /v1/audio/transcriptions`

The OpenAI-compatible file endpoint. It takes multipart form data:

| Field | Meaning |
|---|---|
| `file` | Audio or video file; required |
| `model` | Accepted for compatibility |
| `language` | Recognition language, for example `ru` |
| `response_format` | `json`, `text`, `srt`, `vtt` or `verbose_json` |
| `prompt` | Initial prompt, up to 1024 characters |
| `temperature` | Sampling temperature |
| `word_timestamps` | Word timings; `timestamp_granularities[]=word` is accepted as the OpenAI spelling |
| `clip_timestamps` | Ranges to transcribe, for example `12.5,30` |

The synchronous answer stops at `file_max_sync_s` (900 seconds by default). A longer file returns `413` with `"job_endpoint": "/jobs"`. The response is the transcript itself; the endpoint does not write files. `verbose_json` carries the engine readings: `avg_logprob`, `no_speech_prob`, `compression_ratio` and `temperature` on each segment, and a top-level `words[]` with `probability`.

### The job API

For long files, uploads or paths on disk:

| Method and path | What it does |
|---|---|
| `POST /jobs` | Queues a file; multipart `file` or JSON `{ "path": "...", "language": "ru", "formats": ["srt"] }`; also accepts `prompt`, `word_timestamps` and `clip_timestamps`; answers `202` with `job_id`, `state` and a `Location` header |
| `GET /jobs/<id>` | `state`, `progress`, `source`, `language`, `model`, `duration_s`, `segments`, `outputs`, `error` and the applied `prompt`, `word_timestamps`, `clip_timestamps` |
| `GET /jobs/<id>/result?format=txt` | The finished transcript as `txt`, `json`, `srt` or `vtt` |
| `DELETE /jobs/<id>` | Cancels the job |

A job pauses while a dictation runs and resumes when the service is idle. `GET /jobs/<id>/result` answers `409` until the job is done. A bad clip range or a prompt longer than 1024 characters returns `400`.

## Status codes

| Code | When |
|---|---|
| `200` | The request succeeded |
| `202` | A job was accepted |
| `400` | A bad field, an unknown format, a missing path or an uninstalled model |
| `401` | The token is missing or wrong |
| `403` | The path is outside the allowed file roots |
| `404` | Unknown path or job |
| `409` | The service is busy, a dictation is running, or the job is not done |
| `411` | `Content-Length` is missing |
| `413` | The body or the file is too large; for the file endpoint, use `/jobs` |
| `415` | `Content-Type` is not supported |
| `429` | More than one request per second on `/transcribe` |
| `500` | The recognition or writing step failed |
| `503` | The model is still loading |

A rejected request is read up to 1 MB and then answered, so the client receives the status code instead of a connection reset.

## Examples

### PowerShell

```powershell
$config = Get-Content "$env:LOCALAPPDATA\VibeForma\config.json" | ConvertFrom-Json
$token = $config.http_token

Invoke-RestMethod -Uri "http://127.0.0.1:8787/health" `
  -Headers @{ "X-VibeForma-Token" = $token }

Invoke-RestMethod -Uri "http://127.0.0.1:8787/v1/audio/transcriptions" `
  -Method Post `
  -Headers @{ "X-VibeForma-Token" = $token } `
  -Form @{ file = Get-Item "D:\audio\note.m4a"; response_format = "json" }
```

### curl

```bash
curl -s http://127.0.0.1:8787/health \
  -H "X-VibeForma-Token: $VIBEFORMA_TOKEN"

curl -s -X POST http://127.0.0.1:8787/v1/audio/transcriptions \
  -H "X-VibeForma-Token: $VIBEFORMA_TOKEN" \
  -F "file=@note.m4a" \
  -F "response_format=srt"
```

## What the API does not do

- It does not accept audio from another machine.
- It does not expose settings, history or the dictionary.
- It does not use TLS, because the traffic never leaves the loopback interface.
- It does not process files in parallel: the queue runs one file at a time, and dictation has priority.

## Security notes

- The listener is loopback-only; a remote client cannot reach it.
- The token is required on every request and compared in constant time.
- The rate limit and the busy answer prevent the API from competing with live dictation.
- Temporary audio is deleted on every outcome.
- The token is in `config.json`; redact it before sharing logs or the file.

More on [Security](/security/).

## If a request fails

| Symptom | Check |
|---|---|
| Connection refused | The API is off, or the service is not running |
| `401` | The token in the request does not match `config.json` |
| `403` | The path is on a network share or outside `file_roots` |
| `404` | The path or job id is wrong |
| `409` | The service is recording or processing; retry when idle |
| `413` | The file is over `file_max_sync_s`; post it to `/jobs` |
| `429` | Wait at least one second between `/transcribe` requests |
| `503` | The model is still loading; retry after it is ready |

## Where to go next

- [File transcription](/file-transcription/) — the queue, batches and limits.
- [AI agents and integrations](/agents/) — discovery and a minimal client.
- [Command line](/cli/) — the named-pipe route without a port.
- [Transcript formats](/formats/) — `response_format` and result formats.
