<template>
  <UModal close-icon="i-lucide-arrow-right" title="輸入 OTP 密碼" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema
          :validate-on="['input']"
          :title="`已發送驗證碼至以下${actionType}: `"
          :description="info"
          icon="material-symbols:key-outline-rounded"
          :fields
          :providers
          @submit="onSubmit" />
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

  const toast = useToast();
  const { refreshUserData } = useAuth();
  const { resendOtp } = useAuth();
  const { remaining, isRunning, canResend, format, start, stop } = resendOtp({
    cooldownSeconds: 60,
  });

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
      label: canResend.value ? '重新發送驗證碼' : `倒數 ${format.value} 後才能再次發送`,
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
      .length(6, 'OTP 必須是 6 位數')
      .refine((arr) => arr.every((v) => v !== ''), 'OTP 不可有空值'),
  });

  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    const actionMap: Record<string, Function> = {
      async email() {
        const { code, message } = await useApi().checkVerifyEmail({
          email: info,
          code: payload.data.otp.join(''),
        });

        if (code === 200) {
          toast.add({ title: '通知', description: '綁定成功' });
          await refreshUserData();
          onSuccess();
        } else {
          toast.add({ title: '通知', description: message });
        }
      },
    };

    if (actionMap[actionType]) actionMap[actionType]();
  };

  onMounted(() => {
    nextTick(() => {
      onReSend({ remaining, isRunning, canResend, format, start, stop });
    });
  });
</script>
