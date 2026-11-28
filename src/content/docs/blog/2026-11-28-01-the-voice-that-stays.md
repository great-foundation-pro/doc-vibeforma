---
title: The voice that stays with you
description: Why VibeForma runs locally — no cloud, no account, no telemetry — and why that is a stance, not a feature.
date: 2026-11-28T18:00:00
authors: forma
excerpt: "We speak faster than we type. But voice assistants take the speech to the cloud. VibeForma starts from a different decision: the voice stays with the person."
cover:
  image: ../../../assets/blog/01-the-voice-that-stays.jpg
  alt: A glowing voice waveform turning into a sharp geometric mark on a dark background.
tags:
  - idea
  - privacy
---

There is a moment every heavy writer knows. The thought is already formed, the fingers are still choosing words, and every sentence costs a second and a half between the head and the screen. Voice is faster. It carries intonation, second thoughts, the parenthetical clarifications that editing would remove anyway. And yet voice input stayed optional for years: too much friction between “said” and “got text”.

Cloud assistants removed some of that friction — and added another kind. Audio leaves for a server. An account is required. A network is required. Trust in someone else’s retention policy is required. For “set a timer”, that is fine. For a work email, a piece of code, a draft contract or a medical note, it is not.

VibeForma starts from a different decision: **the voice stays with you**. Not as a setting you can turn off, but as a property of the thing itself.

## What that means in practice

Recognition runs on your computer. The Whisper model lives in the app folder or in a local cache. Audio never leaves the machine: no upload, no account, no telemetry. The app works on a plane, in an isolated network, on a computer without internet — and dictation still works.

That is not free. A local model takes disk space, the first run needs a download, and speed depends on your GPU. On a weak laptop, recognition will be slower than in the cloud. We think the trade is honest: you pay with hardware and time, not with your text.

## Why the language is pinned, not guessed

The first version had auto-detection: the model listened to a phrase and decided which language it was. It sounds convenient. In practice it is a source of quiet errors. A short “ok”, a proper name, a technical term — and the model switches to English while you were speaking Russian. The text comes out almost right, but foreign.

In 0.1.1 we removed auto-detection from the menu and pinned the language exactly. The model recognizes the chosen code, not the one it finds more likely. If you speak two languages, you switch yourself — a deliberate action, not a surprise at the end of a paragraph. Later we added a language hint: when confidence is low, the panel can say “looks like English”, but recognition stays on the pinned language.

That small decision says a lot about the product. We prefer predictability over convenience that has to be undone later.

## From voice vibe to sharp form

VibeForma has a short formula: **from voice vibe to sharp form**. Voice is naturally loose: pauses, repetitions, “um”, “like”. Text is naturally sharp: it has boundaries, punctuation, case. The job is not to transcribe sound into letters, but to carry a thought to a form you are not ashamed to send.

That is where the rest comes from: a dictionary that knows your names and terms; application profiles where a chat and an IDE have different vocabulary; cleanup of numbers and filler words; a draft where doubtful words are underlined before insertion; a guard against an invented ending you never said. Each of these is a small act of respect for what you actually said.

## What it is not

VibeForma is not a cloud service with a local client. There is no “free tier with a minute limit”, because there is no server counting minutes. No recognition subscription. No foreign model learning from your texts. There is an app, a model and your computer.

It is also not a perfect transcriber. The model makes mistakes, especially on names, noise and a bad microphone. That is why the product has doubt, retry and honest limits — the next posts are about them.

## What comes next

This series is not a set of press releases. It is ten stories about how the product learned to listen: from the first sound of 0.1.0 to 0.5.8, where we taught the engine not to append “to be continued”. Each story has a scene, a cause, a solution and a border we have not crossed yet.

If you are reading from the start: next is [“The first sound”](/blog/2026-11-28-02-the-first-sound/), the story of how a closed loop — press, speak, insert — came together in one day. If you want the whole chronology at once, it is on the [Chronicle](/chronicle/) page.
