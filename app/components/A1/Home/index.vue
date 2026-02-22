<template>
  <div class="space-y-5 sm:space-y-8">
    <A1HomeBanner />
    <A1HomePromo />
    <A1GameLobby />
    <A1GameRankList />
    <!-- FAQ 常見問題 -->
    <div class="space-y-3 sm:space-y-4">
      <div class="flex items-center gap-2 px-1">
        <Icon name="noto:speech-balloon" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">常見問題</span>
      </div>
      <UAccordion
        :items="faqItems"
        :ui="{
          root: 'space-y-2.5',
          item: 'rounded-xl overflow-hidden bg-[#131f30] ring-1 ring-white/8',
          header: 'w-full',
          trigger:
            'group w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left text-[13px] sm:text-[15px] font-medium text-white/90 hover:bg-white/[0.03] transition-colors',
          leadingIcon: 'text-emerald-400/80',
          trailingIcon:
            'size-4 sm:size-5 text-white/40 transition-transform duration-200 group-data-[state=open]:rotate-180',
          body: 'py-2',
          content:
            'px-4 sm:px-5 py-0 text-[12px] sm:text-[14px] leading-relaxed text-white/60 border-t border-white/8',
        }"
        :multiple="false" />
    </div>
    <!-- 遊戲供應商 -->
    <div class="space-y-3 sm:space-y-4">
      <div class="flex items-center gap-2 px-1">
        <Icon name="noto:handshake" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">合作夥伴</span>
      </div>
      <div
        class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3 sm:p-5">
        <div
          v-for="item in provider"
          :key="item.name"
          class="group flex items-center justify-center p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors">
          <NuxtImg
            :src="item.logo"
            :alt="item.name"
            class="h-8 sm:h-10 w-16 sm:w-20 object-contain"
            loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const { provider } = useGame();

  const faqItems = ref([
    {
      label: '如何在平台上註冊帳號？',
      content:
        '點擊右上角「註冊」按鈕，填寫帳號、密碼等基本資訊即可快速註冊。我們也支援 Google、Facebook 等第三方快速登入。',
    },
    {
      label: '支持哪些存款方式？',
      content:
        '我們支援銀行轉帳（ATM）、信用卡以及加密貨幣（USDT 等）多種存款方式，滿足您的不同需求。',
    },
    {
      label: '如何保障我的帳戶安全？',
      content:
        '平台採用 SSL 加密技術保護您的數據，同時支援 Google Authenticator 雙因素認證（2FA），建議您開啟以加強帳戶安全性。',
    },
    {
      label: '提款需要多長時間？',
      content:
        '一般情況下，提款申請會在 24 小時內處理完成。加密貨幣提款通常更快，銀行轉帳視銀行處理時間而定。',
    },
    {
      label: '遇到問題如何聯繫客服？',
      content:
        '您可以透過平台內的即時客服功能聯繫我們，或發送電子郵件至客服信箱。我們的客服團隊 24 小時在線為您服務。',
    },
  ]);
</script>
