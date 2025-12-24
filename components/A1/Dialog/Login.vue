<template>
  <el-dialog
    v-model="visibleProxy"
    :show-close="false"
    :close-on-click-modal="closeOnMask"
    :close-on-press-escape="closeOnEsc"
    :lock-scroll="lockScroll"
    :width="width"
    :append-to-body="appendToBody"
    :align-center="true"
    class="login-dialog"
    :style="dialogInlineStyle"
    :header-class="'absolute top-[-9999]'"
    :body-class="bodyClass"
    :footer-class="footerClass">
    <!-- Header -->
    <template #header>
      <div />
    </template>
    <!-- Content -->
    <div class="space-y-4 text-white h-[calc(100vh-250px)] overflow-auto scrollable-hidden">
      <div class="flex items-center justify-between">
        <div class="select-none text-white text-[34px] font-extrabold leading-none tracking-wide">
          {{ logoText }}
        </div>

        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
          @click="onClose">
          <i class="mdi mdi-close text-xl" />
        </button>
      </div>
      <div class="space-y-3">
        <!-- Account -->
        <div>
          <div class="pb-[5px] text-white/85">{{ accountLabel }}</div>
          <div class="relative">
            <input
              :value="accountValue"
              @input="setFieldValue('account', ($event.target as HTMLInputElement).value)"
              @blur="accountBlur"
              :placeholder="accountPlaceholder"
              :disabled="disabled || loading"
              autocomplete="username"
              class="w-full h-11 rounded-xl px-4 pr-10 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.account
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />

            <!-- clear -->
            <button
              v-if="String(accountValue || '').length > 0 && !(disabled || loading)"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
              @click="setFieldValue('account', '')"
              aria-label="clear account">
              <i class="mdi mdi-close text-lg text-white/80" />
            </button>
          </div>

          <div v-if="errors.account" class="mt-1 text-red-400 text-sm">
            {{ errors.account }}
          </div>
        </div>

        <!-- Password -->
        <div>
          <div class="pb-[5px] text-white/85">{{ passwordLabel }}</div>

          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              :value="passwordValue"
              @input="setFieldValue('password', ($event.target as HTMLInputElement).value)"
              @blur="passwordBlur"
              @keyup.enter="submit"
              :placeholder="passwordPlaceholder"
              :disabled="disabled || loading"
              autocomplete="current-password"
              class="w-full h-11 rounded-xl px-4 pr-12 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.password
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />

            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="disabled || loading"
              @click="showPassword = !showPassword"
              aria-label="toggle password">
              <i
                class="mdi text-lg text-white/80"
                :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>

          <div v-if="errors.password" class="mt-1 text-red-400 text-sm">
            {{ errors.password }}
          </div>
        </div>

        <!-- Forgot -->
        <div class="-mt-1">
          <button
            type="button"
            class="text-sm text-white/85 hover:text-white transition underline-offset-2 hover:underline disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('forgot')">
            {{ forgotText }}
          </button>
        </div>

        <!-- Primary -->
        <button
          type="button"
          class="h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-b from-[#77cbac] to-[#1a6b52] text-white hover:brightness-110 active:brightness-95"
          :disabled="disabled || loading"
          @click="submit">
          <span v-if="!loading">{{ loginText }}</span>
          <span v-else class="inline-flex items-center gap-2">
            <i class="mdi mdi-loading mdi-spin text-lg" />
            {{ loadingText }}
          </span>
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 pt-1">
          <div class="h-px flex-1 bg-white/10" />
          <div class="text-xs whitespace-nowrap text-white/55">
            {{ orText }}
          </div>
          <div class="h-px flex-1 bg-white/10" />
        </div>

        <!-- Alt buttons -->
        <div class="space-y-3">
          <button
            type="button"
            class="h-11 w-full rounded-xl border border-white/10 bg-white/5 text-white/90 flex items-center justify-center gap-3 font-semibold transition hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('passkey')">
            <i class="mdi mdi-account-key-outline text-lg" />
            <span>{{ passkeyText }}</span>
          </button>

          <button
            type="button"
            class="h-11 w-full rounded-xl border border-white/10 bg-white/5 text-white/90 flex items-center justify-center gap-3 font-semibold transition hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('google')">
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-extrabold text-white/90">
              G
            </span>
            <span>{{ googleText }}</span>
          </button>

          <button
            type="button"
            class="h-11 w-full rounded-xl border border-white/10 bg-white/5 text-white/90 flex items-center justify-center font-semibold transition hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('other')">
            <span>{{ otherText }}</span>
          </button>
        </div>

        <!-- Bottom -->
        <div class="pt-2 flex items-center justify-center gap-2">
          <span class="text-sm text-white/55">{{ noAccountText }}</span>
          <button
            type="button"
            class="text-sm font-semibold text-white/90 hover:underline underline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('register')">
            {{ registerText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Footer（可選） -->
    <template v-if="showFooter" #footer>
      <div class="flex justify-end gap-2">
        <el-button v-if="showCancel" @click="onClose" class="!border-0">
          {{ cancelTextLabel }}
        </el-button>
        <el-button type="success" @click="submit" :disabled="disabled || loading" class="!border-0">
          {{ confirmTextLabel }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import * as yup from 'yup';

  type LoginPayload = {
    account: string;
    password: string;
  };

  const store = useStore();
  const props = withDefaults(
    defineProps<{
      modelValue: boolean;

      width?: string | number;
      closeOnMask?: boolean;
      closeOnEsc?: boolean;
      lockScroll?: boolean;
      appendToBody?: boolean;

      disabled?: boolean;

      logoText?: string;
      accountLabel?: string;
      accountPlaceholder?: string;
      passwordLabel?: string;
      passwordPlaceholder?: string;

      forgotText?: string;
      loginText?: string;
      loadingText?: string;

      orText?: string;
      passkeyText?: string;
      googleText?: string;
      otherText?: string;

      noAccountText?: string;
      registerText?: string;

      // dialog theme（你原本就用 inline style，這裡先保留）
      dialogBg?: string;
      dialogBorder?: string;
      dialogShadow?: string;
      dialogRadius?: string;

      showFooter?: boolean;
      showCancel?: boolean;
      cancelTextLabel?: string;
      confirmTextLabel?: string;

      clearOnOpen?: boolean;
    }>(),
    {
      width: 520,
      closeOnMask: true,
      closeOnEsc: true,
      lockScroll: true,
      appendToBody: true,

      disabled: false,

      logoText: 'C9',
      accountLabel: '电邮地址或用户名',
      accountPlaceholder: '',
      passwordLabel: '密码',
      passwordPlaceholder: '',

      forgotText: '忘记密码?',
      loginText: '登录',
      loadingText: '处理中',

      orText: '或者使用',
      passkeyText: '使用密钥登录',
      googleText: '使用以下方式登录 Google',
      otherText: '用另一种方式签名',

      noAccountText: '还未有账户?',
      registerText: '注册账户',

      dialogBg: 'linear-gradient(180deg, #163040 0%, #0B1A26 100%)',
      dialogBorder: 'rgba(255,255,255,0.06)',
      dialogShadow: '0 18px 40px rgba(0,0,0,0.55)',
      dialogRadius: '14px',

      showFooter: false,
      showCancel: false,
      cancelTextLabel: '取消',
      confirmTextLabel: '确认',

      clearOnOpen: false,
    },
  );
  const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'login', payload: LoginPayload): void;
    (e: 'forgot'): void;
    (e: 'passkey'): void;
    (e: 'google'): void;
    (e: 'other'): void;
    (e: 'register'): void;
    (e: 'close'): void;
  }>();
  const { isLogin, setToken } = useAuth();

  const initialValues: LoginPayload = { account: '', password: '' };
  const validationSchema = yup.object({
    account: yup.string().trim().required('请输入账号'),
    password: yup.string().required('请输入密码'),
  });
  const { handleSubmit, resetForm, values, errors, setFieldValue } = useForm<LoginPayload>({
    validationSchema,
    initialValues,
  });

  const { value: accountValue, handleBlur: accountBlur } = useField<string>('account');
  const { value: passwordValue, handleBlur: passwordBlur } = useField<string>('password');

  const loading = ref(false);
  const showPassword = ref(false);

  const visibleProxy = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  });

  const headerClass = 'px-4 py-3 !mr-0';
  const bodyClass = 'px-4 py-4';
  const footerClass = 'px-4 py-4';

  const dialogInlineStyle = computed(() => ({
    background: props.dialogBg,
    border: `1px solid ${props.dialogBorder}`,
    borderRadius: props.dialogRadius,
    boxShadow: props.dialogShadow,
    overflow: 'hidden',
  }));

  watch(
    () => props.modelValue,
    (v) => {
      if (!v) return;
      showPassword.value = false;

      if (props.clearOnOpen) resetForm({ values: { ...initialValues } });
      else resetForm({ values: { ...values } });
    },
  );

  const onClose = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  const onSubmit = async (payload: LoginPayload) => {
    if (props.disabled || loading.value) return;

    try {
      emit('login', payload);
      loading.value = true;

      try {
        const res = await useHttp(useApi().login, {
          method: 'POST',
          body: { account: payload.account, password: payload.password },
          params: { lang: 'zh-TW', device: 'web' },
        });

        if (res.code === 200) {
          useMsg().success('登入成功');
          setToken(res.data.token);
          store.getDoms.dialogLogin.open = false;
        } else {
          useMsg().error(res.message);
        }
      } catch (e) {
        console.error('login failed');
      } finally {
        loading.value = false;
      }
    } finally {
      loading.value = false;
    }
  };

  const submit = handleSubmit(onSubmit);
</script>
