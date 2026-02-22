<template>
  <div>
    <UForm
      ref="UFormRef"
      class="w-full space-y-4"
      :schema
      :state
      @submit="onSubmit"
      :validate-on="['input', 'blur']">
      <UPageCard
        class="w-full"
        :ui="{ body: 'w-full', header: 'w-full space-y-4' }"
        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.">
        <template #header>
          <div class="text-[20px] font-bold">{{ $t('setting.profile') }}</div>
          <USeparator />
        </template>
        <template #title>
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
            <UUser
              :name="store.getUserDetail?.name"
              :ui="{ description: 'text-[14px] sm:text-[16px] text-white' }"
              :description="`${$t('setting.accountLabel')} : ${store.getUserDetail?.account}`"
              :avatar="{
                src: 'https://github.com/benjamincanac.png',
                icon: 'i-lucide-image',
                class: 'size-10 sm:size-[50px]',
              }" />
            <UButton size="sm" class="cursor-pointer">{{ $t('setting.editAvatar') }}</UButton>
          </div>
        </template>
      </UPageCard>
      <UPageCard class="w-full" :ui="{ body: 'w-full', header: 'w-full space-y-4' }">
        <template #header>
          <div class="text-[20px] font-bold">{{ $t('setting.contact') }}</div>
          <USeparator />
        </template>
        <template #title>
          <div class="space-y-4 justify-between items-center w-full">
            <UFormField
              v-for="field in vertifyInfoFields"
              :key="field.name"
              size="xl"
              :name="field.name"
              :ui="{ label: 'mb-1' }"
              :label="field.label">
              <template v-if="field.type === 'email'">
                <UInput
                  v-model="state.email"
                  :disabled="isVerify.email"
                  :ui="{ root: 'w-full' }"
                  :placeholder="field.placeholder" />
              </template>
              <template v-else-if="field.type === 'mobile'">
                <UFieldGroup class="w-full">
                  <USelectMenu
                    type="button"
                    :ui="{ content: 'w-[230px]' }"
                    v-model="state.country"
                    :icon="state.country?.icon"
                    :items="countryItems"
                    @change.stop
                    @input.stop
                    @blur.stop
                    @focus.stop
                    @keydown.stop
                    @click.stop />
                  <UInput
                    v-model="state.mobile"
                    :disabled="isVerify.mobile"
                    :ui="{ root: 'w-full' }"
                    :placeholder="field.placeholder" />
                </UFieldGroup>
              </template>
              <template #hint>
                <div class="flex items-center">
                  <template v-if="isVerify[field.name]">
                    <Icon :name="'icon-park:success'" class="text-[24px] text-[red]" />
                    <span class="text-[14px] text-white/50"> {{ $t('common.verified') }} </span>
                  </template>
                  <template v-else>
                    <UButton
                      size="xs"
                      :disabled="isVerify[field.name]"
                      class="cursor-pointer"
                      loading-auto
                      @click="onVerify(field.name)">
                      {{ $t('common.verifyNow') }}
                    </UButton>
                  </template>
                </div>
              </template>
            </UFormField>
          </div>
        </template>
      </UPageCard>
      <UPageCard class="w-full" :ui="{ body: 'w-full', header: 'w-full space-y-4' }">
        <template #header>
          <div class="text-[20px] font-bold">{{ $t('setting.accountLink') }}</div>
          <USeparator />
        </template>
        <template #title>
          <div class="space-y-4 justify-between items-center w-full">
            <UFormField
              v-for="field in bindInfoFields"
              size="xl"
              :key="field.name"
              :name="field.name"
              :ui="{ label: 'mb-1' }"
              :label="field.label">
              <template v-if="field.type === 'text'">
                <UInput
                  :icon="field.icon"
                  v-model="state[field.name]"
                  :ui="{ root: 'w-full' }"
                  :placeholder="field.placeholder"
                  disabled>
                  <template #trailing>
                    <UButton
                      :color="isVerify[field.name] ? 'error' : 'primary'"
                      size="xs"
                      :icon="
                        isVerify[field.name]
                          ? 'fluent:plug-disconnected-16-filled'
                          : 'file-icons:binder'
                      "
                      class="font-bold rounded-full">
                      {{ isVerify[field.name] ? $t('common.unbind') : $t('common.bind') }}
                    </UButton>
                  </template>
                </UInput>
              </template>
            </UFormField>
          </div>
        </template>
      </UPageCard>
      <UPageCard class="w-full" :ui="{ body: ' w-full', header: 'w-full space-y-4' }">
        <template #header>
          <div class="text-[20px] font-bold">{{ $t('setting.privacy') }}</div>
          <USeparator />
        </template>
        <template #title>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <UPageCard :title="$t('setting.changePassword')" :description="$t('setting.changePasswordDesc')">
              <template #leading>
                <div class="flex">
                  <Icon name="icon-park:exchange-three" size="40px" />
                </div>
              </template>
              <template #footer>
                <UButton @click="modals.editPassword.open()" class="w-full">{{ $t('setting.changePassword') }}</UButton>
              </template>
            </UPageCard>
            <UPageCard
              :title="$t('setting.twoFactor')"
              :description="$t('setting.twoFactorDesc')"
              icon="i-simple-icons-tailwindcss">
              <template #leading>
                <div class="flex">
                  <Icon name="streamline-plump-color:padlock-key-flat" size="40px" />
                </div>
              </template>
              <template #footer>
                <UButton
                  :disabled="store.getUserDetail.googleAuthEnabled"
                  @click="modals.googleAuth.open()"
                  class="w-full">
                  {{ store.getUserDetail.googleAuthEnabled ? $t('auth.enabled') : $t('auth.enable2FA') }}
                </UButton>
              </template>
            </UPageCard>
          </div>
        </template>
      </UPageCard>
      <div
        v-if="store.getUserDetail.loginLogs"
        class="w-full space-y-4 pb-4 bg-slate-900 rounded-lg">
        <div
          class="flex flex-col sm:flex-row sm:justify-between gap-2 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-accented">
          <div class="text-[16px] sm:text-[20px] px-0 sm:px-2 font-bold">{{ $t('setting.loginLocations') }}</div>
          <UInput
            v-model="globalFilter"
            class="w-full sm:max-w-sm sm:w-[50%]"
            :placeholder="$t('setting.searchPlaceholder')" />
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <UTable
            ref="UTableRef"
            v-model:pagination="pagination"
            v-model:global-filter="globalFilter"
            :data="store.getUserDetail.loginLogs"
            :columns="columns"
            :pagination-options="{
              getPaginationRowModel: getPaginationRowModel(),
            }"
            :ui="{ root: 'min-w-[560px]' }"
            class="flex-1" />
        </div>
        <div class="flex justify-center border-t border-default pt-4 px-4">
          <UPagination
            :page="(UTableRef?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="UTableRef?.tableApi?.getState().pagination.pageSize"
            :total="UTableRef?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => UTableRef?.tableApi?.setPageIndex(p - 1)" />
        </div>
      </div>
    </UForm>
  </div>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import moment from 'moment-timezone';
  import type { FormSubmitEvent, TableColumn } from '@nuxt/ui';
  import { getPaginationRowModel } from '@tanstack/vue-table';
  import {
    A1ModalVerifyUserInfo,
    UBadge,
    A1ModalBindGoogleAuth,
    A1ModalEditPassword,
  } from '#components';

  const { t } = useI18n();

  useApi()
    .getUserDetailCsr({ RELATED: ['LOGIN_LOG'] })
    .then((res) => store.setUserDetail(res.result));

  const UFormRef = useTemplateRef('UFormRef');
  const UTableRef = useTemplateRef('UTableRef');

  const store = useStore();
  const overlay = useOverlay();

  const schema = z.object({
    country: z.object({ label: z.string(), icon: z.string() }),
    email: z.string().min(3).email(t('validation.emailFormat')),
    mobile: z.string(t('validation.enterPhone')).regex(/^\d+$/, t('validation.phoneDigitOnly')),
    telegram: z.string().nullable(),
    google: z.string().nullable(),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    country: { label: t('setting.countryTaiwan'), icon: 'cif:tw' },
    email: store.getUserDetail?.email,
    mobile: store.getUserDetail?.mobile,
    telegram: store.getUserDetail?.telegram,
    google: store.getUserDetail?.google,
  });

  const isVerify = computed(
    () =>
      ({
        email: !!store.getUserDetail?.email,
        mobile: !!store.getUserDetail?.mobile,
        telegram: !!store.getUserDetail?.telegram,
        google: !!store.getUserDetail?.google,
      }) as const,
  );

  const vertifyInfoFields = [
    {
      name: 'email',
      type: 'email',
      label: t('setting.emailVerify'),
      placeholder: t('common.notBound'),
    },
    {
      name: 'mobile',
      type: 'mobile',
      label: t('setting.phoneVerify'),
      placeholder: t('common.notBound'),
    },
  ] as const;

  const bindInfoFields = [
    {
      name: 'telegram',
      type: 'text',
      label: 'Telegram',
      icon: 'logos:telegram',
      placeholder: t('common.notBound'),
    },
    {
      name: 'google',
      type: 'text',
      label: 'Google',
      icon: 'devicon:google',
      placeholder: t('common.notBound'),
    },
  ] as const;

  type VerifyAction = keyof typeof isVerify.value;
  const vertifyPayload = reactive<{
    info: string;
    actionType: VerifyAction;
    onReSend: Function;
    onSuccess: Function;
  }>({
    info: '',
    actionType: 'email',
    onReSend: async () => ({}),
    onSuccess: async () => ({}),
  });

  const onVerify = async (action: VerifyAction) => {
    if (!UFormRef.value) return Promise.resolve();
    return UFormRef.value.validate({ name: action }).then(async (values) => {
      if (action === 'email') {
        const { code } = await useApi().sendVerifyEmail({ email: values.email });

        if (code === 200) {
          vertifyPayload.info = values.email;
          vertifyPayload.actionType = 'email';
          vertifyPayload.onSuccess = () => modals.vertifyUserInfo.close();
          modals.vertifyUserInfo.open();
        }
        return;
      }

      if (action === 'mobile') {
        const { code } = await useApi().sendVerifyMobile({
          mobile: values.mobile,
          country: values.country,
        });

        if (code === 200) {
          vertifyPayload.info = values.mobile;
          vertifyPayload.actionType = 'mobile';
          vertifyPayload.onSuccess = () => modals.vertifyUserInfo.close();
          modals.vertifyUserInfo.open();
        }
        return;
      }
    });
  };

  const countryItems = computed(() => {
    const countryCodes = store?.getCountryCodes;
    const isArray = Array.isArray(countryCodes);
    return isArray
      ? countryCodes.map((i: any) => {
          return {
            label: `${i.callingCode}-${i.name}`,
            icon: `cif:${i.country}`.toLocaleLowerCase(),
          };
        })
      : [];
  });

  const onSubmit = (event: FormSubmitEvent<Schema>) => {};

  const modals = reactive({
    vertifyUserInfo: overlay.create(A1ModalVerifyUserInfo, {
      defaultOpen: false,
      destroyOnClose: false,
      props: vertifyPayload,
    }),
    googleAuth: overlay.create(A1ModalBindGoogleAuth, {
      props: {
        onSuccess: () => {
          modals.googleAuth.close();
        },
      },
    }),
    editPassword: overlay.create(A1ModalEditPassword, {
      props: {
        onSuccess: () => {
          modals.editPassword.close();
        },
      },
    }),
  });

  const globalFilter = ref('');

  type LoginLog = {
    device: string;
    ip: string;
    lastUse: string;
    action: number;
  };

  const columns: TableColumn<LoginLog>[] = [
    {
      accessorKey: 'ip',
      header: t('setting.ipAddress'),
      meta: { class: { th: 'text-center w-1/4', td: 'text-center font-medium w-1/4' } },
    },
    {
      accessorKey: 'device',
      header: t('setting.device'),
      meta: { class: { th: 'text-center w-1/4', td: 'text-center font-medium w-1/4' } },
      cell: ({ row }) => {
        const device = String(row.getValue('device') ?? '');
        return h(
          'div',
          { class: 'mx-auto max-w-[360px] text-center break-words whitespace-normal line-clamp-2' },
          device,
        );
      },
    },
    {
      accessorKey: 'lastUse',
      header: t('setting.lastUsed'),
      meta: { class: { th: 'text-center w-1/4', td: 'text-center font-medium w-1/4' } },
      cell: ({ row }) => {
        const s = moment(row.getValue('lastUse')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
        const [date, time] = s.split(' ');
        return h('div', { class: 'text-center leading-5 whitespace-normal' }, [
          h('div', date),
          h('div', time),
        ]);
      },
    },
    {
      accessorKey: 'action',
      header: t('setting.action'),
      meta: { class: { th: 'text-center w-1/4', td: 'text-center font-medium w-1/4' } },
      cell: ({ row }) => {
        const color = {
          LOGIN: 'success' as const,
          DEL: 'error' as const,
          LOGOUT: 'error' as const,
          UNCAPTURED: 'neutral' as const,
        }[row.getValue('action') as string];
        return h(
          UBadge,
          { class: 'capitalize', variant: 'subtle', color },
          () => store.getEnums.AUTH_ENUM.LOGIN_LOG.ACTION[row.getValue('action') as string],
        );
      },
    },
  ];

  const pagination = ref({
    pageIndex: 0,
    pageSize: 5,
  });
</script>
