/**
 * Catalog of the landing "Features" section: one data source for both locales.
 * The cards, the release strip and the modal windows are rendered from here by
 * Landing.astro, so the Russian and the English page can no longer drift apart.
 */

export type CatalogLocale = 'en' | 'ru';

export type CatalogItem = string | { t: string; tag: string };

export interface CatalogCategory {
  key: string;
  no: string;
  image: string;
  flag: Record<CatalogLocale, string>;
  title: Record<CatalogLocale, string>;
  tagline: Record<CatalogLocale, string>;
  desc: Record<CatalogLocale, string>;
  items: Record<CatalogLocale, CatalogItem[]>;
  docs: Record<CatalogLocale, string>;
  wide?: boolean;
}

export const catalogIntro: Record<
  CatalogLocale,
  { kicker: string; titleHtml: string; copy: string }
> = {
  en: {
    kicker: 'Features',
    titleHtml: 'What already <em>works</em>',
    copy: 'The section that lays out everything the product does: ten categories, each with its own sections.',
  },
  ru: {
    kicker: 'Функционал',
    titleHtml: 'То, что уже <em>работает</em>',
    copy: 'Раздел, где расписан весь функционал: десять категорий, у каждой — свои разделы.',
  },
};

export const catalogCopy: Record<
  CatalogLocale,
  { close: string; when: string; docs: string }
> = {
  en: {
    close: 'Close window',
    when: 'Now',
    docs: 'Read more in the documentation →',
  },
  ru: {
    close: 'Закрыть окно',
    when: 'Сейчас',
    docs: 'Подробнее в документации →',
  },
};

export interface ReleaseChip {
  key: string;
  label: Record<CatalogLocale, string>;
}

export const releaseStrip: {
  label: Record<CatalogLocale, string>;
  chips: ReleaseChip[];
  link: { label: Record<CatalogLocale, string>; href: Record<CatalogLocale, string> };
} = {
  label: {
    en: '0.5.5–0.5.8 · new in the last releases',
    ru: '0.5.5–0.5.8 · новое в последних релизах',
  },
  chips: [
    { key: 'invented-tail', label: { en: 'An invented ending is cut', ru: 'Выдуманное окончание срезается' } },
    { key: 'long-take', label: { en: 'A long take keeps its words', ru: 'Длинный заход сохраняет слова' } },
    { key: 'model-updates', label: { en: 'Model updates by consent', ru: 'Обновления моделей по согласию' } },
  ],
  link: {
    label: { en: 'All changes', ru: 'Все изменения' },
    href: { en: '/changelog/', ru: '/ru/changelog/' },
  },
};

export const catalog: CatalogCategory[] = [
  {
    key: 'speech',
    no: '01',
    image: '01-speech.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Dictation and Russian', ru: 'Диктовка и русский язык' },
    tagline: {
      en: 'Press, speak — text at the cursor; local, Russian first, no accounts.',
      ru: 'Нажал, сказал — текст у курсора; локально, по-русски, без аккаунтов.',
    },
    desc: {
      en: 'Press, speak — text at the cursor in any Windows application.',
      ru: 'Нажал, сказал — текст у курсора в любом приложении Windows.',
    },
    items: {
      en: [
        'Hotkey — speak — the text is inserted where the cursor stood.',
        'Local recognition on faster-whisper: the network is needed only for the first model download.',
        'The phrase ends automatically on a pause of silence.',
        'The recognition language is exact, no guessing; languages are named by their endonyms.',
        'Partial transcriptions stream into the panel in near real time.',
        'Cancel dictation — Esc at any moment.',
        'Hold to talk (hold_to_talk): press — speak — release, recording stops by itself; an alternative to toggle mode.',
        'Global hotkey: combinations are normalized, recording by key press in onboarding; combinations taken by Windows — a warning only.',
        'Interface — English and Russian out of the box.',
        'Recognition languages are named by endonyms: English, Русский, Українська, Deutsch.',
        'Recognition runs exactly in the selected language, no guessing.',
        'Language switching — in the tray and in the settings.',
        'The installer speaks Russian on Russian Windows.',
      ],
      ru: [
        'Хоткей — говорите — текст вставляется там, где стоял курсор.',
        'Локальное распознавание на faster-whisper: сеть нужна только для первой загрузки модели.',
        'Фраза завершается автоматически по паузе тишины.',
        'Язык распознавания точный, без угадывания; названия языков — эндонимами.',
        'Частичные транскрипции стримятся в панель почти в реальном времени.',
        'Отмена диктовки — Esc в любой момент.',
        'Hold to talk (hold_to_talk): нажали — говорите — отпустили, запись останавливается сама; альтернатива режиму переключения.',
        'Глобальный хоткей: комбинации нормализуются, запись нажатием в онбординге; сочетания, занятые Windows, — только предупреждение.',
        'Интерфейс — английский и русский из коробки.',
        'Языки распознавания названы эндонимами: English, Русский, Українська, Deutsch.',
        'Распознавание идёт ровно выбранным языком, без угадывания.',
        'Переключение языка — в трее и в настройках.',
        'Установщик говорит по-русски на русской Windows.',
      ],
    },
    docs: { en: '/dictation/', ru: '/ru/dictation/' },
  },
  {
    key: 'panel',
    no: '02',
    image: '02-panel.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Panel and settings window', ru: 'Панель и окно настроек' },
    tagline: {
      en: 'A translucent panel and live settings — without restarting the service.',
      ru: 'Прозрачная панель и живые настройки — без перезапуска сервиса.',
    },
    desc: {
      en: 'A translucent panel watches dictation: level, pauses, draft and actions on it.',
      ru: 'Прозрачная панель следит за диктовкой: уровень, паузы, черновик и действия над ним.',
    },
    items: {
      en: [
        'Monitoring panel: microphone level, VAD indicator, streaming recognized text; transparency and auto-expansion are configurable.',
        {
          t: 'A take clock left of the level bar: the remaining time for a limited microphone take, the elapsed time for continuous dictation and system audio.',
          tag: '0.5.1',
        },
        'The panel grows proportionally to the text: it doesn\'t crawl up off-screen, the draft keeps at least six lines.',
        'DPI-aware geometry of the panel and settings window: readable at 150%.',
        'Dictation from the panel: microphone button, a row of "Correct / Copy / Paste / Cancel"; "Paste" — into the selected window, without a selection — to the clipboard.',
        'Paging through saved dictations with arrows in the panel header (when history is on).',
        'Recognition overlay: the panel dims, a percentage runs across it; 100% — only with the text ready.',
        'Privacy mode (eye button): text hidden, microphone level visible.',
        'The blue "Update" button appears when a release is found.',
        'Hiding the panel ✕: the tray icon remains, launching again shows the panel.',
        'Rounded panel corners and a dark title bar via DWM.',
        'A window with a sidebar and nine sections: Recording, Hotkeys, Model and language, Dictionary, Snippets, History, Statistics, Appearance, System.',
        'Settings apply on the live service without a restart.',
        'Stable window geometry: size is computed once, limited by the screen, centered.',
        'Service keys: Ctrl+F — search, Ctrl+S — save, Esc — close; Reset doesn\'t touch the model, dictionary and history.',
        'Hotkey change with protection: an invalid combination isn\'t saved, the previous one remains.',
        'Model change via a progress dialog inside the window; during dictation — the answer "busy".',
      ],
      ru: [
        'Панель мониторинга: уровень микрофона, индикатор VAD, стриминг распознанного текста; прозрачность и авторасширение настраиваются.',
        {
          t: 'Секундомер записи слева от индикатора уровня: остаток для микрофона с лимитом, прошедшее время для непрерывной диктовки и системного звука.',
          tag: '0.5.1',
        },
        'Рост панели пропорционален тексту: панель не «ползёт» вверх за экран, черновик держит минимум шесть строк.',
        'DPI-aware геометрия панели и окна настроек: читаемость при 150%.',
        'Диктовка с панели: кнопка микрофона, ряд «Корректировать / Копировать / Вставить / Отмена»; «Вставить» — в выбранное окно, без выбора — в буфер.',
        'Листание сохранённых диктовок стрелками в заголовке панели (при включённой истории).',
        'Оверлей распознавания: панель затемняется, по ней бежит процент; 100% — только с готовым текстом.',
        'Режим приватности (кнопка-глаз): текст скрыт, уровень микрофона виден.',
        'Синяя кнопка «Обновить» появляется при найденном релизе.',
        'Скрытие панели ✕: иконка трея остаётся, повторный запуск показывает панель.',
        'Скруглённые углы панели и тёмная полоса заголовка через DWM.',
        'Окно с сайдбаром и девятью разделами: Запись, Горячие клавиши, Модель и язык, Словарь, Сниппеты, История, Статистика, Вид, Система.',
        'Настройки применяются на живом сервисе без перезапуска.',
        'Стабильная геометрия окна: размер считается один раз, ограничивается экраном, центрируется.',
        'Служебные клавиши: Ctrl+F — поиск, Ctrl+S — сохранить, Esc — закрыть; Reset не трогает модель, словарь и историю.',
        'Смена хоткея с защитой: невалидная комбинация не сохраняется, прежняя остаётся.',
        'Смена модели через диалог прогресса внутри окна; при идущей диктовке — ответ «busy».',
      ],
    },
    docs: { en: '/interface/', ru: '/ru/interface/' },
  },
  {
    key: 'memory',
    no: '03',
    image: '03-memory.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Memory and text at hand', ru: 'Память и текст под рукой' },
    tagline: {
      en: 'History, dictionary, snippets, statistics and safe paste — all local.',
      ru: 'История, словарь, сниппеты, статистика и безопасная вставка — всё локально.',
    },
    desc: {
      en: 'Local dictation memory: enabled on demand, stored only on the machine.',
      ru: 'Локальная память диктовок: включается по желанию, хранится только на машине.',
    },
    items: {
      en: [
        'Local history is off by default: the last 100 dictations; turning it off deletes the file.',
        'History table: "When / Characters / Application / Text", search, filters, deletion.',
        {
          t: 'Re-recognize one history entry whose WAV is still on disk; the pass runs in the background and the table stays usable.',
          tag: '0.5.1',
        },
        '"Undo last paste": Ctrl+Z into the same window, within 30 seconds.',
        '"Restore clipboard": the clipboard returns to the state before dictation.',
        'Dictionary: term → replacement pairs, up to 500 pairs; the longest term wins; JSON import and export.',
        'Quick learning: "as heard → as needed" from the draft and history, only after confirmation.',
        'Snippets: a spoken trigger is replaced with prepared text; up to 500 pairs, line breaks preserved.',
        'Snippets tab: editing, import/export, preview, validation.',
        'Statistics: counters of dictations, words, characters and seconds by day; numbers only, never text.',
        'Paste independent of the layout: Shift+Insert by default, Ctrl+V switchable.',
        'Paste only into the window active when the hotkey was pressed: focus isn\'t stolen.',
        'The previous clipboard is restored after a second if nobody touched it.',
        'On Windows 10+, dictated text is excluded from clipboard history and cloud sync.',
        'Notifications by default without text ("Pasted, N characters"); showing the phrase — optional.',
        'Hotkeys tab lists everything the app listens to; only the dictation hotkey is editable.',
      ],
      ru: [
        'Локальная история по умолчанию выключена: последние 100 диктовок; выключение удаляет файл.',
        'Таблица истории: «Когда / Знаков / Приложение / Текст», поиск, фильтры, удаление.',
        {
          t: 'Перераспознать одну запись истории, у которой ещё есть WAV; проход идёт в фоне, таблица остаётся рабочей.',
          tag: '0.5.1',
        },
        '«Отменить последнюю вставку»: Ctrl+Z в то же окно, в пределах 30 секунд.',
        '«Вернуть буфер»: буфер возвращается к состоянию до диктовки.',
        'Словарь: пары термин → замена, до 500 пар; побеждает самый длинный термин; импорт и экспорт JSON.',
        'Быстрое обучение: «как услышано → как нужно» из черновика и истории, только после подтверждения.',
        'Сниппеты: произносимый триггер заменяется подготовленным текстом; до 500 пар, переносы сохраняются.',
        'Вкладка сниппетов: правка, импорт/экспорт, предпросмотр, валидация.',
        'Статистика: счётчики диктовок, слов, знаков и секунд по дням; только числа, никогда не текст.',
        'Вставка, независимая от раскладки: Shift+Insert по умолчанию, Ctrl+V переключается.',
        'Вставка только в окно, активное при нажатии хоткея: фокус не крадётся.',
        'Возврат прежнего буфера через секунду, если его никто не трогал.',
        'На Windows 10+ продиктованный текст исключается из истории буфера и облачной синхронизации.',
        'Уведомления по умолчанию без текста («Вставлено, N знаков»); показ фразы — по желанию.',
        'Вкладка клавиш перечисляет всё, что слушает приложение; редактируется только хоткей диктовки.',
      ],
    },
    docs: { en: '/history/', ru: '/ru/history/' },
  },
  {
    key: 'files-cli',
    no: '04',
    image: '04-files-cli.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Files, CLI and agents', ru: 'Файлы, CLI и агенты' },
    tagline: {
      en: 'A second entry into the same engine: a file instead of a microphone; control from scripts and AI agents.',
      ru: 'Второй вход в тот же движок: файл вместо микрофона; управление из скриптов и ИИ-агентов.',
    },
    desc: {
      en: 'File transcription and a local contract for wrappers — all on the loopback address.',
      ru: 'Транскрибация файлов и локальный контракт для обвязок — всё на loopback-адресе.',
    },
    items: {
      en: [
        'Audio and video files decoded locally.',
        'Output to TXT, JSON, SRT and VTT with timecodes.',
        'Job queue with pause, resume and priority of live dictation.',
        'Tray item "Transcribe file…" and a progress line in the panel.',
        '--transcribe on the command line.',
        'MCP server for AI agents (0.4.5): mcp.cmd as a stdio server — capabilities, file transcription and job status; the service stays loopback-only.',
        'OpenAI-compatible transcription endpoint and job API.',
        'Extended location.json and a named pipe for local wrappers.',
        'Settings for file roots, size and duration limits, job storage.',
        '--toggle (record), --cancel (discard), --status (instance state).',
        'External hook (off by default): text goes to your command\'s stdin, without a shell and metacharacters.',
        'Local HTTP API (off by default): 127.0.0.1 only, token, no more than one request per second.',
        'Automatic port: a busy one is replaced, the address is published in location.json; no secret in the file.',
        'The API key is created on first enable; the listener starts and stops on the live service.',
      ],
      ru: [
        'Аудио- и видеофайлы, декодируемые локально.',
        'Вывод в TXT, JSON, SRT и VTT с таймкодами.',
        'Очередь заданий с паузой, возобновлением и приоритетом живой диктовки.',
        'Пункт трея «Транскрибировать файл…» и строка прогресса в панели.',
        '--transcribe в командной строке.',
        'MCP-сервер для ИИ-агентов (0.4.5): mcp.cmd как stdio-сервер — возможности, транскрибация файла и статус задания; сервис остаётся только на loopback.',
        'OpenAI-совместимый эндпоинт транскрибации и job-API.',
        'Расширенный location.json и именованный канал для локальных обвязок.',
        'Настройки корней файлов, лимитов размера и длительности, хранения заданий.',
        '--toggle (запись), --cancel (отбросить), --status (состояние экземпляра).',
        'Внешний хук (выключен по умолчанию): текст уходит на stdin вашей команды, без shell и метасимволов.',
        'Локальный HTTP API (по умолчанию выключен): только 127.0.0.1, токен, не чаще запроса в секунду.',
        'Автоматический порт: занятый заменяется, адрес публикуется в location.json; секрета в файле нет.',
        'Ключ API создаётся при первом включении; слушатель стартует и останавливается на живом сервисе.',
      ],
    },
    docs: { en: '/file-transcription/', ru: '/ru/file-transcription/' },
  },
  {
    key: 'install',
    no: '05',
    image: '05-install.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Install and update', ru: 'Установка и обновление' },
    tagline: {
      en: 'The model downloads once, then everything works locally.',
      ru: 'Модель загружается один раз, дальше всё работает локально.',
    },
    desc: {
      en: 'The model downloads once, then everything works locally.',
      ru: 'Модель загружается один раз, дальше всё работает локально.',
    },
    items: {
      en: [
        'One command: irm … | iex — the installer finds Python, downloads the release and sets up the service.',
        'Installation — to %LOCALAPPDATA%\\VibeForma: shortcuts and an entry in "Settings → Apps", no admin rights.',
        'The installer is a transaction: a failure stops the chain, a re-run continues from the failure point.',
        'The model and installation directory are chosen during setup.',
        'Auto-update offers a release rather than installing silently — the "Update" button on the panel.',
        {
          t: 'Removal — uninstall.cmd: --keep-data keeps models and config, --remove-data removes everything the app created and leaves the folder ready for a fresh install; links are never followed outside.',
          tag: '0.5.1',
        },
      ],
      ru: [
        'Одна команда: irm … | iex — установщик сам находит Python, скачивает релиз и ставит сервис.',
        'Установка — в %LOCALAPPDATA%\\VibeForma: ярлыки и запись в «Параметрах → Приложения», без прав администратора.',
        'Установщик — транзакция: сбой останавливает цепочку, повторный запуск продолжает с места сбоя.',
        'Модель и каталог установки выбираются при установке.',
        'Автообновление предлагает релиз, а не ставит молча — кнопка «Обновить» на панели.',
        {
          t: 'Удаление — uninstall.cmd: --keep-data сохраняет модели и конфиг, --remove-data убирает всё созданное приложением и оставляет папку готовой к чистой установке; ссылки наружу не преследуются.',
          tag: '0.5.1',
        },
      ],
    },
    docs: { en: '/installation/', ru: '/ru/installation/' },
  },
  {
    key: 'privacy',
    no: '06',
    image: '06-privacy.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Privacy and diagnostics', ru: 'Приватность и диагностика' },
    tagline: {
      en: 'Nothing extra is recorded; checking the machine — with one command.',
      ru: 'Ничего лишнего не записывается; проверка машины — одной командой.',
    },
    desc: {
      en: 'Nothing extra is recorded; checking the machine — with one command.',
      ru: 'Ничего лишнего не записывается; проверка машины — одной командой.',
    },
    items: {
      en: [
        'Rotating logs: dictation text is never written; no telemetry, accounts, tokens.',
        'Panel privacy mode and exclusion of text from clipboard history.',
        '--doctor diagnostics: Python, model, CUDA/CPU, microphone, hotkey; every line OK/WARN/FAIL; the report — without dictation text and token.',
        '--selftest self-check: imports, model, test audio file, recognized text.',
        'Error catalog: every error has a code, a clear message and the next action.',
        'Troubleshooting guide: microphone, port, disk space, model, paste, updates.',
      ],
      ru: [
        'Логи с ротацией: текст диктовки не пишется никогда; никакой телеметрии, аккаунтов, токенов.',
        'Режим приватности панели и исключение текста из истории буфера.',
        'Диагностика --doctor: Python, модель, CUDA/CPU, микрофон, хоткей; у каждой строки OK/WARN/FAIL; отчёт — без текста диктовки и токена.',
        'Самопроверка --selftest: импорты, модель, тестовый аудиофайл, распознанный текст.',
        'Каталог ошибок: у каждой ошибки код, понятное сообщение и следующее действие.',
        'Руководство по типовым проблемам: микрофон, порт, место на диске, модель, вставка, обновления.',
      ],
    },
    docs: { en: '/privacy/', ru: '/ru/privacy/' },
  },
  {
    key: 'quality',
    no: '07',
    image: '07-quality.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'Quality and infrastructure', ru: 'Качество и инфраструктура' },
    tagline: {
      en: 'Build quality is kept automatically on every change.',
      ru: 'Качество сборки удерживается автоматически при каждом изменении.',
    },
    desc: {
      en: 'Build quality is kept automatically on every change.',
      ru: 'Качество сборки удерживается автоматически при каждом изменении.',
    },
    items: {
      en: [
        'GitHub Actions CI: the full test suite on Windows, a cross-platform subset, ruff gate, strict mypy.',
        'Tests run without a model, GPU and network.',
        'Single instance: second launch blocked, autostart with Windows, log rotation.',
        'status.json is written by the service on every state change.',
        'Tray: settings, panel, diagnostics, pause, input device, model and language switch, history, logs.',
        'First launch — a three-step assistant: languages, microphone with live level, hotkey by key press.',
      ],
      ru: [
        'CI GitHub Actions: полный набор тестов на Windows, кроссплатформенное подмножество, ruff-гейт, strict mypy.',
        'Тесты идут без модели, GPU и сети.',
        'Один экземпляр: блокировка второго запуска, автозапуск с Windows, ротация логов.',
        'status.json пишется сервисом на каждом изменении состояния.',
        'Трей: настройки, панель, диагностика, пауза, устройство ввода, смена модели и языка, история, логи.',
        'Первый запуск — помощник из трёх шагов: языки, микрофон с живым уровнем, хоткей записью нажатием.',
      ],
    },
    docs: { en: '/development/', ru: '/ru/development/' },
  },
  {
    key: 'formamind',
    no: '08',
    image: '08-formamind.webp',
    flag: { en: 'READY', ru: 'ГОТОВО' },
    title: { en: 'FormaMind and voice tasks', ru: 'FormaMind и голосовые задачи' },
    tagline: {
      en: 'Voice is the entry to project tasks: VibeForma + FormaMind.',
      ru: 'Голос — вход в задачи проекта: VibeForma + FormaMind.',
    },
    desc: {
      en: 'Voice and project tasks — in one environment with an AI assistant.',
      ru: 'Голос и задачи проекта — в одной среде с ИИ-ассистентом.',
    },
    items: {
      en: [
        'A project management environment with an AI assistant — formamind.pro.',
        'VibeForma is the primary voice input to FormaMind.',
        'Native integration with FormaMind — voice control of project tasks.',
      ],
      ru: [
        'Среда управления проектами с ИИ-ассистентом — formamind.pro.',
        'VibeForma — основной голосовой вход в FormaMind.',
        'Нативная интеграция с FormaMind — голосовое управление задачами проекта.',
      ],
    },
    docs: { en: '/formamind/', ru: '/ru/formamind/' },
  },
  {
    key: 'system-audio',
    no: '09',
    image: '09-system-audio.webp',
    flag: { en: '0.5.1', ru: '0.5.1' },
    title: { en: 'System audio', ru: 'Системный звук' },
    tagline: {
      en: 'Live subtitles and a recording from YouTube, calls and films — local, never inserted into a window.',
      ru: 'Живые субтитры и запись с YouTube, созвонов и фильмов — локально и без вставки в окно.',
    },
    desc: {
      en: 'System audio is recognized on the fly: the last phrases appear in a plate, nothing is typed into the active window, and the take is recorded to a WAV with TXT and SRT beside it.',
      ru: 'Системный звук распознаётся на лету: последние фразы видны в плашке, в активное окно ничего не печатается, а заход пишется в WAV с TXT и SRT рядом.',
    },
    items: {
      en: [
        {
          t: '"System audio" source in settings and on the panel: WASAPI loopback, no virtual cable.',
          tag: '0.5.0',
        },
        {
          t: 'Live subtitles: the last 1–2 phrases in a plate, refreshed up to 4 seconds, at most 400 characters.',
          tag: '0.5.0',
        },
        {
          t: 'Nothing is inserted into the active window; dictation history is not filled.',
          tag: '0.5.0',
        },
        {
          t: 'A take is recorded to a WAV — 16-bit, 16 kHz mono — in the recordings folder, with TXT and SRT beside it on stop; the path is shown while it runs.',
          tag: '0.5.1',
        },
        {
          t: 'The recordings folder is a setting: the Recording tab shows the active path and offers "Change…", "Open" and "Default" (`Documents\\VibeForma\\Recordings`); an unusable folder is rejected before a take starts, and "Open" creates the folder if the first take has not yet.',
          tag: '0.5.3',
        },
        'Music and noise may produce invented text — an honest limit of recognition.',
        {
          t: 'Capture starts and stops with the same hotkey as dictation.',
          tag: '0.5.0',
        },
        'Level and state are visible on the panel; device choice is in settings.',
        'Works locally: audio never leaves the machine.',
      ],
      ru: [
        {
          t: 'Источник «Системный звук» в настройках и на панели: WASAPI loopback, без виртуального кабеля.',
          tag: '0.5.0',
        },
        {
          t: 'Живые субтитры: последние 1–2 фразы в плашке, обновление до 4 секунд, не длиннее 400 знаков.',
          tag: '0.5.0',
        },
        {
          t: 'В активное окно ничего не вставляется; история диктовки не пополняется.',
          tag: '0.5.0',
        },
        {
          t: 'Заход пишется в WAV — 16 бит / 16 кГц моно — в папку записей, а по остановке рядом появляются TXT и SRT; путь виден, пока идёт заход.',
          tag: '0.5.1',
        },
        {
          t: 'Папка записей — настройка: вкладка «Запись» показывает действующий путь и предлагает «Изменить…», «Открыть» и «По умолчанию» (`Documents\\VibeForma\\Recordings`); негодная папка отклоняется до старта записи, а «Открыть» создаст папку, если первой записи ещё не было.',
          tag: '0.5.3',
        },
        'Музыка и шум могут дать выдуманный текст — это честный предел распознавания.',
        {
          t: 'Захват стартует и останавливается тем же хоткеем, что и диктовка.',
          tag: '0.5.0',
        },
        'Уровень и состояние видны на панели; выбор устройства — в настройках.',
        'Работает локально: звук не уходит в сеть.',
      ],
    },
    docs: { en: '/dictation/', ru: '/ru/dictation/' },
    wide: true,
  },
  {
    key: 'accuracy',
    no: '10',
    image: '10-accuracy.webp',
    flag: { en: '0.5.1', ru: '0.5.1' },
    title: { en: 'Accuracy and control', ru: 'Точность и контроль' },
    tagline: {
      en: 'Recognize more precisely, clean speech without filler words, app profiles and predictable punctuation.',
      ru: 'Распознать точнее, чистая речь без паразитов, профили приложений и предсказуемая пунктуация.',
    },
    desc: {
      en: 'When the text is in doubt, decode it again; cleanup, profiles and punctuation adapt to you.',
      ru: 'Когда текст под вопросом, его можно распознать заново; чистка, профили и пунктуация настраиваются под себя.',
    },
    items: {
      en: [
        {
          t: 'Three quality presets for the final dictation pass: Normal, Accurate, Fast — no raw temperature.',
          tag: '0.5.1',
        },
        {
          t: 'A list of local CT2 model folders: add, use, remove the record, return to the built-in; a user folder is never deleted on a switch.',
          tag: '0.5.1',
        },
        {
          t: '"Recognize more precisely" on a doubtful draft: beam 10 at temperature 0, the previous text can be restored.',
          tag: '0.5.0',
        },
        {
          t: 'Continuous dictation with no 120-second cap: a pause ends the phrase, recording continues; key continuous.',
          tag: 'in config.json',
        },
        {
          t: 'Optional text cleanup: numbers, filler words, repeats; protected fragments stay untouched; key text_cleanup.',
          tag: 'in config.json',
        },
        {
          t: 'Application profiles: up to 50 rules "app → dictionary, snippets, cleanup".',
          tag: '0.5.0',
        },
        {
          t: 'Punctuation presets for 26 languages: marks follow the language\'s rules.',
          tag: '0.5.0',
        },
        {
          t: 'Language hint when the selected language does not match the speech; recognition never switches silently.',
          tag: '0.5.0',
        },
        {
          t: 'A custom CT2 model from a folder: the path is validated, the built-in model stays as fallback.',
          tag: '0.5.0',
        },
        {
          t: 'Confidence in JSON and verbose_json; a hallucination filter drops invented phrases from silence and music.',
          tag: '0.5.0',
        },
        {
          t: 'WER/CER on a reference set — a measurement of quality, not a promise.',
          tag: '0.5.0',
        },
        {
          t: 'Sentence captions from word timestamps in SRT/VTT.',
          tag: '0.5.0',
        },
      ],
      ru: [
        {
          t: 'Три пресета качества финального прохода диктовки: «Обычный», «Точный», «Быстрый» — без ручной температуры.',
          tag: '0.5.1',
        },
        {
          t: 'Список локальных CT2-папок моделей: добавить, использовать, убрать запись, вернуть встроенную; папка пользователя не удаляется при переключении.',
          tag: '0.5.1',
        },
        {
          t: '«Распознать точнее» на сомнительном черновике: beam 10 при температуре 0, прежний текст возвращается.',
          tag: '0.5.0',
        },
        {
          t: 'Непрерывная диктовка без предела 120 секунд: пауза завершает фразу, запись продолжается; ключ continuous.',
          tag: 'в config.json',
        },
        {
          t: 'Чистка текста по желанию: числа, слова-паразиты, повторы; защищённые фрагменты не трогаются; ключ text_cleanup.',
          tag: 'в config.json',
        },
        {
          t: 'Профили приложений: до 50 правил «приложение → словарь, сниппеты, чистка».',
          tag: '0.5.0',
        },
        {
          t: 'Пресеты пунктуации для 26 языков: знаки расставляются по правилам языка.',
          tag: '0.5.0',
        },
        {
          t: 'Подсказка о языке, если выбранный не похож на речь; распознавание не переключается молча.',
          tag: '0.5.0',
        },
        {
          t: 'Своя CT2-модель из папки: путь проверяется, встроенная модель остаётся запасной.',
          tag: '0.5.0',
        },
        {
          t: 'Уверенность в JSON и verbose_json; фильтр выдуманных фраз отбрасывает тишину и музыку.',
          tag: '0.5.0',
        },
        {
          t: 'WER/CER на эталонном наборе — измерение качества, а не обещание.',
          tag: '0.5.0',
        },
        {
          t: 'Субтитры по предложениям из таймкодов слов в SRT/VTT.',
          tag: '0.5.0',
        },
      ],
    },
    docs: { en: '/dictation/', ru: '/ru/dictation/' },
    wide: true,
  },
];
