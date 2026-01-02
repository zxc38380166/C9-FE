import hotGame from '~/assets/game/hotGame';
import childGame from '~/assets/game/childGame';
import config, { LAYOUT_ENUM } from '~/site.config';

export default function () {
  const store = useStore();
  const i18n = useI18n();
  const version = config().layout;

  const isChildGameType = (type = null) => {
    if (!type) return true;
    return [
      store.getEnums.game.GAME_TYPE.SLOTS,
      store.getEnums.game.GAME_TYPE.CHESS,
      store.getEnums.game.GAME_TYPE.CRYPTO,
      store.getEnums.game.GAME_TYPE.FISH,
    ].includes(type);
  };

  const LANG_INCLUDES_ENUM = ['zh-CN', 'zh-TW'];
  const getGameMappingImg = (item: any) => {
    const versionCustom: Record<string, string[]> = {
      [LAYOUT_ENUM.a1]: [],
      [LAYOUT_ENUM.a2]: [],
    };
    const langPath = LANG_INCLUDES_ENUM.includes(i18n.locale.value) ? i18n.locale.value : 'en-US';

    const cacheGameCode: Array<string> = [];
    const isCache = cacheGameCode.includes(item?.game_code);
    const typePath = isChildGameType(item?.game_type) ? 'childGame' : 'coverGame';
    const fileName = isChildGameType(item?.game_type) ? item?.productId : item?.game_code;
    const filePath = isCache ? `${item?.game_code}_clone` : item?.game_code || '';
    const customPath = (versionCustom?.[version]?.includes(item?.game_code) && `/${version}`) || '';
    return `${useImg().url}/game${customPath}/${typePath}/${filePath}/${langPath}/${fileName}.webp`;
  };

  return { hotGame, childGame, getGameMappingImg, isChildGameType };
}
