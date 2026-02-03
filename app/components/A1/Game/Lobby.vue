<template>
  <div class="space-y-4">
    <div v-for="(sec, i) in sections" :key="sec.key" class="space-y-3">
      <A1LayoutTitleBar :leftText="sec.leftText" :leftIcon="sec.leftIcon" :ui="{ right: '!gap-0' }">
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
        :ref="(el) => (A1GameListBarRef[i] = el as A1GameListBarRef)"
        :items="sec.items" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { GameListBarExposed } from './ListBar.vue';

  const store = useStore();

  const TITLE_BAR_UI_NOCAN = 'text-[#667386] border-[#2f4553]';
  const TITLE_BAR_UI_CAN = 'text-[#b1bad3] border-[#2f4553]';

  const sections = reactive([
    {
      key: 'continue',
      leftText: '繼續遊戲',
      leftIcon: 'material-symbols:settings-backup-restore',
      items: store.getGameList?.mapping?.slot[3]?.childGame,
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
    {
      key: 'hot',
      leftText: '熱門遊戲',
      leftIcon: 'twemoji:slot-machine',
      items: store.getGameList?.mapping?.slot[6]?.childGame,
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
    {
      key: 'sport',
      leftText: '熱門體育賽事',
      leftIcon: 'fluent-color:sport-24',
      items: store.getGameList?.mapping?.live,
      ui: { left: TITLE_BAR_UI_NOCAN, right: TITLE_BAR_UI_CAN },
    },
  ]);

  type A1GameListBarRef = ComponentPublicInstance<GameListBarExposed> | null;
  const A1GameListBarRef = ref<A1GameListBarRef[]>([]);
  const toggleGameBar = async (i: number, action: 'prev' | 'next') => {
    const bar = A1GameListBarRef.value[i];
    if (!bar) return;
    const result = await bar.toggle(action);
    const canPrev = result?.canPrev ?? false;
    const canNext = result?.canNext ?? false;
    if (sections[i]) {
      sections[i].ui.left = canPrev ? TITLE_BAR_UI_CAN : TITLE_BAR_UI_NOCAN;
      sections[i].ui.right = canNext ? TITLE_BAR_UI_CAN : TITLE_BAR_UI_NOCAN;
    }
  };
</script>
