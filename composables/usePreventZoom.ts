type GestureEventName = 'gesturestart' | 'gesturechange';
type PreventZoomEventName = 'touchstart' | 'touchmove' | 'touchend' | GestureEventName;
type TouchHandler = (event: TouchEvent) => void;
type GestureHandler = (event: Event) => void;

/**
 * iOS Safari / Mobile 瀏覽器：阻止雙擊放大、雙指縮放
 */
export function usePreventZoom(): void {
  let lastTouchEnd = 0;

  /** 全部事件集中管理（TS 版） */
  const eventList: Record<PreventZoomEventName, TouchHandler | GestureHandler> = {
    /** 雙擊放大防止 */
    touchend: (event: TouchEvent) => {
      const now = Date.now();

      // 若為雙擊（兩次 touchend 間隔 < 300ms）
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;

      // touchend 的 touches 通常是 0，真正要看可以用 changedTouches
      // 若同時有兩指以上觸控 → 阻止縮放
      if (event.touches && event.touches.length >= 2) event.preventDefault();
    },

    /** 雙指縮放防止 */
    gesturestart: (event: Event) => {
      event.preventDefault();
    },
    gesturechange: (event: Event) => {
      event.preventDefault();
    },

    /** 防止雙指拖曳放大 */
    touchstart: (event: TouchEvent) => {
      if (event.touches.length >= 2) event.preventDefault();
    },
    touchmove: (event: TouchEvent) => {
      if (event.touches.length >= 2) event.preventDefault();
    },
  };

  onMounted(() => {
    (
      Object.entries(eventList) as Array<[PreventZoomEventName, TouchHandler | GestureHandler]>
    ).forEach(([name, handler]) => {
      // 用 EventListener 讓 addEventListener 型別能接受
      document.addEventListener(name, handler as EventListener, { passive: false });
    });
  });

  onBeforeUnmount(() => {
    (
      Object.entries(eventList) as Array<[PreventZoomEventName, TouchHandler | GestureHandler]>
    ).forEach(([name, handler]) => {
      document.removeEventListener(name, handler as EventListener);
      // removeEventListener 不需要再傳 options；傳了反而可能因為參數不一致而移除失敗
    });
  });
}
