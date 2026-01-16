// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/global.scss', '~/assets/css/main.css'],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh-TW',
    langDir: 'locales',
    locales: [
      { code: 'zh-TW', iso: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en-US', iso: 'en-US', name: 'English', file: 'en-US.json' },
    ],
  },
});
