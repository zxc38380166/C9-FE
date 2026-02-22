import moment from 'moment-timezone';

/** 通用格式化工具 hook */
export const utsFormat = () => {
  /** 通用數字格式化（千分位 + 小數位控制） */
  const formatNumber = (
    val: string | number,
    minDecimals = 0,
    maxDecimals = 2,
  ): string => {
    const n = Number(val || 0);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    });
  };

  /** 固定 2 位小數的金額格式化 */
  const formatAmount = (val: string | number): string =>
    formatNumber(val, 2, 2);

  /** 日期 YYYY/MM/DD（可帶格式參數） */
  const formatDate = (dateStr: string, fmt = 'YYYY/MM/DD'): string => {
    if (!dateStr) return '-';
    const m = moment(dateStr);
    return m.isValid() ? m.format(fmt) : dateStr;
  };

  /** YYYY-MM-DD HH:mm */
  const formatDateTime = (dateStr: string): string => {
    if (!dateStr) return '-';
    const m = moment(dateStr);
    return m.isValid() ? m.format('YYYY-MM-DD HH:mm') : '-';
  };

  /** MM/DD 截止（優惠卡片用） */
  const formatDateShort = (dateStr: string): string => {
    if (!dateStr) return '-';
    const m = moment(dateStr);
    return m.isValid() ? m.format('MM/DD') + ' 截止' : dateStr;
  };

  /** 上午/下午 HH:mm */
  const formatTime = (isoStr: string): string => {
    const m = moment(isoStr);
    return m.isValid() ? m.format('A hh:mm') : isoStr;
  };

  return { formatNumber, formatAmount, formatDate, formatDateTime, formatDateShort, formatTime };
};
