import type { AsyncComponentLoader } from 'vue';
import { defineAsyncComponent } from 'vue';
import getConfig, { LAYOUT_ENUM } from '~/site.config';

declare global {
  function vueVersion(layoutMap: Record<string, AsyncComponentLoader>): {
    is: ReturnType<typeof defineAsyncComponent>;
  };
}

export default defineNuxtPlugin(({ provide }) => {
  const hostname = import.meta.client ? window.location.hostname : useRequestURL().hostname;
  console.log(hostname, 'hostname');

  provide('hostname', hostname);
  globalThis.vueVersion = (layoutMap) => {
    const config = getConfig(hostname);
    console.log(config, 'config');

    const defaultVersion = LAYOUT_ENUM.a1.toLocaleUpperCase();
    const currentVersion = config.layout;
    console.log(currentVersion, 'currentVersion');

    const layout = currentVersion?.toUpperCase() || defaultVersion;
    const loader = layoutMap[layout] ?? layoutMap[defaultVersion];
    console.log(layoutMap, 'layoutMap');

    if (!loader) throw new Error(`[vueVersion] Layout "${layout}" not found`);
    const is = defineAsyncComponent(loader);

    return { is };
  };
});
