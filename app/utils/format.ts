/** 通用數字格式化（千分位 + 小數位控制） */
export const formatNumber = (
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
export const formatAmount = (val: string | number): string =>
  formatNumber(val, 2, 2);

/** zh-TW 日期（預設 YYYY/MM/DD，可擴展 options） */
export const formatDate = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options,
    });
  } catch {
    return dateStr;
  }
};

/** YYYY-MM-DD HH:mm 格式 */
export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** MM/DD 截止（優惠卡片用） */
export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    return (
      new Date(dateStr).toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
      }) + ' 截止'
    );
  } catch {
    return dateStr;
  }
};

/** zh-TW 時間（上午/下午 HH:mm） */
export const formatTime = (isoStr: string): string => {
  try {
    return new Date(isoStr).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoStr;
  }
};
