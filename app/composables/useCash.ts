import { CommonConfirmDialog } from '#components';

// ==================== Types ====================

export type SelectItem = { label: string; value: string };

export type VendorChannel = {
  id: number;
  name: string;
  currency?: string;
  enabled?: number;
  exchangeRate?: { buy: number; sell: number };
  paymentMethods?: string[];
};

export type BankCard = {
  id: number;
  bankCode: string;
  bankAccount: string;
  branch: string;
  holderName: string;
  status: number;
};

export type CreditCard = {
  id: number;
  cardNumber: string;
  holderName: string;
  cvv: string;
  expiryDate: string;
  status: number;
};

export type BankCodeItem = {
  value: string;
  label: string;
  child?: { value: string; label: string }[];
};

export type WantongDepositParams = {
  channelId: number;
  paymentMethod: 'fiat' | 'credit';
  orderAmount: number;
  expectedCode?: string;
  expectedAccount?: string;
  userCardLastValue?: string;
  payerName?: string;
  payerMobile?: string;
  payerEmail?: string;
  productDes?: string;
  msg?: string;
};

export type WantongAtmInput = {
  channelId: number;
  orderAmount: number;
  bankCard: { bankCode: string; bankAccount: string; holderName: string };
  mobile: string;
  email: string;
};

export type WantongCardInput = {
  channelId: number;
  orderAmount: number;
  creditCard: { cardNumber: string; holderName: string };
  mobile: string;
  email: string;
};

// ==================== Module-level shared state ====================

const channels = ref<VendorChannel[]>([]);
const loadingChannels = ref(false);
const selectedCurrency = ref<string | undefined>(undefined);
const exchangeRateData = ref<Record<string, any>>({});
const loadingRate = ref(false);

const bankCards = ref<BankCard[]>([]);
const loadingBankCards = ref(false);
let bankCardsFetched = false;

const creditCards = ref<CreditCard[]>([]);
const loadingCreditCards = ref(false);
let creditCardsFetched = false;

const bankCodeData = ref<BankCodeItem[]>([]);
let bankCodeFetched = false;

// ==================== Composable ====================

export default function () {
  const toast = useToast();
  const store = useStore();
  const router = useRouter();
  const overlay = useOverlay();

  // --- Channels ---

  const currencyOptions = computed<SelectItem[]>(() => {
    const currencies = new Set<string>();
    for (const c of channels.value) {
      if (c.currency) currencies.add(c.currency);
    }
    if (!currencies.size) currencies.add('TWD');
    return Array.from(currencies)
      .sort()
      .map((c) => ({ label: c, value: c }));
  });

  const parseChannelsResult = (raw: any): VendorChannel[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      if (raw.length > 0 && raw[0]?.channels) {
        return raw.flatMap((g: any) => g.channels || []);
      }
      return raw;
    }
    if (raw.channels && Array.isArray(raw.channels)) {
      return raw.channels;
    }
    return [];
  };

  const fetchDepositChannels = async () => {
    loadingChannels.value = true;
    try {
      const resp = await useApi().getDepositChannels();
      let parsed = resp?.code === 200 ? parseChannelsResult(resp.result) : [];
      if (!parsed.length) {
        const resp2 = await useApi().getVendorChannels();
        if (resp2?.code === 200) parsed = parseChannelsResult(resp2.result);
      }
      channels.value = parsed;

      // 自動選擇預設幣別
      if (!selectedCurrency.value && parsed.length) {
        const currencies = new Set<string>();
        for (const c of parsed) {
          if (c.currency) currencies.add(c.currency);
        }
        if (!currencies.size) currencies.add('TWD');
        const sorted = Array.from(currencies).sort();
        selectedCurrency.value = sorted.includes('TWD') ? 'TWD' : sorted[0];
      }
    } catch {
    } finally {
      loadingChannels.value = false;
    }
  };

  // --- Exchange Rate ---

  const quotedAtText = computed(() => String(exchangeRateData.value?.time || ''));

  const toFixedRate = (v: any) => {
    if (v === null || v === undefined || v === '' || v === '-') return '—';
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(4) : '—';
  };

  const rateLookupKey = computed(() => {
    if (!selectedCurrency.value) return null;
    return selectedCurrency.value === 'TWD' ? 'USD' : selectedCurrency.value;
  });

  const hasRateForCurrency = computed(() => {
    return !!rateLookupKey.value && !!exchangeRateData.value?.[rateLookupKey.value];
  });

  const showRate = (field: string) => {
    if (!rateLookupKey.value) return '—';
    const row = exchangeRateData.value?.[rateLookupKey.value];
    return toFixedRate(row?.[field]);
  };

  const fetchExchangeRate = async () => {
    loadingRate.value = true;
    try {
      const resp = await useApi().getExchangeRate();
      if (resp?.code === 200) exchangeRateData.value = resp.result || {};
    } catch {
    } finally {
      loadingRate.value = false;
    }
  };

  const refreshAll = () => {
    fetchDepositChannels();
    fetchExchangeRate();
  };

  // --- Bank Cards ---

  const fetchBankCards = async (force = false) => {
    if (bankCardsFetched && !force) return;
    bankCardsFetched = true;
    loadingBankCards.value = true;
    try {
      const resp = await useApi().getBankCards();
      if (resp?.code === 200 && Array.isArray(resp.result)) bankCards.value = resp.result;
    } catch {
      bankCardsFetched = false;
    } finally {
      loadingBankCards.value = false;
    }
  };

  const fetchBankCodeData = async () => {
    if (bankCodeFetched) return;
    bankCodeFetched = true;
    try {
      bankCodeData.value = await $fetch<BankCodeItem[]>('/bankCode.json');
    } catch {
      bankCodeFetched = false;
    }
  };

  // --- Credit Cards ---

  const fetchCreditCards = async (force = false) => {
    if (creditCardsFetched && !force) return;
    creditCardsFetched = true;
    loadingCreditCards.value = true;
    try {
      const resp = await useApi().getCreditCards();
      if (resp?.code === 200 && Array.isArray(resp.result)) creditCards.value = resp.result;
    } catch {
      creditCardsFetched = false;
    } finally {
      loadingCreditCards.value = false;
    }
  };

  // --- User Verification ---

  const checkUserVerification = (): boolean => {
    const user = store.getUserDetail;
    if (!user?.email || !user?.mobile) {
      const modal = overlay.create(CommonConfirmDialog, {
        props: {
          title: '請先完成身份驗證',
          description: '存款前需先綁定手機號碼與電子信箱，請前往帳戶設定完成綁定。',
          confirmLabel: '前往設定',
          confirmColor: 'primary',
          onSuccess: () => router.push('/user/setting'),
        },
      });
      modal.open();
      return false;
    }
    return true;
  };

  // --- Vendor ---

  const vendor = {
    wantong: {
      /** 產生萬通 ATM（法幣）開單參數 */
      buildAtmParams: (input: WantongAtmInput): WantongDepositParams => ({
        channelId: input.channelId,
        paymentMethod: 'fiat',
        orderAmount: input.orderAmount,
        productDes: '存款',
        msg: '存款',
        payerName: input.bankCard.holderName,
        payerMobile: input.mobile,
        payerEmail: input.email,
        expectedCode: input.bankCard.bankCode,
        expectedAccount: input.bankCard.bankAccount,
      }),
      /** 產生萬通信用卡開單參數 */
      buildCardParams: (input: WantongCardInput): WantongDepositParams => ({
        channelId: input.channelId,
        paymentMethod: 'credit',
        orderAmount: input.orderAmount,
        productDes: '存款',
        msg: '存款',
        payerName: input.creditCard.holderName,
        payerMobile: input.mobile,
        payerEmail: input.email,
        userCardLastValue: input.creditCard.cardNumber.slice(-4),
      }),
      /** 萬通支付開單：自動帶入 callback、subOrder，呼叫 deposit API 後開啟付款頁面 */
      async deposit(params: WantongDepositParams) {
        const subOrder = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const payload: Record<string, any> = { ...params, subOrder };
        const resp = await useApi().deposit(payload);

        const resultUrl = resp.result?.data?.result_url;
        if (!resultUrl) {
          throw new Error('未取得付款頁面連結');
        }

        toast.add({ title: '通知', description: '存款訂單建立成功，正在開啟付款頁面…' });
        window.open(resultUrl, '_blank');
      },
    },
  };

  /** 根據 channel name 取得對應 vendor handler */
  const getVendor = (channelName: string) => {
    const handler = vendor[channelName as keyof typeof vendor];
    if (!handler) throw new Error(`不支援的支付商: ${channelName}`);
    return handler;
  };

  /** 根據 channel id 取得對應 vendor handler */
  const getVendorByChannelId = (channelId: number | string) => {
    const channel = channels.value.find((c) => String(c.id) === String(channelId));
    if (!channel) throw new Error('找不到對應的支付通道');
    return getVendor(channel.name);
  };

  return {
    channels,
    loadingChannels,
    selectedCurrency,
    currencyOptions,
    exchangeRateData,
    loadingRate,
    quotedAtText,
    rateLookupKey,
    hasRateForCurrency,
    toFixedRate,
    showRate,
    refreshAll,
    checkUserVerification,
    init: refreshAll,
    vendor,
    getVendor,
    getVendorByChannelId,
    bankCards,
    loadingBankCards,
    fetchBankCards,
    bankCodeData,
    fetchBankCodeData,
    creditCards,
    loadingCreditCards,
    fetchCreditCards,
  };
}
