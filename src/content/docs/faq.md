---
title: FAQ
description: Short answers about price, offline work, languages, accuracy, accounts, platforms, file transcription and data.
---

## Is VibeForma free?

Yes. VibeForma is free and open source under the MIT license. There is no account, subscription or paid tier.

## Does it work offline?

Yes, after the model is downloaded. The network is used once for the model and later for update checks. Recognition itself never contacts a server.

## Which languages does it support?

The model supports about 99 languages. The recognition menu offers 26 language codes. The language is fixed in the settings — VibeForma does not detect it automatically.

## How accurate is it?

Accuracy depends on the model, the microphone, the room and the language. The project publishes no accuracy percentage; claims like "99% accurate" are marketing, not measurement. A larger model and a good microphone help more than any setting.

## Is my voice sent anywhere?

No. Recognition runs locally. Audio and files are not uploaded, and recording audio is not kept after recognition. The local API can send a file to a local process, but only on `127.0.0.1`.

## Do I need an account?

No. There is no sign-in, no telemetry and no cloud sync.

## Does it run on macOS, Linux, iOS or Android?

No. VibeForma 0.4.5 is Windows 10/11 only.

## Can it transcribe audio and video files?

Yes. The same recognition engine takes `mp4`, `mkv`, `mov`, `webm`, `mp3`, `wav` and `m4a` files, one at a time, and can walk a folder as a batch. Results are written as TXT, JSON, SRT or VTT. See [File transcription](/file-transcription/).

## Does file transcription need ffmpeg?

No. PyAV decodes the file inside the application; there is no external `ffmpeg` binary to install.

## Does it translate?

No. It recognizes the chosen language and does not translate.

## Can it tell speakers apart?

No. Speaker diarization is out of scope.

## Do I need administrator rights?

No. The installer writes to `%LOCALAPPDATA%\VibeForma` and registers the app for the current user.

## Why does Windows SmartScreen warn?

The installer and the app are not code-signed. There is no certificate yet, so SmartScreen treats them as unknown. Verify the download against `SHA256SUMS` and continue only if you trust the source.

## How do I update?

VibeForma checks GitHub Releases in the background and offers a new version with an **Update** button. You can also rerun the installer. Data and models are preserved.

## How do I remove it completely?

Run `uninstall.cmd` with `--remove-data` to remove the app, models and `config.json`. Without the flag, models and settings stay for a reinstall.

## Where is my data?

In the install directory: `config.json`, `models\`, `logs\`, and — if enabled — `history.jsonl` and `stats.json`. Transcripts of files are written beside their sources unless `--out` says otherwise. Nothing is uploaded. See [Files and locations](/files-and-paths/).

## Does history record everything?

No. History is off by default. When enabled, it keeps the last 100 dictations locally. Statistics keep only counters, never text.

## Can I use it commercially?

The MIT license allows commercial use. Check the license text in the repository for the exact terms.

## What is FormaMind?

FormaMind is a project-management tool; VibeForma is its voice layer. The native integration is in development. See [VibeForma in FormaMind](/formamind/).

## Where do I report a bug?

Open an issue in the [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma) repository. Attach the `--doctor` report and the relevant part of the log, with the token and any personal text redacted.

## Where to go next

- [Troubleshooting](/troubleshooting/) — symptom by symptom.
- [Known issues and limitations](/known-issues/) — what the product does not do.
- [Comparison](/comparison/) — how it compares with alternatives.
- [Quickstart](/quickstart/) — install and dictate.
