<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-indigo-500 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 items-center justify-center shadow-xl shadow-indigo-500/20 text-white font-black text-2xl mb-4">
        ⚡
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">
        Master Admin
      </h2>
      <p class="mt-2 text-sm text-slate-400">
        Painel de Controle e Gestão Global de Clientes SaaS
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
        <!-- Quick Fill Helper -->
        <div class="mb-6 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-indigo-300">⚡ Acesso Rápido de Demonstração</span>
            <button
              type="button"
              @click="quickFill"
              class="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-0.5 rounded transition"
            >
              Preencher
            </button>
          </div>
          <p class="text-slate-400">admin@saas.com &bull; admin123</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {{ errorMessage }}
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail do Administrador
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@saas.com"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Senha Master
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {{ loading ? 'Autenticando Master...' : 'Entrar no Painel Master' }}
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <NuxtLink to="/admin/login" class="hover:text-indigo-400 transition">
            &larr; Painel do Lojista
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-indigo-400 transition">
            Ver Lojas &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('admin@saas.com')
const password = ref('admin123')
const loading = ref(false)
const errorMessage = ref('')

const { setSession } = useAuth()
const router = useRouter()

const quickFill = () => {
  email.value = 'admin@saas.com'
  password.value = 'admin123'
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      }
    })

    if (res.user.role !== 'SUPERADMIN' && res.user.role !== 'MASTER') {
      errorMessage.value = 'Acesso negado: Este usuário não possui privilégios de SuperAdmin.'
      return
    }

    setSession(res.token, res.user, res.tenant)
    router.push('/master')
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || 'Falha ao autenticar. Verifique e-mail e senha.'
  } finally {
    loading.value = false
  }
}
</script>

