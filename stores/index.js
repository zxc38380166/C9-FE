export const useMainStore = defineStore('main', () => {
  // State
  const userDetail = ref({
    test: '1234123',
  });

  // Actions
  const actions = {
    setUserDetail(params) {
      userDetail.value = params;
    },
  };

  // Getters
  const getters = {
    getUserDetail: computed(() => userDetail.value),
  };

  return {
    ...actions,
    ...getters,
  };
});
