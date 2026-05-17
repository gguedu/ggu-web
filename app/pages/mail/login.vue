<script setup lang="ts">
definePageMeta({
  layout: false,
});

const router = useRouter();
const mailService = useMailService();
const { token, user, config, accounts, currentAccountId, clearSession } = useMailState();

const mode = ref<'login' | 'register'>('login');
const emailPrefix = ref('');
const password = ref('');
const confirmPassword = ref('');
const inviteCode = ref('');
const suffix = ref('');
const loading = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const allowRegister = computed(() => {
  const value = config.value.register;
  if (value === undefined || value === null) {
    return true;
  }
  return Number(value) === 0;
});

const showLoginDomain = computed(() => {
  const value = config.value.loginDomain;
  if (value === undefined || value === null) {
    return true;
  }
  return Number(value) === 0;
});

const regKeyMode = computed(() => Number(config.value.regKey ?? 1));
const requireInviteCode = computed(() => regKeyMode.value === 0);
const optionalInviteCode = computed(() => regKeyMode.value === 2);
const minEmailPrefix = computed(() => Number(config.value.minEmailPrefix ?? 1));

const fullEmail = computed(() => {
  const prefix = emailPrefix.value.trim();
  if (!prefix) {
    return '';
  }
  if (prefix.includes('@')) {
    return prefix;
  }
  if (!showLoginDomain.value) {
    return prefix;
  }
  return `${prefix}${suffix.value || ''}`;
});

const domainList = computed(() => config.value.domainList || []);

const bootstrap = async () => {
  config.value = await mailService.websiteConfig();
  if (domainList.value.length > 0 && !suffix.value) {
    suffix.value = domainList.value[0] || '';
  }
};

const completeSession = async (sessionToken: string) => {
  token.value = sessionToken;
  try {
    const profile = await mailService.loginUserInfo();
    user.value = profile;
    const accountList = await mailService.accountList(0, 100);
    accounts.value = accountList;
    currentAccountId.value = profile.account?.accountId || accountList[0]?.accountId || null;
    await router.push('/mail');
  } catch {
    clearSession();
    throw new Error('登录成功但加载用户信息失败，请重新登录');
  }
};

const submit = async () => {
  errorMsg.value = '';
  if (!fullEmail.value) {
    errorMsg.value = '请输入邮箱';
    return;
  }
  if (emailPrefix.value.trim().length < minEmailPrefix.value) {
    errorMsg.value = `邮箱至少 ${minEmailPrefix.value} 位`;
    return;
  }
  if (!password.value) {
    errorMsg.value = '请输入密码';
    return;
  }

  loading.value = true;
  try {
    if (mode.value === 'login') {
      const res = await mailService.login(fullEmail.value, password.value);
      await completeSession(res.token);
    } else {
      if (!allowRegister.value) {
        throw new Error('当前站点未开放注册');
      }
      if (password.value.length < 6) {
        throw new Error('密码长度至少 6 位');
      }
      if (password.value !== confirmPassword.value) {
        throw new Error('两次输入密码不一致');
      }
      if (requireInviteCode.value && !inviteCode.value.trim()) {
        throw new Error('当前注册需要邀请码');
      }
      const res = await mailService.register({
        email: fullEmail.value,
        password: password.value,
        code: inviteCode.value || undefined,
      });
      await completeSession(res.token);
    }
  } catch (error: any) {
    errorMsg.value = error?.message || '登录失败，请检查配置与网络';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const init = async () => {
    if (token.value) {
      try {
        const profile = await mailService.loginUserInfo();
        user.value = profile;
        const accountList = await mailService.accountList(0, 100);
        accounts.value = accountList;
        currentAccountId.value = profile.account?.accountId || accountList[0]?.accountId || null;
        await router.replace('/mail');
        return;
      } catch {
        clearSession();
      }
    }
    await bootstrap();
  };
  init();
});

watch(allowRegister, (enabled) => {
  if (!enabled && mode.value === 'register') {
    mode.value = 'login';
  }
});

watch(mode, () => {
  errorMsg.value = '';
});
</script>

<template>
  <div class="h-screen bg-black text-white flex items-center justify-center px-4 py-6 overflow-hidden relative">
    <!-- Ambient light orbs -->
    <div
      class="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-60"
      style="background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)"
    />
    <div
      class="pointer-events-none absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full opacity-50"
      style="background: radial-gradient(circle, rgba(0,148,255,0.12), transparent 70%)"
    />
    <div
      class="pointer-events-none absolute -bottom-24 right-1/4 w-[400px] h-[400px] rounded-full"
      style="background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%)"
    />

    <!-- Main card -->
    <div
      class="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_440px] rounded-3xl overflow-hidden"
      style="border: 1px solid rgba(255,255,255,0.1); background: rgba(17,22,28,0.9); backdrop-filter: blur(24px); box-shadow: 0 18px 36px rgba(0,0,0,0.35)"
    >
      <!-- Left: Brand panel -->
      <section class="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style="border-right: 1px solid rgba(255,255,255,0.06)">
        <!-- Inner orb -->
        <div
          class="pointer-events-none absolute top-0 right-0 w-[320px] h-[320px] rounded-full"
          style="background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)"
        />

        <div class="relative z-10">
          <p class="text-xs font-medium tracking-[0.4em] uppercase text-gray-500 mb-6">
            Galaxy Global University
          </p>
          <h1
            class="font-custom text-5xl leading-[1.15] tracking-[0.08em] text-white"
            style="text-shadow: 0 4px 50px rgba(255, 255, 255, 0.15)"
          >
            星河邮箱
          </h1>
          <p class="mt-6 text-lg leading-[1.6] text-gray-400 max-w-sm">
            统一身份账号登录，访问教学通知、校内协同与事务邮件。
          </p>
        </div>

        <div class="relative z-10 space-y-3">
          <div class="flex items-center gap-3 text-gray-500">
            <Icon name="lucide:users" size="16" class="text-gray-600" />
            <span class="text-sm tracking-wide">多账户统一管理</span>
          </div>
          <div class="flex items-center gap-3 text-gray-500">
            <Icon name="lucide:paperclip" size="16" class="text-gray-600" />
            <span class="text-sm tracking-wide">附件上传与发送</span>
          </div>
        </div>
      </section>

      <!-- Right: Form panel -->
      <section class="p-8 sm:p-10 flex flex-col justify-center">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-semibold tracking-wide">
              {{ config.title || 'Cloud Mail' }}
            </h2>
            <p class="text-xs text-gray-500 mt-1.5 font-medium tracking-[0.18em] uppercase">
              {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
            </p>
          </div>
          <NuxtLink
            to="/"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-300 flex items-center gap-1.5"
          >
            <Icon name="lucide:arrow-left" size="12" />
            <span>返回主站</span>
          </NuxtLink>
        </div>

        <!-- Mode tabs -->
        <div
          v-if="allowRegister"
          class="flex mb-7 rounded-lg p-1"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06)"
        >
          <button
            type="button"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300"
            :class="mode === 'login'
              ? 'bg-white/10 text-white'
              : 'text-gray-500 hover:text-gray-300'"
            @click="mode = 'login'"
          >
            登录
          </button>
          <button
            type="button"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300"
            :class="mode === 'register'
              ? 'bg-white/10 text-white'
              : 'text-gray-500 hover:text-gray-300'"
            @click="mode = 'register'"
          >
            注册
          </button>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="submit">
          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">
              邮箱
            </label>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="lucide:mail" size="16" class="text-gray-600" />
                </div>
                <input
                  v-model="emailPrefix"
                  type="text"
                  required
                  :placeholder="showLoginDomain ? 'admin' : 'name@example.com'"
                  class="w-full bg-black rounded-md pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors duration-300"
                  style="border: 1px solid #4b5563"
                  @focus="($event.target as HTMLInputElement).style.borderColor = '#ffffff'"
                  @blur="($event.target as HTMLInputElement).style.borderColor = '#4b5563'"
                />
              </div>
              <select
                v-if="showLoginDomain && domainList.length > 0"
                v-model="suffix"
                class="w-[150px] bg-black rounded-md px-3 py-3 text-sm text-white focus:outline-none transition-colors duration-300"
                style="border: 1px solid #4b5563"
                @focus="($event.target as HTMLSelectElement).style.borderColor = '#ffffff'"
                @blur="($event.target as HTMLSelectElement).style.borderColor = '#4b5563'"
              >
                <option v-for="item in domainList" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">
              密码
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="lucide:key-round" size="16" class="text-gray-600" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full bg-black rounded-md pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors duration-300"
                style="border: 1px solid #4b5563"
                @focus="($event.target as HTMLInputElement).style.borderColor = '#ffffff'"
                @blur="($event.target as HTMLInputElement).style.borderColor = '#4b5563'"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors duration-300"
                @click="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
              </button>
            </div>
          </div>

          <!-- Confirm password (register) -->
          <div v-if="mode === 'register'">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">
              确认密码
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="lucide:key-round" size="16" class="text-gray-600" />
              </div>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full bg-black rounded-md pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors duration-300"
                style="border: 1px solid #4b5563"
                @focus="($event.target as HTMLInputElement).style.borderColor = '#ffffff'"
                @blur="($event.target as HTMLInputElement).style.borderColor = '#4b5563'"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors duration-300"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
              </button>
            </div>
          </div>

          <!-- Invite code (register) -->
          <div v-if="mode === 'register' && (requireInviteCode || optionalInviteCode)">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">
              邀请码
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="lucide:ticket" size="16" class="text-gray-600" />
              </div>
              <input
                v-model="inviteCode"
                type="text"
                :placeholder="requireInviteCode ? '请输入邀请码' : '邀请码（可选）'"
                class="w-full bg-black rounded-md pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors duration-300"
                style="border: 1px solid #4b5563"
                @focus="($event.target as HTMLInputElement).style.borderColor = '#ffffff'"
                @blur="($event.target as HTMLInputElement).style.borderColor = '#4b5563'"
              />
            </div>
          </div>

          <!-- Error message -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="errorMsg"
              class="flex items-start gap-2.5 p-3 rounded-lg"
              style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25)"
            >
              <Icon name="lucide:alert-circle" size="16" class="text-red-400 shrink-0 mt-0.5" />
              <span class="text-sm text-red-300">{{ errorMsg }}</span>
            </div>
          </transition>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3.5 bg-white text-black border border-white rounded-md font-bold text-sm tracking-[0.1em] transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" size="16" class="animate-spin" />
              处理中...
            </span>
            <span v-else>{{ mode === 'login' ? '登录' : '注册并登录' }}</span>
          </button>
        </form>

        <!-- Mobile register toggle -->
        <button
          v-if="allowRegister"
          type="button"
          class="mt-5 w-full py-2.5 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300 lg:hidden"
          @click="mode = mode === 'login' ? 'register' : 'login'"
        >
          {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
        </button>
      </section>
    </div>
  </div>
</template>
