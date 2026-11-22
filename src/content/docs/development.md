---
title: Development
description: The repository layout, the local setup, tests, linting, CI, the documentation site and the release build.
---

VibeForma is a Python application with a Tkinter interface, packaged as a source copy with a virtual environment.

## Repository layout

| Path | What it holds |
|---|---|
| `app/` | Application modules: audio, ASR, insertion, history, dictionary, snippets, statistics, hotkey, tray, panel, settings, onboarding, updates, diagnostics |
| `app/vibeforma/` | Service package: `service.py`, `http_api.py`, `status.py`, `settings_ops.py`, `update_ops.py`, `updates.py`, `actions.py`, `selftest.py`, `util.py` |
| `app/locales/` | `en.json`, `ru.json` and any added locale |
| `tests/` | About 40 test files |
| `tools/` | `build_release.py`, `ruff_gate.py` and release helpers |
| `install.ps1`, `install.py`, `install_steps.py`, `install_core.py`, `install_system.py` | The installer |
| `uninstall.py` | The uninstaller |
| `main.py`, `run.cmd` | Entry points |
| `docs/` | Product troubleshooting source |

## Requirements

- Python 3.10–3.14.
- Windows for the full test suite; a subset runs on Linux.
- No GPU and no model are needed for the tests.

## Local setup

```powershell
git clone https://github.com/FormaMindPro/vibeforma.git
cd vibeforma
python -m venv .venv
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r app\requirements.txt
.venv\Scripts\python main.py
```

CUDA machines install the CUDA requirements as well:

```powershell
.venv\Scripts\python -m pip install -r app\requirements-cuda.txt
```

The application starts as a tray service. Models are downloaded on first use.

## Tests

```powershell
.venv\Scripts\python -m pytest -q
```

The suite runs without a model, a GPU or a network. It covers configuration, locales and key parity, insertion, the installer, HTTP API guards, history, snippets, statistics, dictionary, learning, text rules, hold-to-talk, `Esc`, the history table and filters, the keys tab, the panel, onboarding, updates and the uninstaller.

A platform-independent subset is marked for Linux:

```powershell
.venv\Scripts\python -m pytest -q -m "not windows"
```

## Linting and typing

```powershell
.venv\Scripts\python tools\ruff_gate.py
.venv\Scripts\python -m mypy app\vibeforma
```

The ruff gate compares findings with a baseline: new findings fail, existing ones are tracked. `mypy` runs in strict mode for the `vibeforma` package.

## CI

GitHub Actions runs:

- the full test suite on Windows;
- the platform-independent subset on Ubuntu;
- `compileall`;
- the ruff baseline gate;
- strict `mypy` for the service package.

A pull request is expected to pass all of them.

## Language rules

- The core is English: code, comments, logs, `CHANGELOG.md` and commits.
- Executable code is ASCII.
- Cyrillic is allowed only in `app/locales/*.json`, Russian installer text, Russian and Ukrainian ASR prompts and `README.ru.md`.
- A test enforces the rule.

## Documentation site

The site in this repository is built with Astro Starlight:

```powershell
cd project\production\vibeforma.pro
npm install
npm run dev
npm run build
npm run verify:all
```

The documentation exists in English at the root and in Russian under `/ru/` with the same slugs. A new page is added in both locales.

## Release build

```powershell
.venv\Scripts\python tools\build_release.py --out dist
```

The build produces a zip archive and `SHA256SUMS`, including `test_ru.wav`. The GitHub Actions workflow builds the same archive on a tag.

The release is installed by the same `install.ps1` used for a first install; the updater keeps a backup and rolls back on failure.

## Where to go next

- [Contributing](/contributing/) — how to send a change.
- [Changelog](/changelog/) — what shipped.
- [Diagnostics and logs](/diagnostics/) — the doctor and the selftest.
- [Files and locations](/files-and-paths/) — the runtime layout.
