import type {
  UserDetail,
  CountryCode,
  EnumsResult,
  LoginConfigResult,
} from '~/composables/useApiTypes';

export const useMainStore = defineStore('main', () => {
  // State
  const isReady = ref(false);
  const isLoading = ref(false);
  const doms = ref<Record<string, any>>({});
  const userDetail = ref<Partial<UserDetail>>({});
  const enums = ref<Partial<EnumsResult>>({});
  const countryCodes = ref<CountryCode[]>([]);
  const gameList: Ref<GameListResult> = ref({
    areaBlock: [],
    enable: [],
    maintain: [],
    mapping: {},
    provider: [],
  });
  const loginConfig = ref<LoginConfigResult>({ google: '' });

  // Actions
  const actions = {
    setDoms(params: Record<string, any>) {
      doms.value = params;
    },
    setUserDetail(params: Partial<UserDetail>) {
      userDetail.value = params;
    },
    setIsReady(params: boolean) {
      isReady.value = params;
    },
    setIsRoading(params: boolean) {
      isLoading.value = params;
    },
    setEnums(params: Partial<EnumsResult>) {
      enums.value = params;
    },
    setCountryCodes(params: CountryCode[]) {
      countryCodes.value = params;
    },
    setGameList(params: GameListResult) {
      gameList.value = params;
    },
    setLoginConfig(params: LoginConfigResult) {
      loginConfig.value = params;
    },
  };

  // Getters
  const getters = {
    getDoms: computed(() => doms.value),
    getUserDetail: computed(() => userDetail.value),
    getIsReady: computed(() => isReady.value),
    getIsRoading: computed(() => isLoading.value),
    getEnums: computed(() => enums.value),
    getCountryCodes: computed(() => countryCodes.value),
    getGameList: computed(() => gameList.value),
    getLoginConfig: computed(() => loginConfig.value),
  };

  return {
    ...actions,
    ...getters,
  };
});
