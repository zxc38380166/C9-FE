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
    <A1GameRankList />
    <div>
      <UAccordion
        :items="faqItems"
        :ui="{
          root: 'space-y-3',
          item: 'rounded-2xl overflow-hidden bg-slate-800/55 ring-1 ring-white/10 backdrop-blur shadow-[0_12px_40px_-22px_rgba(0,0,0,0.55)]',
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
      class="py-10 hidden lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-x-6 gap-y-4">
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
  const { provider } = useGame();

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
