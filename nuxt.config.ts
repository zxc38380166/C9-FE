export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@pinia/nuxt',
  ],
  i18n: {
    // 不要語系前綴（/en /zh）
    strategy: 'no_prefix',
    // 預設語言
    defaultLocale: 'zh-TW',
    // 語系檔目錄（相對專案根目錄）
    langDir: './locales',
    // 語系清單
    locales: [
      { code: 'zh-TW', file: 'zh-TW.json', name: '繁體中文' },
      { code: 'en-US', file: 'en-US.json', name: 'English' },
    ],
    // vue-i18n 設定檔
    vueI18n: './i18n/i18n.config.ts',
  },
  // Element Plus 推薦：避免 SSR mismatch
  build: {
    transpile: ['element-plus'],
  },
  elementPlus: {
    // 選擇性設定
    importStyle: 'css', // 預設 'css'，你也可以改成 'sass'
    // themes: ['dark'], // 可以加 dark/light 主題
  },
  css: ['@mdi/font/css/materialdesignicons.css', 'assets/css/global.scss'],
});
