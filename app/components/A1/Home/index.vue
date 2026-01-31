<template>
  <div class="space-y-5">
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
    <A1GameLobby />
    <div class="pt-6">
      <A1LayoutTitleBar :leftText="'排行榜'" :leftIcon="'fa7-solid:ranking-star'">
        <template #right>
          <div>
            <UTabs
              :ui="{ list: 'bg-[#1a2c38]', trigger: 'cursor-pointer' }"
              :items="rankingTabs"
              class="w-full" />
          </div>
        </template>
      </A1LayoutTitleBar>
      <CommonRankList :items="rankingList" :interval="2000" />
    </div>
    <div>
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
    <div
      class="py-20 hidden lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-x-6 gap-y-4">
      <div v-for="item in provider" :key="item.name" class="group flex items-center justify-center">
        <NuxtImg
          :src="item.logo"
          :alt="item.name"
          class="h-10.5 w-21 object-contain opacity-75 group-hover:opacity-100 grayscale-20 group-hover:grayscale-0 transition"
          loading="lazy" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui';

  const store = useStore();

  const rankingTabs: TabsItem[] = [
    {
      label: '最近即時投注',
    },
    {
      label: '每日投注排行榜',
    },
    {
      label: '每週投注排行榜',
    },
    {
      label: '每月投注排行榜',
    },
    {
      label: '累積提領排行榜',
    },
  ];

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

  const provider = [
    { name: 'ADVANTPLAY', logo: '/img/common/provider/advantplay.png' },
    { name: 'AFB_SPORTS', logo: '/img/common/provider/afb_sports.png' },
    { name: 'AMEBA', logo: '/img/common/provider/ameba.png' },
    { name: 'ATG', logo: '/img/common/provider/atg.png' },
    { name: 'BAISON', logo: '/img/common/provider/baison.png' },
    { name: 'BBIN', logo: '/img/common/provider/bbin.png' },
    { name: 'BTGAMING', logo: '/img/common/provider/btgaming.png' },
    { name: 'CARD365', logo: '/img/common/provider/card365.png' },
    { name: 'CF102', logo: '/img/common/provider/cf102.png' },
    { name: 'CQ9', logo: '/img/common/provider/cq9.png' },
    { name: 'CRYSTAL', logo: '/img/common/provider/crystal.png' },
    { name: 'DG', logo: '/img/common/provider/dg.png' },
    { name: 'EAZY_GAMING', logo: '/img/common/provider/eazy_gaming.png' },
    { name: 'EBET', logo: '/img/common/provider/ebet.png' },
    { name: 'EVOPLAY', logo: '/img/common/provider/evoplay.png' },
    { name: 'EZUGI', logo: '/img/common/provider/ezugi.png' },
    { name: 'FASTSPIN', logo: '/img/common/provider/fastspin.png' },
    { name: 'FB_SPORTS', logo: '/img/common/provider/fb_sports.png' },
    { name: 'FC', logo: '/img/common/provider/fc.png' },
    { name: 'FUNTA', logo: '/img/common/provider/funta.png' },
    { name: 'GA28', logo: '/img/common/provider/ga28.png' },
    { name: 'GAME168', logo: '/img/common/provider/game168.png' },
    { name: 'HT368', logo: '/img/common/provider/ht368.png' },
    { name: 'IM_ESPORTS', logo: '/img/common/provider/im_esports.png' },
    { name: 'IM_SPORTS', logo: '/img/common/provider/im_sports.png' },
    { name: 'JDB', logo: '/img/common/provider/jdb.png' },
    { name: 'JILI', logo: '/img/common/provider/jili.png' },
    { name: 'KA', logo: '/img/common/provider/ka.png' },
    { name: 'KINGMAKER', logo: '/img/common/provider/kingmaker.png' },
    { name: 'LC', logo: '/img/common/provider/lc.png' },
    { name: 'LUCKY_SPORTS', logo: '/img/common/provider/lucky_sports.png' },
    { name: 'MG', logo: '/img/common/provider/mg.png' },
    { name: 'MOTIVATION', logo: '/img/common/provider/motivation.png' },
    { name: 'NEXTSPIN', logo: '/img/common/provider/nextspin.png' },
    { name: 'OCTOPLAY', logo: '/img/common/provider/octoplay.png' },
    { name: 'ONGAME', logo: '/img/common/provider/ongame.png' },
    { name: 'ONLIVE', logo: '/img/common/provider/onlive.png' },
    { name: 'PG', logo: '/img/common/provider/pg.png' },
    { name: 'PNG', logo: '/img/common/provider/png.png' },
    { name: 'PP', logo: '/img/common/provider/pp.png' },
    { name: 'PS', logo: '/img/common/provider/ps.png' },
    { name: 'RCB', logo: '/img/common/provider/rcb.png' },
    { name: 'RG', logo: '/img/common/provider/rg.png' },
    { name: 'RG_CLUB', logo: '/img/common/provider/rg_club.png' },
    { name: 'RICH88', logo: '/img/common/provider/rich88.png' },
    { name: 'RSG', logo: '/img/common/provider/rsg.png' },
    { name: 'SA', logo: '/img/common/provider/sa.png' },
    { name: 'SABA', logo: '/img/common/provider/saba.png' },
    { name: 'SBOBET', logo: '/img/common/provider/sbobet.png' },
    { name: 'SEXYBCRT', logo: '/img/common/provider/sexybcrt.png' },
    { name: 'SPADEGAMING', logo: '/img/common/provider/spadegaming.png' },
    { name: 'SPLUS', logo: '/img/common/provider/splus.png' },
    { name: 'SPRIBE', logo: '/img/common/provider/spribe.png' },
    { name: 'SV', logo: '/img/common/provider/sv.png' },
    { name: 'TF', logo: '/img/common/provider/tf.png' },
    { name: 'THREE_SING', logo: '/img/common/provider/three_sing.png' },
    { name: 'TP', logo: '/img/common/provider/tp.png' },
    { name: 'TURBO', logo: '/img/common/provider/turbo.png' },
    { name: 'VA', logo: '/img/common/provider/va.png' },
    { name: 'VIA_CASINO', logo: '/img/common/provider/via_casino.png' },
    { name: 'VOLTENT', logo: '/img/common/provider/voltent.png' },
    { name: 'WALA88', logo: '/img/common/provider/wala88.png' },
    { name: 'WCC', logo: '/img/common/provider/wcc.png' },
    { name: 'WG_LIVE', logo: '/img/common/provider/wg_live.png' },
    { name: 'XGAME', logo: '/img/common/provider/xgame.png' },
    { name: 'YELLOWBAT', logo: '/img/common/provider/yellowbat.png' },
    { name: 'YL', logo: '/img/common/provider/yl.png' },
  ] as const;

  const orderNum = 20;

  // 預設單一 game_code 顯示一筆, 若設定為 Infinity 則無限多
  const limitMap = {
    allbet: Infinity,
    dg: Infinity,
    rsg: Infinity,
    ky: Infinity,
    splus_encode: Infinity,
    jili_chess: Infinity,
    ftg_fish: Infinity,
    rsg_fishing: Infinity,
    spribe: 10,
    // pp_table: 6,
    jili_table: 11,
    fc_fish: Infinity,
  };

  // 每個指定的 game_code 要從哪個 index 排
  const positionMap = {
    rsg: 0, // ex: splus 從索引 0 開始
    splus_encode: 0,
  };
</script>
