---
title: AI agents and integrations
description: Connect a local agent or harness to VibeForma — location.json discovery, the named pipe CLI, the OpenAI-compatible endpoint and the job API.
---

VibeForma is designed to be called by another local program: an editor, a script, a coding agent or FormaMind. The integration stays on this computer, uses no cloud account and needs no network listener unless you turn on the local API.

There are three surfaces, in the order a harness should try them:

| Surface | Needs a port | Needs the token | Best for |
|---|---|---|---|
| Named pipe CLI | No | No | Anything that can start a process |
| Local HTTP API | Yes, loopback | Yes | HTTP clients and OpenAI-compatible code |
| Files on disk | No | No | Reading finished transcripts |

## Discovery: location.json

The service publishes `%LOCALAPPDATA%\VibeForma\location.json` so a harness never has to guess the install folder. The file is written atomically and contains no secret.

```json
{
  "schema": 2,
  "app": "vibeforma",
  "version": "0.4.0",
  "launcher": "C:\\Users\\you\\AppData\\Local\\VibeForma\\run.cmd",
  "python": "C:\\Users\\you\\AppData\\Local\\VibeForma\\.venv\\Scripts\\python.exe",
  "entry": "C:\\Users\\you\\AppData\\Local\\VibeForma\\main.py",
  "install_dir": "C:\\Users\\you\\AppData\\Local\\VibeForma",
  "config": "C:\\Users\\you\\AppData\\Local\\VibeForma\\config.json",
  "app_dir": "C:\\Users\\you\\AppData\\Local\\VibeForma",
  "pid": 12345,
  "updated": 1795312800,
  "file_mode": true,
  "formats": ["txt", "json", "srt", "vtt"],
  "languages": ["en", "ru"],
  "max_file_mb": 4096,
  "max_file_s": 21600,
  "max_sync_s": 900,
  "pipe": "\\\\.\\pipe\\VibeForma-you",
  "port": 8787,
  "api": "on"
}
```

| Field | Meaning |
|---|---|
| `schema` | File schema; `2` adds the file-mode fields |
| `version` | Product version |
| `launcher`, `python`, `entry` | The three ways to start the app |
| `config`, `app_dir`, `install_dir` | Paths a harness may need |
| `pid`, `updated` | The writing process and a Unix timestamp |
| `file_mode` | `true` once the named pipe is listening; `false` while the service is still loading |
| `formats`, `languages` | What the running build accepts |
| `max_file_mb`, `max_file_s`, `max_sync_s` | The limits in force |
| `pipe` | Present only when the pipe is listening |
| `port`, `api` | Present when the HTTP API is on; `api` is `on`, `off` or `error` |

A harness that finds no location file can call `GET /capabilities` instead — it repeats the same facts over HTTP.

## The named pipe

The CLI talks to the running service over `\\.\pipe\VibeForma-<user>`, created with an owner-only DACL. No port, no token and no network are involved. This is the recommended surface for an agent that can start a process.

```powershell
.\run.cmd --status
.\run.cmd --transcribe "D:\audio\interview.m4a" --format json --json
.\run.cmd --transcribe-folder "D:\audio\batch" --recursive --json
.\run.cmd --cancel-batch
```

| Flag | Answer |
|---|---|
| `--transcribe` | Progress on stderr, the result path or a JSON object on stdout |
| `--transcribe-folder` | A JSON summary of the batch on stdout |
| `--cancel-batch [<id>]` | Stops every unfinished batch, or the named one |
| `--status` | The service state as JSON |

Exit codes: `0` success, `1` a service or job error, `2` bad arguments, `3` cancelled, `4` nothing to transcribe in the folder. While the model is loading the call answers `the model is loading` and exits `1`; retry later.

## The OpenAI-compatible endpoint

With the local API on, `POST /v1/audio/transcriptions` accepts multipart form data with the OpenAI field names:

| Field | Meaning |
|---|---|
| `file` | The audio or video file; required |
| `model` | Accepted for compatibility |
| `language` | Recognition language, for example `ru` |
| `response_format` | `json`, `text`, `srt`, `vtt` or `verbose_json` |
| `prompt` | Initial prompt, up to 1024 characters |
| `temperature` | Sampling temperature |

Authentication is `Authorization: Bearer <token>` or `X-VibeForma-Token: <token>`. The endpoint answers synchronously while the file is at or below `file_max_sync_s` (900 s by default). A longer file returns `413` with `"job_endpoint": "/jobs"`.

## The job API for long files

| Method and path | What it does |
|---|---|
| `POST /jobs` | Queues a file and returns its id and `Location` header |
| `GET /jobs/<id>` | State, progress, duration, segment count and outputs |
| `GET /jobs/<id>/result?format=txt` | The finished transcript in one of the four formats |
| `DELETE /jobs/<id>` | Cancels the job |
| `GET /capabilities` | Formats, models, limits, pipe and launcher |
| `GET /health` | Live state plus `file_mode`, `jobs_running` and `jobs_queued` |

A job pauses when a dictation starts and resumes when the service is idle. The HTTP surface answers `409` while a dictation is in progress, so a caller should retry rather than compete with the microphone. Details and status codes are on [Local API](/local-api/).

## A minimal integration

1. Read `location.json`.
2. If `file_mode` is `true` and `pipe` is present, run the CLI with `--json` and parse stdout.
3. Otherwise, if `api` is `on`, read `http_token` from `config.json` and call the endpoint with that token.
4. If `file_mode` is `false`, wait and retry — the service is still loading its model.
5. Keep files on local disks; network paths are refused.

```powershell
$loc = Get-Content "$env:LOCALAPPDATA\VibeForma\location.json" | ConvertFrom-Json
if ($loc.file_mode -and $loc.pipe) {
  & $loc.launcher --transcribe "D:\audio\note.wav" --format txt --json
} elseif ($loc.api -eq "on") {
  $cfg = Get-Content $loc.config | ConvertFrom-Json
  Invoke-RestMethod -Uri ("http://127.0.0.1:" + $loc.port + "/v1/audio/transcriptions") `
    -Method Post -Headers @{ "X-VibeForma-Token" = $cfg.http_token } `
    -Form @{ file = Get-Item "D:\audio\note.wav"; response_format = "json" }
}
```

## Security boundaries

- The pipe is per user and owner-only; another account cannot connect.
- The HTTP API binds `127.0.0.1` only and requires the token on every request.
- `location.json` carries no secret; the token stays in `config.json`.
- File jobs accept local fixed and removable disks, not UNC shares.
- Nothing is uploaded: recognition, decoding and transcript writing are local.

## Where to go next

- [Command line](/cli/) — the full flag and exit-code contract.
- [Local API](/local-api/) — endpoints, token and status codes.
- [File transcription](/file-transcription/) — queue, batches and limits.
- [VibeForma in FormaMind](/formamind/) — the product integration this surface serves.
