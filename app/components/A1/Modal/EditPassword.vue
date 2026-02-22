<template>
  <UModal close-icon="i-lucide-arrow-right" :title="$t('auth.changePasswordTitle')" :ui="{ title: 'text-[20px]' }">
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
              {{ loading ? $t('auth.changing') : $t('auth.confirmChange') }}
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

  const { t } = useI18n();
  const toast = useToast();

  const fields: AuthFormField[] = [
    {
      name: 'password',
      label: t('auth.currentPassword'),
      type: 'password',
      placeholder: t('auth.enterCurrentPassword'),
      required: true,
    },
    {
      name: 'newPassword',
      label: t('auth.newPassword'),
      type: 'password',
      placeholder: t('auth.enterNewPassword'),
      required: true,
    },
    {
      name: 'confirmPassword',
      label: t('auth.confirmPasswordLabel'),
      type: 'password',
      placeholder: t('auth.reenterNewPassword'),
      required: true,
    },
  ];

  const schema = z
    .object({
      password: z.string(t('auth.enterCurrentPassword')).min(6, t('validation.minChars6')),
      newPassword: z.string(t('auth.enterNewPassword')).min(6, t('validation.minChars6')),
      confirmPassword: z.string(t('auth.reenterNewPassword')).min(6, t('validation.minChars6')),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (newPassword !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: t('validation.passwordMismatch'),
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
          toast.add({ title: t('common.notify'), description: t('auth.passwordChanged') });
          onSuccess();
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
</script>
