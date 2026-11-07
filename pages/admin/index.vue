<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Top Store Header & Quick Actions -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full" :class="data?.tenant?.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
            <span class="text-xs font-semibold uppercase tracking-wide" :class="data?.tenant?.isActive !== false ? 'text-emerald-700' : 'text-amber-700'">
              {{ data?.tenant?.isActive !== false ? 'Loja Publicada' : 'Modo Rascunho' }} &bull; {{ data?.tenant?.name || 'Minha Loja' }}
            </span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 mt-1">Visão Geral do E-commerce</h1>
          <p class="text-slate-500 text-sm">Acompanhe vendas em tempo real, pedidos e estoque da sua marca.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Botão Publicar / Pausar Loja -->
          <button
            @click="togglePublishStore"
            :disabled="publishing"
            class="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
            :class="data?.tenant?.isActive !== false
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 animate-pulse'"
            :title="data?.tenant?.isActive !== false ? 'Clique para pausar e colocar em modo rascunho' : 'Clique para publicar a loja na internet'"
          >
            <svg v-if="data?.tenant?.isActive !== false" class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.458 14.96 14.96 0 01.06-.312m-2.24 7.99a4.5 4.5 0 01-1.414-1.414m3.654 3.654l-1.06-1.06m-2.594-2.594l-1.06-1.06" />
            </svg>
            <span>{{ data?.tenant?.isActive !== false ? 'Loja Publicada' : 'Publicar Loja' }}</span>
          </button>

          <!-- Copy Store Link Pill -->
          <button
            @click="copyStoreLink"
            class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center space-x-2 transition shadow-xs"
            title="Copiar link da vitrine"
          >
            <svg v-if="copied" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>{{ copied ? 'Link Copiado!' : 'Copiar Link da Loja' }}</span>
          </button>

          <!-- Ver Loja Online -->
          <a
            :href="`/?tenant=${data?.tenant?.subdomain || ''}`"
            target="_blank"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition border border-slate-200"
          >
            <span>Abrir Vitrine</span>
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>

          <!-- Novo Produto -->
          <NuxtLink
            to="/admin/produtos/novo"
            class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition"
          >
            <span>+ Novo Produto</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Banner de Alerta se Loja estiver em Rascunho -->
      <div v-if="data?.tenant && data?.tenant?.isActive === false" class="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div class="flex items-center space-x-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900">Sua loja está em Modo Rascunho (Privada)</h3>
            <p class="text-xs text-amber-700 mt-0.5">
              Seus clientes não conseguem ver seus produtos ou finalizar compras até que você clique em <strong>Publicar Loja</strong>.
            </p>
          </div>
        </div>
        <button
          @click="togglePublishStore"
          :disabled="publishing"
          class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0 flex items-center space-x-2"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.458 14.96 14.96 0 01.06-.312m-2.24 7.99a4.5 4.5 0 01-1.414-1.414m3.654 3.654l-1.06-1.06m-2.594-2.594l-1.06-1.06" />
          </svg>
          <span>Publicar Minha Loja Agora</span>
        </button>
      </div>

      <!-- Toast Feedback de Publicação -->
      <div v-if="publishMessage" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
        <span>{{ publishMessage }}</span>
        <button @click="publishMessage = ''" class="text-emerald-600 hover:text-emerald-900 text-base">&times;</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-500 text-sm">Carregando métricas da sua loja...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Revenue -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Faturamento Total</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-xs">
                R$
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ formatCurrency(data?.metrics?.totalRevenue || 0) }}
            </p>
            <div class="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
              <span class="text-emerald-600 font-semibold">{{ data?.metrics?.paidOrders || 0 }} pedidos</span>
              <span>pagos com sucesso</span>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Pedidos</span>
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ data?.metrics?.totalOrders || 0 }}
            </p>
            <div class="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
              <span class="text-amber-600 font-semibold">{{ data?.metrics?.pendingOrders || 0 }} pendentes</span>
              <span>({{ formatCurrency(data?.metrics?.pendingRevenue || 0) }})</span>
            </div>
          </div>

          <!-- Average Ticket -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Ticket Médio</span>
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ formatCurrency(data?.metrics?.averageTicket || 0) }}
            </p>
            <p class="mt-2 text-xs text-slate-500">Gasto médio por cliente aprovado</p>
          </div>

          <!-- Total Products & Stock -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Catálogo Ativo</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900">
              {{ data?.metrics?.totalProducts || 0 }} produtos
            </p>
            <div class="mt-2 text-xs">
              <span v-if="data?.metrics?.lowStockCount > 0" class="text-amber-600 font-bold flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{{ data?.metrics?.lowStockCount }} com estoque crítico</span>
              </span>
              <span v-else class="text-emerald-600 font-semibold flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Todos os estoques saudáveis</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Weekly Sales Visual Bar Chart (Last 7 Days) -->
        <div class="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900">Evolução de Vendas (Últimos 7 dias)</h2>
              <p class="text-xs text-slate-500">Faturamento diário liquidado na sua loja</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              Pix & Cartão
            </span>
          </div>

          <!-- Bars Container -->
          <div class="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100">
            <div
              v-for="day in data?.salesHistory"
              :key="day.date"
              class="flex flex-col items-center justify-end h-full group"
            >
              <!-- Tooltip on hover -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 px-2 py-0.5 rounded text-white font-bold mb-1 whitespace-nowrap shadow pointer-events-none">
                {{ formatCurrency(day.total) }} ({{ day.ordersCount }} ped)
              </div>

              <!-- Bar -->
              <div class="w-full max-w-[40px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-full">
                <div
                  class="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-500 group-hover:to-indigo-400"
                  :style="{ height: getBarHeight(day.total) }"
                ></div>
              </div>

              <!-- Day Label -->
              <span class="text-[11px] text-slate-500 font-semibold mt-2 text-center truncate w-full">
                {{ day.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Smart Assistant Card: Lumi IA (Inspired by Nuvemshop) -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/40 border border-blue-200/70 shadow-sm relative overflow-hidden">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <span class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span class="text-xs font-bold uppercase tracking-wider text-blue-700">Lumi IA &bull; Assistente da Loja</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">Recomendações Práticas para seu E-commerce</h3>
              <p class="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Nossa inteligência artificial identificou que o pagamento via PIX tem <strong class="text-emerald-700 font-bold">100% de aprovação imediata</strong>. Recomendamos ativar o frete grátis para compras acima de R$ 199 no menu de personalização para aumentar seu ticket médio.
              </p>
            </div>

            <NuxtLink
              to="/admin/personalizar"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition shrink-0"
            >
              Configurar Oferta
            </NuxtLink>
          </div>
        </div>

        <!-- 2 Columns: Recent Orders & Low Stock Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Recent Orders Table (8 cols) -->
          <div class="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Últimos Pedidos Recebidos</h2>
                <p class="text-xs text-slate-500">Vendas recentes realizadas na sua loja virtual</p>
              </div>
              <NuxtLink to="/admin/pedidos" class="text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                Ver todos os pedidos &rarr;
              </NuxtLink>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider">
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

                    <td class="py-3.5 px-3 font-bold text-emerald-600">
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
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        :class="{
                          'bg-blue-50 text-blue-700 border border-blue-200': order.orderStatus === 'shipped',
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': order.orderStatus === 'delivered',
                          'bg-slate-100 text-slate-600 border border-slate-200': order.orderStatus === 'processing' || order.orderStatus === 'pending',
                        }"
                      >
                        {{ formatOrderStatus(order.orderStatus) }}
                      </span>
                    </td>

                    <td class="py-3.5 px-3 text-right">
                      <NuxtLink
                        to="/admin/pedidos"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
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
          <div class="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">Controle de Estoque</h2>
                <p class="text-xs text-slate-500">Itens que precisam de atenção</p>
              </div>
              <NuxtLink to="/admin/produtos" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                Ver todos
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="prod in data?.lowStockProducts"
                :key="prod.id"
                class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div class="flex items-center space-x-3 overflow-hidden">
                  <img
                    v-if="prod.coverImage"
                    :src="prod.coverImage"
                    :alt="prod.name"
                    class="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0"
                  >
                    IMG
                  </div>
                  <div class="overflow-hidden">
                    <p class="font-bold text-xs text-slate-900 truncate">{{ prod.name }}</p>
                    <p class="text-[10px] text-slate-500 font-mono">{{ prod.sku || 'Sem SKU' }}</p>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {{ prod.stockQuantity }} un
                  </span>
                </div>
              </div>

              <div v-if="!data?.lowStockProducts?.length" class="py-6 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Todos os produtos com estoque saudável acima de 10 unidades.</span>
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
  middleware: 'admin',
})

const { token, isAuthenticated, initAuth, fetchWithAuth } = useAuth()
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
