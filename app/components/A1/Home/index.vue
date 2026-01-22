<template>
  <div class="px-3.5 lg:px-10 xl:px-20 space-y-5">
    <A1HomeBanner />
    <A1LayoutCarousel />
    <UMarquee :overlay="false" :ui="{ root: '[--gap:--spacing(3)]' }">
      <UPageCard
        v-for="item in marqueeItems"
        :key="item.img"
        :description="item.description"
        :ui="{ container: '!p-2', description: 'text-[11px] text-center' }">
        <template #title>
          <NuxtImg :src="item.img" class="w-17.5" />
        </template>
      </UPageCard>
    </UMarquee>
    <div class="space-y-4">
      <div v-for="(sec, i) in sections" :key="sec.key" class="space-y-4">
        <A1LayoutTitleBar
          :leftText="sec.leftText"
          :leftIcon="sec.leftIcon"
          :ui="{ right: '!gap-0' }">
          <template #right>
            <div
              @click="toggleGameBar(i, 'prev')"
              :class="[sec.ui.left]"
              class="cursor-pointer rounded-l-xl w-12.5 border flex items-center justify-center h-9">
              <Icon :name="'material-symbols:chevron-left-rounded'" />
            </div>
            <div
              @click="toggleGameBar(i, 'next')"
              :class="[sec.ui.right]"
              class="cursor-pointer rounded-r-xl w-12.5 border flex items-center justify-center h-9">
              <Icon :name="'material-symbols:chevron-right-rounded'" />
            </div>
          </template>
        </A1LayoutTitleBar>
        <A1GameListBar
          :ref="(el) => (A1GameListBarRef[i] = el)"
          :carouselItems="sec.carouselItems" />
      </div>
    </div>
    <CommonRankList :items="rankingList" :interval="2000" />
    <div class="pb-100">
      <UAccordion
        :items="faqItems"
        :ui="{
          root: 'space-y-3',
          item: 'rounded-2xl overflow-hidden bg-[#233b47]/55 ring-1 ring-white/10 backdrop-blur shadow-[0_12px_40px_-22px_rgba(0,0,0,0.55)]',
          header: 'w-full',
          trigger:
            'group w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.04] transition-colors',
          leadingIcon: 'text-[#00df72]/85',
          trailingIcon:
            'size-5 text-white/55 transition-transform duration-200 group-data-[state=open]:rotate-180',
          body: 'py-3',
          content:
            'px-5 py-0 text-sm md:text-[15px] leading-relaxed text-white/70 border-t border-white/10',
        }"
        :multiple="false" />
    </div>
  </div>
</template>
<script setup lang="ts">
  const TITLE_BAR_UI_NOCAN = 'text-[#667386] border-[#2f4553]';
  const TITLE_BAR_UI_CAN = 'text-[#b1bad3] border-[#2f4553]';

  const sections = reactive([
    {
      key: 'continue',
      leftText: '繼續遊戲',
      leftIcon: 'material-symbols:settings-backup-restore',
      carouselItems: [
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
      ],
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
    {
      key: 'hot',
      leftText: '熱門遊戲',
      leftIcon: 'twemoji:slot-machine',
      carouselItems: [
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
      ],
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
    {
      key: 'sport',
      leftText: '熱門體育賽事',
      leftIcon: 'fluent-color:sport-24',
      carouselItems: [
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/rsg/TW/112.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/fc_fish/TW/21008.webp',
        'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/pp_table/TW/bndt.webp',
      ],
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
  ]);

  const A1GameListBarRef: Ref = ref([]);
  const toggleGameBar = (i: number, action: 'prev' | 'next') => {
    const bar = A1GameListBarRef.value[i];
    if (!bar) return;
    const UCarouselRef = bar.UCarouselRef;
    const api = UCarouselRef.emblaApi;
    const { canScrollPrev, canScrollNext } = api;
    if (action === 'prev' && canScrollPrev()) api.scrollPrev();
    if (action === 'next' && canScrollNext()) api.scrollNext();
    nextTick(() => {
      if (sections[i]) {
        sections[i].ui.left = canScrollPrev() ? TITLE_BAR_UI_CAN : TITLE_BAR_UI_NOCAN;
        sections[i].ui.right = canScrollNext() ? TITLE_BAR_UI_CAN : TITLE_BAR_UI_NOCAN;
      }
    });
  };

  const rankingList = [
    {
      id: 1,
      gameIcon: 'mdi mdi-cards',
      gameName: 'VIP Blackjack 7',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:27',
      betAmount: '$1,875.00',
      betCurrencyIcon: 'mdi mdi-ethereum',
      multiplier: '1.20x',
      payout: '$2,250.00',
      payoutCurrencyIcon: 'mdi mdi-ethereum',
      payoutPositive: true,
    },
    {
      id: 2,
      gameIcon: 'mdi mdi-duck',
      gameName: 'Duck Hunters',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:27',
      betAmount: '$1,022.57',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '1.89x',
      payout: '$1,936.23',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 3,
      gameIcon: 'mdi mdi-dots-triangle',
      gameName: 'Plinko',
      playerIcon: 'mdi mdi-account',
      playerName: 'Bonkers1424',
      time: '下午2:27',
      betAmount: 'CA$800.00',
      betCurrencyIcon: 'mdi mdi-currency-usd',
      multiplier: '3.00x',
      payout: 'CA$2,400.00',
      payoutCurrencyIcon: 'mdi mdi-currency-usd',
      payoutPositive: true,
    },
    {
      id: 4,
      gameIcon: 'mdi mdi-cards-diamond',
      gameName: 'Speed Baccarat A',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:27',
      betAmount: '$2,986.54',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '2.00x',
      payout: '$5,973.08',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 5,
      gameIcon: 'mdi mdi-candy',
      gameName: 'Sugar Rush 1000',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:26',
      betAmount: '$600.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '3.04x',
      payout: '$1,825.44',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 6,
      gameIcon: 'mdi mdi-cards-club',
      gameName: 'Privé Lounge Baccarat',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:26',
      betAmount: '$5,000.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '1.95x',
      payout: '$9,750.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 7,
      gameIcon: 'mdi mdi-cards-spade',
      gameName: 'Salon Privé Blackjack',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:26',
      betAmount: '$4,462.08',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '0.00x',
      payout: '-$4,462.08',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: false,
    },
    {
      id: 8,
      gameIcon: 'mdi mdi-slot-machine',
      gameName: 'Gates of Olympus',
      playerIcon: 'mdi mdi-account',
      playerName: 'ZeusKing',
      time: '下午2:25',
      betAmount: '$320.00',
      betCurrencyIcon: 'mdi mdi-ethereum',
      multiplier: '6.20x',
      payout: '$1,984.00',
      payoutCurrencyIcon: 'mdi mdi-ethereum',
      payoutPositive: true,
    },
    {
      id: 9,
      gameIcon: 'mdi mdi-shark',
      gameName: 'Jaws of Justice',
      playerIcon: 'mdi mdi-account',
      playerName: 'SharkBoy88',
      time: '下午2:25',
      betAmount: '$450.00',
      betCurrencyIcon: 'mdi mdi-bitcoin',
      multiplier: '0.00x',
      payout: '-$450.00',
      payoutCurrencyIcon: 'mdi mdi-bitcoin',
      payoutPositive: false,
    },
    {
      id: 10,
      gameIcon: 'mdi mdi-airplane',
      gameName: 'Airstrike',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:24',
      betAmount: '$1,200.00',
      betCurrencyIcon: 'mdi mdi-ethereum',
      multiplier: '2.50x',
      payout: '$3,000.00',
      payoutCurrencyIcon: 'mdi mdi-ethereum',
      payoutPositive: true,
    },

    // 再補 10 筆（風格一致）

    {
      id: 11,
      gameIcon: 'mdi mdi-slot-machine',
      gameName: 'Sweet Bonanza',
      playerIcon: 'mdi mdi-account',
      playerName: 'CandyMan',
      time: '下午2:24',
      betAmount: '$200.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '5.10x',
      payout: '$1,020.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 12,
      gameIcon: 'mdi mdi-cards-heart',
      gameName: 'VIP Roulette',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:23',
      betAmount: '$800.00',
      betCurrencyIcon: 'mdi mdi-bitcoin',
      multiplier: '0.00x',
      payout: '-$800.00',
      payoutCurrencyIcon: 'mdi mdi-bitcoin',
      payoutPositive: false,
    },
    {
      id: 13,
      gameIcon: 'mdi mdi-fire',
      gameName: 'Hot Dice',
      playerIcon: 'mdi mdi-account',
      playerName: 'Lucky777',
      time: '下午2:23',
      betAmount: '$150.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '8.00x',
      payout: '$1,200.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 14,
      gameIcon: 'mdi mdi-diamond-stone',
      gameName: 'Mega Gems',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:22',
      betAmount: '$500.00',
      betCurrencyIcon: 'mdi mdi-ethereum',
      multiplier: '2.00x',
      payout: '$1,000.00',
      payoutCurrencyIcon: 'mdi mdi-ethereum',
      payoutPositive: true,
    },
    {
      id: 15,
      gameIcon: 'mdi mdi-poker-chip',
      gameName: 'High Roller Poker',
      playerIcon: 'mdi mdi-account',
      playerName: 'AceMaster',
      time: '下午2:22',
      betAmount: '$2,000.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '1.50x',
      payout: '$3,000.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 16,
      gameIcon: 'mdi mdi-bullseye-arrow',
      gameName: 'Target Win',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:21',
      betAmount: '$300.00',
      betCurrencyIcon: 'mdi mdi-bitcoin',
      multiplier: '0.00x',
      payout: '-$300.00',
      payoutCurrencyIcon: 'mdi mdi-bitcoin',
      payoutPositive: false,
    },
    {
      id: 17,
      gameIcon: 'mdi mdi-crown',
      gameName: 'Royal Baccarat',
      playerIcon: 'mdi mdi-account',
      playerName: 'King888',
      time: '下午2:21',
      betAmount: '$1,000.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '2.20x',
      payout: '$2,200.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: true,
    },
    {
      id: 18,
      gameIcon: 'mdi mdi-cash-multiple',
      gameName: 'Money Drop',
      playerIcon: 'mdi mdi-incognito',
      playerName: '隐身',
      time: '下午2:20',
      betAmount: '$400.00',
      betCurrencyIcon: 'mdi mdi-ethereum',
      multiplier: '3.50x',
      payout: '$1,400.00',
      payoutCurrencyIcon: 'mdi mdi-ethereum',
      payoutPositive: true,
    },
    {
      id: 19,
      gameIcon: 'mdi mdi-star',
      gameName: 'Star Burst',
      playerIcon: 'mdi mdi-account',
      playerName: 'NovaX',
      time: '下午2:20',
      betAmount: '$250.00',
      betCurrencyIcon: 'mdi mdi-tether',
      multiplier: '0.00x',
      payout: '-$250.00',
      payoutCurrencyIcon: 'mdi mdi-tether',
      payoutPositive: false,
    },
    {
      id: 20,
      gameIcon: 'mdi mdi-lightning-bolt',
      gameName: 'Lightning Dice',
      playerIcon: 'mdi mdi-account',
      playerName: 'Flash99',
      time: '下午2:19',
      betAmount: '$180.00',
      betCurrencyIcon: 'mdi mdi-bitcoin',
      multiplier: '4.00x',
      payout: '$720.00',
      payoutCurrencyIcon: 'mdi mdi-bitcoin',
      payoutPositive: true,
    },
  ];

  const faqItems = ref([
    {
      label: 'Is Nuxt UI free to use?',
      content:
        'Yes! Nuxt UI is completely free and open source under the MIT license. All 125+ components are available to everyone.',
    },
    {
      label: 'Can I use Nuxt UI with Vue without Nuxt?',
      content:
        'Yes! While optimized for Nuxt, Nuxt UI works perfectly with standalone Vue projects via our Vite plugin. You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.',
    },
    {
      label: 'Is Nuxt UI production-ready?',
      content:
        'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.',
    },
  ]);

  const marqueeItems = ref([
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
    {
      description: '999人在玩',
      img: 'https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/gameChild/splus/TW/611.webp',
    },
  ]);
</script>
