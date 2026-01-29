<template>
  <UModal
    close-icon="i-lucide-arrow-right"
    title="啟動 Google Authenticator"
    :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <div class="w-full flex justify-center">
          <img
            v-if="googleAuthData.qrCode"
            :src="googleAuthData.qrCode"
            class="w-[200px] h-[200px]" />
          <USkeleton v-else class="w-[200px] h-[200px]" />
        </div>
        <UAuthForm
          :schema
          :validate-on="['input']"
          :title="`備用金鑰（請妥善保存) ${googleAuthData.secret}`"
          :description="'啟用 Google Authenticator 後，登入與重要操作將需要輸入動態驗證碼'"
          :fields
          :providers="[]"
          :ui="{
            title: 'text-[14px] min-h-[50px]',
            description: 'text-[14px] text-[red]',
            header: 'min-h-[100px]',
          }"
          @submit="onSubmit">
          <template #submit>
            <UButton type="submit" block> 確認啟用 </UButton>
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
    onSuccess: Function;
  }>();

  const toast = useToast();
  const { refreshUserData } = useAuth();

  const fields: AuthFormField[] = [
    {
      name: 'otp',
      type: 'otp',
      label: '6 位數驗證碼',
      length: 6,
      placeholder: '○',
    },
  ];

  const schema = z.object({
    otp: z
      .array(z.string())
      .length(6, 'OTP 必須是 6 位數')
      .refine((arr) => arr.every((v) => v !== ''), 'OTP 不可有空值'),
  });

  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    useApi()
      .enableGoogle({ code: payload.data.otp.join('') })
      .then(async (res) => {
        if (res.code === 200) {
          toast.add({ title: '通知', description: '啟用成功' });
          await refreshUserData();
          onSuccess();
        } else {
          toast.add({ title: '通知', description: res.message });
        }
      });
  };

  const googleAuthData = ref({ qrCode: '', secret: '' });
  const generateGoogle = async () => {
    const res = await useApi().generateGoogle();
    googleAuthData.value = res.result;
  };

  onMounted(() => {
    generateGoogle();
  });
</script>
