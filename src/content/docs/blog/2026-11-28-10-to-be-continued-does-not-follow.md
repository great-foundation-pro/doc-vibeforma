---
title: To be continued does not follow
description: How VibeForma stopped inserting an invented “To be continued” — and why it took three releases.
date: 2026-11-28T09:00:00
authors: forma
excerpt: "You dictate a work message, insert it — and at the end it says “To be continued...”. You never said that. The model's most human mistake turned out to be the hardest to fix."
cover:
  image: ../../../assets/blog/10-to-be-continued-does-not-follow.jpg
  alt: A dark soundwave whose last segment dissolves into static, with a thin magenta cut line before it.
tags:
  - hallucinations
  - trust
  - dictation
---

You dictate a message: “Use the runner for the whole wave, set the effort for all runners, run in several threads if the tasks allow it.” You insert it. At the end: “To be continued...”. You never said that. Not at the start, not at the end. The phrase was not in the recording.

This is not a microphone glitch and not an insertion error. It is the model. Whisper is trained on a huge corpus of subtitles and videos, and in that corpus a service line often follows the last line: “To be continued”, “Thanks for watching”, “Subscribe to the channel”. Over silence, music or a pause, the model completes what usually happens at the end of a video. It does not hear the phrase — it predicts it.

## Why you cannot just ban the phrase

The first instinct is to take a list of stop phrases and cut them always. But then the person who actually said “To be continued” suffers — for example, dictating a chapter or finishing a letter. A ban does not distinguish invented from spoken; it just dislikes the phrase.

What was needed was a signal that says not “this phrase is bad” but “this phrase was not in the sound”. That signal became the VAD — the speech detector already running in the app.

## The first layer: silence and compression

0.5.0 added a stop list of typical false phrases for Russian and English, a 2-second silence threshold with word timestamps and a compression-ratio check. A segment is dropped if `no_speech_prob` is at least 0.6 and the phrase is on the stop list or the ratio is above 1.35. A loop the engine still reads as speech stays and is marked.

That layer caught tails over silence, but not a phrase packed into speech. And that is exactly how the model usually “continues itself”: it puts the invented line right after the last word, in the same segment, with the same timestamps.

## The second layer: checking the tail against the sound

In 0.5.6 the final dictation pass began checking a trailing stop phrase against the audio. If the phrase's words overlap detected speech by less than 0.15 seconds, the phrase is cut together with everything after its first word — in the text, the word list and the subtitles.

A spoken phrase stays: if the VAD hears speech underneath it, the cut does not fire. A take without word timestamps or with a VAD failure is left unchanged — better to keep something doubtful than to lose what was said.

## The third layer: words, duration and tempo

0.5.6 still looked only at the last segment. If the phrase was split between segments, or a punctuation-only segment stood before it, the check could miss it. In 0.5.7 the guard reads the take's words as one stream across all segments, in a window of the last 20 words, and cuts from the phrase's first word to the end, including later segments.

The phrase stays only with three agreeing signals:

- the VAD hears speech under the tail for at least 0.15 seconds;
- the phrase's own words last at least 0.25 seconds per word;
- the take's density is no higher than 8 words per second.

An invented line is compressed into a fraction of a second and has no speech underneath. A take that is too dense is the model continuing itself. If all three signals say “spoken”, the phrase stays.

Without word timestamps there is a text fallback: cut only if there is no speech under the last segment or the take is denser than 8 words per second; otherwise fail-open, that is, the text is left alone.

## The fourth layer: the window offset

After the 0.5.7 release, self-review found a bug the tests had missed: the guard read the last 20 words, but applied the phrase's position inside the window as if it were the position in the whole take. On a take longer than 20 words the cut started a window too early and carried away real words before the phrase.

In 0.5.8 the position is carried from the window back into the take. A 25-word regression test was added: all 25 stay, only the phrase is cut. Short takes and the rule that keeps a spoken phrase are unchanged.

This bug is a good illustration of why “we fixed the hallucination” cannot be said after one release. A guard against invented text is not one check but several layers, and each layer can err in its own direction.

## Where the border is

We do not cut a phrase woven into real speech with normal density and plausible duration. That is a deliberate choice: better to keep a doubtful tail than to cut living words. That is why the log has two lines — `Cut invented tail` and `Tail stop phrase kept` — with the phrase, the time span, the duration and the tempo, but without the dictated text.

Live partial hints and file mode live by their own rules: partials show a raw preview, files use a separate 0.5.0 guard. The tail guard is for the final dictation text and re-recognition.

## How it ended

The phrase “To be continued” no longer appears at the end of the text unless you said it. If you did, it stays. That is the difference between a ban and a check: a ban does not listen, a check does.

This is where the series ends — but not the project. There will be new releases, new bugs and new breakdowns. The timeline of all ten posts and releases is on the [Chronicle](/chronicle/) page. And if you really did say “To be continued...” — it stays.
