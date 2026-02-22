/** 銀行卡審核狀態常數 hook */
export const utsBankCard = () => {
  const { t } = useI18n();

  /** 審核狀態 → 標籤 & 顏色（0=待審核, 1=已通過, 2=已拒絕） */
  const STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
    0: { label: t('bankCard.status.pending'), color: 'warning' },
    1: { label: t('bankCard.status.approved'), color: 'success' },
    2: { label: t('bankCard.status.rejected'), color: 'error' },
  };

  return { STATUS_MAP };
};
