<template>
  <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen text-slate-200">
    <div>
      <!-- Brand Header -->
      <div class="p-6 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-brand-600 flex items-center justify-center text-white font-bold text-sm border border-brand-400">
            SM
          </div>
          <div>
            <h1 class="font-black text-white text-base leading-tight tracking-tight">Lojio Master</h1>
            <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SuperAdmin
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 space-y-1.5">
        <NuxtLink
          to="/master"
          exact-active-class="bg-brand-600 text-white font-semibold"
          class="flex items-center space-x-3 px-3.5 py-2.5 border-l-2 border-transparent text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Visão Geral</span>
        </NuxtLink>

        <NuxtLink
          to="/master/lojas"
          active-class="bg-brand-600 text-white font-semibold"
          class="flex items-center justify-between px-3.5 py-2.5 border-l-2 border-transparent text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span>Gerenciar Lojas</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 font-semibold border border-slate-700">
            Clientes
          </span>
        </NuxtLink>

        <a
          href="/"
          target="_blank"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          <span>Abrir Portal SaaS</span>
        </a>

        <NuxtLink
          to="/admin"
          target="_blank"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition text-sm font-medium"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <span>Painel do Lojista</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Admin Profile & Logout -->
    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-3">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 border border-indigo-500/30">
            AD
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate">{{ user?.name || 'Admin Geral' }}</p>
            <p class="text-[11px] text-slate-400 truncate">{{ user?.email || 'admin@saas.com' }}</p>
          </div>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition"
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
