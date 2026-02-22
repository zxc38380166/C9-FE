<template>
  <UModal
    close-icon="i-lucide-arrow-right"
    :title="$t('auth.googleAuthTitle')"
    :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <div class="w-full flex justify-center">
          <NuxtImg v-if="googleAuthData.qrCode" :src="googleAuthData.qrCode" class="w-50 h-50" />
          <USkeleton v-else class="w-50 h-50" />
        </div>
        <UAuthForm
          ref="UAuthFormRef"
          :loading
          :schema="schema"
          :validate-on="['input']"
          :title="`${$t('auth.backupKey')} ${googleAuthData.secret}`"
          :description="$t('auth.googleAuthDesc')"
          :fields
          :ui="{
            title: 'text-[14px] min-h-[50px]',
            description: 'text-[14px] text-[red]',
            header: 'min-h-[100px]',
          }"
          @submit="onSubmit">
          <template #submit="{ loading }">
            <UButton type="submit" block :loading="loading">
              {{ loading ? $t('auth.enabling') : $t('auth.confirmEnable') }}
            </UButton>
          </template>
        </UAuthForm>
      </UPageCard>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

  const { onSuccess = () => {} } = defineProps<{
    onSuccess?: () => void;
  }>();

  const { t } = useI18n();
  const toast = useToast();
  const { refreshUserData } = useAuth();

  const UAuthFormRef = useTemplateRef('UAuthFormRef');

  const fields: AuthFormField[] = [
    {
      name: 'otp',
      type: 'otp',
      label: t('auth.otpLabel'),
      length: 6,
      placeholder: '○',
    },
  ];

  const schema = z.object({
    otp: z
      .array(z.string())
      .length(6, t('validation.enterOtp6'))
      .refine((arr) => arr.every((v) => v !== ''), t('validation.enterOtp6')),
  });

  const loading = ref(false);
  type Schema = z.output<typeof schema>;
  const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
    try {
      loading.value = true;
      const code = payload.data.otp.join('');
      const res = await useApi().enableGoogleAuth({ code });

      if (res.code === 200) {
        toast.add({ title: t('common.notify'), description: t('auth.enableSuccess') });
        await refreshUserData();
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };

  const googleAuthData = ref({ qrCode: '', secret: '' });
  const generateGoogleAuth = async () => {
    const res = await useApi().generateGoogleAuth();
    if (res.result) {
      googleAuthData.value = res.result;
    }
    if (UAuthFormRef.value) UAuthFormRef.value.state.otp = [];
  };

  onMounted(() => {
    generateGoogleAuth();
  });
</script>
