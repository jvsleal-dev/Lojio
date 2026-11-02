<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 selection:bg-blue-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Logo Nuvemshop style -->
      <NuxtLink to="/?tenant=none" class="inline-flex items-center space-x-2.5 mb-6 group">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <span class="font-extrabold text-3xl tracking-tight text-slate-900 flex items-center">
          loj<span class="text-blue-600">io</span>
        </span>
      </NuxtLink>

      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Painel do Lojista
      </h2>
      <p class="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Gerencie seu catálogo, estoque, vendas e pedidos em tempo real
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
        <!-- Quick Fill Helpers -->
        <div class="mb-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-2.5">
          <div class="flex items-center justify-between text-blue-900 font-bold">
            <span class="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Acesso Rápido para Teste</span>
            </span>
            <span class="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Demo</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="quickLogin('lojista@demo.com', 'senha123')"
              class="py-2.5 px-3 rounded-xl bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs border border-blue-200/60 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>👕</span>
              <span>Moda Urbana</span>
            </button>
            <button
              type="button"
              @click="quickLogin('tech@demo.com', 'senha123')"
              class="py-2.5 px-3 rounded-xl bg-white hover:bg-purple-600 text-slate-700 hover:text-white font-bold text-xs border border-blue-200/60 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>⚡</span>
              <span>TechZone</span>
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div v-if="errorMsg" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ errorMsg }}</span>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              E-mail do Lojista
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="lojista@demo.com"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Senha
              </label>
              <button
                type="button"
                @click="alertPassword"
                class="text-xs text-blue-600 hover:underline font-semibold"
              >
                Esqueceu a senha?
              </button>
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {{ loading ? 'Autenticando...' : 'Entrar no Painel do Lojista' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
          <NuxtLink to="/master/login" class="hover:text-indigo-600 transition flex items-center gap-1">
            <span>👑</span>
            <span>Painel Master</span>
          </NuxtLink>
          <NuxtLink to="/?tenant=none" class="hover:text-blue-600 transition flex items-center gap-1">
            <span>← Início da Plataforma</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Footer Help Note -->
      <p class="text-center text-xs text-slate-400 mt-6">
        Ainda não tem uma loja virtual?
        <NuxtLink to="/?tenant=none#planos" class="font-bold text-blue-600 hover:underline">
          Criar loja grátis na Lojio
        </NuxtLink>
      </p>
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

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/admin')
  }
})

const quickLogin = (e: string, p: string) => {
  email.value = e
  password.value = p
  errorMsg.value = ''
}

const alertPassword = () => {
  alert('Dica de demonstração: a senha padrão de todas as lojas é "senha123".')
}

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

    if (res.user && res.token) {
      setAuth(res.user, res.token)
      router.push('/admin')
    } else {
      errorMsg.value = 'Credenciais inválidas.'
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Erro ao realizar login. Verifique seu e-mail e senha.'
  } finally {
    loading.value = false
  }
}
</script>
