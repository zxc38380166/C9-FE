<template>
  <UModal close-icon="i-lucide-arrow-right" :title="$t('auth.otpTitle')" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          ref="UAuthFormRef"
          :schema
          :loading
          :validate-on="['input']"
          :title="$t('auth.otpSentTo', { type: actionType })"
          :description="info"
          icon="material-symbols:key-outline-rounded"
          :fields
          :providers
          @submit="onSubmit">
          <template #submit="{ loading }">
            <UButton type="submit" block :loading="loading">
              {{ loading ? $t('auth.binding') : $t('auth.confirmBind') }}
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

  const {
    info = '',
    actionType = 'email',
    onReSend = async () => ({}),
    onSuccess = async () => ({}),
  } = defineProps<{
    info: string;
    actionType: string;
    onReSend: Function;
    onSuccess: Function;
  }>();

  const { t } = useI18n();
  const toast = useToast();
  const { refreshUserData } = useAuth();
  const { resendOtp } = useAuth();
  const { remaining, isRunning, canResend, format, start, stop } = resendOtp({
    cooldownSeconds: 60,
  });

  const UAuthFormRef = useTemplateRef('UAuthFormRef');

  const fields: AuthFormField[] = [
    {
      name: 'otp',
      type: 'otp',
      label: 'OTP',
      length: 6,
      placeholder: '○',
    },
  ];

  const providers = computed(() => [
    {
      label: canResend.value ? t('auth.resendOtp') : t('auth.resendCountdown', { time: format.value }),
      icon: 'ic:outline-restart-alt',
      disabled: !canResend.value,
      async onClick() {
        if (!canResend.value) return;
        onReSend({ remaining, isRunning, canResend, format, start, stop });
      },
    },
  ]);

  const schema = z.object({
    otp: z
      .array(z.string())
      .length(6, t('validation.enterOtp6'))
      .refine((arr) => arr.every((v) => v !== ''), t('validation.enterOtp6')),
  });

  const loading = ref(false);
  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    loading.value = true;
    const actionMap: Record<string, Function> = {
      async email() {
        const { code } = await useApi().checkVerifyEmail({
          email: info,
          code: payload.data.otp.join(''),
        });

        if (code === 200) {
          toast.add({ title: t('common.notify'), description: t('auth.bindSuccess') });
          await refreshUserData();
          onSuccess();
        }

        loading.value = false;
      },
    };

    if (actionMap[actionType]) actionMap[actionType]();
  };

  onMounted(() => {
    nextTick(() => {
      onReSend({ remaining, isRunning, canResend, format, start, stop });
      if (UAuthFormRef.value) UAuthFormRef.value.state.otp = [];
    });
  });
</script>
