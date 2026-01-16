export const useMainStore = defineStore('main', () => {
  // State
  const isReady: Ref<boolean> = ref(false);
  const isLoading: Ref<boolean> = ref(false);
  const doms: any = ref({});
  const userDetail: any = ref({});
  const enums: any = ref({});

  // Actions
  const actions = {
    setDoms(params: any) {
      doms.value = params;
    },
    setUserDetail(params: any) {
      userDetail.value = params;
    },
    setIsReady(params: boolean) {
      isReady.value = params;
    },
    setIsRoading(params: boolean) {
      isLoading.value = params;
    },
    setEnums(params: any) {
      enums.value = params;
    },
  };

  // Getters
  const getters = {
    getDoms: computed(() => doms.value),
    getUserDetail: computed(() => userDetail.value),
    getIsReady: computed(() => isReady.value),
    getIsRoading: computed(() => isLoading.value),
    getEnums: computed(() => enums.value),
  };

  return {
    ...actions,
    ...getters,
  };
});
