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
      useApi().getLoginConfigSsr({}),
    ];

    const loginPromise = [
      useApi().getUserDetailSsr({}), //
      useApi().getCountryCodesSsr({}),
    ];

    const promiseList = [
      ...defaultPromise, //
      ...(isLogin.value ? loginPromise : []),
    ] as const;

    const [gameProviderRes, enumsRes, loginConfigRes, userDetailRes, countryCodesRes] =
      await Promise.all(promiseList);

    const userDetail = userDetailRes?.data?.value?.result;
    const countryCodes = countryCodesRes?.data?.value?.result;
    const enums = enumsRes?.data?.value?.result;
    const provider = gameProviderRes?.data?.value?.result;
    const loginConfig = loginConfigRes?.data?.value?.result;

    console.log(loginConfig, 'loginConfig');

    if (userDetail) store.setUserDetail(userDetail);
    if (countryCodes) store.setCountryCodes(countryCodes);
    if (enums) store.setEnums(enums);
    if (loginConfig) store.setLoginConfig(loginConfig);
    if (provider) {
      // 建立 gameType value → key 的反查表，避免 O(n*m) 遍歷
      const typeValueToKey = new Map<number, GameTypeKey>();
      for (const [key, value] of Object.entries(GAME_TYPE_VALUE_ENUM)) {
        typeValueToKey.set(value, key as GameTypeKey);
      }

      const gameList: GameListResult = {
        mapping: {},
        areaBlock: [],
        maintain: [],
        enable: [],
        provider: [],
      };

      for (const item of provider as ProviderItem[]) {
        gameList.provider.push(item);
        if (item.enable) gameList.enable.push(item.gameCode);
        if (item.areaBlock) gameList.areaBlock.push(item.gameCode);
        if (item.maintain) gameList.maintain.push(item.gameCode);

        const k = typeValueToKey.get(item.gameType);
        if (k) {
          if (!gameList.mapping[k]) gameList.mapping[k] = [];
          if (isChildGameType(item.gameType)) {
            item.childGame = Object.prototype.hasOwnProperty.call(childGame, item.gameCode)
              ? childGame[item.gameCode as ChildGameKey]
              : [];
          }
          gameList.mapping[k]!.push(item);
        }
      }

      store.setGameList(gameList);
    }

    store.setIsReady(true);
  } catch (err) {
    console.error('[prefetch] failed', err);
  }
</script>
