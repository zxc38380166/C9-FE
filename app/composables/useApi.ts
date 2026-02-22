import { HTTP_METHOD, type UseHttpOptions } from './useHttp';

type Opts = Partial<UseHttpOptions>;

export default function () {
    return {
      login: (payload: any, opts?: Opts) => useHttp('/api/auth/login', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      register: (payload: any, opts?: Opts) => useHttp('/api/auth/register', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      getGameProviderCsr: (payload: any, opts?: Opts) => useHttp('/api/game/provider', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      getGameProviderSsr: (payload: any, asyncOptions?: any) => useHttpAsync(`game-provider:${JSON.stringify(payload ?? {})}`, '/api/game/provider', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),
      getUserDetailSsr: (payload: any, asyncOptions?: any) => useHttpAsync(`user-detail:${JSON.stringify(payload ?? {})}`, '/api/auth/user-detail', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),
      getCountryCodesSsr: (payload: any, asyncOptions?: any) => useHttpAsync(`country-codes:${JSON.stringify(payload ?? {})}`, '/api/auth/country-codes', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),
      getLoginConfigSsr: (payload: any, asyncOptions?: any) => useHttpAsync(`login-config:${JSON.stringify(payload ?? {})}`, '/api/auth/login-config', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),
      getUserDetailCsr: (payload: any, opts?: Opts) => useHttp('/api/auth/user-detail', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      getEnumsSsr: (payload: any, asyncOptions?: any) => useHttpAsync(`enums:${JSON.stringify(payload ?? {})}`, '/api/common/enums', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),
      getEnumsCsr: (payload: any, opts?: Opts) => useHttp('/api/common/enums', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      sendVerifyEmail: (payload: any, opts?: Opts) => useHttp('/api/auth/send-verify-email', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      checkVerifyEmail: (payload: any, opts?: Opts) => useHttp('/api/auth/check-verify-email', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      sendVerifyMobile: (payload: any, opts?: Opts) => useHttp('/api/auth/send-verify-email', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      generateGoogleAuth: (payload?: any, opts?: Opts) => useHttp('/api/auth/generate-google-auth', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      enableGoogleAuth: (payload?: any, opts?: Opts) => useHttp('/api/auth/enable-google-auth', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      editPassword: (payload?: any, opts?: Opts) => useHttp('/api/auth/edit-password', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      loginGoogle: (payload?: any, opts?: Opts) => useHttp('/api/auth/login-google', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      getExchangeRate: (payload?: any, opts?: Opts) => useHttp('/api/deposit/exchange-rate', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      getBankCards: (payload?: any, opts?: Opts) => useHttp('/api/wallet/bank-card/list', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      addBankCard: (payload: any, opts?: Opts) => useHttp('/api/wallet/bank-card/add', { method: HTTP_METHOD.POST, body: payload, json: false, ...opts }),
      deleteBankCard: (id: number, opts?: Opts) => useHttp(`/api/wallet/bank-card/${id}`, { method: HTTP_METHOD.DELETE, ...opts }),
      getVendorChannels: (payload?: any, opts?: Opts) => useHttp('/api/vendor/channels', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      getDepositChannels: (payload?: any, opts?: Opts) => useHttp('/api/deposit/channels', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      deposit: (payload: any, opts?: Opts) => useHttp('/api/deposit', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      getCreditCards: (payload?: any, opts?: Opts) => useHttp('/api/wallet/credit-card/list', { method: HTTP_METHOD.GET, body: payload, ...opts }),
      addCreditCard: (payload: any, opts?: Opts) => useHttp('/api/wallet/credit-card/add', { method: HTTP_METHOD.POST, body: payload, ...opts }),
      deleteCreditCard: (id: number, opts?: Opts) => useHttp(`/api/wallet/credit-card/${id}`, { method: HTTP_METHOD.DELETE, ...opts }),
    };
  }
