<script setup lang="ts">
defineProps<{
  store?: any
}>()
</script>

<template>
  <footer class="bg-white border-t border-slate-300 mt-20">
    <!-- Benefits Bar -->
    <div class="border-b border-slate-200 py-9 bg-stone-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 border border-slate-200 bg-white text-slate-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900">Entrega para todo o Brasil</h4>
              <p class="text-xs text-slate-500 mt-0.5">Rastreamento direto e envios rápidos</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-11 h-11 border border-slate-200 bg-white text-slate-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900">Pagamento 100% Seguro</h4>
              <p class="text-xs text-slate-500 mt-0.5">PIX dinâmico e proteção total</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-11 h-11 border border-slate-200 bg-white text-slate-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900">Suporte Direto</h4>
              <p class="text-xs text-slate-500 mt-0.5">Atendimento humano via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4 md:col-span-2">
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-xl text-slate-900 tracking-tight">
              {{ store?.name || 'Minha Loja' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 max-w-sm leading-relaxed">
            {{ store?.description || 'Plataforma oficial de compras online com catálogo exclusivo e entrega garantida.' }}
          </p>
          <div v-if="store?.contactWhatsapp" class="pt-2">
            <a
              :href="`https://wa.me/55${store.contactWhatsapp.replace(/\D/g, '')}`"
              target="_blank"
              class="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
            >
              <span>Falar no WhatsApp: {{ store.contactWhatsapp }}</span>
            </a>
          </div>
        </div>

        <div>
          <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Institucional</h5>
          <ul class="space-y-2 text-xs text-slate-600">
            <li><NuxtLink :to="store?.subdomain ? `/?tenant=${store.subdomain}` : '/'" class="hover:text-blue-600 transition-colors">Catálogo da Loja</NuxtLink></li>
            <li><NuxtLink to="/checkout" class="hover:text-blue-600 transition-colors">Carrinho e Checkout</NuxtLink></li>
            <li><NuxtLink to="/admin" class="hover:text-blue-600 transition-colors">Área do Lojista</NuxtLink></li>
            <li><NuxtLink to="/?tenant=none" class="font-bold text-blue-600 hover:text-blue-800 transition-colors">⚡ Plataforma Lojio (Criar Loja)</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Meios de Pagamento</h5>
          <div class="flex flex-wrap gap-2 text-xs text-slate-600">
            <span class="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">PIX</span>
            <span class="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">Cartão de Crédito</span>
            <span class="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">Boleto</span>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {{ new Date().getFullYear() }} {{ store?.name }}. Todos os direitos reservados.</p>
        <p class="flex items-center gap-1">
          <span>Criado com</span>
          <span class="font-bold text-slate-700">Nuxt 3 & Prisma</span>
        </p>
      </div>
    </div>
  </footer>
</template>
