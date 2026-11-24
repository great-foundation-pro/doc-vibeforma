---
title: Contributing
description: How to report an issue, send a pull request, add a locale and change the documentation in both languages.
---

VibeForma is open source under the MIT license. Contributions are welcome — issues, fixes, locales and documentation.

## Before you start

- Search the existing issues and pull requests.
- For a large change, open an issue first so the scope can be agreed.
- For a security problem, follow [Security](/security/) instead of opening a public issue.

## Reporting an issue

Include:

1. The VibeForma version (the settings window header or `run.cmd --status`).
2. Windows version and whether the machine has an NVIDIA GPU.
3. Steps to reproduce.
4. The expected and actual result.
5. The `--doctor` report.
6. The relevant part of the log.

Redact the API token and any personal text. The doctor report already excludes both.

## Code contributions

| Rule | Detail |
|---|---|
| Language | English in code, comments, logs and commits. |
| Encoding | Executable code is ASCII. |
| Tests | Add or update tests for a behavior change. |
| Lint | `python tools/ruff_gate.py` must not add findings. |
| Typing | Strict `mypy` for `app/vibeforma`. |
| Scope | One change per pull request; unrelated refactors go separately. |

Run before sending:

```powershell
.venv\Scripts\python -m pytest -q
.venv\Scripts\python tools\ruff_gate.py
.venv\Scripts\python -m mypy app\vibeforma
```

## Language rules

- The core is English.
- Cyrillic is allowed only in `app/locales/*.json`, Russian installer text, Russian and Ukrainian ASR prompts and `README.ru.md`.
- A test enforces the rule; a pull request that violates it fails CI.

## Adding an interface language

1. Copy `app/locales/en.json` to `app/locales/<code>.json`.
2. Translate the values, keeping the keys unchanged.
3. Run the locale tests; key parity is checked.
4. The language appears in the settings automatically.
5. Missing keys fall back to English.

## Documentation changes

- Every page exists in English at the root and in Russian under `/ru/` with the same slug.
- Both versions change in the same pull request.
- The page standard: one H1, sentence case, second person, active voice, no marketing.
- UI labels quoted in a page match the locale of that page.
- Screenshots, if added, are in the language of the page and have alt text.
- Build and verify:

```powershell
cd project\production\vibeforma.pro
npm run verify:all
```

## Commit messages

Write them in English, in the imperative mood, with a short subject. A body explains why, not what — the diff shows what.

## License

By contributing, you agree that your contribution is licensed under the MIT license of the project.

## Where to go next

- [Development](/development/) — setup, tests and release build.
- [Roadmap](/roadmap/) — what is being worked on.
- [Security](/security/) — reporting a vulnerability.
- [Known issues and limitations](/known-issues/) — the current boundary.
