<template>
  <UModal :title="$t('crypto.addTitle')" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UForm
        ref="formRef"
        class="space-y-4"
        :schema
        :state
        :validate-on="['blur', 'input']"
        @submit="onSubmit">
        <UFormField :label="$t('crypto.walletName')" name="walletName" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.walletName"
            :placeholder="$t('crypto.enterWalletName')"
            icon="i-lucide-wallet"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('crypto.currency')" name="currency" :ui="{ label: 'text-white/70 mb-1' }">
            <UInput
              v-model="state.currency"
              disabled
              icon="i-lucide-bitcoin"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              }" />
          </UFormField>

          <UFormField :label="$t('crypto.network')" name="network" :ui="{ label: 'text-white/70 mb-1' }">
            <USelectMenu
              v-model="state.network"
              :items="networkOptions"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
                content: 'w-full bg-slate-900 ring-1 ring-white/10',
              }"
              icon="i-lucide-network"
              :placeholder="$t('crypto.selectNetwork')"
              value-key="value" />
          </UFormField>
        </div>

        <UFormField :label="$t('crypto.address')" name="address" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.address"
            :placeholder="$t('crypto.enterAddress')"
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
          {{ loading ? $t('common.submitting') : $t('common.confirmAdd') }}
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

  const { t } = useI18n();
  const toast = useToast();
  const loading = ref(false);

  const networkOptions = [
    { label: 'TRC-20', value: 'TRC-20' },
    { label: 'ERC-20', value: 'ERC-20' },
  ];

  const schema = z.object({
    walletName: z.string().min(1, t('validation.enterWalletName')),
    currency: z.string().min(1, t('validation.selectCurrency')),
    network: z.string().min(1, t('validation.selectNetwork')),
    address: z.string().min(10, t('validation.enterValidAddress')),
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
        toast.add({ title: t('common.notify'), description: t('crypto.addSuccess') });
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };
</script>
