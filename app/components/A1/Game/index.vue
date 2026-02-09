<template>
  <div class="space-y-4">
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        shortcut="shift_s"
        :files="searchFiles"
        :navigation="searchNavigation"
        :links="searchLinks"
        :color-mode="false"
        :fuse="{ resultLimit: 40 }" />
      <A1LayoutCarousel />
      <UContentSearchButton
        :collapsed="false"
        :label="'快速查詢遊戲'"
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
            <div v-show="activeTab === GAME_PROVIDER.KEY">
              <A1GameProvider />
            </div>
            <div
              v-show="![GAME_CUSTOM.KEY, GAME_PROVIDER.KEY].includes(activeTab)"
              class="space-y-4">
              <template v-if="visibleGames.length">
                <div
                  class="grid w-full gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-10 2xl:grid-cols-12">
                  <template v-for="game in visibleGames" :key="getGameMappingImg(game)">
                    <button
                      v-if="!errImg.isErr(getGameMappingImg(game))"
                      type="button"
                      class="group w-full overflow-hidden rounded-2xl"
                      @click="onClickGame(game)">
                      <div class="relative cursor-pointer">
                        <NuxtImg
                          :src="getGameMappingImg(game)"
                          :alt="getGameMappingImg(game)"
                          @error="errImg.onError(getGameMappingImg(game))"
                          class="w-full h-auto group-hover:scale-[1.06] transition-transform duration-300"
                          loading="lazy" />
                      </div>
                    </button>
                  </template>
                </div>
                <A1GameLoadMore
                  v-model="shownCount"
                  :total="totalCount"
                  :step="STEP"
                  @load="onLoadMore" />
              </template>
              <A1GameEmpty v-else />
            </div>
          </div>
        </template>
      </UTabs>
    </ClientOnly>
    <A1GameRankList v-show="activeTab !== GAME_PROVIDER.KEY" />
  </div>
</template>
<script setup lang="ts">
  const i18n = useI18n();
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  const { GAME_TYPE_VALUE_ENUM, isChildGameType, getGameMappingImg, getGameName, errImg } =
    useGame();

  const GAME_CUSTOM = { KEY: 'gameLobby', VALUE: 0 };
  const GAME_PROVIDER = { KEY: 'gameProvider', VALUE: -1 };

  const tabIconMap = reactive({
    [GAME_CUSTOM.VALUE]: 'material-symbols:view-list-sharp',
    [GAME_PROVIDER.VALUE]: 'material-symbols:business-center-outline',
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
    const base = {
      [GAME_CUSTOM.KEY]: GAME_CUSTOM.VALUE,
      ...GAME_TYPE_VALUE_ENUM,
      [GAME_PROVIDER.KEY]: GAME_PROVIDER.VALUE,
    };

    return Object.entries(base).map(([key, value]) => ({
      label: i18n.t(`game.${key}`),
      value: key,
      icon: tabIconMap[value],
    }));
  });

  watch(
    () => route.query.tab,
    (tabRaw) => {
      const tab = Array.isArray(tabRaw) ? tabRaw[0] : tabRaw;
      if (typeof tab !== 'string') return;
      if (tab in GAME_TYPE_VALUE_ENUM) activeTab.value = tab;
    },
    { immediate: true },
  );

  const flattenCache = shallowRef(new Map<string, (ProviderItem & ChildGameItem)[]>());
  const currentGames = computed<(ProviderItem & ChildGameItem)[]>(() => {
    const mapping = store.getGameList?.mapping;
    if (!mapping) return [];
    // gameLobby 本身不用走 data
    if (activeTab.value === GAME_CUSTOM.KEY) return [];
    if (activeTab.value === GAME_PROVIDER.KEY) return [];

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

  watch(
    () => store.getGameList?.mapping,
    () => (flattenCache.value = new Map()),
  );

  const DEFAULT_SHOW = 50;
  const STEP = 50;
  const shownCount = ref<number>(DEFAULT_SHOW);
  watch(
    activeTab,
    async (tab) => {
      shownCount.value = DEFAULT_SHOW;
      const current = Array.isArray(route.query.tab) ? route.query.tab[0] : route.query.tab;
      if (current === tab) return;
      await router.replace({
        path: route.path,
        query: { ...route.query, tab },
      });
    },
    { immediate: true, flush: 'post' },
  );

  const totalCount = computed(() => currentGames.value.length);
  const visibleGames = computed(() => currentGames.value.slice(0, shownCount.value));
  const onLoadMore = (payload: LoadMorePayload) => {};
  const onClickGame = (game: ProviderItem & ChildGameItem) => {};

  const searchTerm = ref('');
  const { data: searchNavigation } = await useAsyncData('navigation', () =>
    queryCollectionNavigation('content'),
  );
  const { data: searchFiles } = useLazyAsyncData(
    'search',
    () => queryCollectionSearchSections('content'),
    { server: false },
  );

  const searchLinks = computed(() => {
    const mapping = Object.entries(store.getGameList?.mapping ?? {}).map(([key, item]) => {
      return {
        label: i18n.t(`game.${key}`),
        icon: tabIconMap[GAME_TYPE_VALUE_ENUM[key as GameTypeKey]],
        to: { path: route.path, query: { ...route.query, tab: key } },
        children: item?.map(({ childGame, gameCode }) => {
          const hasChildGame = Array.isArray(childGame) && childGame.length;
          const result = hasChildGame
            ? childGame.map((gameItem: ChildGameItem) => {
                return {
                  label: getGameName(gameItem),
                };
              })
            : [];

          return { label: String(gameCode).toUpperCase(), children: result };
        }),
      };
    });

    return mapping;
  });
</script>
