<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-between gap-2">
      <div class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('wallet.myCreditCards') }}</div>
      <UButton
        size="xs"
        icon="i-lucide-plus"
        class="cursor-pointer shrink-0 rounded-[10px]"
        :ui="{
          base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
        }"
        @click="openAddCreditCard">
        <span class="hidden sm:inline">{{ $t('wallet.addCreditCard') }}</span>
        <span class="sm:hidden">{{ $t('common.add') }}</span>
      </UButton>
    </div>
    <USeparator />

    <!-- 空狀態 -->
    <template v-if="!creditCards.length">
      <div class="flex flex-col items-center justify-center py-12 space-y-3">
        <Icon name="i-lucide-credit-card" class="text-[48px] text-white/20" />
        <div class="text-[14px] text-white/40">{{ $t('wallet.noCreditCard') }}</div>
        <UButton size="xs" variant="soft" class="cursor-pointer" @click="openAddCreditCard">
          {{ $t('common.addNow') }}
        </UButton>
      </div>
    </template>

    <!-- 信用卡列表 -->
    <template v-else>
      <!-- 手機版：卡片展開 -->
      <div class="sm:hidden space-y-2">
        <div
          v-for="item in creditCards"
          :key="item.id"
          class="rounded-[10px] bg-white/4 ring-1 ring-white/8 overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-3 text-left cursor-pointer"
            @click="mobileExpandedId = mobileExpandedId === item.id ? null : item.id">
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="i-lucide-credit-card" class="size-4 text-violet-400 shrink-0" />
              <span class="text-[13px] font-medium text-white font-mono">{{ maskAccount(item.cardNumber) }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[13px] text-white/60">{{ item.holderName }}</span>
              <Icon
                name="i-lucide-chevron-down"
                class="size-4 text-white/40 transition-transform duration-200"
                :class="mobileExpandedId === item.id ? 'rotate-180' : ''" />
            </div>
          </button>
          <div v-show="mobileExpandedId === item.id" class="border-t border-white/6 p-3 space-y-2">
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('creditCard.expiryDate') }}</span>
              <span class="text-white/80">{{ item.expiryDate }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('common.status') }}</span>
              <UBadge
                :color="(STATUS_MAP[item.status] ?? STATUS_MAP[0])!.color"
                variant="subtle"
                size="xs">
                {{ (STATUS_MAP[item.status] ?? STATUS_MAP[0])!.label }}
              </UBadge>
            </div>
            <div class="flex items-center justify-end gap-2 mt-1">
              <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash-2" class="cursor-pointer" @click="onDeleteCreditCard(item.id)">
                {{ $t('common.delete') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面版：UTable -->
      <div class="hidden sm:block">
        <UTable
          :data="creditCards"
          :columns="creditCardColumns"
          :ui="{
            th: 'text-white/60 text-center text-[11px] sm:text-[13px]',
            td: 'text-center text-white/80 text-[12px] sm:text-[13px]',
          }" />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import { A1ModalAddCreditCard, CommonConfirmDialog, UButton, UBadge } from '#components';

  const { t } = useI18n();
  const toast = useToast();
  const overlay = useOverlay();
  const { STATUS_MAP } = utsBankCard();

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
  const mobileExpandedId = ref<number | null>(null);

  const maskAccount = (account: string) => {
    if (account.length <= 4) return account;
    return '****' + account.slice(-4);
  };

  const creditCardColumns = computed<TableColumn<CreditCard>[]>(() => [
    {
      accessorKey: 'cardNumber',
      header: t('creditCard.cardNumber'),
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
      cell: ({ row }) => maskAccount(row.getValue('cardNumber') as string),
    },
    {
      accessorKey: 'holderName',
      header: t('creditCard.holderName'),
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
    },
    {
      accessorKey: 'expiryDate',
      header: t('creditCard.expiryDate'),
      meta: { class: { th: 'text-center w-1/5', td: 'text-center font-medium w-1/5' } },
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      meta: { class: { th: 'text-center w-1/5', td: 'text-center w-1/5' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as number] ?? STATUS_MAP[0]!;
        return h(UBadge, { color: s!.color, variant: 'subtle' }, () => s!.label);
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      meta: { class: { th: 'text-center w-1/5', td: 'text-center w-1/5' } },
      cell: ({ row }) =>
        h(UButton, { size: 'xs', color: 'error', variant: 'soft', icon: 'i-lucide-trash-2', class: 'cursor-pointer', onClick: () => onDeleteCreditCard(row.original.id) }, () => t('common.delete')),
    },
  ]);

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
        toast.add({ title: t('common.notify'), description: t('wallet.creditCardDeleted') });
        creditCards.value = creditCards.value.filter((c) => c.id !== id);
      }
    } catch {}
  };

  const onDeleteCreditCard = (id: number) => {
    const modal = overlay.create(CommonConfirmDialog, {
      props: {
        title: t('wallet.deleteCreditCard'),
        description: t('wallet.deleteCreditCardDesc'),
        confirmLabel: t('wallet.confirmDelete'),
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
