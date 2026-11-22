---
title: Troubleshooting
description: Find the symptom, its likely cause and the next step — installer, microphone, hotkey, insertion, model, updates and the API.
---

Find the symptom that matches. Each section names the likely cause, the steps to take and the result you should see. If a step needs a deeper check, it links to [Diagnostics and logs](/diagnostics/).

## The installer does not start

**Likely cause:** missing Python, an unsupported Windows build or a blocked PowerShell script.

1. Check that Python 3.10–3.14 is installed and on `PATH`.
2. Check that Windows is 10 build 1809+ or 11.
3. Run the saved script to see the error instead of piping it:

   ```powershell
   irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 -OutFile install.ps1
   .\install.ps1 -DryRun
   ```

**Expected:** the dry run prints the checks and the plan without changing anything.

## The installer stops partway

**Likely cause:** a failed precheck or a network error during the model download.

1. Read `install.log` in the install directory; it names the failed step.
2. Check free disk space: the model size plus about 4 GB.
3. Run the installer again. It continues from the failed step and reuses the virtual environment, model and configuration.

**Expected:** the second run reaches the end or names a different, specific failure.

## No text appears after dictation

**Likely cause:** the cursor is not in a text field, the insertion was blocked, or the text went to the clipboard.

1. Click into a text field and put the cursor where the text should go.
2. Dictate again, then try `Shift+Insert` — this insertion does not depend on the keyboard layout.
3. Check the tray notification: if it says the text was copied, the target window was not available.
4. If the focus changed during recognition, VibeForma asked where to insert; choose **Insert here**.

**Expected:** the text appears at the cursor, or the notification explains that it is in the clipboard.

## Text went into the wrong window

**Likely cause:** the focus changed between the hotkey press and the end of recognition.

VibeForma inserts into the window that was active at the hotkey. If the focus moved, it asks instead of guessing. Answer **Insert here**, **Copy** or **Cancel**.

If the dialog cannot be shown, the text is copied and a tray notification says so. Nothing is inserted into an unknown window.

## The microphone is silent

**Likely cause:** the wrong input device, a muted device or Windows microphone privacy.

1. Open **Settings → Recording** and choose another input device.
2. Watch the level meter while speaking.
3. Press **Check microphone**; the recognized text is shown and not inserted.
4. Check **Windows Settings → Privacy → Microphone** and allow desktop apps.
5. For a Bluetooth headset, switch to a wired or USB microphone if the level is low.

**Expected:** the level moves with your voice and the test recording produces text.

## Recognition is slow

**Likely cause:** a large model on CPU, or CUDA not active.

1. Run `run.cmd --doctor` and read the CUDA/CPU line.
2. Switch to `large-v3-turbo` or `small` in **Settings → Model & language**.
3. If the machine has an NVIDIA GPU, check that the CUDA profile is active and the drivers are installed.

**Expected:** the CUDA line is `OK`, or the smaller model reduces waiting time.

## Recognition is inaccurate

**Likely cause:** the wrong language, a weak model, a poor microphone or unknown terms.

1. Check the recognition language in **Settings → Model & language** or the tray.
2. Choose a larger model if the machine can carry it.
3. Move closer to the microphone and reduce background noise.
4. Add names and terms to the [dictionary](/dictionary/) or `hotwords`.

**Expected:** the same phrase is recognized with fewer errors. Accuracy depends on the input; no setting guarantees a perfect result.

## The hotkey does nothing

**Likely cause:** another application owns the combination, the service is paused, or the listener failed to start.

1. Check the tray: is the service paused?
2. Choose another combination in **Settings → Keyboard shortcuts**. Windows-reserved combinations produce a warning.
3. Run `run.cmd --doctor` and read the hotkey line.
4. Restart the app; the new listener starts before the old one stops, and a failure keeps the previous combination.

**Expected:** the panel shows recording, or the doctor names the conflict.

## The model did not download

**Likely cause:** no network, a proxy, or insufficient disk space.

1. Check the network and free disk space.
2. Retry the model switch in **Settings → Model & language**; a failed download rolls back to the previous model.
3. If a model exists in the shared Hugging Face cache, VibeForma can use it without downloading.

**Expected:** the progress dialog reaches **done** and dictation works.

## Settings do not apply

**Likely cause:** the change was not saved, or it needs a model reload.

1. Save with `Ctrl+S`; the confirmation appears in place.
2. For a model switch, wait for the progress dialog to finish. If a dictation is running, the answer is "busy".
3. Most recording and appearance settings apply to the live service immediately.

**Expected:** the change takes effect without a restart.

## The clipboard is not restored

**Likely cause:** something new was copied within one second, or restoration is disabled.

VibeForma restores the previous clipboard only if `GetClipboardSequenceNumber` has not changed. An empty clipboard is restored too. Check `restore_clipboard` in the settings.

**Expected:** the previous clipboard content returns about a second after insertion.

## Undo does not work

**Likely cause:** more than 30 seconds passed, or the focus is in another window.

`Ctrl+Z` is sent only to the same window and only within 30 seconds. Outside that, VibeForma warns instead of sending a blind keystroke.

**Expected:** the last insertion is undone, or the warning explains why not.

## History is empty

**Likely cause:** history is off — which is the default.

Turn it on under the history table in **Settings → History**. Turning it off deletes `history.jsonl`.

**Expected:** new dictations appear in the table; old ones cannot be recovered after the file is deleted.

## The API returns 401 or 409

| Code | Cause | Next step |
|---|---|---|
| `401` | The token is missing or wrong | Read `http_token` from `config.json` and send it in `X-VibeForma-Token`. |
| `409` | The service is recording or processing | Retry when the state is idle. |
| `415` | The content type is not `audio/wav` | Set `Content-Type: audio/wav`. |
| `429` | More than one request per second | Wait at least a second. |

The actual port may not be 8787; read it from `location.json`.

## The app does not start after an update

1. Read `install.log` in the install directory.
2. Run `run.cmd --doctor` and read the first `FAIL`.
3. Restore the backup created by the updater.
4. Reinstall with the same installer; it continues from the failed step.

**Expected:** the service starts and `run.cmd --status` returns a fresh state.

## Antivirus blocks the installer

The build is unsigned, so antivirus and SmartScreen may warn. Verify the archive against `SHA256SUMS` and allow it only if you trust the source.

## Where to go next

- [Diagnostics and logs](/diagnostics/) — the doctor, the selftest and the logs.
- [Known issues and limitations](/known-issues/) — documented limits.
- [FAQ](/faq/) — short answers.
- [Command line](/cli/) — exit codes and the status command.
