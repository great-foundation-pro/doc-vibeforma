---
title: Dictation
description: How to dictate with VibeForma — toggle and hold modes, phrase endings, insertion, the clipboard, cancellation and notifications.
---

Dictation is the main loop of VibeForma: a hotkey starts listening, speech is recognized locally, and the text is inserted where the cursor was.

![The panel with a phrase being recognized in the draft area.](../../assets/docs/app/hud-recording-en.png)

*The panel streams the phrase while you speak.*
## Dictate a phrase

1. Put the cursor in a text field.
2. Press `Ctrl+Alt+Space` — the default hotkey.
3. Speak.
4. End the phrase in one of three ways:
   - pause for 2 seconds of silence;
   - press the hotkey again in toggle mode;
   - release the hotkey in hold-to-talk mode.
5. The text is inserted at the cursor.

A phrase is no longer capped at 120 seconds. Continuous dictation is on by default: a long take is cut at a pause of 400 ms after at least one second of speech, or at 30 seconds with the last 300 ms carried into the next chunk. The chunks are recognized by the final pass, joined without repeated words at the seams, and inserted once. With `continuous: false`, `max_record_s` stops a phrase at 120 seconds as before.

## Modes

| Mode | How it works | Setting |
|---|---|---|
| Toggle (default) | Press once to start, press again to stop | `hold_to_talk: false` |
| Hold to talk | Hold the hotkey while speaking, release to stop | `hold_to_talk: true` |

The mode is chosen in **Settings → Recording** and applies to the running service without a restart.

## Recognition quality

**Settings → Recording** carries a **Recognition quality** preset, and it shapes the final pass of a dictation:

| Preset | What it changes |
|---|---|
| **Normal (recommended)** | Beam 5 with the temperature fallback from 0.0 to 0.2 |
| **Accurate** | Beam 10 at temperature 0 — a wider search, slower |
| **Fast** | Beam 1 at temperature 0 — quicker, weaker on a complex phrase |

The preset is read when the final pass starts, so a saved change applies to the next phrase without a restart. It is the only quality control of that pass: there is no separate temperature setting. File transcription and live subtitles keep their own settings.

## What happens while you speak

- The microphone is captured at 16 kHz mono internally; the capture path follows the device format and resamples when needed.
- Voice activity detection (VAD) uses 512-sample frames — 32 ms each.
- Partial transcriptions are streamed to the panel about every 1.5 seconds (`partial_every_s`).
- The panel shows the microphone level and a VAD indicator, so you can see whether the app hears you.
- A take clock sits left of the level bar: a limited microphone take counts down to `max_record_s`, while continuous dictation and a system take count elapsed time. Details: [Panel, tray and autostart](/interface/).
- Start and end beeps can be enabled (`beep_on`, `beep_off`).

## Doubtful phrases

The engine reports how sure it is: `avg_logprob`, `compression_ratio`, `no_speech_prob` and `temperature` for a segment, `probability` for a word. When the readings are poor — or the final pass needed a temperature above zero — the phrase stays in the panel draft and nothing is inserted. The doubtful words are underlined in the draft; **Insert** still pastes the whole phrase if you agree with it.

A drafted doubtful phrase also offers **Recognize more precisely**: the same recording is decoded again with beam 10 at temperature 0, and the new text replaces the draft with its own highlighting. **Restore previous** returns the exact earlier text. A confident phrase does not get the button. The recording is kept for this purpose; a long continuous take needs history audio on, because only the whole take can be decoded again.

## Text cleanup

Text cleanup is opt-in (`text_cleanup`, off by default). When on, it runs after the dictionary, text rules and snippets, so both the draft and the insertion get the cleaned text:

- numbers and dates are written as digits for Russian and English ("двадцать три рубля" → "23 рубля");
- filler words — "эээ", "ну", "как бы", "um", "you know" — are removed where it is safe, never inside a word;
- a capital letter starts the text and each sentence after `. ! ? …` or a line break;
- protected fragments stay byte for byte: `snake_case`, `camelCase`, dotted paths, URLs, e-mail addresses, Windows paths and text in backticks.

Punctuation is not rewritten: it still comes from Whisper. A small single numeral outside a recognized phrase may stay as words ("пять рублей"), and there is no settings tab yet — the key lives in `config.json`.

## Voice actions

The optional `actions` list turns a whole spoken phrase into a command:

```json
"actions": [
  {"trigger": "open browser", "kind": "command"},
  {"trigger": "switch to the small model", "kind": "model", "model": "small"},
  {"trigger": "ask the agent", "kind": "agent", "command": "\"C:\\tools\\agent.exe\""}
]
```

`command` runs `hook_command` (or the record's own `command`) through stdin without a shell; `model` switches the model after the phrase ends; `agent` starts its own command. Matching comes after the dictionary and snippets and requires the whole phrase, so an action does not fire from the middle of ordinary speech. A triggered action is not inserted as text. A failed command still inserts the phrase and writes the exit code to the log.

## Context from the previous phrase

`dictation_context` is off by default. When on, the tail of the previous phrase (160 characters) and the text selected in the target window (up to 400 characters) join `hotwords`, so a name said once is spelled the same way next time. Context is read for the next dictation only and does not rewrite `config.json`.

## System audio: live subtitles and a recording

With the sound source set to **System audio**, the dictation hotkey does not insert text: it feeds live subtitles and records the take to a file. The panel shows the last one or two phrases, refreshed at most every 4 seconds over the last 10 seconds of sound, and the same hotkey stops the take. Nothing goes into the active window, and no draft or history record appears.

The take is written as a 16-bit, 16 kHz mono WAV into the recordings folder — `Documents\VibeForma\Recordings` by default, a date subfolder, the file named by the take's start time. The panel's status line names the path for the whole take, and a notification repeats it. On stop, TXT and SRT are queued beside the WAV through the file queue. A folder that cannot be written is reported before the take starts.

Two limits are worth knowing: a take longer than `file_max_s` (6 hours) or larger than `file_max_mb` (4 GB) is not transcribed, and `Esc` or exiting the app closes the WAV but does not queue the transcript. The live capture buffer stays capped at 30 seconds, so a take can run for hours without growing. Read [Panel, tray and autostart](/interface/) for the plate itself and [Files and locations](/files-and-paths/) for the folder; the **Sound source** switch is on **Settings → Recording**.

## Cancel a phrase

Press `Esc` while the phrase is in flight. The recording or the panel draft is discarded and nothing is inserted.

The global `Esc` listener exists only while a dictation is in flight and is destroyed afterwards, so `Esc` stays with the application you are using at all other times.

## Where the text goes

VibeForma inserts into the window that was active when you pressed the hotkey — not into whatever happens to be focused later. The target is captured at the start of the take.

If the focus changes while the phrase is being recognized, VibeForma does not ask and does not paste into a stranger: the recognized text stays in the clipboard, and a tray notification says so. Insert it yourself with `Ctrl+V` where you want it; the previous clipboard content is not restored over it.

Insertion also waits for the stopping combination to be released: a paste sent while `Ctrl+Alt` is still held does not paste in any app, so the text lands only after the keys are up.

## Insertion and the clipboard

| Behavior | Detail |
|---|---|
| Paste method | `Shift+Insert` by default; `Ctrl+V` can be chosen (`paste_method`) |
| Layout independence | The default method does not depend on the keyboard layout |
| Clipboard restore | The previous clipboard is restored after about 1 second, only if `GetClipboardSequenceNumber` has not changed |
| Empty clipboard | An empty clipboard is also restored |
| Turning restore off | `restore_clipboard: false` |
| Windows clipboard history | Dictated text is marked as excluded from clipboard history and cloud clipboard on Windows 10+ |
| Third-party managers | A third-party clipboard manager may still keep the text; the settings say so |

The exclusion uses `ExcludeClipboardContentFromMonitorProcessing`, `CanIncludeInClipboardHistory=0` and `CanUploadToCloudClipboard=0`.

## Drafts on the panel

The microphone button on the panel starts a recording without the hotkey. The recognized text stays in the panel instead of being inserted immediately, and a row of actions appears below it:

- **Edit** — open the draft for correction.
- **Copy** — put it in the clipboard.
- **Insert into the selected window** — insert into the window you choose after the draft appears. A maximized window stays maximized.
- **Cancel** — discard the draft.

If no window is selected, the text goes to the clipboard. `Ctrl+Enter` inserts the panel draft.

## Undo the last insertion

Press `Ctrl+Z` within 30 seconds, in the same window where the text was inserted. VibeForma sends the undo keystroke by virtual key (`VK_Z`), so it does not depend on the keyboard layout.

After 30 seconds, or in another window, VibeForma warns that the undo is no longer allowed instead of sending a blind keystroke.

**Restore clipboard** returns the clipboard to what it was before the dictation.

## Notifications

Notifications report the number of characters — for example, "Inserted, 42 characters" — and never the dictated text. Showing the phrase is opt-in (`notify_text`).

## Language

The recognition language is fixed in the settings. VibeForma does not guess it. If the wrong language is chosen, recognition quality drops; change it in **Settings → Model & language** or from the tray.

The app does not switch the language on its own, but it can say when the wrong one is pinned. If the pinned language scores below 50% and another language scores at least 50%, the panel shows "looks like X (..%), Y selected (..%)" for 20 seconds. The pinned language stays in force.

## Where the dictionary fits

Every 30-second window of a long take now carries the dictionary terms through the engine's `hotwords` parameter, and up to 223 tokens are chosen by correction frequency. Application profiles can add their own terms and snippets in a specific app. Details: [Dictionary](/dictionary/).

## If dictation does not work

- No text: check the cursor, try `Shift+Insert`, check the microphone in **Settings → Recording**.
- Wrong window: see the focus-change behavior above; insertion follows the window active at the hotkey.
- Hotkey conflict: choose another combination in **Settings → Hotkeys**.
- Model missing: [Models and languages](/models/).

Full symptom index: [Troubleshooting](/troubleshooting/).

## Where to go next

- [Keyboard shortcuts](/hotkeys/) — every key the app listens to.
- [Panel, tray and autostart](/interface/) — the panel and the tray menu.
- [Dictionary](/dictionary/) — names and terms.
- [History](/history/) — optional records of dictations.
