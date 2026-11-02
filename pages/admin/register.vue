<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 selection:bg-blue-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Logo Lojio -->
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
        Crie sua Loja Virtual Grátis
      </h2>
      <p class="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Junte-se a milhares de marcas que vendem todos os dias com a Lojio
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
        <!-- Benefits Chips -->
        <div class="mb-6 flex flex-wrap gap-2 justify-center">
          <span class="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1">
            <span>✓</span> 14 dias grátis
          </span>
          <span class="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1">
            <span>✓</span> Sem cartão de crédito
          </span>
          <span class="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1">
            <span>⚡</span> Ativação instantânea
          </span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="errorMsg" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ errorMsg }}</span>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Seu Nome Completo *
            </label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Ex: Carlos Silva"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nome da sua Loja *
            </label>
            <input
              v-model="storeName"
              @input="handleStoreNameInput"
              type="text"
              required
              placeholder="Ex: Streetwear Club"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Link da sua Loja (Subdomínio) *
            </label>
            <div class="flex items-center">
              <input
                v-model="subdomain"
                type="text"
                required
                placeholder="streetwearclub"
                class="flex-1 px-4 py-3 rounded-l-2xl bg-slate-50 border border-r-0 border-slate-200 text-slate-900 text-sm font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
              <span class="px-3.5 py-3 bg-slate-100 border border-l-0 border-slate-200 rounded-r-2xl text-slate-500 text-xs font-mono select-none">
                .lojio.com.br
              </span>
            </div>
            <p v-if="subdomain" class="text-[11px] text-blue-600 font-semibold mt-1">
              Sua vitrine será: <strong>{{ subdomain }}.lojio.com.br</strong>
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Seu E-mail *
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="carlos@email.com"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Crie sua Senha *
            </label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="Mínimo de 6 caracteres"
              class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {{ loading ? 'Criando sua loja na Lojio...' : 'Criar Minha Loja Grátis' }}
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          Já tem uma loja cadastrada?
          <NuxtLink to="/admin/login" class="font-bold text-blue-600 hover:underline ml-1">
            Fazer Login
          </NuxtLink>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-center items-center text-xs text-slate-400">
          <NuxtLink to="/?tenant=none" class="hover:text-slate-600 transition flex items-center gap-1 font-semibold">
            <span>← Início da Plataforma</span>
          </NuxtLink>
        </div>
      </div>

      <p class="text-center text-[11px] text-slate-400 mt-6 max-w-xs mx-auto">
        Ao criar sua conta você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setAuth } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const storeName = ref('')
const subdomain = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleStoreNameInput = () => {
  subdomain.value = storeName.value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const handleRegister = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    const res: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        storeName: storeName.value,
        subdomain: subdomain.value,
      },
    })

    setAuth(res.token, res.user, res.tenant)
    router.push('/admin')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Falha ao criar loja. Verifique se o e-mail ou subdomínio já estão em uso.'
  } finally {
    loading.value = false
  }
}
</script>
