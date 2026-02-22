import { useEventListener } from '@vueuse/core';

/**
 * iOS Safari / Mobile 瀏覽器：阻止雙擊放大、雙指縮放
 */
export function usePreventZoom(): void {
  let lastTouchEnd = 0;

  /** 雙擊放大防止 */
  useEventListener(document, 'touchend', (event: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
    if (event.touches && event.touches.length >= 2) event.preventDefault();
  }, { passive: false });

  /** 雙指縮放防止 */
  useEventListener(document, 'gesturestart', (event) => {
    event.preventDefault();
  }, { passive: false });

  useEventListener(document, 'gesturechange', (event) => {
    event.preventDefault();
  }, { passive: false });

  /** 防止雙指拖曳放大 */
  useEventListener(document, 'touchstart', (event: TouchEvent) => {
    if (event.touches.length >= 2) event.preventDefault();
  }, { passive: false });

  useEventListener(document, 'touchmove', (event: TouchEvent) => {
    if (event.touches.length >= 2) event.preventDefault();
  }, { passive: false });
}
