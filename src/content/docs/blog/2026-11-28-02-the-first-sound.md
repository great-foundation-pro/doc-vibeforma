---
title: The first sound
description: How the closed loop of press, speak and insert came together in one day — and why the magic is the chain, not the model.
date: 2026-11-28T17:00:00
authors: forma
excerpt: "The first VibeForma release was not a model demo. It was a closed loop: microphone, Whisper, clipboard, insertion, restore. Trust in it is built from small things."
cover:
  image: ../../../assets/blog/02-the-first-sound.jpg
  alt: A dark microphone with a thin thread of cyan light turning into a line of abstract glyphs.
tags:
  - chronicle
  - dictation
---

The first working loop looks like a trick. Put the cursor in an empty field, press `Ctrl+Alt+Space`, say one phrase — and a second later the text is there. Not in a separate window, not in the clipboard, not in history: right where the cursor was. A second ago the text did not exist, and now it does.

The trick is not that the model can recognize speech. Dozens of engines can. The trick is that there is no gap between “pressed” and “inserted”. The microphone gives audio, the VAD finds speech, Whisper turns it into segments, post-processing shapes the text, the clipboard delivers it to the active window, and the old clipboard content comes back. If any link breaks, the magic disappears.

On 20 November 2026 we assembled the whole chain.

## What went into the first version

0.1.0 was the first international release. It was not a “recognition prototype” but a complete working loop:

- a hotkey and insertion through the clipboard and `Shift+Insert`, independent of the keyboard layout;
- restoring the previous clipboard content, so dictation does not erase what you were carrying in another window;
- 26 languages in the menu, each with its own punctuation preset;
- a monitoring panel: microphone level, VAD, live partial previews, transparency, autogrow;
- settings applied live, without a restart;
- a tray menu: pause, input device, model switch, language, logs folder;
- an installer, CUDA float16 on NVIDIA and an automatic CPU int8 fallback;
- a single service instance, rotating logs, `run.cmd --selftest`.

By the evening the same day we added `--doctor`, a dictionary, history, a transactional installer and the first 34 tests. That matters more than it sounds: the product was built from the start as something you use every day, not as something you try once.

## Why the language is pinned

In 0.1.1 we removed auto-detection. It was one of the first deliberate decisions against “smartness”. Auto-detection fails on short phrases, names and technical terms, and a language error ruins the whole text at once. A pinned language is predictable: you chose Russian, the model recognizes Russian even if the phrase sounds English.

Later we added a language hint: the panel can say “looks like English”, but recognition stays on the pinned language. That is a compromise between predictability and information. Predictability came first.

## Trust is built from small things

The user does not see the chain. They see the result. So every link has to be invisible and reliable.

**Clipboard.** If your text stays in the clipboard after insertion instead of what you copied earlier, that is annoying. If the clipboard is not restored, you lose data. So insertion swaps the clipboard temporarily and restores it.

**Layout.** `Ctrl+V` depends on the layout and the app. `Shift+Insert` works in most fields regardless of language. Insertion is not tied to one combination.

**Offline.** The model loads from disk. The first run may download it, but after that the network is not needed. Dictation works on a plane and in an isolated network.

**Diagnostics.** `--doctor` checks Python, dependencies, the model, CUDA/CPU, the microphone, the hotkey, disk space and update settings. It does not read dictated text, history, the dictionary or the token. It is a report about the environment, not about you.

**Installer.** It checks the Windows version, architecture, Python, disk space and the target folder; refuses system directories; cleans up after a failed first step; keeps a backup during an update. Installation is a transaction, not a sequence of “hope it works”.

## What the first version could not do

It did not take files. It did not hear system audio. It did not do continuous dictation — recording stopped on a timer. It did not show model confidence or offer to retry a doubtful phrase. It did not know application profiles and did not clean numbers or filler words.

That is not a list of failures. It is the map of the next posts. The first sound mattered not because the product could already do everything, but because the main loop was closed: from the keypress to the text and back, without a cloud and without losses.

Next is [“The site as the other half”](/blog/2026-11-28-03-the-site-as-the-other-half/): why a local tool has to explain itself, and how vibeforma.pro appeared.
