import { HTTP_METHOD, type UseHttpOptions } from './useHttp';
import type {
  ApiResponse,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  UserDetailParams,
  UserDetail,
  CountryCode,
  SendVerifyEmailPayload,
  SendVerifyMobilePayload,
  CheckVerifyEmailPayload,
  EnableGoogleAuthPayload,
  GoogleAuthResult,
  EditPasswordPayload,
  LoginConfigResult,
  LoginGooglePayload,
  LoginGoogleResult,
  GameProviderParams,
  GameProvider,
  EnumsResult,
  BankCard,
  AddCreditCardPayload,
  CreditCard,
  AddCryptoAddressPayload,
  CryptoAddress,
  VendorChannelsResult,
  ExchangeRateParams,
  ExchangeRateResult,
  DepositPayload,
  DepositOrdersParams,
  DepositOrder,
  PaginatedResult,
  PromoListParams,
  PromoItem,
  ClaimPromoResult,
  PromoClaimsParams,
  PromoClaim,
  VipLevel,
  VipRebate,
  VipStatusResult,
  RankingParams,
  RankingItem,
  BetRecordParams,
  BetRecordResult,
  BetRecordDetail,
} from './useApiTypes';

type Opts = Partial<UseHttpOptions>;

export default function () {
  return {
    // ==================== Auth ====================

    login: (payload: LoginPayload, opts?: Opts) =>
      useHttp<ApiResponse<LoginResult>>('/api/auth/login', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    register: (payload: RegisterPayload, opts?: Opts) =>
      useHttp<ApiResponse<LoginResult>>('/api/auth/register', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    getUserDetailSsr: (payload?: UserDetailParams, asyncOptions?: any) =>
      useHttpAsync<ApiResponse<UserDetail>>(`user-detail:${JSON.stringify(payload ?? {})}`, '/api/auth/user-detail', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),

    getUserDetailCsr: (payload?: UserDetailParams, opts?: Opts) =>
      useHttp<ApiResponse<UserDetail>>('/api/auth/user-detail', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getCountryCodesSsr: (payload?: Record<string, any>, asyncOptions?: any) =>
      useHttpAsync<ApiResponse<CountryCode[]>>(`country-codes:${JSON.stringify(payload ?? {})}`, '/api/auth/country-codes', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),

    getLoginConfigSsr: (payload?: Record<string, any>, asyncOptions?: any) =>
      useHttpAsync<ApiResponse<LoginConfigResult>>(`login-config:${JSON.stringify(payload ?? {})}`, '/api/auth/login-config', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),

    sendVerifyEmail: (payload: SendVerifyEmailPayload, opts?: Opts) =>
      useHttp<ApiResponse<{ id: string }>>('/api/auth/send-verify-email', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    checkVerifyEmail: (payload: CheckVerifyEmailPayload, opts?: Opts) =>
      useHttp<ApiResponse<null>>('/api/auth/check-verify-email', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    sendVerifyMobile: (payload: SendVerifyMobilePayload, opts?: Opts) =>
      useHttp<ApiResponse<{ id: string }>>('/api/auth/send-verify-mobile', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    generateGoogleAuth: (payload?: Record<string, never>, opts?: Opts) =>
      useHttp<ApiResponse<GoogleAuthResult>>('/api/auth/generate-google-auth', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    enableGoogleAuth: (payload: EnableGoogleAuthPayload, opts?: Opts) =>
      useHttp<ApiResponse<{ affected: number }>>('/api/auth/enable-google-auth', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    editPassword: (payload: EditPasswordPayload, opts?: Opts) =>
      useHttp<ApiResponse<{ affected: number }>>('/api/auth/edit-password', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    loginGoogle: (payload: LoginGooglePayload, opts?: Opts) =>
      useHttp<ApiResponse<LoginGoogleResult>>('/api/auth/login-google', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    // ==================== Game ====================

    getGameProviderCsr: (payload?: GameProviderParams, opts?: Opts) =>
      useHttp<ApiResponse<GameProvider[]>>('/api/game/provider', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getGameProviderSsr: (payload?: GameProviderParams, asyncOptions?: any) =>
      useHttpAsync<ApiResponse<GameProvider[]>>(`game-provider:${JSON.stringify(payload ?? {})}`, '/api/game/provider', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),

    // ==================== Common ====================

    getEnumsSsr: (payload?: Record<string, any>, asyncOptions?: any) =>
      useHttpAsync<ApiResponse<EnumsResult>>(`enums:${JSON.stringify(payload ?? {})}`, '/api/common/enums', { method: HTTP_METHOD.GET, params: payload }, asyncOptions),

    getEnumsCsr: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<EnumsResult>>('/api/common/enums', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== Wallet - BankCard ====================

    getBankCards: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<BankCard[]>>('/api/wallet/bank-card/list', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    addBankCard: (payload: FormData, opts?: Opts) =>
      useHttp<ApiResponse<BankCard>>('/api/wallet/bank-card/add', { method: HTTP_METHOD.POST, body: payload, json: false, ...opts }),

    deleteBankCard: (id: number, opts?: Opts) =>
      useHttp<ApiResponse<null>>(`/api/wallet/bank-card/${id}`, { method: HTTP_METHOD.DELETE, ...opts }),

    // ==================== Wallet - CreditCard ====================

    getCreditCards: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<CreditCard[]>>('/api/wallet/credit-card/list', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    addCreditCard: (payload: AddCreditCardPayload, opts?: Opts) =>
      useHttp<ApiResponse<CreditCard>>('/api/wallet/credit-card/add', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    deleteCreditCard: (id: number, opts?: Opts) =>
      useHttp<ApiResponse<null>>(`/api/wallet/credit-card/${id}`, { method: HTTP_METHOD.DELETE, ...opts }),

    // ==================== Wallet - CryptoAddress ====================

    getCryptoAddresses: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<CryptoAddress[]>>('/api/wallet/crypto-address/list', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    addCryptoAddress: (payload: AddCryptoAddressPayload, opts?: Opts) =>
      useHttp<ApiResponse<CryptoAddress>>('/api/wallet/crypto-address/add', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    deleteCryptoAddress: (id: number, opts?: Opts) =>
      useHttp<ApiResponse<null>>(`/api/wallet/crypto-address/${id}`, { method: HTTP_METHOD.DELETE, ...opts }),

    // ==================== Vendor ====================

    getVendorChannels: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<VendorChannelsResult>>('/api/vendor/channels', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== Deposit ====================

    getExchangeRate: (payload?: ExchangeRateParams, opts?: Opts) =>
      useHttp<ApiResponse<ExchangeRateResult>>('/api/deposit/exchange-rate', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getDepositChannels: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<VendorChannelsResult>>('/api/deposit/channels', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    deposit: (payload: DepositPayload, opts?: Opts) =>
      useHttp<ApiResponse<any>>('/api/deposit', { method: HTTP_METHOD.POST, body: payload, ...opts }),

    getDepositOrders: (payload?: DepositOrdersParams, opts?: Opts) =>
      useHttp<ApiResponse<PaginatedResult<DepositOrder>>>('/api/deposit/orders', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== Promo ====================

    getPromos: (payload?: PromoListParams, opts?: Opts) =>
      useHttp<ApiResponse<PaginatedResult<PromoItem>>>('/api/promo', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getPromoById: (id: number, opts?: Opts) =>
      useHttp<ApiResponse<PromoItem>>(`/api/promo/${id}`, { method: HTTP_METHOD.GET, ...opts }),

    claimPromo: (id: number, opts?: Opts) =>
      useHttp<ApiResponse<ClaimPromoResult>>(`/api/promo/${id}/claim`, { method: HTTP_METHOD.POST, ...opts }),

    getPromoClaims: (payload?: PromoClaimsParams, opts?: Opts) =>
      useHttp<ApiResponse<PaginatedResult<PromoClaim>>>('/api/promo/claims', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== VIP ====================

    getVipLevels: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<VipLevel[]>>('/api/vip/levels', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getVipRebates: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<VipRebate[]>>('/api/vip/rebates', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getVipStatus: (payload?: Record<string, any>, opts?: Opts) =>
      useHttp<ApiResponse<VipStatusResult>>('/api/vip/status', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== Ranking ====================

    getRanking: (payload?: RankingParams, opts?: Opts) =>
      useHttp<ApiResponse<RankingItem[]>>('/api/ranking', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    // ==================== BetRecord ====================

    getBetRecords: (payload?: BetRecordParams, opts?: Opts) =>
      useHttp<ApiResponse<BetRecordResult>>('/api/bet-record', { method: HTTP_METHOD.GET, body: payload, ...opts }),

    getBetRecordDetails: (orderId: number, opts?: Opts) =>
      useHttp<ApiResponse<BetRecordDetail[]>>(`/api/bet-record/${orderId}/details`, { method: HTTP_METHOD.GET, ...opts }),
  };
}
