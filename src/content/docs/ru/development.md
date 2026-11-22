---
title: Разработка
description: Структура репозитория, локальная настройка, тесты, линтеры, CI, сайт документации и сборка релиза.
---

VibeForma — приложение на Python с интерфейсом Tkinter, поставляемое как копия исходников с виртуальным окружением.

## Структура репозитория

| Путь | Что содержит |
|---|---|
| `app/` | Модули приложения: аудио, ASR, вставка, история, словарь, сниппеты, статистика, горячая клавиша, трей, панель, настройки, онбординг, обновления, диагностика |
| `app/vibeforma/` | Пакет сервиса: `service.py`, `http_api.py`, `status.py`, `settings_ops.py`, `update_ops.py`, `updates.py`, `actions.py`, `selftest.py`, `util.py` |
| `app/locales/` | `en.json`, `ru.json` и любая добавленная локаль |
| `tests/` | Около 40 тестовых файлов |
| `tools/` | `build_release.py`, `ruff_gate.py` и помощники релиза |
| `install.ps1`, `install.py`, `install_steps.py`, `install_core.py`, `install_system.py` | Установщик |
| `uninstall.py` | Удалятор |
| `main.py`, `run.cmd` | Точки входа |
| `docs/` | Исходник продуктового troubleshooting |

## Требования

- Python 3.10–3.14.
- Windows для полного набора тестов; подмножество идёт на Linux.
- GPU и модель для тестов не нужны.

## Локальная настройка

```powershell
git clone https://github.com/FormaMindPro/vibeforma.git
cd vibeforma
python -m venv .venv
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r app\requirements.txt
.venv\Scripts\python main.py
```

На машинах с CUDA ставятся и CUDA-зависимости:

```powershell
.venv\Scripts\python -m pip install -r app\requirements-cuda.txt
```

Приложение стартует как сервис в трее. Модели скачиваются при первом использовании.

## Тесты

```powershell
.venv\Scripts\python -m pytest -q
```

Набор идёт без модели, GPU и сети. Он покрывает конфигурацию, локали и парность ключей, вставку, установщик, защиты HTTP API, историю, сниппеты, статистику, словарь, обучение, текстовые правила, удержание, `Esc`, таблицу и фильтры истории, вкладку клавиш, панель, онбординг, обновления и удалятор.

Платформенно-независимое подмножество помечено для Linux:

```powershell
.venv\Scripts\python -m pytest -q -m "not windows"
```

## Линтеры и типизация

```powershell
.venv\Scripts\python tools\ruff_gate.py
.venv\Scripts\python -m mypy app\vibeforma
```

Гейт ruff сравнивает находки с baseline: новые находки падают, существующие отслеживаются. `mypy` работает в strict-режиме для пакета `vibeforma`.

## CI

GitHub Actions запускает:

- полный набор тестов на Windows;
- платформенно-независимое подмножество на Ubuntu;
- `compileall`;
- гейт baseline ruff;
- strict `mypy` для пакета сервиса.

Pull request должен проходить всё.

## Правила языка

- Ядро английское: код, комментарии, логи, `CHANGELOG.md` и коммиты.
- Исполняемый код — ASCII.
- Кириллица разрешена только в `app/locales/*.json`, русских текстах установщика, ru/uk промптах ASR и `README.ru.md`.
- Правило проверяется тестом.

## Сайт документации

Сайт в этом репозитории собирается Astro Starlight:

```powershell
cd project\production\vibeforma.pro
npm install
npm run dev
npm run build
npm run verify:all
```

Документация существует на английском в корне и на русском под `/ru/` с теми же slug. Новая страница добавляется в обе локали.

## Сборка релиза

```powershell
.venv\Scripts\python tools\build_release.py --out dist
```

Сборка даёт zip-архив и `SHA256SUMS`, включая `test_ru.wav`. Workflow GitHub Actions собирает тот же архив по тегу.

Релиз ставится тем же `install.ps1`, что и первая установка; обновлятор сохраняет бэкап и откатывается при сбое.

## Что дальше

- [Участие](/ru/contributing/) — как отправить изменение.
- [История версий](/ru/changelog/) — что вышло.
- [Диагностика и логи](/ru/diagnostics/) — доктор и selftest.
- [Файлы и расположение](/ru/files-and-paths/) — runtime-структура.
