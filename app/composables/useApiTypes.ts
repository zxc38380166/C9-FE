// ==================== 共用 ====================

/** 統一 API 回應 */
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  result?: T;
  timestamp?: number;
  path?: string;
}

/** 分頁參數 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** 分頁回應 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** 分頁列表回應 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

// ==================== Auth ====================

export interface LoginPayload {
  account: string;
  password: string;
}

export interface RegisterPayload {
  account: string;
  password: string;
  name: string;
  birthday?: string;
  phone?: string;
  referralCode?: string;
  lang?: string;
}

export interface LoginResult {
  token: string;
  user: UserBasic;
}

export interface UserBasic {
  id: number;
  account: string;
  name: string;
  email: string | null;
  mobile: string | null;
  vipLevel: string;
  balance: string;
  vendorGroupId: number | null;
  googleAuthEnabled: number;
  tokenVersion: number;
  createdAt: string;
}

export interface LoginLog {
  id: number;
  userId: number;
  ip: string;
  device: string;
  action: string;
  lastUse: string;
}

export interface UserDetail {
  id: number;
  account: string;
  name: string;
  email: string | null;
  mobile: string | null;
  telegram: string | null;
  google?: string | null;
  vipLevel: string;
  vipProgress: string;
  totalEffectiveBet: string;
  relegationMissCount: number;
  vipHold: number;
  googleAuthEnabled: number;
  balance: string;
  vendorGroupId: number | null;
  createdAt: string;
  loginLogs?: LoginLog[];
}

export interface UserDetailParams {
  RELATED?: string | string[];
}

export interface CountryCode {
  country: string;
  callingCode: string;
  name: string;
}

export interface SendVerifyEmailPayload {
  email: string;
  subject?: string;
}

export interface SendVerifyMobilePayload {
  mobile: string;
  country: { label: string; icon: string };
}

export interface CheckVerifyEmailPayload {
  code: string;
  email: string;
}

export interface EnableGoogleAuthPayload {
  code: string;
}

export interface GoogleAuthResult {
  secret: string;
  qrCode: string;
}

export interface EditPasswordPayload {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginConfigResult {
  google: string;
}

export interface LoginGooglePayload {
  code: string;
  state: string;
}

export interface LoginGoogleResult {
  token: string;
  user: UserBasic;
  google: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}

// ==================== Game ====================

export interface GameProviderParams {
  gameType?: number;
}

export interface GameProvider {
  id: number;
  gameCode: string;
  gameType: number;
  gameTypeLabel: string;
  areaBlock: boolean;
  maintain: boolean;
  enable: boolean;
  createdAt: string;
}

// ==================== Wallet - BankCard ====================

export interface BankCard {
  id: number;
  userId: number;
  bankCode: string;
  bankAccount: string;
  branch: string;
  holderName: string;
  idCardFront: string;
  idCardBack: string;
  passbookCover: string;
  status: number; // 0=待審核, 1=已通過, 2=已拒絕
  createdAt: string;
  updatedAt: string;
}

// addBankCard 使用 FormData，不需 interface

// ==================== Wallet - CreditCard ====================

export interface AddCreditCardPayload {
  cardNumber: string;
  holderName: string;
  cvv: string;
  expiryDate: string;
}

export interface CreditCard {
  id: number;
  userId: number;
  cardNumber: string;
  holderName: string;
  cvv: string;
  expiryDate: string;
  status: number; // 0=待審核, 1=已通過, 2=已拒絕
  createdAt: string;
  updatedAt: string;
}

// ==================== Wallet - CryptoAddress ====================

export interface AddCryptoAddressPayload {
  walletName: string;
  currency?: string;
  network?: string;
  address: string;
}

export interface CryptoAddress {
  id: number;
  userId: number;
  walletName: string;
  currency: string;
  network: string;
  address: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Vendor ====================

export interface VendorChannel {
  id: number;
  name: string;
  currency: string;
  paymentMethods: string[];
  paymentAddress: string | null;
  network?: string;
  enabled: number;
  exchangeRate?: { buy: number; sell: number } | null;
}

export interface VendorChannelsResult {
  groupId: number;
  groupName: string;
  channels: VendorChannel[];
}

// ==================== Deposit ====================

export interface ExchangeRateParams {
  currency?: string;
  bankCode?: string;
}

export interface ExchangeRateResult {
  time: string;
  base: string;
  [currency: string]: any;
}

export interface DepositPayload {
  channelId: number;
  paymentMethod: 'fiat' | 'credit' | 'crypto';
  subOrder: string;
  orderAmount: number;
  expectedCode?: string;
  expectedAccount?: string;
  userCardLastValue?: string;
  productDes?: string;
  msg?: string;
  payerName?: string;
  payerMobile?: string;
  payerEmail?: string;
}

export interface DepositWantongResult {
  status: boolean;
  sub_order: string;
  data?: { result_url?: string };
}

export interface DepositUsdtResult {
  paymentAddress: string;
  network: string;
  currency: string;
  orderAmount: number;
  subOrder: string;
}

export interface DepositOrdersParams extends PaginationParams {
  status?: 'pending' | 'created' | 'paid' | 'failed';
}

export interface DepositOrder {
  id: number;
  channelName: string;
  currency: string;
  subOrder: string;
  orderAmount: number;
  paymentMethod: string;
  status: string;
  payAmount: number;
  payTime: string | null;
  usdAmount: string;
  exchangeRate: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Promo ====================

export interface PromoListParams extends PaginationParams {
  tag?: string;
  activeOnly?: string | number;
  limit?: number;
}

export interface PromoItem {
  id: number;
  title: string;
  imgPc: string | null;
  imgMobile: string | null;
  content: string;
  actionHtml: string;
  startTime: string;
  endTime: string;
  tag: string;
  enabled: number;
  conditionType: string;
  conditionValue: string;
  rewardAmount: string;
  turnoverMultiplier: string;
  maxClaims: number;
  claimedCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isClaimed: boolean;
  isClaimable: boolean;
}

export interface ClaimPromoResult {
  rewardAmount: string;
  newBalance: string;
}

export interface PromoClaimsParams extends PaginationParams {}

export interface PromoClaim {
  id: number;
  promoId: number;
  promoTitle: string;
  promoTag: string;
  rewardAmount: string;
  requiredTurnover: string;
  completedTurnover: string;
  turnoverCompleted: number; // 0=未完成, 1=已完成
  claimedAt: string;
}

// ==================== VIP ====================

export interface VipLevel {
  id: number;
  level: number;
  name: string;
  tier: string;
  minChip: string;
  relegationChip: string;
  sortOrder: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

export interface VipRebate {
  id: number;
  level: number;
  gameType: string;
  rebateRate: string;
  createdAt: string;
  updatedAt: string;
}

export interface VipStatusResult {
  level: number;
  name: string;
  tier: string;
  totalEffectiveBet: string;
  currentChip: string;
  nextLevelMinChip: string;
  progress: string;
  relegationChip: string;
  monthlyEffective: string;
  relegationMissCount: number;
  vipHold: number;
  rebates: { gameType: string; rebateRate: string }[];
  allLevels: {
    level: number;
    name: string;
    tier: string;
    minChip: string;
    relegationChip: string;
  }[];
}

// ==================== Ranking ====================

export interface RankingParams {
  type?: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'total';
  limit?: number;
}

export interface RankingItem {
  id?: number;
  gameName?: string;
  playerName?: string;
  time?: string;
  betAmount?: string;
  multiplier?: string;
  payout?: string;
  isAnonymous?: boolean;
  // total type
  playerAccount?: string;
  totalPayout?: string;
}

// ==================== BetRecord ====================

export interface BetRecordParams extends PaginationParams {
  status?: 'valid' | 'invalid' | 'cancelled';
}

export interface BetRecordSummary {
  totalBetCount: number;
  betAmount: string;
  betEffective: string;
  winLose: string;
}

export interface BetRecordItem {
  id: number;
  gameType: string;
  gamePlatform: string;
  gameNumber: string;
  totalBetCount: number;
  betAmount: string;
  betEffective: string;
  winLose: string;
  status: 'valid' | 'invalid' | 'cancelled';
  odds: string;
  invalidReason: string | null;
  betDatetime: string;
  gameName: string;
}

export interface BetRecordResult extends BetRecordSummary {
  items: BetRecordItem[];
  pagination: Pagination;
}

export interface BetRecordDetail {
  id: number;
  roundNo: number;
  betAmount: string;
  winLose: string;
  createdAt: string;
}

// ==================== Common Enums ====================

export interface EnumsResult {
  AUTH_ENUM: {
    RELATED: Record<string, string>;
    LOGIN_LOG: { ACTION: Record<string, string> };
  };
  ERROR_CODES: Record<string, Record<string, string>>;
}
