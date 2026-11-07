<template>
  <aside class="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 min-h-screen text-slate-700 shadow-sm selection:bg-emerald-600 selection:text-white">
    <div>
      <!-- Brand Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <NuxtLink to="/master" class="flex items-center space-x-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 class="font-black text-slate-900 text-base leading-tight tracking-tight">Lojio Master</h1>
            <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              SuperAdmin
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3.5 space-y-1">
        <NuxtLink
          to="/master"
          exact-active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Visão Geral</span>
        </NuxtLink>

        <NuxtLink
          to="/master/lojas"
          active-class="bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-2xs"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span>Gerenciar Lojas</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
            Tenants
          </span>
        </NuxtLink>

        <NuxtLink
          to="/admin"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <span>Painel do Lojista</span>
        </NuxtLink>

        <NuxtLink
          to="/?tenant=none"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          <span>Página Inicial Lojio</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Admin Profile & Logout -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
      <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
            AD
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-900 truncate">{{ user?.name || 'Admin Geral' }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ user?.email || 'admin@lojio.com.br' }}</p>
          </div>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span>Encerrar Sessão Master</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/master/login')
}
</script>
