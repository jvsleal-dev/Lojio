<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <MasterSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Gestão de Lojas de Clientes</h1>
          <p class="text-slate-500 text-sm">Administre todos os lojistas, planos, suspensões e acessos à plataforma.</p>
        </div>

        <button
          @click="openCreateModal = true"
          class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition self-start md:self-auto hover:scale-105 active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nova Loja Cliente</span>
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div class="relative w-full md:w-96">
          <input
            v-model="search"
            @input="debounceFetch"
            type="text"
            placeholder="Buscar por loja, subdomínio ou e-mail..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <div class="flex items-center space-x-3 w-full md:w-auto overflow-x-auto">
          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            @change="fetchTenants"
            class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          >
            <option value="">Todos os Status</option>
            <option value="active">Apenas Ativas</option>
            <option value="suspended">Apenas Suspensas</option>
          </select>

          <!-- Plan Filter -->
          <select
            v-model="planFilter"
            @change="fetchTenants"
            class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          >
            <option value="">Todos os Planos</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>
      </div>

      <!-- Notification Toast -->
      <div v-if="toastMessage" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm">
        <span>{{ toastMessage }}</span>
        <button @click="toastMessage = ''" class="text-emerald-700 hover:text-emerald-950 text-base">&times;</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-500 text-sm">Carregando lojas de clientes...</p>
      </div>

      <!-- Stores Table -->
      <div v-else class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th class="py-4 px-6">Loja & Subdomínio</th>
                <th class="py-4 px-6">Lojista Responsável</th>
                <th class="py-4 px-6">Plano</th>
                <th class="py-4 px-6">Catálogo & Pedidos</th>
                <th class="py-4 px-6">Faturamento (GMV)</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm font-medium">
              <tr v-for="store in tenants" :key="store.id" class="hover:bg-slate-50/80 transition">
                <!-- Loja & Subdomain -->
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-xs"
                      :style="{ backgroundColor: store.accentColor || '#1f7a52' }"
                    >
                      {{ store.name.slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">{{ store.name }}</p>
                      <div class="flex items-center space-x-1 mt-0.5">
                        <span class="text-xs text-emerald-700 font-mono">{{ store.subdomain }}</span>
                        <span class="text-[11px] text-slate-400">.lojio.com.br</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Lojista -->
                <td class="py-4 px-6">
                  <p class="font-semibold text-slate-800">{{ store.owner?.name || 'Não vinculado' }}</p>
                  <p class="text-xs text-slate-500">{{ store.owner?.email || store.contactEmail || '-' }}</p>
                </td>

                <!-- Plano -->
                <td class="py-4 px-6">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                    :class="{
                      'bg-slate-100 text-slate-700 border border-slate-200': store.plan === 'STARTER',
                      'bg-emerald-50 text-emerald-800 border border-emerald-200': store.plan === 'PRO',
                      'bg-purple-50 text-purple-700 border border-purple-200': store.plan === 'ENTERPRISE',
                    }"
                  >
                    {{ store.plan }}
                  </span>
                </td>

                <!-- Catálogo & Pedidos -->
                <td class="py-4 px-6">
                  <div class="text-xs space-y-0.5">
                    <p class="text-slate-700"><strong class="text-slate-900">{{ store.productsCount }}</strong> produtos</p>
                    <p class="text-slate-400">{{ store.ordersCount }} pedidos realizados</p>
                  </div>
                </td>

                <!-- GMV -->
                <td class="py-4 px-6">
                  <p class="font-bold text-emerald-600">{{ formatCurrency(store.totalSales) }}</p>
                  <p class="text-[11px] text-slate-400">{{ formatCurrency(store.paidSales) }} pagos</p>
                </td>

                <!-- Status -->
                <td class="py-4 px-6">
                  <button
                    @click="toggleStoreStatus(store)"
                    :disabled="togglingId === store.id"
                    class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition"
                    :class="store.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'"
                  >
                    <span class="w-2 h-2 rounded-full" :class="store.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    <span>{{ store.isActive ? 'Ativa' : 'Suspensa' }}</span>
                  </button>
                </td>

                <!-- Ações -->
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <!-- Ver Loja (Vitrine) -->
                  <a
                    :href="`/?tenant=${store.subdomain}`"
                    target="_blank"
                    title="Abrir vitrine da loja como cliente"
                    class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Vitrine
                  </a>

                  <!-- Impersonate / Painel Lojista -->
                  <button
                    @click="impersonateStore(store)"
                    title="Acessar o painel administrativo deste lojista"
                    class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Painel Lojista
                  </button>
                </td>
              </tr>

              <tr v-if="tenants.length === 0">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  Nenhuma loja de cliente encontrada com os filtros selecionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Criar Nova Loja -->
      <div v-if="openCreateModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-900">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 class="text-lg font-black text-slate-900">Criar Nova Loja de Cliente</h2>
              <p class="text-xs text-slate-500">Cadastre um novo lojista e crie a loja na hora</p>
            </div>
            <button @click="openCreateModal = false" class="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="handleCreateStore" class="space-y-4">
            <div v-if="createError" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {{ createError }}
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nome da Loja *</label>
              <input
                v-model="newStore.name"
                @input="autoGenerateSubdomain"
                required
                placeholder="Ex: Bella Calçados"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Subdomínio (Link da Loja) *</label>
              <div class="flex items-center">
                <input
                  v-model="newStore.subdomain"
                  required
                  placeholder="bellacalcados"
                  class="flex-1 px-4 py-2.5 rounded-l-xl bg-slate-50 border border-r-0 border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono transition"
                />
                <span class="px-3 py-2.5 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-slate-500 text-xs font-mono">
                  .lojio.com.br
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Plano SaaS *</label>
                <select
                  v-model="newStore.plan"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                >
                  <option value="STARTER">Starter (R$ 99/mês)</option>
                  <option value="PRO">Pro (R$ 249/mês)</option>
                  <option value="ENTERPRISE">Enterprise (R$ 699/mês)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Cor Destaque</label>
                <input
                  v-model="newStore.accentColor"
                  type="color"
                  class="w-full h-10 rounded-xl bg-white border border-slate-200 p-1 cursor-pointer"
                />
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100">
              <p class="text-xs font-bold uppercase text-emerald-800 mb-3">Dados do Lojista (Admin da Loja)</p>

              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Nome do Proprietário *</label>
                  <input
                    v-model="newStore.ownerName"
                    required
                    placeholder="Ex: Ana Maria"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">E-mail do Lojista (Login) *</label>
                  <input
                    v-model="newStore.ownerEmail"
                    type="email"
                    required
                    placeholder="ana@bellacalcados.com"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Senha Inicial *</label>
                  <input
                    v-model="newStore.ownerPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end space-x-3 border-t border-slate-100">
              <button
                type="button"
                @click="openCreateModal = false"
                class="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {{ creating ? 'Criando Loja...' : 'Cadastrar Loja Cliente' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'master',
})

const { token, setSession } = useAuth()
const router = useRouter()

const loading = ref(true)
const tenants = ref<any[]>([])
const search = ref('')
const statusFilter = ref('')
const planFilter = ref('')
const toastMessage = ref('')
const togglingId = ref<string | null>(null)

// Modal State
const openCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')
const newStore = reactive({
  name: '',
  subdomain: '',
  plan: 'PRO',
  accentColor: '#1f7a52',
  ownerName: '',
  ownerEmail: '',
  ownerPassword: 'senha123',
})

const autoGenerateSubdomain = () => {
  newStore.subdomain = newStore.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

let debounceTimer: any = null
const debounceFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchTenants()
  }, 300)
}

const fetchTenants = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value
    if (planFilter.value) params.plan = planFilter.value

    const res: any = await $fetch('/api/master/tenants', {
      params,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    tenants.value = res.tenants
  } catch (err: any) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      router.push('/master/login')
    }
  } finally {
    loading.value = false
  }
}

const toggleStoreStatus = async (store: any) => {
  togglingId.value = store.id
  try {
    const res: any = await $fetch(`/api/master/tenants/${store.id}/toggle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    store.isActive = res.tenant.isActive
    toastMessage.value = res.message
    setTimeout(() => { toastMessage.value = '' }, 4000)
  } catch (err: any) {
    toastMessage.value = err.data?.statusMessage || 'Erro ao alterar status da loja.'
  } finally {
    togglingId.value = null
  }
}

const impersonateStore = async (store: any) => {
  try {
    const res: any = await $fetch(`/api/master/tenants/${store.id}/impersonate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    setSession(res.token, res.user, res.tenant)
    window.open('/admin', '_blank')
  } catch (err: any) {
    toastMessage.value = err.data?.statusMessage || 'Não foi possível entrar no painel do lojista.'
  }
}

const handleCreateStore = async () => {
  creating.value = true
  createError.value = ''

  try {
    const res: any = await $fetch('/api/master/tenants', {
      method: 'POST',
      body: newStore,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    toastMessage.value = `Loja "${res.tenant.name}" criada com sucesso!`
    openCreateModal.value = false
    newStore.name = ''
    newStore.subdomain = ''
    newStore.ownerName = ''
    newStore.ownerEmail = ''
    fetchTenants()
  } catch (err: any) {
    createError.value = err.data?.statusMessage || 'Erro ao cadastrar loja.'
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/master/login')
    return
  }
  fetchTenants()
})
</script>
