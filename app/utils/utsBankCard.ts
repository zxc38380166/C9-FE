/** 銀行卡審核狀態常數 hook */
export const utsBankCard = () => {
  /** 審核狀態 → 標籤 & 顏色（0=待審核, 1=已通過, 2=已拒絕） */
  const STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
    0: { label: '待審核', color: 'warning' },
    1: { label: '已通過', color: 'success' },
    2: { label: '已拒絕', color: 'error' },
  };

  return { STATUS_MAP };
};
