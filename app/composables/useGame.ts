import childGame from '../assets/game/childGame';

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

export type ProviderLogoItem = { name: string; logo: string };
export type ProviderItem = {
  gameCode: string;
  gameType: number;
  enable: boolean;
  areaBlock: boolean;
  maintain: boolean;
  childGame?: ChildGameValue;
};

export type ChildGameMap = typeof childGame;
export type ChildGameKey = keyof ChildGameMap;
export type ChildGameValue = ChildGameMap[ChildGameKey];
export type ChildGameItem = ChildGameValue[number];
export type GameTypeKey = keyof typeof GAME_TYPE_VALUE_ENUM;

export type GameListResult = {
  mapping: Partial<Record<GameTypeKey, ProviderItem[]>>;
  areaBlock: string[];
  maintain: string[];
  enable: string[];
  provider: ProviderItem[];
};

export type LoadMorePayload = {
  prevCount: number;
  nextCount: number;
  total: number;
  step: number;
};

export function useGame() {
  const store = useStore();
  const i18n = useI18n();

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

  const provider: { name: string; logo: string }[] = [
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
  ];

  return {
    mapGameList,
    getGameMappingImg,
    isChildGameType,
    GAME_TYPE_VALUE_ENUM,
    GAME_TYPE_KEY_ENUM,
    provider,
  };
}
