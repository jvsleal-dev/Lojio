<template>
  <aside class="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between shrink-0 min-h-screen selection:bg-emerald-600 selection:text-white">
    <div class="flex-1 overflow-y-auto">
      <!-- Nuvemshop Style Brand Header -->
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <NuxtLink to="/admin" class="flex items-center space-x-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <!-- Nuvemshop/Lojio Cloud Icon -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <span class="font-extrabold text-lg tracking-tight text-slate-900">
            loj<span class="text-emerald-600">io</span>
          </span>
        </NuxtLink>

        <!-- Sidebar Collapse Icon (Nuvemshop style) -->
        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          title="Alternar visualização da barra lateral"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3 space-y-6">
        <!-- Main Top Section (Início e Estatísticas) -->
        <div class="space-y-1">
          <NuxtLink
            to="/admin"
            exact-active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Nuvemshop Início Home Outline Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Início</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/relatorios"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Estatísticas Bar Chart Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>Estatísticas</span>
          </NuxtLink>
        </div>

        <!-- Section: Gestão -->
        <div class="space-y-1">
          <p class="px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
            Gestão
          </p>

          <NuxtLink
            to="/admin/pedidos"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <div class="flex items-center space-x-3">
              <!-- Cart / Vendas Icon -->
              <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Vendas</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/produtos"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <div class="flex items-center space-x-3">
              <!-- Tag / Produtos Icon -->
              <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span>Produtos</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/categorias"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Categories Folder Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
            <span>Categorias</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/personalizar"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Meios de Pagamento Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Meios de Pagamento</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/personalizar"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Formas de Envio Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span>Formas de Envio</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/pedidos"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Users / Clientes Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Clientes</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/cupons"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <div class="flex items-center space-x-3">
              <!-- Descontos Percent Icon -->
              <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              <span>Descontos</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/personalizar"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Marketing Megaphone Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span>Marketing</span>
          </NuxtLink>
        </div>

        <!-- Section: Canais de venda -->
        <div class="space-y-1">
          <p class="px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
            Canais de venda
          </p>

          <div class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-sm font-medium group">
            <NuxtLink to="/admin/construtor" class="flex items-center space-x-3 flex-1" active-class="text-emerald-700 font-bold">
              <!-- Elementor / Blocks Icon -->
              <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span>Editar Layout da Loja</span>
            </NuxtLink>
            <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Visual</span>
          </div>

          <div class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-sm font-medium group">
            <NuxtLink to="/admin/personalizar" class="flex items-center space-x-3 flex-1">
              <!-- Storefront Window Icon -->
              <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Loja online</span>
            </NuxtLink>
            <a
              :href="`/?tenant=${tenant?.subdomain || ''}`"
              target="_blank"
              class="text-slate-400 hover:text-emerald-600 transition"
              title="Abrir vitrine em nova guia"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div class="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 text-sm font-normal">
            <span class="flex items-center space-x-3">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Ponto de Venda</span>
            </span>
            <span class="text-[10px] text-slate-400">↗</span>
          </div>

          <div class="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 text-sm font-normal">
            <span class="flex items-center space-x-3">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Chat</span>
            </span>
          </div>

          <div class="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 text-sm font-normal">
            <span class="flex items-center space-x-3">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Instagram e Facebook</span>
            </span>
          </div>

          <div class="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 text-sm font-normal">
            <span class="flex items-center space-x-3">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Google Shopping</span>
            </span>
          </div>
        </div>

        <!-- Section: Configurações -->
        <div class="pt-2 border-t border-slate-100">
          <NuxtLink
            to="/admin/personalizar"
            active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
          >
            <!-- Gear Icon -->
            <svg class="w-4 h-4 shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configurações</span>
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- User Profile Bar (Nuvemshop style) -->
    <div class="p-3 border-t border-slate-100 bg-slate-50/70">
      <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
            {{ user?.name ? user.name.slice(0, 1).toUpperCase() : 'J' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-900 truncate leading-tight">{{ user?.name || 'João vitor dos santos leal' }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ tenant?.name || 'Moda Urbana' }}</p>
          </div>
        </div>

        <button
          @click="logout"
          title="Encerrar Sessão"
          class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { user, tenant, logout } = useAuth()
</script>
