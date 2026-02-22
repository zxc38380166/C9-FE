<template>
  <UModal title="銀行卡審核詳情" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <div class="space-y-4">
        <!-- 狀態 -->
        <div class="flex items-center justify-between">
          <span class="text-[14px] text-white/60">審核狀態</span>
          <UBadge v-if="statusConfig?.color" :color="statusConfig.color" variant="subtle">
            {{ statusConfig?.label || '' }}
          </UBadge>
        </div>
        <USeparator />

        <!-- 基本資訊 -->
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="field in infoFields"
            :key="field.label"
            class="rounded-[10px] bg-white/5 ring-1 ring-white/10 p-3">
            <div class="text-[12px] text-white/50">{{ field.label }}</div>
            <div class="text-[14px] font-medium text-white mt-0.5">{{ field.value }}</div>
          </div>
        </div>
        <USeparator />

        <!-- 上傳圖片 -->
        <div class="space-y-3">
          <div class="text-[14px] font-bold text-white">上傳文件</div>
          <div v-for="img in imageFields" :key="img.key" class="space-y-1.5">
            <div class="text-[13px] text-white/60">{{ img.label }}</div>
            <div
              class="rounded-xl bg-slate-900/50 ring-1 ring-white/10 p-2 flex items-center justify-center min-h-20"
              :class="img.url ? 'cursor-pointer hover:ring-white/20 transition-colors' : ''"
              @click="img.url && openImage(img.url)">
              <NuxtImg
                v-if="img.url"
                :src="img.url"
                class="max-h-40 rounded-lg object-contain"
                referrerpolicy="no-referrer"
                crossorigin="anonymous" />
              <div v-else class="flex flex-col items-center gap-1 py-4">
                <Icon name="i-lucide-image-off" class="text-[20px] text-white/20" />
                <span class="text-[12px] text-white/40">未上傳</span>
              </div>
            </div>
          </div>
        </div>
        <USeparator />

        <!-- 時間 -->
        <div class="flex items-center justify-between text-[13px] text-white/40">
          <span>建立時間</span>
          <span>{{ formatDate(card.createdAt) }}</span>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  const { card } = defineProps<{
    card: {
      id: number;
      bankCode: string;
      bankAccount: string;
      branch: string;
      holderName: string;
      idCardFront: string;
      idCardBack: string;
      passbookCover: string;
      status: number;
      createdAt: string;
      updatedAt: string;
    };
  }>();

  const STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
    0: { label: '待審核', color: 'warning' },
    1: { label: '已通過', color: 'success' },
    2: { label: '已拒絕', color: 'error' },
  };

  const statusConfig = computed(() => STATUS_MAP[card.status] || STATUS_MAP[0]);

  type BankCodeItem = { value: string; label: string; child?: { value: string; label: string }[] };
  const bankCodeData = ref<BankCodeItem[]>([]);

  const bankLabel = computed(() => {
    const bank = bankCodeData.value.find((b) => b.value === card.bankCode);
    return bank?.label || card.bankCode;
  });

  const branchLabel = computed(() => {
    const bank = bankCodeData.value.find((b) => b.value === card.bankCode);
    const branch = bank?.child?.find((c) => c.value === card.branch);
    return branch?.label || card.branch;
  });

  onMounted(async () => {
    try {
      bankCodeData.value = await $fetch<BankCodeItem[]>('/bankCode.json');
    } catch {}
  });

  const infoFields = computed(() => [
    { label: '銀行', value: bankLabel.value },
    { label: '銀行帳號', value: card.bankAccount },
    { label: '分行', value: branchLabel.value },
    { label: '持卡人姓名', value: card.holderName },
  ]);

  const imageFields = computed(() => [
    { key: 'idCardFront', label: '身分證正面', url: card.idCardFront },
    { key: 'idCardBack', label: '身分證反面', url: card.idCardBack },
    { key: 'passbookCover', label: '銀行存摺封面', url: card.passbookCover },
  ]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const openImage = (url: string) => {
    window.open(url, '_blank');
  };
</script>
