<template>
  <div class="w-full space-y-4 bg-slate-900 rounded-[14px] ring-1 ring-white/10 p-4">
    <template v-if="loadingCreditCards">
      <div class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="size-8 text-white/40 animate-spin" />
      </div>
    </template>
    <template v-else>
    <div class="flex items-center justify-between">
      <div class="text-[20px] font-bold text-white">信用卡存款</div>
      <div class="flex items-center gap-2">
        <UBadge
          v-if="quotedAtText"
          variant="soft"
          class="bg-white/5 ring-1 ring-white/10 text-white/70">
          更新：{{ quotedAtText }}
        </UBadge>
        <UButton
          size="sm"
          variant="soft"
          icon="i-lucide-refresh-cw"
          class="cursor-pointer"
          :loading="loadingRate"
          @click="refreshAll">
          重新整理
        </UButton>
      </div>
    </div>
    <USeparator />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 1. 幣別 -->
      <UFormField label="選擇幣別" :ui="{ label: 'text-white/70 mb-1' }">
        <USelectMenu
          v-model="selectedCurrency"
          :items="currencyOptions"
          :loading="loadingChannels"
          :ui="selectUi"
          icon="i-lucide-coins"
          placeholder="請選擇幣別"
          value-key="value" />
      </UFormField>

      <!-- 2. 支付通道 -->
      <UFormField label="支付通道" :ui="{ label: 'text-white/70 mb-1' }">
        <USelectMenu
          v-model="selectedChannel"
          :items="channelOptions"
          :disabled="!selectedCurrency"
          :loading="loadingChannels"
          :ui="selectUi"
          icon="i-lucide-route"
          placeholder="請先選擇幣別"
          value-key="value" />
      </UFormField>

      <!-- 3. 信用卡選擇 -->
      <UFormField label="選擇信用卡" :ui="{ label: 'text-white/70 mb-1' }">
        <USelectMenu
          v-model="selectedCreditCard"
          :items="creditCardOptions"
          :ui="selectUi"
          icon="i-lucide-credit-card"
          placeholder="請選擇已審核的信用卡"
          value-key="value" />
        <p v-if="!creditCardOptions.length" class="mt-1 text-[12px] text-amber-400/80">
          尚無已審核通過的信用卡，請先至錢包管理新增信用卡
        </p>
      </UFormField>

      <!-- 4. 存款金額 -->
      <UFormField label="存款金額" :ui="{ label: 'text-white/70 mb-1' }">
        <UInput
          v-model="amount"
          type="number"
          min="0"
          placeholder="輸入金額"
          :ui="inputUi"
          icon="i-lucide-wallet" />
      </UFormField>
    </div>

    <!-- 匯率摘要 -->
    <div class="rounded-[12px] bg-white/3 ring-1 ring-white/10 p-4 space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-[14px] text-white/60">選擇幣別</div>
        <div class="text-[14px] font-semibold text-white">{{ selectedCurrency || '-' }}</div>
      </div>
      <template v-if="selectedChannelRate">
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">買入匯率</div>
            <div class="text-[16px] font-bold text-white">{{ toFixedRate(selectedChannelRate.buy) }}</div>
          </div>
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">賣出匯率</div>
            <div class="text-[16px] font-bold text-white">{{ toFixedRate(selectedChannelRate.sell) }}</div>
          </div>
        </div>
      </template>
      <template v-else-if="hasRateForCurrency">
        <div class="text-[12px] text-white/50 mb-1">
          {{ selectedCurrency === 'TWD' ? 'USDT（≈USD）匯率' : `${selectedCurrency} 匯率` }}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">即期買入</div>
            <div class="text-[16px] font-bold text-white">{{ showRate('bkbuy') }}</div>
          </div>
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">即期賣出</div>
            <div class="text-[16px] font-bold text-white">{{ showRate('bksell') }}</div>
          </div>
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">現金買入</div>
            <div class="text-[16px] font-bold text-white">{{ showRate('cashbuy') }}</div>
          </div>
          <div class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/60">現金賣出</div>
            <div class="text-[16px] font-bold text-white">{{ showRate('cashsell') }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-[14px] text-white/40">請選擇幣別以查看匯率</div>
      </template>
    </div>

    <!-- 提交按鈕 -->
    <UButton
      block
      size="xl"
      :loading="submitting"
      :disabled="!canSubmit"
      class="cursor-pointer rounded-[12px]"
      :ui="btnUi"
      @click="onDeposit">
      {{ submitting ? '提交中…' : '確認存款' }}
    </UButton>

    <UAlert
      v-if="errorText"
      color="error"
      variant="soft"
      icon="i-lucide-triangle-alert"
      title="錯誤"
      :description="errorText" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { SelectItem, VendorChannel } from '~/composables/useCash';

  const store = useStore();
  const {
    channels, loadingChannels, selectedCurrency, getCurrencyOptions,
    loadingRate, quotedAtText, toFixedRate, hasRateForCurrency, showRate,
    refreshAll, checkUserVerification, vendor,
    creditCards, loadingCreditCards, fetchCreditCards,
  } = useCash();

  const currencyOptions = computed(() => getCurrencyOptions('credit'));

  // 預設幣別為 TWD，切換 tab 時若當前幣別不在選項中則重設
  watch(currencyOptions, (items) => {
    if (!items.length) return;
    if (!items.find((i) => i.value === selectedCurrency.value)) {
      const twd = items.find((i) => i.value === 'TWD');
      selectedCurrency.value = twd?.value ?? items[0]!.value;
    }
  }, { immediate: true });

  const selectUi = {
    base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
    content: 'w-full bg-slate-900 ring-1 ring-white/10',
  };
  const inputUi = {
    base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
  };
  const btnUi = {
    base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
  };

  // ==================== Channels ====================

  const selectedChannel = ref<string | undefined>(undefined);

  const channelOptions = computed<SelectItem[]>(() => {
    if (!selectedCurrency.value) return [];
    return channels.value
      .filter((c: VendorChannel) => {
        const currencyMatch = !c.currency || c.currency === selectedCurrency.value;
        const methodMatch = !c.paymentMethods?.length || c.paymentMethods.includes('credit');
        return currencyMatch && methodMatch;
      })
      .map((c: VendorChannel) => ({ label: c.name, value: String(c.id) }));
  });

  const selectedChannelRate = computed(() => {
    if (!selectedChannel.value) return null;
    return channels.value.find((c: VendorChannel) => String(c.id) === selectedChannel.value)?.exchangeRate || null;
  });

  watch(selectedCurrency, () => {
    selectedChannel.value = undefined;
  });

  watch(channelOptions, (items) => {
    if (!selectedChannel.value && items.length) {
      selectedChannel.value = items[0]!.value;
    }
  }, { immediate: true });

  // ==================== Credit Cards ====================

  const selectedCreditCard = ref<string | undefined>(undefined);

  const creditCardOptions = computed<SelectItem[]>(() => {
    return creditCards.value
      .filter((c) => c.status === 1)
      .map((c) => ({
        label: `****${c.cardNumber.slice(-4)} (${c.holderName}) 到期 ${c.expiryDate}`,
        value: String(c.id),
      }));
  });

  watch(creditCardOptions, (items) => {
    if (!selectedCreditCard.value && items.length) {
      selectedCreditCard.value = items[0]!.value;
    }
  }, { immediate: true });

  // ==================== Deposit ====================

  const amount = ref('');
  const submitting = ref(false);
  const errorText = ref('');

  const canSubmit = computed(() => {
    return !!(
      selectedCurrency.value &&
      selectedChannel.value &&
      selectedCreditCard.value &&
      amount.value &&
      Number(amount.value) > 0
    );
  });

  const onDeposit = async () => {
    if (!canSubmit.value) return;
    if (!checkUserVerification()) return;

    submitting.value = true;
    errorText.value = '';

    try {
      const user = store.getUserDetail;
      const card = creditCards.value.find((c) => String(c.id) === selectedCreditCard.value);
      if (!card) throw new Error('請選擇信用卡');

      const params = vendor.wantong.buildCardParams({
        channelId: Number(selectedChannel.value),
        orderAmount: Number(amount.value),
        creditCard: card,
        mobile: user?.mobile || '',
        email: user?.email || '',
      });

      await vendor.wantong.deposit(params);
    } catch (e: any) {
      errorText.value = e?.message || '存款失敗';
    } finally {
      submitting.value = false;
    }
  };

  // ==================== Init ====================

  onMounted(() => {
    fetchCreditCards();
  });

</script>
