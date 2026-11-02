<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <MasterSidebar />

    <main class="flex-1 overflow-y-auto p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Plataforma Operacional</span>
          </div>
          <h1 class="text-2xl font-black text-white mt-1">Visão Geral da Plataforma</h1>
          <p class="text-slate-400 text-sm">Monitore o crescimento, receita global e saúde de todas as lojas parceiras.</p>
        </div>

        <div class="flex items-center space-x-3">
          <NuxtLink
            to="/master/lojas"
            class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Gerenciar Clientes</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-400 text-sm">Carregando métricas da plataforma...</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8 mt-6">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- GMV Global -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">GMV Global da Plataforma</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                R$
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.totalGMV || 0) }}
            </p>
            <div class="mt-2 text-xs text-slate-400 flex items-center space-x-1.5">
              <span class="text-emerald-400 font-semibold">{{ formatCurrency(data?.metrics?.paidGMV || 0) }}</span>
              <span>liquidados</span>
            </div>
          </div>

          <!-- Total de Lojas -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Lojas Cadastradas</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ data?.metrics?.totalStores || 0 }}
            </p>
            <div class="mt-2 text-xs text-slate-400 flex items-center space-x-2">
              <span class="text-emerald-400 font-semibold">{{ data?.metrics?.activeStores || 0 }} ativas</span>
              <span>&bull;</span>
              <span class="text-rose-400 font-semibold">{{ data?.metrics?.suspendedStores || 0 }} suspensas</span>
            </div>
          </div>

          <!-- Pedidos Totais -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Pedidos</span>
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ data?.metrics?.totalOrders || 0 }}
            </p>
            <p class="mt-2 text-xs text-slate-400">
              {{ data?.metrics?.paidOrdersCount || 0 }} pedidos pagos com sucesso
            </p>
          </div>

          <!-- Ticket Médio -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Ticket Médio Geral</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.averageTicket || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-400">
              {{ data?.metrics?.totalProducts || 0 }} produtos no catálogo geral
            </p>
          </div>
        </div>

        <!-- Plan Breakdown Cards -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 class="text-base font-bold text-white mb-4">Distribuição de Planos de Clientes</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400 font-semibold uppercase">Starter</p>
                <p class="text-xl font-black text-white mt-0.5">{{ data?.metrics?.plans?.starter || 0 }} lojas</p>
                <p class="text-[11px] text-slate-500 mt-1">Até R$ 10k/mês</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700 text-slate-300">R$ 99/mês</span>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/60 border border-indigo-500/40 relative overflow-hidden flex items-center justify-between">
              <div class="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
              <div>
                <div class="flex items-center space-x-1.5">
                  <p class="text-xs text-indigo-400 font-bold uppercase">Pro (Mais Popular)</p>
                </div>
                <p class="text-xl font-black text-white mt-0.5">{{ data?.metrics?.plans?.pro || 0 }} lojas</p>
                <p class="text-[11px] text-slate-400 mt-1">Até R$ 100k/mês</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">R$ 249/mês</span>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/60 border border-purple-500/40 relative overflow-hidden flex items-center justify-between">
              <div>
                <p class="text-xs text-purple-400 font-bold uppercase">Enterprise</p>
                <p class="text-xl font-black text-white mt-0.5">{{ data?.metrics?.plans?.enterprise || 0 }} lojas</p>
                <p class="text-[11px] text-slate-400 mt-1">Volume ilimitado</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600/30 text-purple-300 border border-purple-500/30">R$ 699/mês</span>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Recent Stores & Recent Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Client Stores -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-base font-bold text-white">Lojas de Clientes Recentes</h2>
                <p class="text-xs text-slate-400">Últimos clientes adicionados à plataforma</p>
              </div>
              <NuxtLink to="/master/lojas" class="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
                Ver todas &rarr;
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="store in data?.recentStores"
                :key="store.id"
                class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between hover:border-slate-600 transition"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 border border-indigo-500/30">
                    {{ store.name.slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h3 class="font-bold text-sm text-white">{{ store.name }}</h3>
                      <span
                        class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                        :class="store.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
                      >
                        {{ store.isActive ? 'Ativa' : 'Suspensa' }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-400">{{ store.subdomain }}.localhost &bull; {{ store.owner?.email || 'Sem lojista' }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <a
                    :href="`/?tenant=${store.subdomain}`"
                    target="_blank"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                  >
                    Ver Loja
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Global Orders -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-base font-bold text-white">Vendas Recentes no SaaS</h2>
                <p class="text-xs text-slate-400">Transações em tempo real em todas as lojas</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="order in data?.recentOrders"
                :key="order.id"
                class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-sm text-white">{{ order.orderNumber }}</span>
                    <span class="text-xs text-indigo-400 font-medium">({{ order.tenant?.name }})</span>
                  </div>
                  <p class="text-xs text-slate-400">{{ order.customerName }} &bull; {{ formatDate(order.createdAt) }}</p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-bold text-emerald-400">{{ formatCurrency(order.total) }}</p>
                  <span
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    :class="order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'"
                  >
                    {{ order.paymentStatus === 'paid' ? 'Pago' : 'Pendente' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, token } = useAuth()
const router = useRouter()

const loading = ref(true)
const data = ref<any>(null)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const fetchDashboard = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/master/dashboard', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    data.value = res
  } catch (err: any) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      router.push('/master/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/master/login')
    return
  }
  fetchDashboard()
})
</script>

