import os from 'os';

const cpus = os.cpus();
const cpuModel = [...new Set(cpus.map((item: any) => item.model))][0];
const { env: nuxtEnv, version: nodeVersion, arch, memoryUsage } = process;

// 顏色代碼
const Reset = '\x1b[0m';
const HeaderColor = '\x1b[44m';
const FooterColor = '\x1b[44m';

console.log(HeaderColor, '==================⚠️ 專案與環境⚠️ ==================', Reset);
console.log('✨ 專案名稱:', 'apollo-nuxt3');
console.log('✨ 啟動環境:', nuxtEnv.npm_lifecycle_event);
console.log('✨ 本機版號:', nodeVersion);
console.log('✨ 開發環境:', arch);
console.log('✨ 中央處理器:', cpuModel);
console.log('✨ 記憶體使用量:', `${(memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`);
console.log(FooterColor, '==================================================', Reset);

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
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
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
      { code: 'zh-CN', file: 'zh-CN.json', name: '簡體中文' },
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
