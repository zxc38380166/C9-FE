export const useMainStore = defineStore('main', () => {
  // State
  const doms: any = ref({});
  const userDetail: any = ref({});

  // Actions
  const actions = {
    setDoms(params: any) {
      doms.value = params;
    },
    setUserDetail(params: any) {
      userDetail.value = params;
    },
  };

  // Getters
  const getters = {
    getDoms: computed(() => doms.value),
    getUserDetail: computed(() => userDetail.value),
  };

  return {
    ...actions,
    ...getters,
  };
});
