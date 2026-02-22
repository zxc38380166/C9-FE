<template>
  <div class="space-y-4">
    <div class="text-[24px] font-bold text-white">帳戶錢包管理</div>
    <UTabs
      v-model="activeTab"
      :items="tabs"
      :unmount-on-hide="false"
      class="w-full"
      :ui="{
        root: 'w-full items-start',
        list: 'rounded-[10px] w-full bg-[#00df72]/20 ring-1 ring-white/10',
        indicator: 'bg-[#00df72]',
        trigger: 'cursor-pointer h-10 text-white/70',
        content: 'mt-4',
      }">
      <template #content>
        <!-- 法幣 -->
        <div v-if="activeTab === 'fiat'">
          <div class="w-full space-y-4 bg-slate-900 rounded-[14px] ring-1 ring-white/10 p-4">
            <div class="flex items-center justify-between">
              <div class="text-[20px] font-bold text-white">我的銀行卡</div>
              <UButton
                size="sm"
                icon="i-lucide-plus"
                class="cursor-pointer rounded-[10px]"
                :ui="{
                  base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
                }"
                @click="openAddBankCard">
                新增銀行卡
              </UButton>
            </div>
            <USeparator />

            <!-- 空狀態 -->
            <template v-if="!bankCards.length">
              <div class="flex flex-col items-center justify-center py-12 space-y-3">
                <Icon name="i-lucide-landmark" class="text-[48px] text-white/20" />
                <div class="text-[14px] text-white/40">尚未綁定銀行卡</div>
                <UButton size="xs" variant="soft" class="cursor-pointer" @click="openAddBankCard">
                  立即新增
                </UButton>
              </div>
            </template>

            <!-- 銀行卡列表 -->
            <template v-else>
              <UTable
                :data="bankCards"
                :columns="bankCardColumns"
                :ui="{
                  th: 'text-white/60 text-center',
                  td: 'text-center text-white/80',
                }" />
            </template>
          </div>
        </div>

        <!-- 信用卡 -->
        <div v-else-if="activeTab === 'credit'">
          <div class="w-full space-y-4 bg-slate-900 rounded-[14px] ring-1 ring-white/10 p-4">
            <div class="flex items-center justify-between">
              <div class="text-[20px] font-bold text-white">我的信用卡</div>
              <UButton
                size="sm"
                icon="i-lucide-plus"
                class="cursor-pointer rounded-[10px]"
                :ui="{
                  base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
                }"
                @click="openAddCreditCard">
                新增信用卡
              </UButton>
            </div>
            <USeparator />

            <!-- 空狀態 -->
            <template v-if="!creditCards.length">
              <div class="flex flex-col items-center justify-center py-12 space-y-3">
                <Icon name="i-lucide-credit-card" class="text-[48px] text-white/20" />
                <div class="text-[14px] text-white/40">尚未綁定信用卡</div>
                <UButton size="xs" variant="soft" class="cursor-pointer" @click="openAddCreditCard">
                  立即新增
                </UButton>
              </div>
            </template>

            <!-- 信用卡列表 -->
            <template v-else>
              <UTable
                :data="creditCards"
                :columns="creditCardColumns"
                :ui="{
                  th: 'text-white/60 text-center',
                  td: 'text-center text-white/80',
                }" />
            </template>
          </div>
        </div>

        <!-- USDT -->
        <div v-else>
          <div class="w-full space-y-4 bg-slate-900 rounded-[14px] ring-1 ring-white/10 p-4">
            <div class="text-[20px] font-bold text-white">USDT 錢包</div>
            <USeparator />
            <div class="text-white/60 text-[14px]">USDT 錢包管理功能開發中…</div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import {
    A1ModalAddBankCard,
    A1ModalAddCreditCard,
    A1ModalBankCardDetail,
    CommonConfirmDialog,
    UButton,
    UBadge,
  } from '#components';

  const toast = useToast();
  const overlay = useOverlay();

  type TabValue = 'fiat' | 'credit' | 'usdt';
  const activeTab = ref<TabValue>('fiat');
  const tabs: Array<{ label: string; value: TabValue; icon: string }> = [
    { label: '法幣', value: 'fiat', icon: 'i-lucide-banknote' },
    { label: '信用卡', value: 'credit', icon: 'i-lucide-credit-card' },
    { label: '虛擬貨幣', value: 'usdt', icon: 'i-lucide-bitcoin' },
  ];

  const STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
    0: { label: '待審核', color: 'warning' },
    1: { label: '已通過', color: 'success' },
    2: { label: '已拒絕', color: 'error' },
  };

  // ==================== 銀行卡 ====================

  type BankCard = {
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

  type BankCodeItem = { value: string; label: string; child?: { value: string; label: string }[] };
  const bankCodeData = ref<BankCodeItem[]>([]);

  const bankNameMap = computed(() => {
    const map: Record<string, string> = {};
    for (const b of bankCodeData.value) map[b.value] = b.label;
    return map;
  });

  const branchNameMap = computed(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const b of bankCodeData.value) {
      if (b.child) {
        if (!map[b.value]) map[b.value] = {};
        for (const c of b.child) map[b.value]![c.value] = c.label;
      }
    }
    return map;
  });

  const bankCards = ref<BankCard[]>([]);

  const maskAccount = (account: string) => {
    if (account.length <= 4) return account;
    return '****' + account.slice(-4);
  };

  const bankCardColumns: TableColumn<BankCard>[] = [
    {
      accessorKey: 'bankCode',
      header: '銀行',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) => bankNameMap.value[row.getValue('bankCode') as string] || row.getValue('bankCode'),
    },
    {
      accessorKey: 'bankAccount',
      header: '帳號',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) => maskAccount(row.getValue('bankAccount') as string),
    },
    {
      accessorKey: 'branch',
      header: '分行',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) => branchNameMap.value[row.original.bankCode]?.[row.getValue('branch') as string] || row.getValue('branch'),
    },
    {
      accessorKey: 'holderName',
      header: '姓名',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
    },
    {
      accessorKey: 'status',
      header: '狀態',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as number] ?? STATUS_MAP[0]!;
        return h(UBadge, { color: s!.color, variant: 'subtle' }, () => s!.label);
      },
    },
    {
      id: 'actions',
      header: '操作',
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) =>
        h('div', { class: 'flex items-center justify-center gap-1.5' }, [
          h(UButton, { size: 'xs', variant: 'soft', icon: 'i-lucide-eye', class: 'cursor-pointer', onClick: () => openBankCardDetail(row.original) }, () => '詳情'),
          h(UButton, { size: 'xs', color: 'error', variant: 'soft', icon: 'i-lucide-trash-2', class: 'cursor-pointer', onClick: () => onDeleteBankCard(row.original.id) }, () => '刪除'),
        ]),
    },
  ];

  const fetchBankCards = async () => {
    try {
      const { code, result } = await useApi().getBankCards();
      if (code === 200 && Array.isArray(result)) bankCards.value = result;
    } catch {}
  };

  const doDeleteBankCard = async (id: number) => {
    try {
      const { code } = await useApi().deleteBankCard(id);
      if (code === 200) {
        toast.add({ title: '通知', description: '銀行卡已刪除' });
        bankCards.value = bankCards.value.filter((c) => c.id !== id);
      }
    } catch {}
  };

  const onDeleteBankCard = (id: number) => {
    const modal = overlay.create(CommonConfirmDialog, {
      props: {
        title: '刪除銀行卡',
        description: '確定要刪除此銀行卡嗎？此操作無法復原。',
        confirmLabel: '確認刪除',
        confirmColor: 'error',
        onSuccess: () => doDeleteBankCard(id),
      },
    });
    modal.open();
  };

  const addBankCardModal = overlay.create(A1ModalAddBankCard, {
    props: {
      onSuccess: () => {
        addBankCardModal.close();
        fetchBankCards();
      },
    },
  });

  const openAddBankCard = () => addBankCardModal.open();

  const openBankCardDetail = (card: BankCard) => {
    const modal = overlay.create(A1ModalBankCardDetail, { props: { card } });
    modal.open();
  };

  // ==================== 信用卡 ====================

  type CreditCard = {
    id: number;
    cardNumber: string;
    holderName: string;
    cvv: string;
    expiryDate: string;
    status: number;
    createdAt: string;
    updatedAt: string;
  };

  const creditCards = ref<CreditCard[]>([]);

  const creditCardColumns: TableColumn<CreditCard>[] = [
    {
      accessorKey: 'cardNumber',
      header: '卡號',
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
      cell: ({ row }) => maskAccount(row.getValue('cardNumber') as string),
    },
    {
      accessorKey: 'holderName',
      header: '持卡人',
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
    },
    {
      accessorKey: 'expiryDate',
      header: '到期日',
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
    },
    {
      accessorKey: 'status',
      header: '狀態',
      meta: { class: { th: 'text-center w-1/5', td: 'text-center w-1/5' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as number] ?? STATUS_MAP[0]!;
        return h(UBadge, { color: s!.color, variant: 'subtle' }, () => s!.label);
      },
    },
    {
      id: 'actions',
      header: '操作',
      meta: { class: { th: 'text-center w-1/5', td: 'text-center w-1/5' } },
      cell: ({ row }) =>
        h(UButton, {
          size: 'xs',
          color: 'error',
          variant: 'soft',
          icon: 'i-lucide-trash-2',
          class: 'cursor-pointer',
          onClick: () => onDeleteCreditCard(row.original.id),
        }, () => '刪除'),
    },
  ];

  const fetchCreditCards = async () => {
    try {
      const { code, result } = await useApi().getCreditCards();
      if (code === 200 && Array.isArray(result)) creditCards.value = result;
    } catch {}
  };

  const doDeleteCreditCard = async (id: number) => {
    try {
      const { code } = await useApi().deleteCreditCard(id);
      if (code === 200) {
        toast.add({ title: '通知', description: '信用卡已刪除' });
        creditCards.value = creditCards.value.filter((c) => c.id !== id);
      }
    } catch {}
  };

  const onDeleteCreditCard = (id: number) => {
    const modal = overlay.create(CommonConfirmDialog, {
      props: {
        title: '刪除信用卡',
        description: '確定要刪除此信用卡嗎？此操作無法復原。',
        confirmLabel: '確認刪除',
        confirmColor: 'error',
        onSuccess: () => doDeleteCreditCard(id),
      },
    });
    modal.open();
  };

  const addCreditCardModal = overlay.create(A1ModalAddCreditCard, {
    props: {
      onSuccess: () => {
        addCreditCardModal.close();
        fetchCreditCards();
      },
    },
  });

  const openAddCreditCard = () => addCreditCardModal.open();

  // ==================== Init ====================

  onMounted(async () => {
    try {
      bankCodeData.value = await $fetch<BankCodeItem[]>('/bankCode.json');
    } catch {}
    fetchBankCards();
    fetchCreditCards();
  });
</script>
