---
title: Troubleshooting
description: What to check when the installer fails, no text appears, or the model is missing.
---

## The installer does not start

Check the requirements: Windows 10 or Windows 11 with an x64 system, and Python 3.10 or newer available in `PATH`.

## No text appears

Make sure the cursor is in a text field, then try `Shift+Insert`. This insertion works regardless of the keyboard layout, and the clipboard is restored afterwards.

## A machine without network

The recognition model is downloaded once, and that download needs the network. After the download, dictation works offline.

## An update did not finish

Updates come from a manifest signed with minisign/Ed25519. The updater keeps a backup and can roll back.

## Where to look next

The repository README describes the current state of the project: [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma).
