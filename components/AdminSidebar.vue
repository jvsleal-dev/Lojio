<template>
  <aside class="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
    <div>
      <!-- Store Info & Status -->
      <div class="p-6 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shrink-0"
            :style="{ backgroundColor: '#1f7a52' }"
          >
            {{ tenant?.name ? tenant.name.slice(0, 2).toUpperCase() : 'LJ' }}
          </div>
          <div class="overflow-hidden">
            <h2 class="font-extrabold text-white text-sm truncate leading-tight">
              {{ tenant?.name || 'Minha Loja' }}
            </h2>
            <div class="flex items-center space-x-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-[11px] text-emerald-400 font-semibold">Loja Online</span>
            </div>
          </div>
        </div>

        <!-- Store Subdomain Pill -->
        <div class="mt-3.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <span class="text-slate-400 font-mono truncate text-[11px]">
            {{ tenant?.subdomain || 'loja' }}.localhost
          </span>
          <a
            :href="`/?tenant=${tenant?.subdomain || ''}`"
            target="_blank"
            class="text-blue-400 hover:text-white text-[11px] font-bold shrink-0 ml-1"
            title="Abrir vitrine"
          >
            ↗
          </a>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 space-y-1.5">
        <NuxtLink
          to="/admin"
          exact-active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Visão Geral</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/produtos"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>Produtos</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
            Catálogo
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/categorias"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>Categorias</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/cupons"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <span>Cupons</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
            Promo
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/pedidos"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>Pedidos & Vendas</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
            Pix
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/relatorios"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>Relatórios</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
            CSV
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/personalizar"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
          </svg>
          <span>Personalizar Loja</span>
        </NuxtLink>

        <div class="pt-4 border-t border-slate-800/80">
          <a
            :href="`/?tenant=${tenant?.subdomain || ''}`"
            target="_blank"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-600/20 border border-emerald-500/20 transition text-sm font-bold"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span>Ver Vitrine da Loja</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- User Profile & Master Quick Link -->
    <div class="p-4 border-t border-slate-800 space-y-3">
      <NuxtLink
        to="/master"
        class="w-full flex items-center justify-center space-x-2 p-2 rounded-xl text-xs font-bold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 transition"
      >
        <span>👑</span>
        <span>Acessar Painel Master SaaS</span>
      </NuxtLink>

      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
            {{ user?.name ? user.name.slice(0, 1) : 'L' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate">{{ user?.name || 'Lojista' }}</p>
            <p class="text-[11px] text-slate-400 truncate">{{ user?.email }}</p>
          </div>
        </div>

        <button
          @click="logout"
          title="Encerrar Sessão"
          class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
