<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="size-8 rounded-[10px] bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center">
          <UIcon name="i-lucide-arrow-down-to-line" class="size-4 text-emerald-400" />
        </div>
        <div class="text-[18px] font-bold text-white">存款紀錄</div>
      </div>
      <div class="flex items-center gap-2">
        <USelectMenu
          v-model="statusFilter"
          :items="statusOptions"
          :ui="{
            base: 'w-[140px] h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[13px]',
            content: 'bg-slate-800 ring-1 ring-white/10',
          }"
          icon="i-lucide-filter"
          value-key="value"
          @update:model-value="onStatusChange" />
        <UButton
          size="sm"
          variant="ghost"
          color="neutral"
          icon="i-lucide-refresh-cw"
          class="cursor-pointer rounded-[10px] ring-1 ring-white/10"
          :loading="loading"
          @click="fetchOrders" />
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Loading -->
    <template v-if="loading && !orders.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-3">
        <div class="size-12 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
          <UIcon name="i-lucide-loader-2" class="size-6 text-emerald-400 animate-spin" />
        </div>
        <div class="text-[13px] text-white/40">載入中...</div>
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!orders.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="size-16 rounded-full bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <UIcon name="i-lucide-inbox" class="size-8 text-white/20" />
        </div>
        <div class="text-center">
          <div class="text-[15px] font-medium text-white/50">暫無存款紀錄</div>
          <div class="text-[12px] text-white/30 mt-1">完成存款後紀錄將顯示於此</div>
        </div>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <div class="overflow-x-auto rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="orders"
          :columns="columns"
          :ui="{
            root: 'min-w-full',
            thead: 'bg-white/3',
            th: 'text-white/50 text-center text-[12px] font-semibold uppercase tracking-wider',
            td: 'text-center text-white/80 text-[13px]',
            tr: 'border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors',
          }" />
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between pt-1">
        <div class="text-[12px] text-white/35 tabular-nums">
          共 <span class="text-white/60 font-medium">{{ pagination.total }}</span> 筆，第 {{ pagination.page }} / {{ pagination.totalPages }} 頁
        </div>
        <UPagination
          :model-value="pagination.page"
          :total="pagination.total"
          :items-per-page="pagination.pageSize"
          :ui="{ root: 'gap-1' }"
          @update:page="onPageChange" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import { UBadge } from '#components';

  // ==================== Types ====================

  type DepositOrder = {
    id: number;
    channelName: string;
    currency: string;
    subOrder: string;
    orderAmount: number;
    paymentMethod: string;
    status: string;
    payAmount: number;
    payTime: string;
    usdAmount: string;
    exchangeRate: string;
    createdAt: string;
    updatedAt: string;
  };

  // ==================== Constants ====================

  const STATUS_MAP: Record<
    string,
    { label: string; color: 'warning' | 'info' | 'success' | 'error' }
  > = {
    pending: { label: '待處理', color: 'warning' },
    created: { label: '已建立', color: 'info' },
    paid: { label: '已完成', color: 'success' },
    failed: { label: '失敗', color: 'error' },
  };

  const PAYMENT_METHOD_MAP: Record<string, string> = {
    fiat: '法幣',
    credit: '信用卡',
    crypto: '虛擬貨幣',
  };

  const statusOptions = [
    { label: '全部狀態', value: '' },
    { label: '待處理', value: 'pending' },
    { label: '已建立', value: 'created' },
    { label: '已完成', value: 'paid' },
    { label: '失敗', value: 'failed' },
  ];

  // ==================== State ====================

  const orders = ref<DepositOrder[]>([]);
  const loading = ref(false);
  const statusFilter = ref('');
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // ==================== Table Columns ====================

  const formatAmount = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toLocaleString() : '—';
  };

  const formatDate = (v: string) => {
    if (!v) return '—';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '—';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const columns: TableColumn<DepositOrder>[] = [
    {
      accessorKey: 'subOrder',
      header: '訂單編號',
      meta: { class: { th: 'text-center', td: 'text-center font-mono text-[12px] text-white/60' } },
    },
    {
      accessorKey: 'paymentMethod',
      header: '支付方式',
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string;
        return h(
          UBadge,
          { variant: 'subtle', color: 'neutral' },
          () => PAYMENT_METHOD_MAP[method] || method,
        );
      },
    },
    {
      accessorKey: 'currency',
      header: '幣別',
      meta: { class: { th: 'text-center', td: 'text-center font-semibold' } },
    },
    {
      accessorKey: 'orderAmount',
      header: '訂單金額',
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums' } },
      cell: ({ row }) => formatAmount(row.getValue('orderAmount')),
    },
    {
      accessorKey: 'payAmount',
      header: '實付金額',
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums' } },
      cell: ({ row }) => formatAmount(row.getValue('payAmount')),
    },
    {
      accessorKey: 'usdAmount',
      header: 'USD 金額',
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums text-amber-400 font-medium' } },
      cell: ({ row }) => formatAmount(row.getValue('usdAmount')),
    },
    {
      accessorKey: 'status',
      header: '狀態',
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const s = STATUS_MAP[row.getValue('status') as string] ?? {
          label: row.getValue('status'),
          color: 'neutral' as const,
        };
        return h(UBadge, { color: s.color, variant: 'subtle' }, () => s.label);
      },
    },
    {
      accessorKey: 'createdAt',
      header: '建立時間',
      meta: { class: { th: 'text-center', td: 'text-center text-white/50 text-[12px] tabular-nums' } },
      cell: ({ row }) => formatDate(row.getValue('createdAt') as string),
    },
  ];

  // ==================== Fetch ====================

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (statusFilter.value) params.status = statusFilter.value;

      const resp = await useApi().getDepositOrders(params);
      if (resp?.code === 200 && resp.result) {
        orders.value = resp.result.items || [];
        const p = resp.result.pagination;
        if (p) {
          pagination.total = p.total || 0;
          pagination.totalPages = p.totalPages || 0;
        }
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };

  const onStatusChange = () => {
    pagination.page = 1;
    fetchOrders();
  };

  const onPageChange = (page: number) => {
    pagination.page = page;
    fetchOrders();
  };

  onMounted(() => {
    fetchOrders();
  });
</script>
