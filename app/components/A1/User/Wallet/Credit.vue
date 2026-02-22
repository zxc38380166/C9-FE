<template>
  <div class="w-full space-y-4">
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
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import {
    A1ModalAddCreditCard,
    CommonConfirmDialog,
    UButton,
    UBadge,
  } from '#components';

  const toast = useToast();
  const overlay = useOverlay();

  const STATUS_MAP: Record<number, { label: string; color: 'warning' | 'success' | 'error' }> = {
    0: { label: '待審核', color: 'warning' },
    1: { label: '已通過', color: 'success' },
    2: { label: '已拒絕', color: 'error' },
  };

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

  const maskAccount = (account: string) => {
    if (account.length <= 4) return account;
    return '****' + account.slice(-4);
  };

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

  onMounted(() => {
    fetchCreditCards();
  });
</script>
