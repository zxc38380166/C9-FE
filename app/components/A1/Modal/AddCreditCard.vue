<template>
  <UModal title="新增信用卡" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UForm
        ref="formRef"
        class="space-y-4"
        :schema
        :state
        :validate-on="['blur', 'input']"
        @submit="onSubmit">
        <UFormField label="卡號" name="cardNumber" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.cardNumber"
            placeholder="請輸入 13-19 位卡號"
            icon="i-lucide-credit-card"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <UFormField label="持卡人姓名" name="holderName" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.holderName"
            placeholder="請輸入持卡人姓名"
            icon="i-lucide-user"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="到期日" name="expiryDate" :ui="{ label: 'text-white/70 mb-1' }">
            <UInput
              v-model="state.expiryDate"
              placeholder="MM/YY"
              icon="i-lucide-calendar"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              }" />
          </UFormField>

          <UFormField label="CVV" name="cvv" :ui="{ label: 'text-white/70 mb-1' }">
            <UInput
              v-model="state.cvv"
              placeholder="3-4 位數"
              type="password"
              icon="i-lucide-lock"
              :ui="{
                base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              }" />
          </UFormField>
        </div>

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

  const schema = z.object({
    cardNumber: z.string().regex(/^\d{13,19}$/, '卡號需 13-19 位數字'),
    holderName: z.string().min(2, '請輸入持卡人姓名'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, '格式為 MM/YY'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV 需 3-4 位數字'),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    cardNumber: '',
    holderName: '',
    expiryDate: '',
    cvv: '',
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    try {
      const { code } = await useApi().addCreditCard(event.data);
      if (code === 200) {
        toast.add({ title: '通知', description: '信用卡新增成功' });
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };
</script>
