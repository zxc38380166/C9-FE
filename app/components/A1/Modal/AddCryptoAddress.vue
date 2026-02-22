<template>
  <UModal title="新增加密貨幣錢包" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UForm
        ref="formRef"
        class="space-y-4"
        :schema
        :state
        :validate-on="['blur', 'input']"
        @submit="onSubmit">
        <UFormField label="錢包名稱" name="walletName" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.walletName"
            placeholder="請輸入錢包名稱"
            icon="i-lucide-wallet"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="幣種" name="currency" :ui="{ label: 'text-white/70 mb-1' }">
            <UInput
              v-model="state.currency"
              disabled
              icon="i-lucide-bitcoin"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              }" />
          </UFormField>

          <UFormField label="網路" name="network" :ui="{ label: 'text-white/70 mb-1' }">
            <USelectMenu
              v-model="state.network"
              :items="networkOptions"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
                content: 'w-full bg-slate-900 ring-1 ring-white/10',
              }"
              icon="i-lucide-network"
              placeholder="請選擇網路"
              value-key="value" />
          </UFormField>
        </div>

        <UFormField label="錢包地址" name="address" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.address"
            placeholder="請輸入錢包地址"
            icon="i-lucide-hash"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <UButton
          type="submit"
          block
          size="xl"
          :loading
          class="cursor-pointer rounded-[12px]"
          :ui="{
            base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
          }">
          {{ loading ? '提交中…' : '確認新增' }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent } from '@nuxt/ui';

  const { onSuccess = () => {} } = defineProps<{
    onSuccess: Function;
  }>();

  const toast = useToast();
  const loading = ref(false);

  const networkOptions = [
    { label: 'TRC-20', value: 'TRC-20' },
    { label: 'ERC-20', value: 'ERC-20' },
  ];

  const schema = z.object({
    walletName: z.string().min(1, '請輸入錢包名稱'),
    currency: z.string().min(1, '請選擇幣種'),
    network: z.string().min(1, '請選擇網路'),
    address: z.string().min(10, '請輸入有效的錢包地址'),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    walletName: '',
    currency: 'USDT',
    network: 'TRC-20',
    address: '',
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    try {
      const { code } = await useApi().addCryptoAddress(event.data);
      if (code === 200) {
        toast.add({ title: '通知', description: '加密貨幣錢包新增成功' });
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };
</script>
