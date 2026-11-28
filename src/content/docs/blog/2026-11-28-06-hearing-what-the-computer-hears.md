---
title: Hearing what the computer hears
description: System audio through WASAPI loopback, live subtitles and WAV/TXT/SRT recording — without a virtual cable or a cloud.
date: 2026-11-28T13:00:00
authors: forma
excerpt: "The microphone hears the room. The computer hears what it plays. In 0.4.1 VibeForma learned to take system audio; in 0.5.0, to show its live subtitles."
cover:
  image: ../../../assets/blog/06-hearing-what-the-computer-hears.jpg
  alt: A dark room with a laptop, a cyan soundwave blooming from the screen into subtitle-like bars.
tags:
  - system-audio
  - subtitles
---

A lecture without subtitles. A film you watch late at night. A call where people speak faster than you can take notes. The old path was to hold a microphone to the speakers and hope the room does not add echo. Or install a virtual audio cable, deal with drivers and pray it does not break the system sound.

On 23 November 2026, in 0.4.1, VibeForma learned to hear the computer itself. Not through a microphone, but through WASAPI loopback — the same sound Windows sends to the speakers, captured before it leaves. It works on the built-in audio card, on Bluetooth headphones, on a USB DAC and on HDMI.

## How it works

You switch the sound source to **System audio** on the Recording tab, or set `"audio_source": "system"` in `config.json`. Press the same hotkey — the take starts. The same hotkey stops it.

Unlike the microphone, there is no silence auto-stop and no live partial text in the normal mode: the system may play music, and silence does not mean the end. `max_record_s` still applies.

If loopback is unavailable — for example, the driver does not expose the output device — the app shows a clear notification instead of pasting an empty result. When Windows recreates an audio endpoint while the app runs, the device cache is re-read once and the same capture plan is retried; the log line names `api=Windows WASAPI`.

## Live subtitles

0.5.0 added a second mode: not insertion, but live subtitles. You enable system audio, and the panel shows the last one or two phrases. Nothing is inserted into the active window, dictation history is not filled, statistics are not counted. It is a separate product inside the product: not “dictate text to me” but “show me what they are saying”.

The buffer is 30 seconds, and the refresh is no more than once every 4 seconds. That pace is deliberate: a subtitle should be readable, not flicker. Two live takes of 409.5 and 844.4 seconds held without a break.

Since 0.5.1 a system take is also recorded: a 16-bit / 16 kHz mono WAV in the recordings folder, with TXT and SRT beside it on stop. The folder can be chosen in settings; **Open** creates it before the first recording. The result is a local archive: record a lecture, get the sound and the text.

## Why the audio needed fixing

System audio is not a microphone. It has a different rate, level and stereo image. The first resampler with 25 taps and Kaiser beta 8 was too soft: a 9 kHz tone folded to 7 kHz at −13.7 dB. For speech that is almost invisible; for music and subtitles it is not.

We replaced it with 127 taps and Kaiser beta 10: flat to 6 kHz, aliases from 9 kHz suppressed. At the same time the VAD learned to keep the beginning of a phrase: `speech_pad_ms` grew from 30 to 400 ms, `min_silence_duration_ms` from 250 to 1000 ms. The first word and the closing punctuation stopped disappearing.

## Where the border is

The live subtitle filter drops short stop phrases and loops, but invented text over music can still reach the plate. That is an honest limit: in real time we do not have full context and the right to rewrite a line already shown. The system mode does not write dictation history and does not insert text — that is its purpose, not a gap.

And system audio is not “screen recording”. We take only the sound, without video and without window titles. The log does not contain the content — only facts: device, rate, duration.

Next is [“A long thought does not break”](/blog/2026-11-28-07-a-long-thought/).
