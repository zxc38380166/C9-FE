/** 優惠活動相關常數 hook */
export const utsPromo = () => {
  const { t } = useI18n();

  /** 優惠 tag key → UBadge color */
  const TAG_COLOR_MAP: Record<string, 'error' | 'warning' | 'success' | 'info' | 'neutral'> = {
    limited: 'error',
    daily: 'warning',
    recommended: 'success',
    vip: 'info',
    sports: 'success',
    event: 'warning',
    beginner: 'info',
    deposit: 'success',
  };

  /** 優惠 tag key → 顯示文字 */
  const TAG_LABEL_MAP: Record<string, string> = {
    limited: t('promo.tag.limited'),
    daily: t('promo.tag.daily'),
    recommended: t('promo.tag.recommended'),
    vip: t('promo.tag.vip'),
    sports: t('promo.tag.sports'),
    event: t('promo.tag.event'),
    beginner: t('promo.tag.beginner'),
    deposit: t('promo.tag.deposit'),
  };

  const getTagColor = (tag: string) =>
    (TAG_COLOR_MAP[tag] || 'neutral') as any;

  const getTagLabel = (tag: string) =>
    TAG_LABEL_MAP[tag] || tag;

  /** 優惠條件類型 → 顯示文字 */
  const CONDITION_MAP: Record<string, string> = {
    none: t('promo.condition.none'),
    first_deposit: t('promo.condition.firstDeposit'),
    deposit_threshold: t('promo.condition.depositThreshold'),
    vip_level: t('promo.condition.vipLevel'),
  };

  return { TAG_COLOR_MAP, TAG_LABEL_MAP, getTagColor, getTagLabel, CONDITION_MAP };
};
