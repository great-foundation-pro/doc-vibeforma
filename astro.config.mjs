import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import starlightGiscus from 'starlight-giscus';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightPageFeedback from 'starlight-page-feedback';

// The community token is an environment credential: it lives in the `.env`
// at the project root (AGENTS.md, prohibition 15). A deployment may provide
// its own site `.env`; that value wins over the project root. The token stays
// server-side: only the public giscus IDs below reach the page.
function readEnvKey(file, key) {
  if (!existsSync(file)) return null;
  const line = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((entry) => new RegExp(`^${key}\\s*=`).test(entry));
  if (!line) return null;
  const value = line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  return value.length > 0 ? value : null;
}

if (!process.env.COMMUNITY_GITHUB_TOKEN) {
  const token =
    readEnvKey(new URL('./.env', import.meta.url), 'COMMUNITY_GITHUB_TOKEN') ??
    readEnvKey(new URL('../../../.env', import.meta.url), 'COMMUNITY_GITHUB_TOKEN');
  if (token) process.env.COMMUNITY_GITHUB_TOKEN = token;
}

// Comments stay off until the product repository has Discussions enabled and
// `scripts/giscus-ids.mjs` has written the public repository and category IDs.
const giscusIdsPath = new URL('./src/giscus-ids.json', import.meta.url);
const giscusIds = existsSync(giscusIdsPath)
  ? JSON.parse(readFileSync(giscusIdsPath, 'utf8'))
  : null;

// https://starlight.astro.build/
export default defineConfig({
  // Placeholder production domain; see README.md ("Publication chain").
  site: 'https://vibeforma.pro',

  // The old single "Usage" page is split into task pages. Keep the old URLs
  // working in both locales instead of returning 404.
  redirects: {
    '/usage': '/dictation',
    '/ru/usage': '/ru/dictation',
  },

  integrations: [
    starlight({
      title: 'VibeForma',
      description:
        'Local voice dictation for Windows. Press a hotkey, speak, and the text appears at the cursor.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ru: { label: 'Русский', lang: 'ru' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/FormaMindPro/vibeforma',
        },
        {
          icon: 'comment',
          label: 'Community',
          href: 'https://formamind.pro/community/',
        },
      ],
      customCss: [
        './src/styles/fonts.css',
        './src/styles/theme.css',
        './src/styles/site.css',
      ],
      // Expressive Code switches with the site theme: a dark and a light
      // Shiki theme keep code readable on both desks.
      expressiveCode: {
        themes: ['github-dark-default', 'github-light'],
        useStarlightUiThemeColors: true,
        styleOverrides: {
          borderRadius: '0.6rem',
          borderWidth: '1px',
          codeFontSize: '0.875rem',
          codeLineHeight: '1.6',
        },
        defaultProps: {
          wrap: false,
        },
      },
      components: {
        Head: './src/components/Head.astro',
      },
      plugins: [
        starlightBlog({
          title: { en: 'Blog', ru: 'Блог' },
          authors: {
            forma: { name: 'FormaMindPro' },
          },
        }),
        starlightPageFeedback({
          github: 'FormaMindPro/vibeforma',
          event: 'Docs Feedback',
        }),
        starlightLinksValidator({ failOnError: false }),
        starlightLlmsTxt(),
        starlightImageZoom(),
        starlightHeadingBadges(),
        ...(giscusIds?.repoId && giscusIds?.categoryId
          ? [
              starlightGiscus({
                repo: 'FormaMindPro/vibeforma',
                repoId: giscusIds.repoId,
                category: 'Comments',
                categoryId: giscusIds.categoryId,
                mapping: 'pathname',
                theme: { light: 'light', dark: 'dark' },
              }),
            ]
          : []),
      ],
      sidebar: [
        {
          label: 'Start',
          translations: { ru: 'Начало' },
          items: [
            {
              label: 'What is VibeForma?',
              translations: { ru: 'Что такое VibeForma' },
              link: '/introduction',
            },
            {
              label: 'VibeForma and alternatives',
              translations: { ru: 'VibeForma и аналоги' },
              link: '/comparison',
            },
            {
              label: 'Quickstart',
              translations: { ru: 'Быстрый старт' },
              link: '/quickstart',
            },
            {
              label: 'Installation',
              translations: { ru: 'Установка' },
              link: '/installation',
            },
            {
              label: 'System requirements',
              translations: { ru: 'Системные требования' },
              link: '/requirements',
            },
          ],
        },
        {
          label: 'Using VibeForma',
          translations: { ru: 'Использование' },
          items: [
            {
              label: 'Dictation',
              translations: { ru: 'Диктовка' },
              link: '/dictation',
            },
            {
              label: 'Keyboard shortcuts',
              translations: { ru: 'Горячие клавиши' },
              link: '/hotkeys',
            },
            {
              label: 'Settings',
              translations: { ru: 'Настройки' },
              link: '/settings',
            },
            {
              label: 'Models and languages',
              translations: { ru: 'Модели и языки' },
              link: '/models',
            },
            {
              label: 'Panel, tray and autostart',
              translations: { ru: 'Панель, трей и автозапуск' },
              link: '/interface',
            },
            {
              label: 'Updates',
              translations: { ru: 'Обновления' },
              link: '/updates',
            },
          ],
        },
        {
          label: 'Text and records',
          translations: { ru: 'Текст и записи' },
          items: [
            {
              label: 'File transcription',
              translations: { ru: 'Транскрибация файлов' },
              link: '/file-transcription',
            },
            {
              label: 'Dictionary',
              translations: { ru: 'Словарь' },
              link: '/dictionary',
            },
            {
              label: 'Snippets',
              translations: { ru: 'Сниппеты' },
              link: '/snippets',
            },
            {
              label: 'History',
              translations: { ru: 'История' },
              link: '/history',
            },
            {
              label: 'Statistics',
              translations: { ru: 'Статистика' },
              link: '/statistics',
            },
          ],
        },
        {
          label: 'Integrations',
          translations: { ru: 'Интеграции' },
          items: [
            {
              label: 'VibeForma in FormaMind',
              translations: { ru: 'VibeForma в FormaMind' },
              link: '/formamind',
            },
            {
              label: 'AI agents and integrations',
              translations: { ru: 'ИИ-агенты и интеграции' },
              link: '/agents',
            },
          ],
        },
        {
          label: 'Reference',
          translations: { ru: 'Справочник' },
          items: [
            {
              label: 'Settings reference',
              translations: { ru: 'Справочник настроек' },
              link: '/settings-reference',
            },
            {
              label: 'Files and locations',
              translations: { ru: 'Файлы и расположение' },
              link: '/files-and-paths',
            },
            {
              label: 'Command line',
              translations: { ru: 'Командная строка' },
              link: '/cli',
            },
            {
              label: 'Local API',
              translations: { ru: 'Локальный API' },
              link: '/local-api',
            },
            {
              label: 'Transcript formats',
              translations: { ru: 'Форматы расшифровки' },
              link: '/formats',
            },
            {
              label: 'Glossary',
              translations: { ru: 'Глоссарий' },
              link: '/glossary',
            },
          ],
        },
        {
          label: 'Help',
          translations: { ru: 'Помощь' },
          items: [
            {
              label: 'Troubleshooting',
              translations: { ru: 'Решение проблем' },
              link: '/troubleshooting',
            },
            {
              label: 'FAQ',
              translations: { ru: 'Частые вопросы' },
              link: '/faq',
            },
            {
              label: 'Diagnostics and logs',
              translations: { ru: 'Диагностика и логи' },
              link: '/diagnostics',
            },
            {
              label: 'Known issues and limitations',
              translations: { ru: 'Известные ограничения' },
              link: '/known-issues',
            },
          ],
        },
        {
          label: 'Privacy and security',
          translations: { ru: 'Приватность и безопасность' },
          items: [
            {
              label: 'Privacy',
              translations: { ru: 'Приватность' },
              link: '/privacy',
            },
            {
              label: 'Security',
              translations: { ru: 'Безопасность' },
              link: '/security',
            },
          ],
        },
        {
          label: 'Project',
          translations: { ru: 'Проект' },
          items: [
            {
              label: 'Changelog',
              translations: { ru: 'История версий' },
              link: '/changelog',
            },
            {
              label: 'Roadmap',
              translations: { ru: 'Дорожная карта' },
              link: '/roadmap',
            },
            {
              label: 'Feature requests',
              translations: { ru: 'Желаемые функции' },
              link: '/wishlist',
            },
            {
              label: 'Development',
              translations: { ru: 'Разработка' },
              link: '/development',
            },
            {
              label: 'Contributing',
              translations: { ru: 'Участие' },
              link: '/contributing',
            },
          ],
        },
        {
          label: 'Community',
          translations: { ru: 'Сообщество' },
          items: [
            {
              label: 'FormaMind community',
              translations: { ru: 'Сообщество FormaMind' },
              link: 'https://formamind.pro/community/',
              attrs: { target: '_blank' },
            },
          ],
        },
        {
          label: 'Journal',
          translations: { ru: 'Журнал' },
          items: [
            {
              label: 'Logs',
              translations: { ru: 'Логи' },
              link: '/logs',
            },
            {
              label: 'Starting this site',
              translations: { ru: 'Запуск сайта' },
              link: '/logs/2026-11-21-start',
            },
          ],
        },
      ],
    }),
  ],
});
