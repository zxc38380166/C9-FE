<template>
  <div class="w-full space-y-4">
    <!-- 建單前：填寫表單 -->
    <template v-if="!depositResult">
      <div class="flex items-center justify-between gap-2">
        <div class="text-[16px] sm:text-[20px] font-bold text-white">虛擬貨幣存款</div>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-refresh-cw"
          class="cursor-pointer shrink-0"
          :loading="loadingChannels"
          @click="refreshAll">
          <span class="hidden sm:inline">重新整理</span>
        </UButton>
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

        <!-- 3. 存款金額 -->
        <UFormField label="存款金額 (USDT)" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="amount"
            type="number"
            min="0"
            placeholder="輸入金額"
            :ui="inputUi"
            icon="i-lucide-wallet" />
        </UFormField>
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

    <!-- 建單後：顯示繳費資訊 + QR Code -->
    <template v-else>
      <div class="flex items-center justify-between gap-2">
        <div class="text-[16px] sm:text-[20px] font-bold text-white">存款訂單已建立</div>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-arrow-left"
          class="cursor-pointer shrink-0"
          @click="depositResult = null">
          返回
        </UButton>
      </div>
      <USeparator />

      <UAlert
        color="warning"
        variant="soft"
        icon="i-lucide-info"
        title="請注意"
        description="請使用對應的網路進行轉帳，轉至錯誤網路將導致資金遺失。" />

      <div class="flex flex-col items-center space-y-5 py-4">
        <!-- QR Code -->
        <div class="rounded-[12px] sm:rounded-[16px] bg-white p-3 sm:p-4">
          <QrcodeVue :value="depositResult.paymentAddress" :size="160" level="H" class="sm:size-50!" />
        </div>

        <!-- 繳費資訊 -->
        <div class="w-full max-w-sm space-y-3">
          <div class="rounded-[12px] bg-white/5 ring-1 ring-white/10 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-white/60">幣種</span>
              <span class="text-[14px] font-semibold text-white">{{ depositResult.currency }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-white/60">網路</span>
              <span class="text-[14px] font-semibold text-white">{{ depositResult.network }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-white/60">金額</span>
              <span class="text-[14px] font-semibold text-white"
                >{{ depositResult.orderAmount }} {{ depositResult.currency }}</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-white/60">訂單編號</span>
              <span class="text-[14px] font-semibold text-white">{{ depositResult.subOrder }}</span>
            </div>
          </div>

          <!-- 地址 + 複製 -->
          <div class="rounded-[12px] bg-white/5 ring-1 ring-white/10 p-4 space-y-2">
            <div class="text-[13px] text-white/60">錢包地址</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 truncate text-[13px] font-mono text-white/90">
                {{ depositResult.paymentAddress }}
              </div>
              <UButton
                size="xs"
                variant="soft"
                icon="i-lucide-copy"
                class="cursor-pointer shrink-0"
                @click="copyAddress">
                複製
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue';
  import type { SelectItem, VendorChannel, CryptoDepositResult } from '~/composables/useCash';

  const toast = useToast();
  const {
    channels,
    loadingChannels,
    selectedCurrency,
    getCurrencyOptions,
    refreshAll,
    checkUserVerification,
    vendor,
  } = useCash();

  const currencyOptions = computed(() => getCurrencyOptions('crypto'));

  // 預設幣別為 USDT，切換 tab 時若當前幣別不在選項中則重設
  watch(
    currencyOptions,
    (items) => {
      if (!items.length) return;
      if (!items.find((i) => i.value === selectedCurrency.value)) {
        const usdt = items.find((i) => i.value === 'USDT');
        selectedCurrency.value = usdt?.value ?? items[0]!.value;
      }
    },
    { immediate: true },
  );

  const selectUi = {
    base: 'w-full h-[44px] rounded-[10px] bg-white/5 ring-1 ring-white/10 text-white',
    content: 'w-full bg-slate-900 ring-1 ring-white/10',
  };
  const inputUi = {
    base: 'w-full h-[44px] rounded-[10px] bg-white/5 ring-1 ring-white/10 text-white',
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
        const methodMatch = !c.paymentMethods?.length || c.paymentMethods.includes('crypto');
        return currencyMatch && methodMatch;
      })
      .map((c: VendorChannel) => ({
        label: `${c.name} (${c.network || c.currency})`,
        value: String(c.id),
      }));
  });

  watch(selectedCurrency, () => {
    selectedChannel.value = undefined;
  });

  watch(
    channelOptions,
    (items) => {
      if (!selectedChannel.value && items.length) {
        selectedChannel.value = items[0]!.value;
      }
    },
    { immediate: true },
  );

  // ==================== Deposit ====================

  const amount = ref('');
  const submitting = ref(false);
  const errorText = ref('');
  const depositResult = ref<CryptoDepositResult | null>(null);

  const canSubmit = computed(() => {
    return !!(
      selectedCurrency.value &&
      selectedChannel.value &&
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
      const params = vendor.usdt.buildCryptoParams({
        channelId: Number(selectedChannel.value),
        orderAmount: Number(amount.value),
      });

      depositResult.value = await vendor.usdt.deposit(params);
    } catch (e: any) {
      errorText.value = e?.message || '存款失敗';
    } finally {
      submitting.value = false;
    }
  };

  const copyAddress = async () => {
    if (!depositResult.value) return;
    try {
      await navigator.clipboard.writeText(depositResult.value.paymentAddress);
      toast.add({ title: '通知', description: '地址已複製' });
    } catch {
      toast.add({ title: '錯誤', description: '複製失敗，請手動複製', color: 'error' });
    }
  };
</script>
