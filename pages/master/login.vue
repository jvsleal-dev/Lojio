<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 selection:bg-indigo-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <NuxtLink to="/?tenant=none" class="inline-flex items-center space-x-2.5 mb-6 group">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <span class="text-xl">👑</span>
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
              <span>⚡</span> Acesso Rápido Master
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
            <span>⚠️</span>
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
const { setAuth } = useAuth()
const router = useRouter()

const email = ref('admin@saas.com')
const password = ref('admin123')
const loading = ref(false)
const errorMessage = ref('')

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
      setAuth(res.user, res.token)
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
