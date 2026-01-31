<template>
  <div class="space-y-4">
    <ClientOnly>
      <A1LayoutCarousel />
      <UContentSearchButton
        :collapsed="false"
        :label="'查詢遊戲'"
        :kbds="['shift', 's']"
        :ui="{
          base: [
            'w-full h-[50px]',
            'rounded-[10px]',
            'bg-[#0f1f2a]/70 ring-1 ring-white/10 backdrop-blur',
            'px-4 cursor-pointer',
            'text-white/70',
            'hover:bg-white/[0.06] hover:text-white',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00df72]/35',
            'shadow-[0_14px_50px_-26px_rgba(0,0,0,0.65)]',
          ],
          label: 'text-[13px] font-semibold tracking-wide',
          leadingIcon: 'text-[16px] opacity-90',
        }" />
      <UTabs
        v-model="activeTab"
        :ui="{
          root: 'w-full items-start',
          list: 'rounded-[10px] max-w-[900px] w-full bg-[#0f1f2a]/70 ring-1 ring-white/10 backdrop-blur',
          trigger: 'cursor-pointer h-10 text-white/70 hover:bg-white/[0.06] hover:text-white h-10',
          leadingIcon: 'text-[16px] opacity-90',
          content: 'mt-2',
        }"
        :items="tabs"
        :unmount-on-hide="false"
        class="w-full">
        <template #content>
          <div>
            <div v-show="activeTab === GAME_CUSTOM.KEY">
              <A1GameLobby />
            </div>
            <div v-show="activeTab !== GAME_CUSTOM.KEY" class="space-y-4">
              <div
                class="grid w-full gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                <button
                  v-for="game in visibleGames"
                  :key="getGameMappingImg(game)"
                  type="button"
                  class="group w-full overflow-hidden rounded-2xl"
                  @click="onClickGame(game)">
                  <div class="relative cursor-pointer">
                    <NuxtImg
                      :src="getGameMappingImg(game)"
                      :alt="getGameMappingImg(game)"
                      class="w-full h-auto group-hover:scale-[1.06] transition-transform duration-300"
                      loading="lazy" />
                  </div>
                </button>
              </div>
              <div class="flex justify-center pt-2" v-if="canShowMore">
                <UButton size="lg" variant="soft" class="min-w-55" @click="showMore">
                  展示更多
                  <span class="ml-2 text-white/60 text-xs">
                    ({{ shownCount }}/{{ totalCount }})
                  </span>
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
  import type { ChildGameItem, ProviderItem } from '~/app.vue';

  const i18n = useI18n();
  const store = useStore();
  const { GAME_TYPE_VALUE_ENUM, isChildGameType, getGameMappingImg } = useGame();

  const GAME_CUSTOM = { KEY: 'gameLobby', VALUE: 0 };

  const tabIconMap = reactive({
    [GAME_CUSTOM.VALUE]: 'material-symbols:view-list-sharp',
    [GAME_TYPE_VALUE_ENUM.sports]: 'material-symbols-light:sports-volleyball',
    [GAME_TYPE_VALUE_ENUM.slot]: 'mdi:slot-machine-outline',
    [GAME_TYPE_VALUE_ENUM.live]: 'ic:twotone-live-tv',
    [GAME_TYPE_VALUE_ENUM.lottery]: 'fluent:lottery-20-filled',
    [GAME_TYPE_VALUE_ENUM.chess]: 'fluent:chess-24-filled',
    [GAME_TYPE_VALUE_ENUM.esports]: 'material-symbols:sports-esports',
    [GAME_TYPE_VALUE_ENUM.crypto]: 'streamline-ultimate:virtual-coin-crypto-ethereum-bold',
    [GAME_TYPE_VALUE_ENUM.fish]: 'tdesign:fish-filled',
  });

  const activeTab = ref<string>(GAME_CUSTOM.KEY);

  const tabs = computed(() => {
    return Object.entries({ [GAME_CUSTOM.KEY]: GAME_CUSTOM.VALUE, ...GAME_TYPE_VALUE_ENUM }).map(
      ([key, value]) => ({
        label: i18n.t(`game.${key}`),
        value: key,
        icon: tabIconMap[value],
      }),
    );
  });

  const flattenCache = shallowRef(new Map<string, (ProviderItem & ChildGameItem)[]>());
  const currentGames = computed<(ProviderItem & ChildGameItem)[]>(() => {
    const mapping = store.getGameList?.mapping;
    if (!mapping) return [];

    // gameLobby 本身不用走 data
    if (activeTab.value === GAME_CUSTOM.KEY) return [];

    const key = activeTab.value;
    const raw = (mapping as any)?.[key];

    // 沒資料直接回空
    if (!raw) return [];

    // childGame 類型需要 flatten（只在該 tab 被打開時做一次）
    const gameTypeValue = (GAME_TYPE_VALUE_ENUM as any)[key] ?? null;
    const needFlatten = gameTypeValue != null && isChildGameType(gameTypeValue);

    if (!needFlatten) {
      // 非 child 類型：直接用原本陣列（不要複製）
      return Array.isArray(raw) ? raw : [];
    }

    // child 類型：做 flatten cache，避免切回來又重算
    const cached = flattenCache.value.get(key);
    if (cached) return cached;

    const flattened = Array.isArray(raw) ? raw.flatMap((p: any) => p.childGame ?? []) : [];

    flattenCache.value.set(key, flattened);
    return flattened;
  });

  // 當 store mapping 換引用時，清 cache（避免拿到舊資料）
  // 這個 watch 很輕量：只看 mapping 引用，不深層追蹤
  watch(
    () => store.getGameList?.mapping,
    () => (flattenCache.value = new Map()),
  );

  /** ===== Grid 顯示更多（只渲染 slice） ===== */
  const DEFAULT_SHOW = 50;
  const STEP = 50;

  const shownCount = ref<number>(DEFAULT_SHOW);
  watch(activeTab, () => {
    shownCount.value = DEFAULT_SHOW;
  });

  const totalCount = computed(() => currentGames.value.length);
  const visibleGames = computed(() => currentGames.value.slice(0, shownCount.value));
  const canShowMore = computed(() => totalCount.value > shownCount.value);

  function showMore() {
    shownCount.value += STEP;
  }

  function onClickGame(game: ProviderItem & ChildGameItem) {
    console.log('click game:', game);
  }
</script>
