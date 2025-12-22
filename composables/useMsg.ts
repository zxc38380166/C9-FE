// composables/useMsg.ts
import { ElNotification } from 'element-plus';
import type { NotificationOptions, NotificationParams, NotificationHandle } from 'element-plus';

type NotifyMethod = (params?: NotificationParams) => NotificationHandle;

// 內部用：允許只給部分 options（Element Plus 實際也允許）
type LooseOptions = Partial<NotificationOptions>;

// 判斷是不是 options 物件（排除 string / VNode / function）
const isOptions = (v: unknown): v is LooseOptions => {
  return !!v && typeof v === 'object' && !Array.isArray(v);
};

const withDefault = (options: LooseOptions): LooseOptions => {
  const base = '!bg-[#16303f] !border-white/10 !border';

  return {
    ...options,
    position: options.position ?? 'top-right',
    duration: options.duration ?? 3000,
    customClass: options.customClass ? `${options.customClass} ${base}` : base,
  };
};

export function useMsg() {
  const show: NotifyMethod = (params?: NotificationParams) => {
    if (params === undefined) {
      return ElNotification({ position: 'top-right', duration: 3000 });
    }

    // string / VNode / (() => VNode)
    if (!isOptions(params)) {
      return ElNotification(withDefault({ message: params as any }) as any);
    }

    // options
    return ElNotification(withDefault(params) as any);
  };

  const success: NotifyMethod = (params?: NotificationParams) => {
    if (params === undefined) {
      return ElNotification.success({ position: 'top-right', duration: 3000 });
    }
    if (!isOptions(params)) {
      return ElNotification.success(withDefault({ message: params as any }) as any);
    }
    return ElNotification.success(withDefault(params) as any);
  };

  const warning: NotifyMethod = (params?: NotificationParams) => {
    if (params === undefined) {
      return ElNotification.warning({ position: 'top-right', duration: 3000 });
    }
    if (!isOptions(params)) {
      return ElNotification.warning(withDefault({ message: params as any }) as any);
    }
    return ElNotification.warning(withDefault(params) as any);
  };

  const info: NotifyMethod = (params?: NotificationParams) => {
    if (params === undefined) {
      return ElNotification.info({ position: 'top-right', duration: 3000 });
    }
    if (!isOptions(params)) {
      return ElNotification.info(withDefault({ message: params as any }) as any);
    }
    return ElNotification.info(withDefault(params) as any);
  };

  const error: NotifyMethod = (params?: NotificationParams) => {
    if (params === undefined) {
      return ElNotification.error({ position: 'top-right', duration: 3000 });
    }
    if (!isOptions(params)) {
      return ElNotification.error(withDefault({ message: params as any }) as any);
    }
    return ElNotification.error(withDefault(params) as any);
  };

  const closeAll = () => ElNotification.closeAll();

  return {
    show,
    success,
    warning,
    info,
    error,
    closeAll,
  };
}
