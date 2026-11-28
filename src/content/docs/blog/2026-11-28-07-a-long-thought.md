---
title: "A long thought does not break"
description: How continuous dictation arrived in 0.5.0 — no 120-second limit, cutting on pauses, and a memory safety valve.
date: 2026-11-28T12:00:00
authors: forma
excerpt: "The old dictation broke at 120 seconds. Continuous dictation cuts on pauses, not on a timer: a pause is a sentence boundary, not a stop command."
cover:
  image: ../../../assets/blog/07-a-long-thought.jpg
  alt: One unbroken cyan ribbon of light flows over a dark landscape and never tears.
tags:
  - continuous-dictation
  - vad
---

Dictating a technical brief is not the same as dictating a message. The thought runs long: a condition, a caveat, an example, an exception. You speak for a minute, two, three. And at the 120th second the app falls silent. Not because you finished, but because a timer fired.

Early versions had a hard recording limit. It protected memory and kept a take from growing without bound, but it paid with the most expensive thing: it cut the thought mid-word. In 0.5.0 continuous dictation became the default mode.

## How a take is cut now

Recording no longer stops by the clock. It cuts the take on a natural boundary: a pause of at least 400 ms after at least 1 second of speech. That is not “the end of recording” but “the end of a phrase”: the app takes the finished piece, recognizes it and keeps listening.

If there is no pause — for example, you read aloud or speak without stopping — the take is cut into 30-second chunks. The last 300 ms of the previous chunk carry over into the next so a word on the boundary stays whole. When stitching, duplicate words at the seam are dropped and the sentence mark crosses the boundary.

Insertion happens once, at the end: you do not see the text jump in pieces. For you it is one long phrase, even though inside there are several passes.

## Why a pause, not a timer

A timer measures time. A pause measures meaning. A person pauses when they finish a thought, not when 30 seconds run out. So cutting on a pause gives boundaries that match sentences instead of slicing a word in half.

The same decision improved the VAD. We raised `speech_pad_ms` from 30 to 400 ms and `min_silence_duration_ms` from 250 to 1000 ms: the first word and the closing punctuation stopped disappearing. Before, the VAD could “eat” the start of a phrase because it counted it as silence.

## The memory safety valve

Continuity has a price: the buffer grows while you speak. If recognition falls far behind, the app cannot hold audio in memory forever. At 240 seconds the buffer stops growing: the accumulated audio is dropped entirely, and the log gets a `Continuous chunk dropped: ... while recognition is behind` warning.

That is not the usual phrase limit. It is an emergency valve: better to lose one long piece than to eat memory and crash the service. In normal operation you never reach 240 seconds: chunks go to recognition as pauses arrive.

## What it changes

Continuous dictation changes the genre, not the speed. Before, voice input was for short commands: “write”, “open”, “translate”. Now you can dictate a paragraph, a piece of documentation, a task description, a letter. You speak the way you think, and the app assembles it into text.

That is exactly why continuous became the default and not an option for enthusiasts. If a feature changes the genre, it should be on by default. Anyone who wants the old mode turns `continuous` off and gets the `max_record_s` stop back.

## Where the border is

240 seconds is a safety valve, not a promise of infinity. A very slow pass can eat a piece; the log will show it. Continuity does not cancel quality: with a bad microphone, a long take will not become better than a short one.

And one more: a 400 ms pause is not a universal truth. Some people pause shorter, some speak without pauses. The threshold is tuned so it neither cuts mid-word nor waits too long. If your tempo is different, you can change it in settings.

Next is [“The model that doubts”](/blog/2026-11-28-08-the-model-that-doubts/).
