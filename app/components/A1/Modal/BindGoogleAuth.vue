<template>
  <UModal
    close-icon="i-lucide-arrow-right"
    title="啟動 Google Authenticator"
    :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <div class="w-full flex justify-center">
          <img v-if="googleAuthData.qrCode" :src="googleAuthData.qrCode" class="w-50 h-50" />
          <USkeleton v-else class="w-50 h-50" />
        </div>
        <UAuthForm
          ref="UAuthFormRef"
          :loading
          :schema="schema"
          :validate-on="['input']"
          :title="`備用金鑰（請妥善保存) ${googleAuthData.secret}`"
          :description="'啟用 Google Authenticator 後，登入與重要操作將需要輸入動態驗證碼'"
          :fields
          :ui="{
            title: 'text-[14px] min-h-[50px]',
            description: 'text-[14px] text-[red]',
            header: 'min-h-[100px]',
          }"
          @submit="onSubmit">
          <template #submit="{ loading }">
            <UButton type="submit" block :loading="loading">
              {{ loading ? '啟用中…' : '確認啟用' }}
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

  const toast = useToast();
  const { refreshUserData } = useAuth();

  const UAuthFormRef = useTemplateRef('UAuthFormRef');

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
      .length(6, '請輸入 6 位數驗證碼')
      .refine((arr) => arr.every((v) => v !== ''), '請輸入 6 位數驗證碼'),
  });

  const loading = ref(false);
  type Schema = z.output<typeof schema>;
  const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
    try {
      loading.value = true;
      const code = payload.data.otp.join('');
      const res = await useApi().enableGoogleAuth({ code });

      if (res.code === 200) {
        toast.add({ title: '通知', description: '啟用成功' });
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
    googleAuthData.value = res.result;
    if (UAuthFormRef.value) UAuthFormRef.value.state.otp = [];
  };

  onMounted(() => {
    generateGoogleAuth();
  });
</script>
