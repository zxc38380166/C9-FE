export function useLayout() {
  const i18n = useI18n();
  const store = useStore();

  const loginModalOpen = useState('loginModalOpen', () => false);
  const openLoginModal = () => {
    loginModalOpen.value = true;
  };

  const loginThirdParty = () => {
    console.log(store.getLoginConfig, 'asdf');
  };

  return {
    loginModalOpen,
    openLoginModal,
    loginThirdParty,
  };
}
