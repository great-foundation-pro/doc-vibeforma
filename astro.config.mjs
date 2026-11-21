import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

// https://starlight.astro.build/
export default defineConfig({
  // Placeholder production domain; see README.md ("Publication chain").
  site: 'https://vibeforma.pro',

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
      ],
      customCss: [
        './src/styles/fonts.css',
        './src/styles/theme.css',
        './src/styles/site.css',
      ],
      plugins: [
        starlightBlog({
          title: { en: 'Blog', ru: 'Блог' },
          authors: {
            forma: { name: 'FormaMindPro' },
          },
        }),
      ],
      sidebar: [
        {
          label: 'Start',
          translations: { ru: 'Начало' },
          items: [
            {
              label: 'Introduction',
              translations: { ru: 'Введение' },
              link: '/introduction',
            },
            {
              label: 'Installation',
              translations: { ru: 'Установка' },
              link: '/installation',
            },
            {
              label: 'Usage',
              translations: { ru: 'Использование' },
              link: '/usage',
            },
          ],
        },
        {
          label: 'Reference',
          translations: { ru: 'Справочник' },
          items: [
            {
              label: 'Privacy',
              translations: { ru: 'Конфиденциальность' },
              link: '/privacy',
            },
            {
              label: 'Troubleshooting',
              translations: { ru: 'Решение проблем' },
              link: '/troubleshooting',
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
