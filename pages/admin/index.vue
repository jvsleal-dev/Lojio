<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto">
      <!-- Nuvemshop Top Navigation Header -->
      <header class="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <!-- Search bar (Nuvemshop style) -->
        <div class="flex items-center flex-1 max-w-md">
          <div class="relative w-full">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar no painel..."
              class="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            />
          </div>
        </div>

        <!-- Top Right Actions (Lumi, Help, User Avatar) -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Lumi / Assistente IA Pill (Nuvemshop style) -->
          <button
            type="button"
            class="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white transition shadow-2xs"
          >
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Lumi</span>
          </button>

          <!-- Help Icon (?) -->
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center text-xs font-bold transition"
            title="Central de Ajuda"
          >
            ?
          </button>

          <!-- User Initial Avatar & Name -->
          <div class="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {{ user?.name ? user.name.slice(0, 1).toUpperCase() : 'J' }}
            </div>
            <span class="hidden md:inline text-xs font-semibold text-slate-800">
              {{ user?.name || 'João vitor dos santos leal' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Main Body Container -->
      <div class="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
        <!-- Toast Feedback -->
        <div v-if="publishMessage" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <span>{{ publishMessage }}</span>
          <button @click="publishMessage = ''" class="text-emerald-600 hover:text-emerald-900 text-base font-black">&times;</button>
        </div>

        <!-- Nuvemshop Title Section -->
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Início
          </h1>
          <p class="text-sm text-slate-500 font-medium">
            Confira os passos para deixar sua loja do seu jeito!
          </p>
        </div>

        <!-- Nuvemshop Onboarding Checklist Card (Exact layout from screenshot) -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          <!-- Item 1: Validar conta (Done) -->
          <div class="p-5 flex items-start space-x-3.5 bg-slate-50/30">
            <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-slate-800 line-through text-sm leading-tight">
                Validar conta
              </p>
              <p class="text-xs text-slate-400 mt-0.5">
                Você já pode continuar trabalhando em sua loja.
              </p>
            </div>
          </div>

          <!-- Item 2: Mostre seus produtos (Active Accordion) -->
          <div class="p-5 bg-white">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3.5">
                <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-sm leading-tight">
                    Mostre seus produtos
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Gere com IA, adicione um a um ou importe seu catálogo.
                  </p>
                  <div class="mt-3.5 flex items-center space-x-3">
                    <NuxtLink
                      to="/admin/produtos/novo"
                      class="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/25 transition active:scale-95"
                    >
                      Adicionar produto
                    </NuxtLink>
                    <NuxtLink
                      to="/admin/produtos"
                      class="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                    >
                      Ver catálogo ({{ data?.metrics?.totalProducts || 0 }})
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <NuxtLink to="/admin/produtos" class="text-slate-400 hover:text-slate-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- Item 3: Personalize sua loja e crie o layout -->
          <NuxtLink
            to="/admin/construtor"
            class="p-5 flex items-start justify-between hover:bg-slate-50/60 transition group cursor-pointer block border-l-4 border-l-emerald-600 bg-emerald-50/20"
          >
            <div class="flex items-start space-x-3.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-600/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <p class="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition">
                    Criar & Editar Layout da Loja
                  </p>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">Novo</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Arraste seções, edite carrossel de slides, produtos, banners, cores e tipografia com preview ao vivo.
                </p>
                <div class="mt-3">
                  <span class="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition">
                    Abrir Editor de Layout &rarr;
                  </span>
                </div>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>

          <!-- Item 4: Defina de onde saem seus pedidos -->
          <NuxtLink
            to="/admin/personalizar"
            class="p-5 flex items-start justify-between hover:bg-slate-50/60 transition group cursor-pointer block"
          >
            <div class="flex items-start space-x-3.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition">
                  Defina de onde saem seus pedidos
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Configure o CEP de origem da expedição e embalagens.
                </p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </NuxtLink>

          <!-- Item 5: Formas de Envio e Frete -->
          <NuxtLink
            to="/admin/personalizar"
            class="p-5 flex items-start justify-between hover:bg-slate-50/60 transition group cursor-pointer block"
          >
            <div class="flex items-start space-x-3.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition">
                  Configurar Formas de Envio
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Opções de entrega dos Correios, PAC, SEDEX, transportadoras e regras de frete grátis.
                </p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </NuxtLink>

          <!-- Item 6: Meios de Pagamento (Mercado Pago, Pix, Cartão) -->
          <NuxtLink
            to="/admin/personalizar"
            class="p-5 flex items-start justify-between hover:bg-slate-50/60 transition group cursor-pointer block"
          >
            <div class="flex items-start space-x-3.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition">
                  Configurar Meios de Pagamento
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Mercado Pago com Checkout Transparente, Pix com aprovação imediata e parcelamento no cartão.
                </p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Nuvemshop Store Construction Status Bar (Exact bottom bar from screenshot) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="data?.tenant?.isActive !== false ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
              ></span>
              <h3 class="text-sm font-bold text-slate-900">
                {{ data?.tenant?.isActive !== false ? 'Sua loja está online' : 'Sua loja está em construção' }}
              </h3>
            </div>
            <p class="text-xs text-slate-500">
              Você já pode acessar
              <a
                :href="`/?tenant=${data?.tenant?.subdomain || tenant?.subdomain || 'moda'}`"
                target="_blank"
                class="font-mono text-emerald-700 font-semibold hover:underline"
              >
                {{ data?.tenant?.subdomain || tenant?.subdomain || 'loja' }}.lojio.com.br
              </a>
            </p>
          </div>

          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <a
              :href="`/?tenant=${data?.tenant?.subdomain || tenant?.subdomain || ''}`"
              target="_blank"
              class="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition inline-flex items-center gap-1.5"
            >
              <span>Ver loja</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <button
              @click="togglePublishStore"
              :disabled="publishing"
              class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50"
            >
              {{ data?.tenant?.isActive !== false ? 'Pausar loja' : 'Publicar loja' }}
            </button>
          </div>
        </div>

        <!-- Nuvemshop Clean Metrics / Estatísticas Section -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-slate-900">
              Resumo de Vendas e Desempenho
            </h2>
            <NuxtLink to="/admin/relatorios" class="text-xs font-bold text-emerald-700 hover:underline">
              Ver estatísticas completas &rarr;
            </NuxtLink>
          </div>

          <!-- 4 Cards Grid with Clean Nuvemshop styling -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Revenue -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Faturamento
              </span>
              <p class="text-2xl font-black text-slate-900 tracking-tight">
                {{ formatCurrency(data?.metrics?.totalRevenue || 0) }}
              </p>
              <p class="mt-1 text-xs text-emerald-700 font-medium">
                {{ data?.metrics?.paidOrders || 0 }} pedidos pagos
              </p>
            </div>

            <!-- Total Orders -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total de Pedidos
              </span>
              <p class="text-2xl font-black text-slate-900 tracking-tight">
                {{ data?.metrics?.totalOrders || 0 }}
              </p>
              <p class="mt-1 text-xs text-amber-700 font-medium">
                {{ data?.metrics?.pendingOrders || 0 }} aguardando pagamento
              </p>
            </div>

            <!-- Average Ticket -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Ticket Médio
              </span>
              <p class="text-2xl font-black text-slate-900 tracking-tight">
                {{ formatCurrency(data?.metrics?.averageTicket || 0) }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                Média por compra aprovada
              </p>
            </div>

            <!-- Active Products -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Produtos no Catálogo
              </span>
              <p class="text-2xl font-black text-slate-900 tracking-tight">
                {{ data?.metrics?.totalProducts || 0 }}
              </p>
              <p class="mt-1 text-xs text-emerald-700 font-medium">
                {{ data?.metrics?.lowStockCount || 0 }} com estoque crítico
              </p>
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-slate-900">Últimos Pedidos</h2>
            <NuxtLink to="/admin/pedidos" class="text-xs font-bold text-emerald-700 hover:underline">
              Ver todos &rarr;
            </NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                  <th class="py-3 px-3">Pedido</th>
                  <th class="py-3 px-3">Cliente</th>
                  <th class="py-3 px-3">Total</th>
                  <th class="py-3 px-3">Pagamento</th>
                  <th class="py-3 px-3">Envio</th>
                  <th class="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr v-for="order in data?.recentOrders" :key="order.id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-3">
                    <span class="font-bold text-slate-900">#{{ order.orderNumber }}</span>
                    <p class="text-[10px] text-slate-400">{{ formatDate(order.createdAt) }}</p>
                  </td>
                  <td class="py-3.5 px-3">
                    <p class="font-semibold text-slate-800">{{ order.customerName }}</p>
                    <p class="text-[11px] text-slate-400">{{ order.customerPhone }}</p>
                  </td>
                  <td class="py-3.5 px-3 font-bold text-emerald-700">
                    {{ formatCurrency(order.total) }}
                  </td>
                  <td class="py-3.5 px-3">
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                      :class="order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                    >
                      {{ order.paymentStatus === 'paid' ? 'Pago' : 'Pendente' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                      {{ formatOrderStatus(order.orderStatus) }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-right">
                    <NuxtLink
                      to="/admin/pedidos"
                      class="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const { token, isAuthenticated, initAuth, fetchWithAuth, user } = useAuth()
const router = useRouter()

const loading = ref(true)
const data = ref<any>(null)
const copied = ref(false)
const publishing = ref(false)
const publishMessage = ref('')

const togglePublishStore = async () => {
  publishing.value = true
  publishMessage.value = ''
  try {
    const res: any = await fetchWithAuth('/api/admin/store-publish', {
      method: 'POST',
    })
    if (data.value?.tenant) {
      data.value.tenant.isActive = res.isPublished
    }
    publishMessage.value = res.message
    setTimeout(() => { publishMessage.value = '' }, 4000)
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erro ao alterar publicação da loja.')
  } finally {
    publishing.value = false
  }
}

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
