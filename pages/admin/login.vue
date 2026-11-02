<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-blue-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center shadow-xl shadow-blue-500/20 text-white font-black text-2xl mb-4">
        🛍️
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">
        Painel do Lojista
      </h2>
      <p class="mt-2 text-sm text-slate-400">
        Gerencie seu catálogo, estoque, vendas e pedidos em tempo real
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
        <!-- Quick Fill Helpers -->
        <div class="mb-6 p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-blue-300">⚡ Acesso Rápido para Teste</span>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              @click="quickLogin('lojista@demo.com', 'senha123')"
              class="flex-1 py-1 px-2 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 font-semibold text-[11px] border border-blue-500/30 transition text-left"
            >
              👕 Moda Urbana
            </button>
            <button
              type="button"
              @click="quickLogin('tech@demo.com', 'senha123')"
              class="flex-1 py-1 px-2 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-semibold text-[11px] border border-purple-500/30 transition text-left"
            >
              ⚡ TechZone
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div v-if="errorMsg" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {{ errorMsg }}
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail do Lojista
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="lojista@demo.com"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Senha
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            {{ loading ? 'Autenticando...' : 'Entrar no Painel do Lojista' }}
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <NuxtLink to="/master/login" class="hover:text-indigo-400 transition">
            👑 Painel Master
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-blue-400 transition">
            Ver Lojas &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setAuth, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('lojista@demo.com')
const password = ref('senha123')
const loading = ref(false)
const errorMsg = ref('')

const quickLogin = (e: string, p: string) => {
  email.value = e
  password.value = p
}

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/admin')
  }
})

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    setAuth(res.token, res.user, res.tenant)
    router.push('/admin')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Falha ao autenticar. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>
