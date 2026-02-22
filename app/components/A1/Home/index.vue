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
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('home.faqTitle') }}</span>
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
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('home.partners') }}</span>
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
  const { t } = useI18n();
  const { provider } = useGame();

  const faqItems = computed(() => [
    { label: t('home.faq.q1'), content: t('home.faq.a1') },
    { label: t('home.faq.q2'), content: t('home.faq.a2') },
    { label: t('home.faq.q3'), content: t('home.faq.a3') },
    { label: t('home.faq.q4'), content: t('home.faq.a4') },
    { label: t('home.faq.q5'), content: t('home.faq.a5') },
  ]);
</script>
