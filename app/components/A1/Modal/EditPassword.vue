<template>
  <UModal close-icon="i-lucide-arrow-right" title="變梗登入密碼" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :loading
          :schema
          :validate-on="['blur', 'change', 'input']"
          :fields
          @submit="onSubmit">
          <template #submit="{ loading }">
            <UButton type="submit" block :loading="loading">
              {{ loading ? '變更中…' : '確認變更' }}
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
    onSuccess: Function;
  }>();

  const toast = useToast();

  const fields: AuthFormField[] = [
    {
      name: 'password',
      label: '當前密碼',
      type: 'password',
      placeholder: '請輸入當前密碼',
      required: true,
    },
    {
      name: 'newPassword',
      label: '新密碼',
      type: 'password',
      placeholder: '請輸入新密碼',
      required: true,
    },
    {
      name: 'confirmPassword',
      label: '確認密碼',
      type: 'password',
      placeholder: '請再次確認並輸入新密碼',
      required: true,
    },
  ];

  const schema = z
    .object({
      password: z.string('請輸入當前密碼').min(6, '最少需要6位數'),
      newPassword: z.string('請輸入新密碼').min(6, '最少需要6位數'),
      confirmPassword: z.string('請再次確認並輸入新密碼').min(6, '最少需要6位數'),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (newPassword !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: '確認密碼與新密碼不符合',
        });
      }
    });

  const loading = ref(false);
  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    loading.value = true;
    useApi()
      .editPassword(payload.data)
      .then((res) => {
        const { code } = res;
        if (code === 200) {
          toast.add({ title: '通知', description: '變更成功, 下次登入時將使用您的新密碼' });
          onSuccess();
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
</script>
