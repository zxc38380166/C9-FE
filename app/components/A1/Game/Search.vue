<template>
  <ClientOnly>
    <LazyUContentSearch
      v-model:search-term="searchTerm"
      shortcut="shift_s"
      :files="searchFiles"
      :navigation="searchNavigation"
      :links="searchLinks"
      :color-mode="false"
      :fuse="{ resultLimit: 40 }" />
  </ClientOnly>
</template>
<script setup lang="ts">
  const i18n = useI18n();
  const store = useStore();
  const { GAME_TYPE_VALUE_ENUM, getGameName } = useGame();

  const tabIconMap: Record<number, string> = {
    [GAME_TYPE_VALUE_ENUM.sports]: 'material-symbols-light:sports-volleyball',
    [GAME_TYPE_VALUE_ENUM.slot]: 'mdi:slot-machine-outline',
    [GAME_TYPE_VALUE_ENUM.live]: 'ic:twotone-live-tv',
    [GAME_TYPE_VALUE_ENUM.lottery]: 'fluent:lottery-20-filled',
    [GAME_TYPE_VALUE_ENUM.chess]: 'fluent:chess-24-filled',
    [GAME_TYPE_VALUE_ENUM.esports]: 'material-symbols:sports-esports',
    [GAME_TYPE_VALUE_ENUM.crypto]: 'streamline-ultimate:virtual-coin-crypto-ethereum-bold',
    [GAME_TYPE_VALUE_ENUM.fish]: 'tdesign:fish-filled',
  };

  const searchTerm = ref('');
  const { data: searchNavigation } = useLazyAsyncData(
    'navigation',
    () => queryCollectionNavigation('content'),
    { server: false },
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
        to: { path: '/game', query: { tab: key } },
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
