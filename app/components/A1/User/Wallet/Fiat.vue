<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-between gap-2">
      <div class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('bankCard.myBankCards') }}</div>
      <UButton
        size="xs"
        icon="i-lucide-plus"
        class="cursor-pointer shrink-0 rounded-[10px]"
        :ui="{
          base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
        }"
        @click="openAddBankCard">
        <span class="hidden sm:inline">{{ $t('bankCard.addBankCard') }}</span>
        <span class="sm:hidden">{{ $t('common.add') }}</span>
      </UButton>
    </div>
    <USeparator />

    <!-- 空狀態 -->
    <template v-if="!bankCards.length">
      <div class="flex flex-col items-center justify-center py-12 space-y-3">
        <Icon name="i-lucide-landmark" class="text-[48px] text-white/20" />
        <div class="text-[14px] text-white/40">{{ $t('bankCard.noBankCards') }}</div>
        <UButton size="xs" variant="soft" class="cursor-pointer" @click="openAddBankCard">
          {{ $t('common.addNow') }}
        </UButton>
      </div>
    </template>

    <!-- 銀行卡列表 -->
    <template v-else>
      <div class="-mx-3 sm:mx-0 overflow-x-auto scrollbar-hide">
        <UTable
          :data="bankCards"
          :columns="bankCardColumns"
          :ui="{
            root: 'min-w-[560px]',
            th: 'text-white/60 text-center text-[11px] sm:text-[13px]',
            td: 'text-center text-white/80 text-[12px] sm:text-[13px]',
          }" />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import {
    A1ModalAddBankCard,
    A1ModalBankCardDetail,
    CommonConfirmDialog,
    UButton,
    UBadge,
  } from '#components';

  const { t } = useI18n();
  const toast = useToast();
  const overlay = useOverlay();
  const { STATUS_MAP } = utsBankCard();

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
      header: t('bankCard.bank'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) =>
        bankNameMap.value[row.getValue('bankCode') as string] || row.getValue('bankCode'),
    },
    {
      accessorKey: 'bankAccount',
      header: t('bankCard.account'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) => maskAccount(row.getValue('bankAccount') as string),
    },
    {
      accessorKey: 'branch',
      header: t('bankCard.branch'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) =>
        branchNameMap.value[row.original.bankCode]?.[row.getValue('branch') as string] ||
        row.getValue('branch'),
    },
    {
      accessorKey: 'holderName',
      header: t('bankCard.name'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
    },
    {
      accessorKey: 'status',
      header: t('bankCard.statusLabel'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as number] ?? STATUS_MAP[0]!;
        return h(UBadge, { color: s!.color, variant: 'subtle' }, () => s!.label);
      },
    },
    {
      id: 'actions',
      header: t('bankCard.actions'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) =>
        h('div', { class: 'flex items-center justify-center gap-1.5' }, [
          h(
            UButton,
            {
              size: 'xs',
              variant: 'soft',
              icon: 'i-lucide-eye',
              class: 'cursor-pointer',
              onClick: () => openBankCardDetail(row.original),
            },
            () => t('common.detail'),
          ),
          h(
            UButton,
            {
              size: 'xs',
              color: 'error',
              variant: 'soft',
              icon: 'i-lucide-trash-2',
              class: 'cursor-pointer',
              onClick: () => onDeleteBankCard(row.original.id),
            },
            () => t('common.delete'),
          ),
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
        toast.add({ title: t('common.notify'), description: t('bankCard.deleted') });
        bankCards.value = bankCards.value.filter((c) => c.id !== id);
      }
    } catch {}
  };

  const onDeleteBankCard = (id: number) => {
    const modal = overlay.create(CommonConfirmDialog, {
      props: {
        title: t('bankCard.deleteTitle'),
        description: t('bankCard.deleteDesc'),
        confirmLabel: t('bankCard.confirmDelete'),
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

  onMounted(async () => {
    try {
      bankCodeData.value = await $fetch<BankCodeItem[]>('/bankCode.json');
    } catch {}
    fetchBankCards();
  });
</script>
