export function useLayout() {
  const i18n = useI18n();
  const store = useStore();

  const loginThirdParty = () => {
    console.log(store.getLoginConfig, 'asdf');
  };

  return {
    loginThirdParty,
  };
}
