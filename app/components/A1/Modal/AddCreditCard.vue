<template>
  <UModal :title="$t('creditCard.addTitle')" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UForm
        ref="formRef"
        class="space-y-4"
        :schema
        :state
        :validate-on="['blur', 'input']"
        @submit="onSubmit">
        <UFormField :label="$t('creditCard.cardNumber')" name="cardNumber" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.cardNumber"
            :placeholder="$t('creditCard.enterCard1319')"
            icon="i-lucide-credit-card"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <UFormField :label="$t('creditCard.holderName')" name="holderName" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.holderName"
            :placeholder="$t('creditCard.enterHolderName')"
            icon="i-lucide-user"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('creditCard.expiryDate')" name="expiryDate" :ui="{ label: 'text-white/70 mb-1' }">
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
              :placeholder="$t('creditCard.cvvPlaceholder')"
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

  const schema = z.object({
    cardNumber: z.string().regex(/^\d{13,19}$/, t('validation.cardNumber1319')),
    holderName: z.string().min(2, t('validation.enterHolderName')),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.formatMMYY')),
    cvv: z.string().regex(/^\d{3,4}$/, t('validation.cvv34')),
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
        toast.add({ title: t('common.notify'), description: t('creditCard.addSuccess') });
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };
</script>
