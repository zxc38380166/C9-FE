import type { ProviderItem, ChildGameItem } from '~/app.vue';

export function useGame() {
  const store = useStore();
  const i18n = useI18n();

  const GAME_TYPE_VALUE_ENUM = {
    sports: 1,
    slot: 2,
    live: 3,
    lottery: 4,
    chess: 5,
    esports: 8,
    crypto: 9,
    fish: 10,
  };

  const GAME_TYPE_KEY_ENUM = {
    3: 'live',
    2: 'slot',
    5: 'chess',
    4: 'lottery',
    8: 'esports',
    9: 'crypto',
    1: 'sports',
    10: 'fish',
  };

  const isChildGameType = (gameType: number) =>
    [
      GAME_TYPE_VALUE_ENUM.slot,
      GAME_TYPE_VALUE_ENUM.chess,
      GAME_TYPE_VALUE_ENUM.crypto,
      GAME_TYPE_VALUE_ENUM.fish,
    ].includes(gameType);

  const filterGameList = (result: any, config: any) => {};

  const mapGameList = (list = [], config = {}) => {
    let result: any = list;
    const options = Object.keys(config);
    const someOptions = (data: any) => data.some((key: any) => options.includes(key));

    const hasFilter = someOptions(['selectCode', 'search']);

    if (hasFilter) result = filterGameList(result, config);

    return result;
  };

  const getGameMappingImg = (item: ProviderItem & ChildGameItem) => {
    const productId = item?.productId;
    const code = item.game_code ?? item.gameCode;
    const replaceUs = [''];
    const cacheGameCode: string[] = [];
    const isCache = cacheGameCode.includes(item?.gameCode);
    const typePath = productId ? 'gameChild' : 'gameCover';
    const filePath = isCache ? `${code}_clone` : code || '';
    const langPath = replaceUs.includes(i18n.locale.value) ? 'en-US' : i18n.locale.value;
    const fileName = productId ? productId : code;
    return `https://pub-c2058afe93ef4c4b97216a2bd33562a7.r2.dev/games/${typePath}/${filePath}/${langPath.replace('zh-TW', 'TW')}/${fileName}.webp`;
  };

  return {
    mapGameList,
    getGameMappingImg,
    GAME_TYPE_VALUE_ENUM,
    GAME_TYPE_KEY_ENUM,
    isChildGameType,
  };
}
