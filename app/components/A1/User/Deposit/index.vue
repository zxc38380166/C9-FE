<template>
  <!-- ✅ 整頁底色固定：#0f172b（不變色、不透明、不用 blur） -->
  <div class="min-h-dvh bg-slate-900 p-4 md:p-6 rounded-lg">
    <div class="space-y-4">
      <UPageCard
        class="w-full"
        :ui="{
          // ✅ 卡片也改成同底色系（可視需求做些層次，但底色主色不變）
          root: 'bg-slate-900 ring-1 ring-white/10 rounded-[14px] shadow-[0_14px_50px_-26px_rgba(0,0,0,0.65)]',
          body: 'w-full',
          header: 'w-full space-y-3',
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-[20px] font-bold text-white">存款</div>
              <div class="text-[13px] text-white/60">
                選擇幣別並查看匯率（useApi().getExchangeRate）
              </div>
            </div>

            <UButton
              size="sm"
              variant="soft"
              icon="i-lucide-refresh-cw"
              class="cursor-pointer"
              :loading="loading"
              @click="refresh">
              重新整理
            </UButton>
          </div>

          <USeparator />
        </template>

        <template #default>
          <UTabs
            v-model="activeTab"
            :items="tabs"
            :unmount-on-hide="false"
            class="w-full"
            :ui="{
              root: 'w-full items-start',
              // ✅ tabs list 底色也固定 #0f172b（不再用 /70）
              list: 'rounded-[10px] w-full bg-slate-900 ring-1 ring-white/10',
              indicator: 'bg-white/10',
              trigger:
                'cursor-pointer h-10 text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors',
              content: 'mt-4',
            }">
            <template #content>
              <!-- 法幣 -->
              <div v-if="activeTab === 'fiat'" class="space-y-4">
                <UPageCard
                  class="w-full"
                  :ui="{
                    root: 'bg-slate-900 ring-1 ring-white/10 rounded-[14px]',
                    body: 'w-full',
                    header: 'w-full space-y-3',
                  }">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="text-[16px] font-bold text-white">法幣存款</div>

                      <div class="flex items-center gap-2">
                        <UBadge
                          variant="soft"
                          class="bg-white/5 ring-1 ring-white/10 text-white/70">
                          台灣銀行 (twbk)
                        </UBadge>
                        <UBadge
                          variant="soft"
                          class="bg-white/5 ring-1 ring-white/10 text-white/70">
                          更新：{{ quotedAtText }}
                        </UBadge>
                      </div>
                    </div>
                    <USeparator />
                  </template>

                  <template #default>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <!-- ✅ 幣別下拉（已修：使用 api.result + 排除 time，並且 USelectMenu v-model 用 undefined，不用 null） -->
                      <UFormField label="選擇幣別" :ui="{ label: 'text-white/70 mb-1' }">
                        <USelectMenu
                          v-model="selectedCurrency"
                          :items="currencyItems"
                          :loading="loading"
                          searchable
                          :search-attributes="['label', 'value']"
                          :ui="{
                            base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
                            content: 'w-[260px] bg-slate-900 ring-1 ring-white/10',
                          }"
                          icon="i-lucide-coins"
                          placeholder="請選擇幣別" />
                      </UFormField>

                      <!-- 匯率摘要 -->
                      <UPageCard
                        class="w-full"
                        :ui="{
                          root: 'bg-white/[0.03] ring-1 ring-white/10 rounded-[12px]',
                          body: 'w-full',
                        }">
                        <template #default>
                          <div class="space-y-2">
                            <div class="flex items-center justify-between">
                              <div class="text-[14px] text-white/60">幣別</div>
                              <div class="text-[14px] font-semibold text-white">
                                {{ selectedCurrency?.value || '-' }}
                              </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                              <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
                                <div class="text-[12px] text-white/60">即期買入</div>
                                <div class="text-[16px] font-bold text-white">
                                  {{ showRate('bkbuy') }}
                                </div>
                              </div>
                              <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
                                <div class="text-[12px] text-white/60">即期賣出</div>
                                <div class="text-[16px] font-bold text-white">
                                  {{ showRate('bksell') }}
                                </div>
                              </div>
                              <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
                                <div class="text-[12px] text-white/60">現金買入</div>
                                <div class="text-[16px] font-bold text-white">
                                  {{ showRate('cashbuy') }}
                                </div>
                              </div>
                              <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
                                <div class="text-[12px] text-white/60">現金賣出</div>
                                <div class="text-[16px] font-bold text-white">
                                  {{ showRate('cashsell') }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </UPageCard>
                    </div>

                    <!-- 存款表單（先做 UI） -->
                    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <UFormField label="存款金額" :ui="{ label: 'text-white/70 mb-1' }">
                        <UInput
                          v-model="amount"
                          type="number"
                          min="0"
                          placeholder="輸入金額"
                          :ui="{
                            base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
                          }"
                          icon="i-lucide-wallet" />
                      </UFormField>

                      <UFormField label="付款方式" :ui="{ label: 'text-white/70 mb-1' }">
                        <USelectMenu
                          v-model="payMethod"
                          :items="payMethodItems"
                          :ui="{
                            base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
                            content: 'bg-slate-900 ring-1 ring-white/10',
                          }"
                          icon="i-lucide-credit-card"
                          placeholder="選擇方式" />
                      </UFormField>

                      <div class="flex items-end">
                        <UButton
                          size="xl"
                          class="w-full cursor-pointer rounded-[12px]"
                          :ui="{
                            base: 'bg-linear-to-r from-[#00df72]/80 to-[#00baff]/70 hover:from-[#00df72] hover:to-[#00baff] text-white ring-1 ring-white/10',
                          }"
                          icon="i-lucide-arrow-right"
                          @click="onDeposit">
                          下一步
                        </UButton>
                      </div>
                    </div>

                    <UAlert
                      v-if="errorText"
                      class="mt-4"
                      color="error"
                      variant="soft"
                      icon="i-lucide-triangle-alert"
                      title="匯率取得失敗"
                      :description="errorText" />
                  </template>
                </UPageCard>
              </div>
              <!-- USDT（先放佔位） -->
              <div v-else class="space-y-4">
                <UPageCard
                  class="w-full"
                  :ui="{
                    root: 'bg-slate-900 ring-1 ring-white/10 rounded-[14px]',
                    body: 'w-full',
                    header: 'w-full space-y-3',
                  }">
                  <template #header>
                    <div class="text-[16px] font-bold text-white">USDT 存款</div>
                    <USeparator />
                  </template>

                  <template #default>
                    <div class="text-white/60 text-[14px]">
                      先完成法幣流程後，再補 USDT（TRC20/ERC20 等）選項與入金地址。
                    </div>
                  </template>
                </UPageCard>
              </div>
            </template>
          </UTabs>
        </template>
      </UPageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  type SelectItem = { label: string; value: string };

  type TwExchangeRow = {
    bkbuy?: string | number;
    bksell?: string | number;
    cashbuy?: string | number;
    cashsell?: string | number;
    [k: string]: any;
  };

  // ✅ 你後端回應格式：{ code, message, result, ... }
  type ApiResp = {
    code: number;
    message: string;
    result: Record<string, any>;
    timestamp?: number;
    path?: string;
  };

  const tabs: Array<{ label: string; value: 'fiat' | 'usdt'; icon: string }> = [
    { label: '法幣', value: 'fiat', icon: 'i-lucide-banknote' },
    { label: 'USDT', value: 'usdt', icon: 'i-lucide-bitcoin' },
  ];

  const activeTab = ref<'fiat' | 'usdt'>('fiat');

  const loading = ref(false);
  const errorText = ref('');

  const apiResult = ref<Record<string, any>>({});

  // ✅ 用 api.result.time 顯示時間
  const quotedAtText = computed(() => String(apiResult.value?.time || '—'));

  // ✅ 下拉 items：從 api.result 取 key，排除 time
  const currencyItems = computed<SelectItem[]>(() => {
    const raw = apiResult.value || {};
    return Object.keys(raw)
      .filter((k) => k !== 'time' && /^[A-Za-z]{3}$/.test(k))
      .sort()
      .map((k) => ({ label: k.toUpperCase(), value: k.toUpperCase() }));
  });

  // ✅ USelectMenu v-model 需要 SelectItem | undefined（不要 null）
  const selectedCurrency = ref<SelectItem | undefined>(undefined);

  const amount = ref<string>('');

  const payMethodItems: SelectItem[] = [
    { label: 'ATM 轉帳', value: 'ATM' },
    { label: '超商代碼', value: 'CVS' },
    { label: '信用卡', value: 'CARD' },
  ];
  const payMethod = ref<SelectItem | undefined>(payMethodItems[0]);

  const toFixedRate = (v: any) => {
    if (v === null || v === undefined || v === '' || v === '-') return '—';
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(4) : '—';
  };

  const showRate = (field: keyof TwExchangeRow) => {
    const code = selectedCurrency.value?.value?.toUpperCase();
    if (!code) return '—';
    const row = (apiResult.value?.[code] || undefined) as TwExchangeRow | undefined;
    return toFixedRate(row?.[field]);
  };

  const ensureDefaultCurrency = () => {
    const items = currencyItems.value;
    if (!items.length) {
      selectedCurrency.value = undefined;
      return;
    }

    const preferred = 'USD';
    if (!selectedCurrency.value) {
      selectedCurrency.value = items.find((x) => x.value === preferred) || items[0];
      return;
    }

    const exists = items.some((x) => x.value === selectedCurrency.value?.value);
    if (!exists) selectedCurrency.value = items[0];
  };

  const fetchExchangeRate = async () => {
    loading.value = true;
    errorText.value = '';
    try {
      const api = useApi() as any;

      // ✅ 你的 api 現在回的是 { code, message, result, ... }
      const resp = (await api.getExchangeRate()) as ApiResp;

      if (!resp || resp.code !== 200) {
        throw new Error(resp?.message || 'api error');
      }

      apiResult.value = resp.result || {};
      ensureDefaultCurrency();
    } catch (e: any) {
      errorText.value = e?.data?.message || e?.message || 'unknown error';
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    await fetchExchangeRate();
  };

  const onDeposit = () => {
    console.log('deposit', {
      tab: activeTab.value,
      currency: selectedCurrency.value?.value,
      amount: amount.value,
      payMethod: payMethod.value?.value,
    });
  };

  onMounted(() => {
    fetchExchangeRate();
  });
</script>
