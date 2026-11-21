# doc-vibeforma — сайт документации VibeForma

Исходник сайта документации к ПО [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma).
Этот каталог станет самостоятельным репозиторием на GitHub и будет публиковаться по той же схеме, что и сайт «Путь Стратегии».

Стек: [Astro](https://astro.build) 7.0.7 + [Starlight](https://starlight.astro.build) 0.41.3, блог — [starlight-blog](https://github.com/HiDeoo/starlight-blog) 0.27.0. Без CSS-фреймворков: оформление — обычный CSS, шрифты — системные.

## Установка и запуск

Нужен Node.js 24 (проверено на 24.22.1) и npm.

```bash
npm install       # зависимости
npm run dev       # dev-сервер, http://localhost:4321
npm run build     # продакшен-сборка в dist/
npm run preview   # просмотр собранного dist/
```

## Проверка сборки

Обязательные маршруты и ссылки лендингов проверяет скрипт:

```bash
node scripts/verify-build.mjs --all   # сборка + проверка (основная команда)
node scripts/verify-build.mjs         # только проверка уже собранного dist/
```

Скрипт проверяет, что в `dist/` есть все маршруты контракта — `/`, `/introduction/`, `/installation/`, `/usage/`, `/privacy/`, `/troubleshooting/`, `/blog/`, `/logs/` и те же страницы под `/ru/`, плюс первые записи блога и журнала; что лендинги ссылаются на документацию, блог, логи, репозиторий и второй язык; что переключатель языка сохраняет раздел. Код возврата 0 — всё сошлось, 1 — список провалов.

## Структура

```
vibeforma.pro/
├─ astro.config.mjs        конфигурация Starlight: локали, сайдбар, блог, ссылка на GitHub
├─ package.json            зависимости и команды
├─ tsconfig.json
├─ public/
│  └─ favicon.svg
├─ scripts/
│  └─ verify-build.mjs     сборка и проверка маршрутов и ссылок
├─ src/
│  ├─ components/
│  │  └─ Landing.astro     лендинг: один компонент, параметр locale
│  ├─ content.config.ts    коллекции docs и i18n, схема блога
│  ├─ content/
│  │  ├─ docs/             английские страницы (корневые маршруты)
│  │  │  ├─ blog/          записи блога
│  │  │  ├─ logs/          индекс журнала и записи
│  │  │  ├─ introduction.md
│  │  │  ├─ installation.md
│  │  │  ├─ usage.md
│  │  │  ├─ privacy.md
│  │  │  └─ troubleshooting.md
│  │  ├─ docs/ru/          русские страницы (маршруты /ru/…)
│  │  └─ i18n/
│  │     ├─ en.json
│  │     └─ ru.json
│  ├─ pages/
│  │  ├─ index.astro       лендинг /
│  │  └─ ru/index.astro    лендинг /ru/
│  └─ styles/
│     ├─ landing.css       оформление лендинга
│     └─ site.css          оформление Starlight
└─ dist/                   результат сборки (не коммитится)
```

## Языки и содержание

- Английский — в корне (`/`, `/introduction/`, …), русский — под `/ru/` (`/ru/`, `/ru/introduction/`, …). Оба языка собираются одной командой `npm run build`.
- Страницы документации лежат в `src/content/docs/` и `src/content/docs/ru/`; индексных `index.mdx` в коллекции нет — главная маршрута `/` и `/ru/` это самостоятельные лендинги в `src/pages/`.
- Блог — плагин `starlight-blog`; записи блога — `src/content/docs/blog/` и `src/content/docs/ru/blog/`, с обязательным полем `date`.
- Раздел `/logs/` — журнал разработки сайта, а не файлы логов приложения VibeForma.
- Факты о продукте берутся только из подтверждённого источника `project/cards/card-004/facts.md`; чего там нет, на сайте не утверждается.

## Домен

В `astro.config.mjs` указан `site: 'https://vibeforma.pro'` — это **placeholder**. При появлении настоящего домена заменить значение там же; от него зависят canonical, Open Graph, RSS блога и sitemap.

## Цепочка публикации

```
vibeforma.pro/project/production/vibeforma.pro/   (этот каталог — исходник)
   → github.com/FormaMindPro/doc-vibeforma   (публикация исходника на GitHub)
      → установка на cool.6ministersbiz.pro  (развертывание)
```

Образец всей цепочки — [great-foundation-pro/doc-pathofstrategy](https://github.com/great-foundation-pro/doc-pathofstrategy)
(локально: `D:\Документы\GitHub\doc-pathofstrategy`), продакшен образца: https://doc.pathofstrategy.com.

## Связь с проектом

- Документация продукта в проекте: `project/docs/` (база знаний по целям, пишет `Intent` после закрытия круга).
- Этот сайт — витрина документации для внешнего читателя; источником содержания служит подтверждённый результат проекта, а не черновики.
- Каталог создан по решению человека 2026-11-21 (инструкция вне маршрута, зафиксирована здесь — запрет 11 `AGENTS.md`). Каркас сайта, контент и проверка сборки — card-004.
