---
title: Security
description: The security model of a local dictation app — the loopback API, the hook, updates, the clipboard and how to report a vulnerability.
---

VibeForma is a local desktop application. It has no cloud service, no account system and no remote backend. Its security model is therefore small and explicit: protect the local machine, keep the API on loopback, verify what is downloaded, and avoid executing untrusted input.

## Threat model

| Asset | Who could reach it | Protection |
|---|---|---|
| Dictated text | A local process, a clipboard manager, the target application | Local-only processing; clipboard exclusion; no upload |
| History and statistics | A local user with your Windows account | Windows file permissions; history off by default |
| API token | A local process that can read `config.json` | Windows account permissions; loopback-only listener |
| Update archive | The network | `SHA256SUMS`; backup and rollback |
| Hook command | The configured command itself | No shell; timeout; parallel execution |

VibeForma does not defend against a compromised Windows account. If an attacker can read your profile, they can read `config.json`.

## Local API

| Control | Detail |
|---|---|
| Bind address | `127.0.0.1` only |
| Token | `X-VibeForma-Token` on every request |
| Comparison | Constant-time (`hmac.compare_digest`) |
| Body limit | 10 MB |
| Content type | `audio/wav` only |
| Rate limit | One request per second |
| Busy service | `409`; live dictation has priority |
| Temporary audio | Deleted on every outcome |
| TLS | Not used; traffic never leaves loopback |

The API is off by default. If the token is missing, the listener does not start — fail-closed.

## Hook command

`hook_command` runs a user command with the recognized text on stdin:

- no shell is involved, so `|`, `>`, `&&` and variable expansion are ordinary characters;
- the timeout is 1–30 seconds;
- a failure or timeout is logged as a status and does not block insertion;
- the hook runs in parallel with insertion.

The hook is a deliberate code-execution surface: whatever you configure will run with your permissions. Treat `hook_command` like an entry in your shell profile.

## Updates

| Control | Detail |
|---|---|
| Source | GitHub Releases |
| Integrity | `SHA256SUMS` |
| Signature | None — no code-signing certificate or signed manifest |
| Backup | Kept before installation |
| Rollback | Restores the backup on failure |
| SmartScreen | May warn because the build is unsigned |

A checksum detects a corrupted download; it does not prove who built the archive. Download only from the official repository and verify the checksum.

## Clipboard

- The previous clipboard is restored after about one second if nothing new was copied.
- Dictated text is marked as excluded from Windows clipboard history and cloud clipboard.
- A third-party clipboard manager may still capture it; that is outside VibeForma's control.

## Files

- `config.json` contains the API token in plain text. Protect it with Windows account permissions.
- `location.json` contains no secret.
- Logs never contain dictated text; window titles are opt-in.
- History is off by default; disabling it deletes the file.

## Single instance

`service.lock` prevents a second service from starting. Two services would compete for the microphone, the hotkey and the API port, and could produce confusing behavior.

## What is intentionally not a security boundary

- The dictionary and snippets are not secret storage.
- History is not encrypted.
- The panel privacy mode hides text from the screen, not from the process.
- The API token is not a substitute for OS account security.

## Reporting a vulnerability

Open a private security advisory in the [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma) repository. If advisories are unavailable, contact the maintainers through the repository without posting exploit details in a public issue.

Include:

- the version;
- the affected component — API, hook, installer, updater, clipboard;
- steps to reproduce;
- the impact you observed.

Do not include your API token, dictated text or personal files.

## Where to go next

- [Privacy](/privacy/) — what is stored and what is not.
- [Local API](/local-api/) — the endpoint and status codes.
- [Updates](/updates/) — checksums, backup and rollback.
- [Files and locations](/files-and-paths/) — where the token lives.
