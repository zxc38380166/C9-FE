export const useMainStore = defineStore('main', () => {
  // State
  const doms: any = ref({});

  // Actions
  const actions = {
    setDoms(params: any) {
      doms.value = params;
    },
  };

  // Getters
  const getters = {
    getDoms: computed(() => doms.value),
  };

  return {
    ...actions,
    ...getters,
  };
});
