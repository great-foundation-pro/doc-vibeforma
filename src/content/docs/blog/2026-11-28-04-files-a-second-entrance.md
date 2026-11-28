---
title: "Files: a second entrance"
description: How VibeForma learned to take more than a microphone — files, folders, a queue with dictation priority, an API and MCP.
date: 2026-11-28T15:00:00
authors: forma
excerpt: "The microphone is not the only source of speech. In 0.3.0 the same engine learned to take files; in 0.4.0, whole folders. The queue is built so dictation always comes first."
cover:
  image: ../../../assets/blog/04-files-a-second-entrance.jpg
  alt: A dark archive of film strips and audio waves flowing into a glowing cyan aperture.
tags:
  - files
  - queue
  - mcp
---

A meeting recorded on a phone. A lecture in an mp4. A conference video that weighs two gigabytes. Before, getting text out of it meant opening another service, uploading the file to a cloud and waiting. Or running a separate local transcriber with a different engine, different settings and different quality.

On 22 November 2026 VibeForma stopped being only a microphone. In 0.3.0 file transcription appeared: the same engine, the same model, the same settings as dictation.

## What the file entrance can do

The app takes mp4, mkv, mov, webm, mp3, wav and m4a. Video is decoded through PyAV to 16 kHz mono float32 — no external ffmpeg. The result can be TXT, JSON, SRT or VTT; by default it lands next to the source, `--out` changes the folder, and an existing file is not overwritten without `--force`.

JSON carries the text, language, model, duration and segments with timestamps. SRT and VTT are ordinary subtitles; since 0.5.0, when word timestamps are on, they are cut by sentences: a sentence end or a pause of 0.6 seconds closes a cue, a shorter pause glues words across windows.

A file can come from the tray, the command line or the API. `POST /v1/audio/transcriptions` follows the OpenAI schema: multipart, `model`, `language`, `response_format`, `prompt`, `temperature`, `Authorization: Bearer`. A long file goes to `/jobs`, where a job has a status and can be cancelled.

## A queue where dictation is always first

The most important decision in file mode is not the formats but the queue. One engine, one worker, one job at a time. If you press the hotkey during a transcription, the file pauses between segments, dictation goes through, and the file continues from the same place.

That sounds like a detail, but it decides whether the app feels alive. The user should not wait forty minutes because “the engine is busy”. Dictation is a conversation here and now; a file can wait.

Cancellation is cooperative: the current file stops, the queue clears. Progress is measured against the file duration, not the segment count, so the bar does not lie. One bad file in a batch is recorded as an error while the rest continue.

## A folder as one take

0.4.0 added folder batches: choose **Transcribe folder…** in the tray or call `--transcribe-folder`. Every supported file at the top level (or in subfolders with `--recursive`) joins the same queue. Results land beside each source or mirror the tree under `--out`.

Long files use a batched pass: 600-second blocks, the same model, language, VAD and prompt. If the batched path is unavailable or fails, the job falls back to the sequential path without duplicates. On a 660-second video the test showed a 5.21× speedup — more on that in the speed post.

## A door for agents

0.4.5 added an MCP server: `app\mcp.cmd` starts a stdio server, finds the running service through `location.json`, reads the token from `config.json` and offers three tools — capabilities, file transcription and job status. No new port is opened; requests are pinned to `127.0.0.1` and redirects are refused.

This is not an integration for a checkbox. A local engine with MCP becomes a building block for agents: an agent can transcribe a folder of meetings and sort the text into tasks without sending audio to the cloud. Same principle as dictation: the speech stays with you.

## Where the border is

File mode is not a cloud batch service. There is one worker and one machine: twenty hours of audio will not get faster because you add more files. Long files need space and time. The file path does not use the dictation tail guard of 0.5.6–0.5.8; it has its own anti-hallucination guard since 0.5.0, and they are different mechanisms.

And a file is not a conversation. It has no cursor, no window, no hurry. File mode lives by different rules, even though the engine is shared.

Next is [“Speed: why the text waited twenty seconds”](/blog/2026-11-28-05-speed-without-the-wait/).
