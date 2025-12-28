<template>
  <div class="min-h-[700px] space-y-4 md:space-y-8 lg:px-5 xl:px-10 2xl:px-28 py-6 md:py-8">
    <!-- <A1LayoutBanner /> -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <A1HomeUserCard v-if="isLogin" class="w-full md:w-1/3" />
      <A1HomeGameBanner class="w-full md:w-2/3 md:h-[200px]" />
    </div>
    <div class="flex flex-col space-y-5">
      <A1GameSearchBar />
      <CommonTab
        v-model="active"
        :items="tabs"
        bg="#0F2633"
        border="#FFFFFF1F"
        text="#FFFFFFDB"
        hover-bg="#FFFFFF0F"
        active-bg="#5B6A74"
        active-text="#FFFFFF"
        active-border="#FFFFFF00"
        padding="6px"
        gap="6px"
        item-px="14px"
        item-py="10px"
        font-size="14px"
        icon-size="18px"
        icon-gap="8px"
        @change="onChange" />
    </div>
    <CommonGrid
      title="熱門遊戲"
      titleIcon="mdi mdi-fire"
      :items="games"
      :cardWidth="140"
      :gap="20"
      bottomTextKey="online"
      hoverEffect
      :showArrow="isDesktop" />
    <CommonGridCard
      title="促销活动"
      title-icon="mdi mdi-calendar-blank-outline"
      :items="promoList"
      text-position="left"
      :desktop-per-page="2"
      :mobile-per-page="1"
      :per-move="1"
      :gap="16"
      :mobile-padding="0"
      @select="onSelect" />
    <CommonRankList :items="rankingList" :interval="2000" />
    <CommonDropdown
      v-model="open"
      :items="faqItems"
      :accordion="true"
      :default-open-first="true"
      item-bg="#233B47"
      item-border="#FFFFFF14"
      header-hover-bg="#FFFFFF08"
      divider-color="#FFFFFF14"
      title-color="#FFFFFF"
      body-color="#FFFFFFB3"
      chevron-color="#FFFFFFCC"
      item-shadow="0 10px 20px #00000026"
      expand-max-height="560px"
      :expand-duration-ms="320" />
  </div>
</template>
<script setup lang="ts">
  const { isLogin } = useAuth();
  const { isDesktop } = useDevice();

  const games = [
    {
      id: 1,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '211 在玩',
    },
    {
      id: 2,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '356 在玩',
    },
    {
      id: 3,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '482 在玩',
    },
    {
      id: 4,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '129 在玩',
    },
    {
      id: 5,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '764 在玩',
    },
    {
      id: 6,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '98 在玩',
    },
    {
      id: 7,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '543 在玩',
    },
    {
      id: 8,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '621 在玩',
    },
    {
      id: 9,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '274 在玩',
    },
    {
      id: 10,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '899 在玩',
    },

    {
      id: 11,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '312 在玩',
    },
    {
      id: 12,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '457 在玩',
    },
    {
      id: 13,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '183 在玩',
    },
    {
      id: 14,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '768 在玩',
    },
    {
      id: 15,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '534 在玩',
    },
    {
      id: 16,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '245 在玩',
    },
    {
      id: 17,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '690 在玩',
    },
    {
      id: 18,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '421 在玩',
    },
    {
      id: 19,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '158 在玩',
    },
    {
      id: 20,
      image:
        'https://mediumrare.imgix.net/de5fa4623b55122f86f474cf82d7fa4c8d05229ffd7c1b6c4d32ba3a18cf629c?w=180&h=236&fit=min&auto=format',
      online: '802 在玩',
    },
  ];

  const promoItems = [
    {
      id: 1,
      image:
        'https://cdn.sanity.io/images/tdrhge4k/C9-com-production/592265f316cfa0c04544dc6f28b8ef7902b43478-1080x1080.jpg?w=220&h=220&fit=min&auto=format',
      title: '英超联赛',
      description: '领先2球赔付活动',
    },
    {
      id: 2,
      image:
        'https://cdn.sanity.io/images/tdrhge4k/C9-com-production/592265f316cfa0c04544dc6f28b8ef7902b43478-1080x1080.jpg?w=220&h=220&fit=min&auto=format',
      title: '200x Olympus Fortune',
      description: '$40,000 奖金池',
    },
    {
      id: 3,
      image:
        'https://cdn.sanity.io/images/tdrhge4k/C9-com-production/592265f316cfa0c04544dc6f28b8ef7902b43478-1080x1080.jpg?w=220&h=220&fit=min&auto=format',
      title: 'NFL',
      description: '第三节赔付活动',
    },
    {
      id: 4,
      image:
        'https://cdn.sanity.io/images/tdrhge4k/C9-com-production/592265f316cfa0c04544dc6f28b8ef7902b43478-1080x1080.jpg?w=220&h=220&fit=min&auto=format',
      title: 'NFL',
      description: '第三节赔付活动',
    },
    {
      id: 5,
      image:
        'https://cdn.sanity.io/images/tdrhge4k/C9-com-production/592265f316cfa0c04544dc6f28b8ef7902b43478-1080x1080.jpg?w=220&h=220&fit=min&auto=format',
      title: 'NFL',
      description: '第三节赔付活动',
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

  const active = ref<string | number>('lobby');

  const tabs = [
    { label: '大厅', value: 'lobby', icon: 'mdi mdi-view-grid' },
    { label: '新游戏', value: 'new', icon: 'mdi mdi-sparkles' },
    { label: 'C9 原创游戏', value: 'C9', icon: 'mdi mdi-fire' },
    { label: '老虎机', value: 'slots', icon: 'mdi mdi-slot-machine' },
    { label: '真人娱乐场', value: 'live', icon: 'mdi mdi-account' },
    { label: 'C9 独家', value: 'exclusive33', icon: 'mdi mdi-currency-usd' },
  ];

  const onChange = (val: string | number) => {
    console.log('change =>', val);
  };

  const open = ref<string | number>('q1');

  const faqItems = reactive([
    {
      value: 'q1',
      title: 'C9 是什么？',
      content:
        'C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。C9.com 从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。',
    },
    { value: 'q2', title: 'C9 是否拿到许可？', content: '这里放答案内容...' },
    { value: 'q3', title: '投注 C9 是否安全？', content: '这里放答案内容...' },
    { value: 'q4', title: '我可以投注哪些货币？', content: '这里放答案内容...' },
  ]);

  const promoList = [
    {
      id: 1,
      title: 'NFL',
      description: '第三节赔付活动',
      image: '/img/demo/promo-1.png',
    },
    {
      id: 2,
      title: 'NBA',
      description: '赛事加码送彩金',
      image: '/img/demo/promo-2.png',
    },
    {
      id: 3,
      title: '电竞',
      description: '连赢奖励加倍送',
      image: '/img/demo/promo-3.png',
    },
  ];

  const onSelect = (item: any) => {
    console.log('select promo:', item);
  };
</script>
