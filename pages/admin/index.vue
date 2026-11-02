<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-8">
      <!-- Top Store Header & Quick Actions -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              Loja Ativa &bull; {{ data?.tenant?.name || 'Minha Loja' }}
            </span>
          </div>
          <h1 class="text-2xl font-black text-white mt-1">Visão Geral do E-commerce</h1>
          <p class="text-slate-400 text-sm">Acompanhe vendas em tempo real, pedidos e estoque da sua marca.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Copy Store Link Pill -->
          <button
            @click="copyStoreLink"
            class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition shadow"
            title="Copiar link da vitrine"
          >
            <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>{{ copied ? 'Link Copiado! ✓' : 'Copiar Link da Loja' }}</span>
          </button>

          <!-- Ver Loja Online -->
          <a
            :href="`/?tenant=${data?.tenant?.subdomain || ''}`"
            target="_blank"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 transition border border-slate-700"
          >
            <span>Abrir Vitrine</span>
            <span>↗</span>
          </a>

          <!-- Novo Produto -->
          <NuxtLink
            to="/admin/produtos/novo"
            class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition"
          >
            <span>+ Novo Produto</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-400 text-sm">Carregando métricas da sua loja...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Revenue -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Faturamento Total</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                R$
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.totalRevenue || 0) }}
            </p>
            <div class="mt-2 text-xs text-slate-400 flex items-center space-x-1.5">
              <span class="text-emerald-400 font-semibold">{{ data?.metrics?.paidOrders || 0 }} pedidos</span>
              <span>pagos com sucesso</span>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Pedidos</span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ data?.metrics?.totalOrders || 0 }}
            </p>
            <div class="mt-2 text-xs text-slate-400 flex items-center space-x-1.5">
              <span class="text-amber-400 font-semibold">{{ data?.metrics?.pendingOrders || 0 }} pendentes</span>
              <span>({{ formatCurrency(data?.metrics?.pendingRevenue || 0) }})</span>
            </div>
          </div>

          <!-- Average Ticket -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Ticket Médio</span>
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.averageTicket || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-400">Gasto médio por cliente aprovado</p>
          </div>

          <!-- Total Products & Stock -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Catálogo Ativo</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ data?.metrics?.totalProducts || 0 }} produtos
            </p>
            <div class="mt-2 text-xs">
              <span v-if="data?.metrics?.lowStockCount > 0" class="text-amber-400 font-bold">
                ⚠️ {{ data?.metrics?.lowStockCount }} com estoque crítico
              </span>
              <span v-else class="text-emerald-400 font-semibold">
                ✓ Todos os estoques saudáveis
              </span>
            </div>
          </div>
        </div>

        <!-- Weekly Sales Visual Bar Chart (Last 7 Days) -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-white">Evolução de Vendas (Últimos 7 dias)</h2>
              <p class="text-xs text-slate-400">Faturamento diário liquidado na sua loja</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Pix & Cartão
            </span>
          </div>

          <!-- Bars Container -->
          <div class="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-800">
            <div
              v-for="day in data?.salesHistory"
              :key="day.date"
              class="flex flex-col items-center justify-end h-full group"
            >
              <!-- Tooltip on hover -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white font-bold mb-1 whitespace-nowrap shadow pointer-events-none">
                {{ formatCurrency(day.total) }} ({{ day.ordersCount }} ped)
              </div>

              <!-- Bar -->
              <div class="w-full max-w-[40px] bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-full">
                <div
                  class="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-500 group-hover:to-indigo-400"
                  :style="{ height: getBarHeight(day.total) }"
                ></div>
              </div>

              <!-- Day Label -->
              <span class="text-[11px] text-slate-400 font-semibold mt-2 text-center truncate w-full">
                {{ day.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Smart Assistant Card: Lumi IA (Inspired by Nuvemshop Image 3) -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-900 border border-blue-500/30 shadow-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <span class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/40">
                  ✨
                </span>
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Lumi IA &bull; Assistente da Loja</span>
              </div>
              <h3 class="text-base font-bold text-white">Recomendações Práticas para seu E-commerce</h3>
              <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Nossa inteligência artificial identificou que o pagamento via PIX tem <strong class="text-emerald-400">100% de aprovação imediata</strong>. Recomendamos ativar o frete grátis para compras acima de R$ 199 para incentivar os clientes a adicionar mais itens ao carrinho.
              </p>
            </div>

            <NuxtLink
              to="/admin/personalizar"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition shrink-0"
            >
              Configurar Oferta
            </NuxtLink>
          </div>
        </div>

        <!-- 2 Columns: Recent Orders & Low Stock Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Recent Orders Table (8 cols) -->
          <div class="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-white">Últimos Pedidos Recebidos</h2>
                <p class="text-xs text-slate-400">Vendas recentes realizadas na sua loja virtual</p>
              </div>
              <NuxtLink to="/admin/pedidos" class="text-xs font-bold text-blue-400 hover:text-blue-300 transition">
                Ver todos os pedidos &rarr;
              </NuxtLink>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th class="py-3 px-3">Pedido</th>
                    <th class="py-3 px-3">Cliente</th>
                    <th class="py-3 px-3">Total</th>
                    <th class="py-3 px-3">Pagamento</th>
                    <th class="py-3 px-3">Envio</th>
                    <th class="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 font-medium">
                  <tr v-for="order in data?.recentOrders" :key="order.id" class="hover:bg-slate-800/40 transition">
                    <td class="py-3.5 px-3">
                      <span class="font-bold text-white">{{ order.orderNumber }}</span>
                      <p class="text-[10px] text-slate-500">{{ formatDate(order.createdAt) }}</p>
                    </td>

                    <td class="py-3.5 px-3">
                      <p class="font-semibold text-slate-200">{{ order.customerName }}</p>
                      <p class="text-[11px] text-slate-500">{{ order.customerPhone }}</p>
                    </td>

                    <td class="py-3.5 px-3 font-bold text-emerald-400">
                      {{ formatCurrency(order.total) }}
                    </td>

                    <td class="py-3.5 px-3">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        :class="order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'"
                      >
                        {{ order.paymentStatus === 'paid' ? 'Pago' : 'Pendente' }}
                      </span>
                    </td>

                    <td class="py-3.5 px-3">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        :class="{
                          'bg-blue-500/20 text-blue-400': order.orderStatus === 'shipped',
                          'bg-emerald-500/20 text-emerald-400': order.orderStatus === 'delivered',
                          'bg-slate-800 text-slate-400': order.orderStatus === 'processing' || order.orderStatus === 'pending',
                        }"
                      >
                        {{ formatOrderStatus(order.orderStatus) }}
                      </span>
                    </td>

                    <td class="py-3.5 px-3 text-right">
                      <NuxtLink
                        to="/admin/pedidos"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      >
                        Gerenciar
                      </NuxtLink>
                    </td>
                  </tr>

                  <tr v-if="!data?.recentOrders?.length">
                    <td colspan="6" class="py-8 text-center text-slate-400">
                      Nenhum pedido recebido ainda.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Low Stock Products Alert (4 cols) -->
          <div class="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-white">Controle de Estoque</h2>
                <p class="text-xs text-slate-400">Itens que precisam de atenção</p>
              </div>
              <NuxtLink to="/admin/produtos" class="text-xs font-bold text-blue-400 hover:text-blue-300">
                Ver todos
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="prod in data?.lowStockProducts"
                :key="prod.id"
                class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between"
              >
                <div class="flex items-center space-x-3 overflow-hidden">
                  <img
                    v-if="prod.coverImage"
                    :src="prod.coverImage"
                    :alt="prod.name"
                    class="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-700"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0"
                  >
                    IMG
                  </div>
                  <div class="overflow-hidden">
                    <p class="font-bold text-xs text-white truncate">{{ prod.name }}</p>
                    <p class="text-[10px] text-slate-400 font-mono">{{ prod.sku || 'Sem SKU' }}</p>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    {{ prod.stockQuantity }} un
                  </span>
                </div>
              </div>

              <div v-if="!data?.lowStockProducts?.length" class="py-6 text-center text-slate-400 text-xs">
                ✓ Todos os produtos com estoque acima de 10 unidades.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { token, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const loading = ref(true)
const data = ref<any>(null)
const copied = ref(false)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const formatOrderStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Aguardando',
    processing: 'Em separação',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return map[status] || status
}

const getBarHeight = (total: number) => {
  const max = Math.max(...(data.value?.salesHistory?.map((s: any) => s.total) || [100]))
  if (!max || max === 0) return '8%'
  const percentage = Math.max(12, Math.round((total / max) * 100))
  return `${percentage}%`
}

const copyStoreLink = () => {
  if (process.client && data.value?.tenant?.subdomain) {
    const url = `${window.location.origin}/?tenant=${data.value.tenant.subdomain}`
    navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 3000)
  }
}

const fetchDashboard = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    data.value = res
  } catch (err: any) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }
  fetchDashboard()
})
</script>
