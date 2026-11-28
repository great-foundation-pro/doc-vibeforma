---
title: "Speed: why the text waited twenty seconds"
description: How we removed the rare 10–20 second waits before the final text and made long files 5.21× faster.
date: 2026-11-28T14:00:00
authors: forma
excerpt: "A short phrase, but the text appears twenty seconds later. The cause was not the model but who held the engine. The fix is not a faster model — it is a schedule."
cover:
  image: ../../../assets/blog/05-speed-without-the-wait.jpg
  alt: A long cyan light trail across a dark grid, one sharp point, a dissolving clock face.
tags:
  - speed
  - performance
---

The most annoying delay is not when the model thinks for a long time. It is when you said a short phrase, released the key and sit looking at an empty field. One second. Three. Ten. Twenty. The text appears, and you have already forgotten what you wanted to say.

In the log such cases show up as the gap between “Recording stopped” and “Latency to ready text”. In one review, recognition took 4.25 seconds while 84 seconds passed before the ready text. The model was not slow. It was waiting.

## Who held the engine

The cause was live partial previews. While you speak, the app periodically shows a preliminary text. To do that, it sends the whole accumulated buffer to the engine — and the buffer grows every second. The longer you speak, the more audio goes into a partial pass. At some point the partial pass occupies the engine long enough that the final pass queues behind it.

The second cause was the final pass with six temperature steps. It is a fallback: if decoding at the first temperature gives a bad result, the model tries the next. On a short phrase six steps can cost more than the text itself.

## What we changed

In 0.4.2 the live preview became cheap: it reads only the last 10 seconds of the take and decodes greedily at one temperature. The final pass stayed high-quality but stopped being a marathon: beam 5 and two temperature steps — 0.0 and 0.2 — instead of six. File mode kept the full fallback: there, quality matters more than seconds.

Every partial pass now writes its duration to the log: above 2 seconds, a `Slow partial` line appears. That is not cosmetics: it shows where the app starts to fall behind and separates a slow model from a queue.

## Long files: 5.21×

For files we took another path. In 0.4.0 files of 60 seconds or more went through `faster_whisper.BatchedInferencePipeline` on the same loaded model: 600-second blocks, the same language, VAD, prompt and anti-hallucination settings. Short files and dictation stayed sequential.

On a 660-second `long_ru.mp4` (large-v3-turbo, CUDA float16) the batched pass gave **5.21×**: a median of 19.9 seconds against 103.6 seconds sequential. CER was 0.79% on the long video and 0% on `test_ru.wav`; peak RSS was 1.00×.

This is not “batching magic”. It is a schedule: while one block is being computed, the next is already prepared; the GPU does not idle between windows. If the batched path is unavailable or fails mid-file, the job falls back to sequential without duplicates.

## Why it matters more than it seems

Speed is not about a stopwatch. It is about trust in the tool. If you have to wait after every phrase, you stop dictating long thoughts and go back to the keyboard. If the text appears almost immediately, voice becomes a normal way to work.

We do not promise “zero latency”. A local model will always depend on hardware, and a long file on the queue. But unnecessary delays can be removed: an extra temperature step, a partial pass over the whole buffer, a wait nobody asked for.

## Where the border is

The batched path is for files of 60 seconds or more. Dictation stays sequential: its task is not quality on long material but a quick answer here and now. If recognition falls far behind, the continuous dictation buffer can be dropped at 240 seconds — that is in the long-thought post.

And yes: the “twenty seconds” in the title is not a guarantee that we removed every twenty-second pause forever. We removed their cause where they appeared most often. If `Slow partial` shows up in the log again, we will dig into the next layer.

Next is [“Hearing what the computer hears”](/blog/2026-11-28-06-hearing-what-the-computer-hears/).
