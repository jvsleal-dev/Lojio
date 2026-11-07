<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
    <MasterSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Plataforma Operacional</span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 mt-1">Visão Geral da Plataforma</h1>
          <p class="text-slate-500 text-sm">Monitore o crescimento, receita global e saúde de todas as lojas parceiras.</p>
        </div>

        <div class="flex items-center space-x-3">
          <NuxtLink
            to="/master/lojas"
            class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition hover:scale-105 active:scale-95"
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
        <div class="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-500 text-sm">Carregando métricas da plataforma...</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- GMV Global -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">GMV Global da Plataforma</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-xs">
                R$
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ formatCurrency(data?.metrics?.totalGMV || 0) }}
            </p>
            <div class="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
              <span class="text-emerald-600 font-semibold">{{ formatCurrency(data?.metrics?.paidGMV || 0) }}</span>
              <span>liquidados</span>
            </div>
          </div>

          <!-- Total de Lojas -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Lojas Cadastradas</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ data?.metrics?.totalStores || 0 }}
            </p>
            <div class="mt-2 text-xs text-slate-500 flex items-center space-x-2">
              <span class="text-emerald-600 font-semibold">{{ data?.metrics?.activeStores || 0 }} ativas</span>
              <span>&bull;</span>
              <span class="text-rose-600 font-semibold">{{ data?.metrics?.suspendedStores || 0 }} suspensas</span>
            </div>
          </div>

          <!-- Pedidos Totais -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Pedidos</span>
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ data?.metrics?.totalOrders || 0 }}
            </p>
            <p class="mt-2 text-xs text-slate-500">
              {{ data?.metrics?.paidOrdersCount || 0 }} pedidos pagos com sucesso
            </p>
          </div>

          <!-- Ticket Médio -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Ticket Médio Geral</span>
              <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ formatCurrency(data?.metrics?.averageTicket || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-500">
              {{ data?.metrics?.totalProducts || 0 }} produtos no catálogo geral
            </p>
          </div>
        </div>

        <!-- Plan Breakdown Cards -->
        <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 mb-4">Distribuição de Planos de Clientes</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase">Starter</p>
                <p class="text-xl font-black text-slate-900 mt-0.5">{{ data?.metrics?.plans?.starter || 0 }} lojas</p>
                <p class="text-[11px] text-slate-400 mt-1">Até R$ 10k/mês</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-700">R$ 99/mês</span>
            </div>

            <div class="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 relative overflow-hidden flex items-center justify-between">
              <div>
                <p class="text-xs text-indigo-700 font-bold uppercase">Pro (Mais Popular)</p>
                <p class="text-xl font-black text-slate-900 mt-0.5">{{ data?.metrics?.plans?.pro || 0 }} lojas</p>
                <p class="text-[11px] text-slate-500 mt-1">Até R$ 100k/mês</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">R$ 249/mês</span>
            </div>

            <div class="p-4 rounded-xl bg-purple-50/60 border border-purple-200 relative overflow-hidden flex items-center justify-between">
              <div>
                <p class="text-xs text-purple-700 font-bold uppercase">Enterprise</p>
                <p class="text-xl font-black text-slate-900 mt-0.5">{{ data?.metrics?.plans?.enterprise || 0 }} lojas</p>
                <p class="text-[11px] text-slate-500 mt-1">Volume ilimitado</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white">R$ 699/mês</span>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Recent Stores & Recent Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Client Stores -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Lojas de Clientes Recentes</h2>
                <p class="text-xs text-slate-500">Últimos clientes adicionados à plataforma</p>
              </div>
              <NuxtLink to="/master/lojas" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
                Ver todas &rarr;
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="store in data?.recentStores"
                :key="store.id"
                class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-slate-300 transition"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 border border-indigo-200">
                    {{ store.name.slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h3 class="font-bold text-sm text-slate-900">{{ store.name }}</h3>
                      <span
                        class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                        :class="store.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'"
                      >
                        {{ store.isActive ? 'Ativa' : 'Suspensa' }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-400">{{ store.subdomain }}.lojio.com.br &bull; {{ store.owner?.email || 'Sem lojista' }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <a
                    :href="`/?tenant=${store.subdomain}`"
                    target="_blank"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                  >
                    Ver Loja ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Global Orders -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Vendas Recentes no SaaS</h2>
                <p class="text-xs text-slate-500">Transações em tempo real em todas as lojas</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="order in data?.recentOrders"
                :key="order.id"
                class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-sm text-slate-900">#{{ order.orderNumber }}</span>
                    <span class="text-xs text-indigo-600 font-semibold">({{ order.tenant?.name }})</span>
                  </div>
                  <p class="text-xs text-slate-400">{{ order.customerName }} &bull; {{ formatDate(order.createdAt) }}</p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-bold text-emerald-600">{{ formatCurrency(order.total) }}</p>
                  <span
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    :class="order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
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
definePageMeta({
  middleware: 'master',
})

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
