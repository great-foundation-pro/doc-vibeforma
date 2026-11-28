---
title: The model that doubts
description: How model confidence stopped being thrown away — a draft with underlined words, re-recognition and history with audio.
date: 2026-11-28T11:00:00
authors: forma
excerpt: "A confident mistake is worse than a visible doubt. In 0.5.0 the app stopped inserting doubtful text blindly: uncertain words wait in a draft until you decide."
cover:
  image: ../../../assets/blog/08-the-model-that-doubts.jpg
  alt: A dark glass panel with a line of ice glyphs, one glyph glowing magenta and underlined with a cyan line.
tags:
  - confidence
  - draft
  - history
---

The worst recognition error is not the one you see. It is the one you do not. The model confidently writes “Ivan Petrov” instead of “Ivan Petukhov”, inserts the text into the wrong chat, and you notice two messages later. Rewriting is awkward, apologizing is late.

Before 0.5.0 the app threw model confidence away. Segments carried `avg_logprob`, `no_speech_prob`, `compression_ratio`, words carried a probability — but the panel took only the text. We decided to fix that: if the model doubts, the user should see it before insertion, not after.

## What happens to a doubtful phrase now

The final pass scores a segment against four thresholds: `avg_logprob` below −1.0, `no_speech_prob` above 0.6, `compression_ratio` above 2.4, or a word probability below 0.6. If a phrase hits at least one, it is not inserted right away. The panel keeps it as a draft, underlines the doubtful words and offers two actions: **“Recognize more precisely”** and **“Restore the previous text”**.

“Recognize more precisely” runs the same take through the same loaded model, but with beam 10, temperature 0 and word timestamps. It is not another model and not a cloud — the same engine, a more expensive pass. The result replaces only the engine text: dictionary, rules, snippets and voice actions are not applied again. “Restore the previous” returns the exact previous text and markup.

## History with audio

So that re-recognition works not only for the last phrase, `history_audio` appeared — an option that saves a WAV of every take next to `history.jsonl`. It is off by default; when on, a 200 MiB limit applies, and deleting an entry or clearing history deletes the sound too. Turning the option off erases the saved WAVs.

With it came two scenarios:

- **“Re-recognize the last dictation”** in the tray: the app asks for a prompt (by default `hotwords`), starts a temporary ASR with the current or another model and leaves the new text in a draft.
- **“Recognize more precisely” for a single history entry**: a background pass with beam 10 and temperature 0, progress visible, the table stays usable.

## The language hint

Sometimes the problem is not the words but the language. If the pinned language is recognized with a probability below 0.5 while another language leads by at least 0.5, the panel says for 20 seconds: “looks like English (81%), Russian is pinned (6%)”. Recognition stays on the pinned language — the hint does not switch it by itself.

That is a compromise: we do not take control away from you, but we give information that was not there before.

## Why this matters more than accuracy

You can chase the percentage of correct words. But in real work something else matters more: the user should know when the text can be trusted. A model that always sounds confident lies more convincingly. A model that shows doubt leaves the last word to the human.

A draft is not “an unfinished insertion”. It is a pause before an action. Sometimes it costs two seconds, sometimes a rewritten message.

## Where the border is

“Recognize more precisely” needs the take's WAV. If history audio is off and the take was long and continuous, the repeat may be unavailable — the app will say so honestly. “Restore the previous” is one level, not an endless version history.

Thresholds are not the final truth. They are tuned so they do not bother the user over trifles, but catch genuinely doubtful phrases. If the model is confidently wrong and above the thresholds, the draft will not fire; that is what re-recognition in history and the language hint are for.

Next is [“Your words”](/blog/2026-11-28-09-your-words/).
