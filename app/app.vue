<template>
  <div>
    <UApp :toaster="{ position: 'top-right' }">
      <NuxtLayout :name="useConfig().layout">
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
<script setup lang="ts">
  import childGame from './assets/game/childGame';
  usePreventZoom();

  const store = useStore();
  const { isLogin } = useAuth();
  const { GAME_TYPE_VALUE_ENUM, isChildGameType } = useGame();

  try {
    const defaultPromise = [
      useApi().getGameProviderSsr({}), //
      useApi().getEnumsSsr({}),
    ];

    const loginPromise = [
      useApi().getUserDetailSsr({}), //
      useApi().getCountryCodesSsr({}),
    ];

    const promiseList = [
      ...defaultPromise, //
      ...(isLogin.value ? loginPromise : []),
    ] as const;

    const [gameProviderRes, enumsRes, userDetailRes, countryCodesRes] =
      await Promise.all(promiseList);

    const userDetail = userDetailRes?.data?.value?.result;
    const countryCodes = countryCodesRes?.data?.value?.result;
    const enums = enumsRes?.data?.value?.result;
    const provider = gameProviderRes?.data?.value?.result;

    if (userDetail) store.setUserDetail(userDetail);
    if (countryCodes) store.setCountryCodes(countryCodes);
    if (enums) store.setEnums(enums);
    if (provider) {
      const gameList: GameListResult = (provider as ProviderItem[]).reduce<GameListResult>(
        (result, item) => {
          result.provider.push(item);
          if (item.enable) result.enable.push(item.gameCode);
          if (item.areaBlock) result.areaBlock.push(item.gameCode);
          if (item.maintain) result.maintain.push(item.gameCode);

          const isChild = isChildGameType(item.gameType);

          Object.entries(GAME_TYPE_VALUE_ENUM).forEach(([key, value]) => {
            const k = key as GameTypeKey;
            if (!result.mapping[k]) result.mapping[k] = [];
            if (value === item.gameType) {
              if (isChild) {
                const hasOwnProperty = Object.prototype.hasOwnProperty.call(
                  childGame,
                  item.gameCode,
                );
                item.childGame = hasOwnProperty ? childGame[item.gameCode as ChildGameKey] : [];
              }
              result.mapping[k]!.push(item);
            }
          });

          return result;
        },
        { mapping: {}, areaBlock: [], maintain: [], enable: [], provider: [] },
      );

      store.setGameList(gameList);
    }

    store.setIsReady(true);
  } catch (err) {
    console.error('[prefetch] failed', err);
  }
</script>
