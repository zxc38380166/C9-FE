/** 銀行卡 / 加密錢包 / 信用卡審核狀態 → 標籤 & 顏色 */
export const BANK_CARD_STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
  0: { label: '待審核', color: 'warning' },
  1: { label: '已通過', color: 'success' },
  2: { label: '已拒絕', color: 'error' },
};
