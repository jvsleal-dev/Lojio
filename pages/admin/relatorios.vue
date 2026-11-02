<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 class="text-2xl font-black text-white">Relatórios & Análise de Vendas</h1>
          <p class="text-slate-400 text-sm">Acompanhe métricas financeiras, conversão por pagamento e exporte dados para planilhas.</p>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Range Selector -->
          <select
            v-model="range"
            @change="loadReports"
            class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="all">Todo o período</option>
          </select>

          <!-- Export CSV Button -->
          <button
            @click="exportCsv"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Exportar CSV / Excel</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-400 text-sm">Calculando dados e relatórios...</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Revenue -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Receita Liquidada</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                R$
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.totalRevenue || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-400">
              {{ data?.metrics?.paidOrdersCount || 0 }} pedidos aprovados
            </p>
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
            <p class="mt-2 text-xs text-slate-400">
              Taxa de conversão: <strong class="text-emerald-400">{{ conversionRate }}%</strong>
            </p>
          </div>

          <!-- Ticket Médio -->
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
            <p class="mt-2 text-xs text-slate-400">Valor médio gasto por compra</p>
          </div>

          <!-- WhatsApp Channel -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Canal WhatsApp</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                💬
              </div>
            </div>
            <p class="text-2xl font-black text-white">
              {{ formatCurrency(data?.metrics?.byPayment?.whatsapp?.revenue || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-400">
              {{ data?.metrics?.byPayment?.whatsapp?.count || 0 }} pedidos direcionados
            </p>
          </div>
        </div>

        <!-- Breakdown by Payment Method Grid -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-white">Desempenho por Método de Pagamento</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- PIX -->
            <div class="p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span>⚡</span>
                  <span>PIX Instantâneo</span>
                </span>
                <span class="text-xs font-bold text-slate-400">{{ data?.metrics?.byPayment?.pix?.count || 0 }} pedidos</span>
              </div>
              <p class="text-xl font-black text-white">
                {{ formatCurrency(data?.metrics?.byPayment?.pix?.revenue || 0) }}
              </p>
              <p class="text-[11px] text-slate-500 mt-1">Aprovação imediata via QR Code</p>
            </div>

            <!-- Cartão -->
            <div class="p-5 rounded-2xl bg-slate-950/60 border border-blue-500/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-blue-400 flex items-center space-x-1.5">
                  <span>💳</span>
                  <span>Cartão de Crédito</span>
                </span>
                <span class="text-xs font-bold text-slate-400">{{ data?.metrics?.byPayment?.creditCard?.count || 0 }} pedidos</span>
              </div>
              <p class="text-xl font-black text-white">
                {{ formatCurrency(data?.metrics?.byPayment?.creditCard?.revenue || 0) }}
              </p>
              <p class="text-[11px] text-slate-500 mt-1">Parcelamento em até 12x</p>
            </div>

            <!-- WhatsApp -->
            <div class="p-5 rounded-2xl bg-slate-950/60 border border-emerald-600/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span>💬</span>
                  <span>WhatsApp Checkout</span>
                </span>
                <span class="text-xs font-bold text-slate-400">{{ data?.metrics?.byPayment?.whatsapp?.count || 0 }} pedidos</span>
              </div>
              <p class="text-xl font-black text-white">
                {{ formatCurrency(data?.metrics?.byPayment?.whatsapp?.revenue || 0) }}
              </p>
              <p class="text-[11px] text-slate-500 mt-1">Negociação direta e SAC personalizado</p>
            </div>
          </div>
        </div>

        <!-- Top Selling Products Table -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-white">Produtos Mais Vendidos</h2>
            <span class="text-xs text-slate-400">Top 10 itens por faturamento</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th class="py-3 px-4">Posição & Produto</th>
                  <th class="py-3 px-4 text-center">Unidades Vendidas</th>
                  <th class="py-3 px-4 text-right">Faturamento Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr v-for="(prod, idx) in data?.topProducts || []" :key="idx" class="hover:bg-slate-800/30 transition">
                  <td class="py-3.5 px-4">
                    <div class="flex items-center space-x-3">
                      <span class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400">
                        {{ idx + 1 }}
                      </span>
                      <span class="font-bold text-white text-sm">{{ prod.name }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span class="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 font-bold">
                      {{ prod.quantity }} un.
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <span class="font-black text-emerald-400 text-sm">
                      {{ formatCurrency(prod.revenue) }}
                    </span>
                  </td>
                </tr>

                <tr v-if="!data?.topProducts?.length">
                  <td colspan="3" class="py-8 text-center text-slate-500">
                    Nenhuma venda registrada no período selecionado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const range = ref('30days')
const loading = ref(true)
const data = ref<any>(null)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

const conversionRate = computed(() => {
  if (!data.value?.metrics?.totalOrders) return 0
  const rate = (data.value.metrics.paidOrdersCount / data.value.metrics.totalOrders) * 100
  return rate.toFixed(1)
})

const loadReports = async () => {
  loading.value = true
  try {
    const res: any = await fetchWithAuth(`/api/admin/reports?range=${range.value}`)
    data.value = res
  } catch {
    router.push('/admin/login')
  } finally {
    loading.value = false
  }
}

const exportCsv = () => {
  if (!data.value?.orders || !data.value.orders.length) {
    alert('Nenhum pedido para exportar.')
    return
  }

  const headers = ['Numero do Pedido', 'Data', 'Cliente', 'Email', 'Telefone', 'Metodo Pagamento', 'Status Pagamento', 'Status Envio', 'Total (R$)']
  const rows = data.value.orders.map((o: any) => [
    `"${o.orderNumber}"`,
    `"${new Date(o.createdAt).toLocaleString('pt-BR')}"`,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.customerEmail}"`,
    `"${o.customerPhone}"`,
    `"${o.paymentMethod}"`,
    `"${o.paymentStatus}"`,
    `"${o.orderStatus}"`,
    `"${o.total.toFixed(2).replace('.', ',')}"`,
  ])

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r: any) => r.join(';'))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio_pedidos_${range.value}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }
  loadReports()
})
</script>

