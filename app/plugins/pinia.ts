import { useMainStore } from '@/stores';

declare global {
  function useStore(): ReturnType<typeof useMainStore>;
}

export default defineNuxtPlugin(() => {
  globalThis.useStore = () => useMainStore();
});
