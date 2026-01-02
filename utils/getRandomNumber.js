const keyToNumberMap = new Map();
const usedNumbers = new Set();

/**
 * 根據 key 取得「全域唯一、不重複」的亂數
 * - 同一 key：永遠回傳同一個數字
 * - 不同 key：盡量不重複
 * - 超出範圍：自動 fallback（不丟錯，UI 不炸）
 */
const getUniqueRandomNumber = (min, max, key) => {
  if (import.meta.server) return '';

  // ✅ 只擋 undefined / null
  if (key === undefined || key === null) {
    throw new Error('key is required');
  }

  const cacheKey = String(key);

  // 已經算過
  if (keyToNumberMap.has(cacheKey)) {
    return keyToNumberMap.get(cacheKey);
  }

  const rangeSize = max - min + 1;

  // ✅ 唯一數已用完 → fallback（不 throw）
  if (usedNumbers.size >= rangeSize) {
    const fallback = deterministicNumber(min, max, cacheKey);
    keyToNumberMap.set(cacheKey, fallback);
    return fallback;
  }

  let value;
  do {
    value = Math.floor(Math.random() * rangeSize) + min;
  } while (usedNumbers.has(value));

  keyToNumberMap.set(cacheKey, value);
  usedNumbers.add(value);

  return value;
};

/**
 * deterministic fallback（SSR / CSR 一致）
 */
const deterministicNumber = (min, max, seed) => {
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const range = max - min + 1;
  return min + (Math.abs(hash) % range);
};

export default getUniqueRandomNumber;
