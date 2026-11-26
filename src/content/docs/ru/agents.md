---
title: ИИ-агенты и интеграции
description: Подключить локального агента или харнесс к VibeForma — обнаружение через location.json, CLI поверх именованного канала, OpenAI-совместимый endpoint и API задач.
---

VibeForma рассчитана на вызов из другой локальной программы: редактора, скрипта, кодинг-агента или FormaMind. Интеграция остаётся на этом компьютере, не требует облачного аккаунта и не открывает сетевой порт, пока вы не включите локальный API.

Есть три поверхности — в том порядке, в котором их стоит пробовать:

| Поверхность | Нужен порт | Нужен токен | Для чего |
|---|---|---|---|
| CLI поверх именованного канала | Нет | Нет | Всё, что умеет запускать процесс |
| Локальный HTTP API | Да, loopback | Да | HTTP-клиенты и OpenAI-совместимый код |
| MCP-сервер `mcp.cmd` | Через локальный HTTP API | Да (берёт `config.json`) | MCP-клиенты: Claude Code, Cursor, Forma Mind |
| Файлы на диске | Нет | Нет | Чтение готовых расшифровок |

## Обнаружение: location.json

Сервис публикует `%LOCALAPPDATA%\VibeForma\location.json`, чтобы харнессу не приходилось угадывать папку установки. Файл пишется атомарно и не содержит секретов.

```json
{
  "schema": 2,
  "app": "vibeforma",
  "version": "0.5.1",
  "launcher": "C:\\Users\\you\\AppData\\Local\\VibeForma\\run.cmd",
  "python": "C:\\Users\\you\\AppData\\Local\\VibeForma\\.venv\\Scripts\\python.exe",
  "entry": "C:\\Users\\you\\AppData\\Local\\VibeForma\\main.py",
  "install_dir": "C:\\Users\\you\\AppData\\Local\\VibeForma",
  "config": "C:\\Users\\you\\AppData\\Local\\VibeForma\\config.json",
  "app_dir": "C:\\Users\\you\\AppData\\Local\\VibeForma",
  "pid": 12345,
  "updated": 1795312800,
  "file_mode": true,
  "formats": ["txt", "json", "srt", "vtt"],
  "languages": ["en", "ru"],
  "max_file_mb": 4096,
  "max_file_s": 21600,
  "max_sync_s": 900,
  "pipe": "\\\\.\\pipe\\VibeForma-you",
  "port": 8787,
  "api": "on"
}
```

| Поле | Значение |
|---|---|
| `schema` | Схема файла; `2` добавляет поля файлового режима |
| `version` | Версия продукта |
| `launcher`, `python`, `entry` | Три способа запустить приложение |
| `config`, `app_dir`, `install_dir` | Пути, которые могут понадобиться харнессу |
| `pid`, `updated` | Процесс, записавший файл, и метка времени Unix |
| `file_mode` | `true`, когда именованный канал слушает; `false`, пока сервис загружается |
| `formats`, `languages` | Что принимает запущенная сборка |
| `max_file_mb`, `max_file_s`, `max_sync_s` | Действующие лимиты |
| `pipe` | Только когда канал слушает |
| `port`, `api` | Когда локальный API включён; `api` — `on`, `off` или `error` |

Харнесс, не нашедший файл location, может вызвать `GET /capabilities` — тот повторяет те же факты по HTTP.

## Именованный канал

CLI общается с запущенным сервисом через `\\.\pipe\VibeForma-<user>`, созданный с DACL только для владельца. Ни порта, ни токена, ни сети. Это рекомендуемая поверхность для агента, который умеет запускать процесс.

```powershell
.\run.cmd --status
.\run.cmd --transcribe "D:\audio\interview.m4a" --format json --json
.\run.cmd --transcribe-folder "D:\audio\batch" --recursive --json
.\run.cmd --cancel-batch
```

| Флаг | Ответ |
|---|---|
| `--transcribe` | Прогресс в stderr, путь результата или JSON-объект в stdout |
| `--prompt <text>` | Начальный промпт задания, до 1024 знаков; без него берётся пресет из конфигурации |
| `--words` | Запросить таймкоды слов |
| `--clip <ranges>` | Расшифровать только названные диапазоны, например `12.5,30` |
| `--transcribe-folder` | JSON-сводка пакета в stdout |
| `--cancel-batch [<id>]` | Останавливает все незавершённые пакеты или названный |
| `--status` | Состояние сервиса в JSON |

Коды выхода: `0` успех, `1` ошибка сервиса или задачи, `2` плохие аргументы, `3` отмена, `4` в папке нечего расшифровывать. Пока модель загружается, вызов отвечает `the model is loading` и выходит с кодом `1`; повторите позже.

## OpenAI-совместимый endpoint

Когда локальный API включён, `POST /v1/audio/transcriptions` принимает multipart-форму с полями OpenAI:

| Поле | Значение |
|---|---|
| `file` | Аудио или видео; обязательно |
| `model` | Принимается для совместимости |
| `language` | Язык распознавания, например `ru` |
| `response_format` | `json`, `text`, `srt`, `vtt` или `verbose_json` |
| `prompt` | Начальный промпт, до 1024 знаков |
| `temperature` | Температура сэмплирования |
| `word_timestamps` | Запросить пословные таймкоды; принимается и написание OpenAI `timestamp_granularities[]=word` |
| `clip_timestamps` | Расшифровать только названные диапазоны, например `12.5,30` |

Аутентификация — `Authorization: Bearer <token>` или `X-VibeForma-Token: <token>`. Endpoint отвечает синхронно, пока файл не длиннее `file_max_sync_s` (по умолчанию 900 с). Более длинный файл получает `413` с `"job_endpoint": "/jobs"`.

`verbose_json` следует форме OpenAI и добавляет чтения движка: `segments[]` несёт `avg_logprob`, `no_speech_prob`, `compression_ratio` и `temperature`, а `words[]` верхнего уровня — `word`, `start`, `end` и `probability`.

## API задач для длинных файлов

| Метод и путь | Что делает |
|---|---|
| `POST /jobs` | Ставит файл в очередь и возвращает id и заголовок `Location`; принимает `prompt`, `word_timestamps` и `clip_timestamps` |
| `GET /jobs/<id>` | Состояние, прогресс, длительность, число сегментов, выходы и применённые `prompt`, `word_timestamps`, `clip_timestamps` |
| `GET /jobs/<id>/result?format=txt` | Готовая расшифровка в одном из четырёх форматов |
| `DELETE /jobs/<id>` | Отменяет задачу |
| `GET /capabilities` | Форматы, модели, лимиты, канал, лаунчер и объявленные `prompt` и `clip_timestamps` |
| `GET /health` | Живое состояние плюс `file_mode`, `jobs_running` и `jobs_queued` |

Задача встаёт на паузу, когда начинается диктовка, и продолжается, когда сервис свободен. HTTP-поверхность отвечает `409`, пока идёт диктовка, поэтому вызывающему стоит повторить запрос, а не соревноваться с микрофоном. Плохой диапазон или промпт длиннее 1024 знаков отклоняется с `400`. Детали и коды статусов — на странице [«Локальный API»](/ru/local-api/).

## MCP-сервер

MCP-клиент запускает `%LOCALAPPDATA%\VibeForma\mcp.cmd` как stdio-сервер:

```json
{
  "mcpServers": {
    "vibeforma": {
      "command": "C:\\Users\\<вы>\\AppData\\Local\\VibeForma\\mcp.cmd"
    }
  }
}
```

Сервер читает `location.json`, чтобы узнать фактический порт, и `config.json`, чтобы взять токен, — ничего не нужно вписывать вручную. Он даёт три инструмента:

| Инструмент | Что делает |
|---|---|
| `vibeforma_capabilities` | Те же факты, что `GET /capabilities` |
| `vibeforma_transcribe_file` | Ставит файл в очередь через `/jobs` и возвращает текст, когда задание готово; принимает `prompt`, `word_timestamps` и `clip_timestamps` |
| `vibeforma_job_status` | Состояние, прогресс и применённый контракт задания в очереди |

Локальный API должен быть включён: без него сервер отвечает понятным отказом. Сам сервис остаётся доступен только на loopback — MCP-сервер не открывает порт и никуда не отправляет токен. В «Настройки → ИИ и автоматизация» показаны адрес, запускатель и готовый блок подключения с кнопками копирования.

## Минимальная интеграция

1. Прочитайте `location.json`.
2. Если `file_mode` — `true` и есть `pipe`, запустите CLI с `--json` и разберите stdout.
3. Иначе, если `api` — `on`, прочитайте `http_token` из `config.json` и вызовите endpoint с этим токеном.
4. Если `file_mode` — `false`, подождите и повторите: сервис ещё загружает модель.
5. Держите файлы на локальных дисках; сетевые пути отклоняются.

```powershell
$loc = Get-Content "$env:LOCALAPPDATA\VibeForma\location.json" | ConvertFrom-Json
if ($loc.file_mode -and $loc.pipe) {
  & $loc.launcher --transcribe "D:\audio\note.wav" --format txt --json
} elseif ($loc.api -eq "on") {
  $cfg = Get-Content $loc.config | ConvertFrom-Json
  Invoke-RestMethod -Uri ("http://127.0.0.1:" + $loc.port + "/v1/audio/transcriptions") `
    -Method Post -Headers @{ "X-VibeForma-Token" = $cfg.http_token } `
    -Form @{ file = Get-Item "D:\audio\note.wav"; response_format = "json" }
}
```

## Границы безопасности

- Канал — на пользователя и только для владельца; другая учётная запись не подключится.
- HTTP API слушает только `127.0.0.1` и требует токен на каждом запросе.
- В `location.json` нет секрета; токен остаётся в `config.json`.
- Файловые задачи принимают локальные фиксированные и съёмные диски, но не UNC-ресурсы.
- Ничего не отправляется: распознавание, декодирование и запись расшифровки локальны.

## Что дальше

- [Командная строка](/ru/cli/) — полный контракт флагов и кодов выхода.
- [Локальный API](/ru/local-api/) — endpoints, токен и коды статусов.
- [Транскрибация файлов](/ru/file-transcription/) — очередь, пакеты и лимиты.
- [VibeForma в FormaMind](/ru/formamind/) — продуктовая интеграция, которой служит эта поверхность.
