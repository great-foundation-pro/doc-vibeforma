# doc-vibeforma — сайт документации VibeForma

Исходник сайта документации к ПО [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma).
Этот каталог станет самостоятельным репозиторием на GitHub и будет публиковаться по той же схеме, что и сайт «Путь Стратегии».

Стек: [Astro](https://astro.build) 7.4.13 + [Starlight](https://starlight.astro.build) 0.43.1, блог — [starlight-blog](https://github.com/HiDeoo/starlight-blog) 0.30.2. Без CSS-фреймворков: оформление — обычный CSS, шрифты — системные.

Модули сообщества: [starlight-giscus](https://github.com/HiDeoo/starlight-giscus) (комментарии), `starlight-page-feedback` (оценка страницы), [starlight-llms-txt](https://github.com/HiDeoo/starlight-llms-txt) (`/llms.txt`), [starlight-heading-badges](https://github.com/HiDeoo/starlight-heading-badges), [starlight-image-zoom](https://github.com/HiDeoo/starlight-image-zoom), [starlight-links-validator](https://github.com/HiDeoo/starlight-links-validator).

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

Скрипт проверяет, что в `dist/` есть все маршруты контракта — `/`, `/introduction/`, `/installation/`, `/usage/`, `/privacy/`, `/troubleshooting/`, `/blog/`, `/logs/`, `/wishlist/` и те же страницы под `/ru/`, плюс первые записи блога и журнала; что лендинги ссылаются на документацию, блог, логи, репозиторий, сообщество и второй язык; что переключатель языка сохраняет раздел. Код возврата 0 — всё сошлось, 1 — список провалов.

## Сообщество и обратная связь

Каналы ведут в GitHub-репозиторий продукта [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma) и на площадку сообщества https://formamind.pro/community/.

**Желаемые функции** — страницы `/wishlist/` и `/ru/wishlist/` читают GitHub Discussions категории `Ideas` и сортируют идеи по числу голосов. Страница имеет три состояния:

| Состояние | Когда | Что видит читатель |
| --- | --- | --- |
| `no-token` | `COMMUNITY_GITHUB_TOKEN` не задан | «Доска ещё не подключена», кнопка «Предложить функцию» и ссылка на сообщество FormaMind |
| `empty` | токен есть, идей нет | «Идей пока нет» и ссылка на доску обсуждений |
| `ideas` | токен есть, идеи есть | таблица: название со ссылкой, голоса, число комментариев |

Токен — read-only GitHub fine-grained token с доступом к Discussions; значение живёт в `.env` в корне проекта (запрет 15 `AGENTS.md`), при развёртывании его можно переопределить отдельным `.env` в корне сайта. В репозиторий значение не попадает, образцы ключа — `.env.example` проекта и сайта. В карточке указывается имя и статус, но не значение. Ошибка GitHub API при заданном токене валит сборку — пустая доска не маскируется под «нет идей».

**Комментарии к документации** — giscus, repo `FormaMindPro/vibeforma`, категория `Comments`, `mapping: pathname`, тема light/dark по теме сайта, язык ru/en. Идентификаторы репозитория и категории публичны и лежат в `src/giscus-ids.json`; файл создаёт скрипт:

```bash
npm run giscus:ids     # node scripts/giscus-ids.mjs
```

Без `src/giscus-ids.json` блок комментариев не рендерится — сборка остаётся зелёной. Требования к репозиторию: публичный, Discussions включены, приложение giscus установлено, категории `Ideas` и `Comments` созданы.

**Ссылка на сообщество** — иконка `comment` в шапке Starlight и пункт «Community» / «Сообщество» в шапке и мобильном меню лендингов; ведёт на https://formamind.pro/community/.

Пошаговая настройка со стороны человека — `project/cards/card-198/human-setup.md`.

## Структура

```
vibeforma.pro/
├─ astro.config.mjs        конфигурация Starlight: локали, сайдбар, блог, ссылка на GitHub
├─ package.json            зависимости и команды
├─ tsconfig.json
├─ public/
│  └─ favicon.svg
├─ scripts/
│  ├─ verify-build.mjs     сборка и проверка маршрутов и ссылок
│  └─ giscus-ids.mjs       получает repoId и categoryId для giscus
├─ src/
│  ├─ components/
│  │  ├─ Landing.astro     лендинг: один компонент, параметр locale
│  │  └─ Wishlist.astro    страница желаемых функций: три состояния
│  ├─ content.config.ts    коллекции docs и i18n, схема блога
│  ├─ content/
│  │  ├─ docs/             английские страницы (корневые маршруты)
│  │  │  ├─ blog/          записи блога
│  │  │  ├─ logs/          индекс журнала и записи
│  │  │  ├─ introduction.md
│  │  │  ├─ installation.md
│  │  │  ├─ dictation.md
│  │  │  ├─ privacy.md
│  │  │  └─ troubleshooting.md
│  │  ├─ docs/ru/          русские страницы (маршруты /ru/…)
│  │  └─ i18n/
│  │     ├─ en.json
│  │     └─ ru.json
│  ├─ lib/
│  │  └─ wishlist.ts       GraphQL-чтение идей и сортировка по голосам
│  ├─ giscus-ids.json      публичные ID giscus (создаёт npm run giscus:ids)
│  ├─ pages/
│  │  ├─ index.astro       лендинг /
│  │  ├─ wishlist.astro    /wishlist/
│  │  └─ ru/
│  │     ├─ index.astro    лендинг /ru/
│  │     └─ wishlist.astro /ru/wishlist/
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
   → github.com/great-foundation-pro/doc-vibeforma   (публикация исходника на GitHub)
      → установка на cool.6ministersbiz.pro  (развертывание)
```

Образец всей цепочки — [great-foundation-pro/doc-pathofstrategy](https://github.com/great-foundation-pro/doc-pathofstrategy)
(локально: `D:\Документы\GitHub\doc-pathofstrategy`), продакшен образца: https://doc.pathofstrategy.com.

## Связь с проектом

- Документация продукта в проекте: `project/docs/` (база знаний по целям, пишет `Intent` после закрытия круга).
- Этот сайт — витрина документации для внешнего читателя; источником содержания служит подтверждённый результат проекта, а не черновики.
- Каталог создан по решению человека 2026-11-21 (инструкция вне маршрута, зафиксирована здесь — запрет 11 `AGENTS.md`). Каркас сайта, контент и проверка сборки — card-004.
