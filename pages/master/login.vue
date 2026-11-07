<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 selection:bg-indigo-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <NuxtLink to="/?tenant=none" class="inline-flex items-center space-x-2.5 mb-6 group">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span class="font-extrabold text-3xl tracking-tight text-slate-900 flex items-center">
          loj<span class="text-indigo-600">io</span>
          <span class="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full ml-2 border border-indigo-200">Master</span>
        </span>
      </NuxtLink>

      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Master Admin Console
      </h2>
      <p class="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Painel de Controle e Gestão Global de Lojas SaaS
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
        <!-- Quick Fill Helper -->
        <div class="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-bold text-indigo-900 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Acesso Rápido Master</span>
            </span>
            <button
              type="button"
              @click="quickFill"
              class="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg transition shadow-xs"
            >
              Preencher
            </button>
          </div>
          <p class="text-slate-500 font-mono text-[11px]">admin@saas.com &bull; admin123</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              E-mail do Administrador
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@saas.com"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Senha Master
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {{ loading ? 'Autenticando Master...' : 'Entrar no Console Master' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
          <NuxtLink to="/admin/login" class="hover:text-blue-600 transition flex items-center gap-1">
            <span>← Painel do Lojista</span>
          </NuxtLink>
          <NuxtLink to="/?tenant=none" class="hover:text-indigo-600 transition flex items-center gap-1">
            <span>Início Lojio &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setAuth, user, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const email = ref('admin@saas.com')
const password = ref('admin123')
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  initAuth()
  if (isAuthenticated.value && (user.value?.role === 'SUPERADMIN' || user.value?.role === 'MASTER')) {
    router.push('/master')
  }
})

const quickFill = () => {
  email.value = 'admin@saas.com'
  password.value = 'admin123'
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res: any = await $fetch('/api/master/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (res.user && res.token) {
      setAuth(res.token, res.user)
      router.push('/master')
    } else {
      errorMessage.value = 'Credenciais master inválidas.'
    }
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || 'Erro ao conectar ao painel master.'
  } finally {
    loading.value = false
  }
}
</script>
