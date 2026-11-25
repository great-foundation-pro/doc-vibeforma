---
title: Transcript formats
description: The four transcript formats — TXT, JSON, SRT and VTT — their fields, timecodes, encoding and how the CLI and the API choose one.
---

A file transcription can be written in four formats. The recognition result is the same; the format decides how much structure travels with the text.

| Format | Best for | Timecodes |
|---|---|---|
| `txt` | Reading, pasting into notes | No |
| `json` | Scripts, agents, downstream processing | Yes, per segment and per word |
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
      "text": "Good morning.",
      "avg_logprob": -0.21,
      "compression_ratio": 1.24,
      "no_speech_prob": 0.01,
      "temperature": 0.0,
      "words": [
        {"start": 0.0, "end": 0.42, "text": "Good", "probability": 0.98},
        {"start": 0.42, "end": 1.1, "text": "morning.", "probability": 0.95}
      ]
    },
    {
      "start": 4.32,
      "end": 9.15,
      "text": "Today we review the release."
    }
  ],
  "words": [
    {"word": "Good", "start": 0.0, "end": 0.42, "probability": 0.98},
    {"word": "morning.", "start": 0.42, "end": 1.1, "probability": 0.95}
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
| `segments[].avg_logprob`, `compression_ratio`, `no_speech_prob`, `temperature` | The engine's confidence readings for the segment, rounded to four decimals; each is present only when the engine returned it |
| `segments[].words` | Optional word timings with `start`, `end`, `text` and `probability` |
| `words` | A top-level array naming every word of the file: `word`, `start`, `end` and `probability` |

Word timings appear when `file_word_timestamps` is on, when a job asks for `word_timestamps`, or with the CLI `--words` flag. The engine also produces word probabilities for the panel's doubtful-word highlighting; the JSON publishes them for clients.

The readings are the raw engine values, not a percentage. `temperature` above zero means the first decode failed a check and a fallback ran; `avg_logprob`, `no_speech_prob` and `compression_ratio` are the checks behind the anti-hallucination guard. A reading is absent when the engine did not return it, so a client must tolerate missing keys.

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

## How SRT and VTT cues are cut

When word timings are available, a cue follows a sentence, not an engine window. A sentence end (`. ! ? …`, with a closing quote or bracket after it) or a pause of 0.6 seconds closes the cue. Words from neighbouring engine windows and 600-second blocks join when the pause is shorter, so a sentence is not split at an engine seam. A cue runs from its first word to its last, and its start is pressed against the end of the previous cue.

Without word timings the engine's segments stand: one cue per window, exactly as before. A finished result is clamped to zero and kept monotonic in both cases.

## Where a format is chosen

| Surface | How the format is chosen |
|---|---|
| Single file CLI | `--format txt\|json\|srt\|vtt\|all`; default `srt` |
| Folder CLI | The same `--format` applies to every file in the batch |
| `POST /v1/audio/transcriptions` | `response_format`: `json`, `text`, `srt`, `vtt` or `verbose_json` |
| `GET /jobs/<id>/result` | `?format=txt\|json\|srt\|vtt`; default `txt` |

`verbose_json` returns the full JSON object above, including the confidence readings and the top-level `words` array; plain `json` returns only `{"text": "..."}`. The API answers in the response body and does not write files. The CLI writes files beside the source unless `--out` points elsewhere, and never overwrites without `--force`.

## What the formats do not carry

- Speaker labels are not written. Confidence is written in JSON as segment readings and word probabilities, but it is not styled into subtitles.
- There is no styling, positioning or karaoke timing inside a cue.
- Translation is not part of the transcript; the text is in the recognition language.
- Word-level timings are written in JSON only; SRT and VTT use them to cut sentences but carry no per-word marks.

## Where to go next

- [File transcription](/file-transcription/) — the queue, batches and limits.
- [Command line](/cli/) — `--format`, `--out` and `--force`.
- [Local API](/local-api/) — `response_format` and the job result endpoint.
