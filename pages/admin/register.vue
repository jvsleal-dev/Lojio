<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-blue-600 selection:text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center shadow-xl shadow-blue-500/20 text-white font-black text-2xl mb-4">
        ⚡
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">
        Crie sua Loja Virtual
      </h2>
      <p class="mt-2 text-sm text-slate-400">
        Cadastre-se e comece a vender em menos de 2 minutos
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="errorMsg" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {{ errorMsg }}
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Seu Nome *</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Ex: Carlos Silva"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Nome da Loja *</label>
            <input
              v-model="storeName"
              @input="handleStoreNameInput"
              type="text"
              required
              placeholder="Ex: Streetwear Club"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Link da Loja (Subdomínio) *</label>
            <div class="flex items-center">
              <input
                v-model="subdomain"
                type="text"
                required
                placeholder="streetwearclub"
                class="flex-1 px-4 py-2.5 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="px-3 py-2.5 bg-slate-800/80 border border-l-0 border-slate-700 rounded-r-xl text-slate-400 text-xs font-mono">
                .localhost
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">E-mail *</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="carlos@email.com"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Crie sua Senha *</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50 mt-2"
          >
            {{ loading ? 'Criando sua loja...' : 'Criar Minha Loja Grátis' }}
          </button>
        </form>

        <div class="text-center pt-5 mt-5 border-t border-slate-800 text-xs text-slate-400">
          Já possui loja?
          <NuxtLink to="/admin/login" class="font-bold text-blue-400 hover:underline ml-1">
            Fazer login
          </NuxtLink>
        </div>
      </div>
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
