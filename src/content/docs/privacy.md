---
title: Privacy
description: How VibeForma works with voice, history and the network.
---

## Recognition runs locally

VibeForma uses faster-whisper and works offline: speech recognition runs on your machine.

## When the network is used

The network is needed in two cases:

- Once, to download the recognition model.
- For updates.

Automatic updates are checked against a manifest signed with minisign/Ed25519. The updater keeps a backup and can roll back.

## History

History is disabled by default. When enabled, VibeForma keeps the last 100 dictations in `history.jsonl`.

## Dictionary and logs

The dictionary can be imported and exported. Logs are rotated.
