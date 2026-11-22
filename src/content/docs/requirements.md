---
title: System requirements
description: The factual requirements for VibeForma 0.4.0 — Windows version, Python, disk space, GPU, network, audio, file transcription and ports.
---

These are the checks the installer performs and the facts the application relies on. Numbers come from the 0.4.0 source and installer, not from estimates.

## Operating system

| Requirement | Value |
|---|---|
| Windows version | Windows 10 build 1809 or newer, or Windows 11 |
| Architecture | x64 or ARM64 |
| Administrator rights | Not required |
| Install location | `%LOCALAPPDATA%\VibeForma` by default |

VibeForma is a Windows application. There is no macOS, Linux, iOS or Android version.

## Python

| Requirement | Value |
|---|---|
| Python for the installer | 3.10, 3.11, 3.12, 3.13 or 3.14 |
| Python for a source install | The same range |
| Bundled Python | No — the installer uses the Python found on the machine |

The installer stops with an explicit reason if Python is missing or outside the supported range.

## Disk space

The installer requires free space for the chosen model plus about 4 GB for the application, dependencies and working files.

| Model | Approximate size |
|---|---|
| `large-v3` | 3.1 GB |
| `large-v3-turbo` (default) | 1.6 GB |
| `medium` | 1.5 GB |
| `small` | 0.5 GB |

Models are stored in `models\<name>` inside the service folder. If a model already exists in the shared Hugging Face cache, VibeForma can use it instead of downloading again.

## Processor and graphics

| Profile | When it is used | Precision |
|---|---|---|
| NVIDIA CUDA | An NVIDIA GPU and a working CUDA setup are found | float16 |
| CPU | No usable CUDA, or `-Cpu` is passed | int8 |

CUDA wheels (`nvidia-cublas-cu12`, `nvidia-cudnn-cu12`) are installed only when the CUDA profile is chosen. A configuration that says `cuda` on a machine without CUDA is corrected automatically.

The installer does not enforce a RAM figure. Larger models need more memory and run slower on CPU; the README benchmark for a 12.5-second phrase with CUDA float16, best of three, is 1.53 s for `large-v3` and 0.64 s for `large-v3-turbo`.

## Network

| Purpose | When |
|---|---|
| Model download | Once, during installation or the first model switch |
| Update checks | About 90 seconds after start, then every 2 hours by default, only while idle |
| Update download | When you accept an update |
| Recognition | Never — it runs locally |

After the model is on disk, dictation works offline.

## Audio

- Any Windows input device that the system exposes.
- Capture tries the device's own format first (WASAPI, mono then stereo), then the legacy host API, then 16 kHz.
- Sample-rate conversion uses a windowed-sinc resampler.
- If the clean path fails, it is retried once and the reason is written to the log.

## File transcription

| Requirement | Value |
|---|---|
| Input formats | `mp4`, `mkv`, `mov`, `webm`, `mp3`, `wav`, `m4a` |
| Decoder | PyAV inside the application; no `ffmpeg` binary is installed or called |
| Default size limit | 4096 MB (`file_max_mb`) |
| Default duration limit | 6 hours (`file_max_s`) |
| Storage | Local fixed or removable disks; UNC shares are refused |
| Parallelism | One file at a time; dictation has priority |

Long files run through the batched inference path on the same loaded model; short files and dictation stay sequential. The file-mode keys are listed on [Settings reference](/settings-reference/).

## Ports

| Port | Use |
|---|---|
| 8787 | Default local API port, bound to `127.0.0.1` only |
| Any free loopback port | Used automatically if 8787 is busy; the actual port is published in `location.json` |
| None | When the local API is disabled (the default) |

No inbound internet port is opened. The API is not reachable from another machine.

## Interface languages

| Language | Status |
|---|---|
| English | Full interface and documentation |
| Russian | Full interface and documentation |
| Other interface languages | Can be added with a locale JSON file; fallback is English |

Recognition is a separate axis: the model supports about 99 languages, while the recognition menu offers 26 language codes.

## Where to go next

- [Installation](/installation/) — the installer and its parameters.
- [Models and languages](/models/) — which model to choose.
- [Known issues and limitations](/known-issues/) — what the product does not support.
- [Privacy](/privacy/) — what leaves the machine and when.
