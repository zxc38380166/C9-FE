const randomCache = new Map();

/**
 * 會根據唯一 key（game_code）回傳固定的亂數，並緩存起來
 */
export default function getRandomNumber(min, max, key) {
  if (!randomCache.has(key)) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    randomCache.set(key, value);
  }
  return randomCache.get(key);
}
