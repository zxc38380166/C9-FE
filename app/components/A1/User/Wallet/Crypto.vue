<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-between gap-2">
      <div class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('wallet.myCryptoWallet') }}</div>
      <UButton
        size="xs"
        icon="i-lucide-plus"
        class="cursor-pointer shrink-0 rounded-[10px]"
        :ui="{
          base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
        }"
        @click="openAddCryptoAddress">
        {{ $t('wallet.addWallet') }}
      </UButton>
    </div>
    <USeparator />

    <!-- 空狀態 -->
    <template v-if="!cryptoAddresses.length">
      <div class="flex flex-col items-center justify-center py-12 space-y-3">
        <Icon name="i-lucide-wallet" class="text-[48px] text-white/20" />
        <div class="text-[14px] text-white/40">{{ $t('wallet.noCryptoWallet') }}</div>
        <UButton size="xs" variant="soft" class="cursor-pointer" @click="openAddCryptoAddress">
          {{ $t('common.addNow') }}
        </UButton>
      </div>
    </template>

    <!-- 錢包列表 -->
    <template v-else>
      <div class="-mx-3 sm:mx-0 overflow-x-auto scrollbar-hide">
        <UTable
          :data="cryptoAddresses"
          :columns="cryptoAddressColumns"
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
    A1ModalAddCryptoAddress,
    CommonConfirmDialog,
    UButton,
    UBadge,
    UTooltip,
  } from '#components';

  const { t } = useI18n();
  const toast = useToast();
  const overlay = useOverlay();
  const { STATUS_MAP } = utsBankCard();

  type CryptoAddress = {
    id: number;
    walletName: string;
    currency: string;
    network: string;
    address: string;
    status: number;
    createdAt: string;
    updatedAt: string;
  };

  const cryptoAddresses = ref<CryptoAddress[]>([]);

  const maskAddress = (addr: string) => {
    if (addr.length <= 10) return addr;
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const cryptoAddressColumns = computed<TableColumn<CryptoAddress>[]>(() => [
    {
      accessorKey: 'walletName',
      header: t('wallet.walletName'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
    },
    {
      accessorKey: 'currency',
      header: t('crypto.currency'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
    },
    {
      accessorKey: 'network',
      header: t('crypto.network'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
    },
    {
      accessorKey: 'address',
      header: t('crypto.address'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center font-medium w-1/6' } },
      cell: ({ row }) => {
        const addr = row.getValue('address') as string;
        if (addr.length <= 10) return addr;
        return h(UTooltip, { text: addr, 'delay-duration': 0 }, () =>
          h('span', { class: 'cursor-default' }, maskAddress(addr)),
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as number] ?? STATUS_MAP[0]!;
        return h(UBadge, { color: s!.color, variant: 'subtle' }, () => s!.label);
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      meta: { class: { th: 'text-center w-1/6', td: 'text-center w-1/6' } },
      cell: ({ row }) =>
        h(UButton, { size: 'xs', color: 'error', variant: 'soft', icon: 'i-lucide-trash-2', class: 'cursor-pointer', onClick: () => onDeleteCryptoAddress(row.original.id) }, () => t('common.delete')),
    },
  ]);

  const fetchCryptoAddresses = async () => {
    try {
      const { code, result } = await useApi().getCryptoAddresses();
      if (code === 200 && Array.isArray(result)) cryptoAddresses.value = result;
    } catch {}
  };

  const doDeleteCryptoAddress = async (id: number) => {
    try {
      const { code } = await useApi().deleteCryptoAddress(id);
      if (code === 200) {
        toast.add({ title: t('common.notify'), description: t('wallet.cryptoWalletDeleted') });
        cryptoAddresses.value = cryptoAddresses.value.filter((c) => c.id !== id);
      }
    } catch {}
  };

  const onDeleteCryptoAddress = (id: number) => {
    const modal = overlay.create(CommonConfirmDialog, {
      props: {
        title: t('wallet.deleteCryptoWallet'),
        description: t('wallet.deleteCryptoWalletDesc'),
        confirmLabel: t('wallet.confirmDelete'),
        confirmColor: 'error',
        onSuccess: () => doDeleteCryptoAddress(id),
      },
    });
    modal.open();
  };

  const addCryptoAddressModal = overlay.create(A1ModalAddCryptoAddress, {
    props: {
      onSuccess: () => {
        addCryptoAddressModal.close();
        fetchCryptoAddresses();
      },
    },
  });

  const openAddCryptoAddress = () => addCryptoAddressModal.open();

  onMounted(() => {
    fetchCryptoAddresses();
  });
</script>
