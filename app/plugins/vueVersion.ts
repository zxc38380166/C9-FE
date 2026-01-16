import type { AsyncComponentLoader } from "vue";
import { defineAsyncComponent } from "vue";
import getConfig, { LAYOUT_ENUM } from "../composables/useConfig";

declare global {
  function vueVersion(layoutMap: Record<string, AsyncComponentLoader>): {
    is: ReturnType<typeof defineAsyncComponent>;
  };
}

export default defineNuxtPlugin(({ provide }) => {
  const hostname = import.meta.client
    ? window.location.hostname
    : useRequestURL().hostname;
  provide("hostname", hostname);

  globalThis.vueVersion = (layoutMap) => {
    const config = getConfig(hostname);
    const defaultVersion = LAYOUT_ENUM.a1.toLocaleUpperCase();
    const currentVersion = config.layout;
    const layout = currentVersion?.toUpperCase() || defaultVersion;
    const loader = layoutMap[layout] ?? layoutMap[defaultVersion];

    if (!loader) throw new Error(`[vueVersion] Layout "${layout}" not found`);
    const is = defineAsyncComponent(loader);

    return { is };
  };
});
