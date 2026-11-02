<template>
  <aside class="w-64 bg-white border-r border-slate-200/90 text-slate-700 flex flex-col justify-between shrink-0 min-h-screen shadow-sm selection:bg-blue-600 selection:text-white">
    <div>
      <!-- Lojio Platform Brand Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <NuxtLink to="/?tenant=none" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <span class="font-extrabold text-xl tracking-tight text-slate-900">
            loj<span class="text-blue-600">io</span>
          </span>
        </NuxtLink>
        <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
          Painel
        </span>
      </div>

      <!-- Merchant Store Info & Status -->
      <div class="p-5 border-b border-slate-100 bg-slate-50/50">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
            :style="{ backgroundColor: tenant?.accentColor || '#2563eb' }"
          >
            {{ tenant?.name ? tenant.name.slice(0, 2).toUpperCase() : 'LJ' }}
          </div>
          <div class="overflow-hidden">
            <h2 class="font-extrabold text-slate-900 text-sm truncate leading-tight">
              {{ tenant?.name || 'Minha Loja' }}
            </h2>
            <div class="flex items-center space-x-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full" :class="tenant?.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
              <span class="text-[11px] font-semibold" :class="tenant?.isActive !== false ? 'text-emerald-700' : 'text-amber-700'">
                {{ tenant?.isActive !== false ? 'Loja Publicada' : 'Modo Rascunho' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Store Subdomain Pill -->
        <div class="mt-3 p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs">
          <span class="text-slate-500 font-mono truncate text-[11px]">
            {{ tenant?.subdomain || 'loja' }}.lojio.com.br
          </span>
          <a
            :href="`/?tenant=${tenant?.subdomain || ''}`"
            target="_blank"
            class="text-blue-600 hover:text-blue-800 text-[11px] font-bold shrink-0 ml-1.5 flex items-center gap-0.5"
            title="Abrir vitrine da loja"
          >
            <span>Ver</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3.5 space-y-1">
        <NuxtLink
          to="/admin"
          exact-active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Visão Geral</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/produtos"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>Produtos</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold group-hover:bg-slate-200">
            Catálogo
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/categorias"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>Categorias</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/cupons"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <span>Cupons</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
            Promo
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/pedidos"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>Pedidos & Vendas</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
            Pix
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/relatorios"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>Relatórios</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
            CSV
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin/personalizar"
          active-class="bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
            <span>Editor de Tema</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200/60">
            Design
          </span>
        </NuxtLink>

        <div class="pt-3 border-t border-slate-100">
          <a
            :href="`/?tenant=${tenant?.subdomain || ''}`"
            target="_blank"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-emerald-700 hover:bg-emerald-50 border border-emerald-200/80 transition text-sm font-bold shadow-xs"
          >
            <svg class="w-5 h-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span>Ver Vitrine da Loja</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- User Profile & Master Quick Link -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
      <NuxtLink
        to="/master"
        class="w-full flex items-center justify-center space-x-2 p-2 rounded-xl text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 transition"
      >
        <span>👑</span>
        <span>Acessar Painel Master SaaS</span>
      </NuxtLink>

      <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
            {{ user?.name ? user.name.slice(0, 1).toUpperCase() : 'L' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-900 truncate">{{ user?.name || 'Lojista' }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ user?.email }}</p>
          </div>
        </div>

        <button
          @click="logout"
          title="Encerrar Sessão"
          class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
