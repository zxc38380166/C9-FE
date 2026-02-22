/** 優惠活動 tag → UBadge color */
export const PROMO_TAG_COLOR_MAP: Record<string, 'error' | 'warning' | 'success' | 'info' | 'neutral'> = {
  '限時': 'error',
  '每日': 'warning',
  '推薦': 'success',
  'VIP': 'info',
  '體育': 'success',
  '賽事': 'warning',
  '新手': 'info',
  '存款': 'success',
};

export const getPromoTagColor = (tag: string) =>
  (PROMO_TAG_COLOR_MAP[tag] || 'neutral') as any;

/** 優惠條件類型 → 顯示文字 */
export const PROMO_CONDITION_MAP: Record<string, string> = {
  none: '無條件',
  first_deposit: '首次存款',
  deposit_threshold: '存款門檻',
  vip_level: 'VIP 等級',
};
