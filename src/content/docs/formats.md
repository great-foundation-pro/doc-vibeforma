---
title: Transcript formats
description: The four transcript formats — TXT, JSON, SRT and VTT — their fields, timecodes, encoding and how the CLI and the API choose one.
---

A file transcription can be written in four formats. The recognition result is the same; the format decides how much structure travels with the text.

| Format | Best for | Timecodes |
|---|---|---|
| `txt` | Reading, pasting into notes | No |
| `json` | Scripts, agents, downstream processing | Yes, per segment |
| `srt` | Subtitles in players and editors | Yes, per cue |
| `vtt` | Web players and web pages | Yes, per cue |

The command line defaults to `srt`; `--format txt`, `--format json`, `--format vtt` or `--format all` choose another, and `all` writes all four files. The API names the format in `response_format`.

## Encoding and line endings

Every file is UTF-8 without a BOM, with LF line endings. A line break that belongs to a recognized phrase stays inside its cue; it does not start a new numbered block.

Timestamps are clamped to zero and kept monotonic. Empty segments are dropped. Start, end and duration are rounded to milliseconds.

## TXT

Plain text: one paragraph per segment, an empty line between paragraphs, and a final newline. There are no timestamps and no metadata.

```text
Good morning. Today we review the release.

The file mode is ready, and the panel shows the progress.
```

## JSON

A machine-readable object with the full text, the facts about the run, and the segments:

```json
{
  "text": "Good morning. Today we review the release.",
  "language": "en",
  "model": "large-v3-turbo",
  "duration": 660.0,
  "segments": [
    {
      "start": 0.0,
      "end": 4.32,
      "text": "Good morning."
    },
    {
      "start": 4.32,
      "end": 9.15,
      "text": "Today we review the release."
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `text` | All segment texts joined with spaces |
| `language` | The recognition language, when known |
| `model` | The model that produced the transcript |
| `duration` | Source duration in seconds |
| `segments` | Cues with `start`, `end` and `text` |
| `segments[].words` | Optional word timings, present when `file_word_timestamps` is on |

Word timings use the same `start`/`end`/`text` shape inside a segment. They are off by default because segment timings are enough for most work.

## SRT

SubRip: a numbered cue, a timecode line with a comma before milliseconds, the text, and an empty line before the next cue.

```text
1
00:00:00,000 --> 00:00:04,320
Good morning.

2
00:00:04,320 --> 00:00:09,150
Today we review the release.
```

## VTT

WebVTT: a `WEBVTT` header, then cues with a dot before milliseconds. Cue numbers are optional, and VibeForma does not write them.

```text
WEBVTT

00:00:00.000 --> 00:00:04.320
Good morning.

00:00:04.320 --> 00:00:09.150
Today we review the release.
```

## Where a format is chosen

| Surface | How the format is chosen |
|---|---|
| Single file CLI | `--format txt\|json\|srt\|vtt\|all`; default `srt` |
| Folder CLI | The same `--format` applies to every file in the batch |
| `POST /v1/audio/transcriptions` | `response_format`: `json`, `text`, `srt`, `vtt` or `verbose_json` |
| `GET /jobs/<id>/result` | `?format=txt\|json\|srt\|vtt`; default `txt` |

`verbose_json` returns the full JSON object above; plain `json` returns only `{"text": "..."}`. The API answers in the response body and does not write files. The CLI writes files beside the source unless `--out` points elsewhere, and never overwrites without `--force`.

## What the formats do not carry

- Speaker labels and confidence scores are not written.
- There is no styling, positioning or karaoke timing inside a cue.
- Translation is not part of the transcript; the text is in the recognition language.
- Word timings are available in JSON only.

## Where to go next

- [File transcription](/file-transcription/) — the queue, batches and limits.
- [Command line](/cli/) — `--format`, `--out` and `--force`.
- [Local API](/local-api/) — `response_format` and the job result endpoint.
