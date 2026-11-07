<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const tenantQuery = computed(() => (route.query.tenant as string) || '')

const { items, isOpen, subtotal, count, updateQuantity, removeItem, clearCart } = useCart()

const { data: storeData } = await useFetch('/api/store/info', {
  query: { tenant: tenantQuery },
})
const store = computed(() => storeData.value?.store)

const close = () => {
  isOpen.value = false
}

const goToCheckout = () => {
  close()
  const tenantParam = tenantQuery.value ? `?tenant=${encodeURIComponent(tenantQuery.value)}` : ''
  navigateTo(`/checkout${tenantParam}`)
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="close"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
    </Transition>

    <!-- Slide Panel -->
    <Transition
      enter-active-class="transform transition ease-in-out duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in-out duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50"
      >
        <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-slate-900">Sua Sacola</h2>
              <span class="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full">
                {{ count }} {{ count === 1 ? 'item' : 'itens' }}
              </span>
            </div>
            <button
              @click="close"
              class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Items List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-if="items.length === 0"
              class="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div class="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-800 text-base">Sua sacola está vazia</h3>
              <p class="text-xs text-slate-400 max-w-xs mt-1">
                Explore nossos produtos e adicione seus itens favoritos para continuar.
              </p>
              <button
                @click="close"
                class="mt-6 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full transition-colors"
              >
                Continuar comprando
              </button>
            </div>

            <div
              v-for="item in items"
              :key="item.productId + (item.variantId || '')"
              class="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-white"
            >
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  :src="item.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="text-xs font-bold text-slate-900 truncate">{{ item.name }}</h4>
                    <button
                      @click="removeItem(item.productId, item.variantId)"
                      class="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title="Remover produto"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="item.variantName" class="text-[11px] text-slate-500 mt-0.5">
                    {{ item.variantName }}
                  </p>
                  <p class="text-xs font-extrabold text-slate-900 mt-1">
                    R$ {{ (item.price * item.quantity).toFixed(2).replace('.', ',') }}
                  </p>
                </div>

                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      @click="updateQuantity(item.productId, item.quantity - 1, item.variantId)"
                      class="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      -
                    </button>
                    <span class="px-2 text-xs font-semibold text-slate-800">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item.productId, item.quantity + 1, item.variantId)"
                      class="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Summary -->
          <div v-if="items.length > 0" class="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span class="font-semibold text-slate-800">
                  R$ {{ subtotal.toFixed(2).replace('.', ',') }}
                </span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Frete</span>
                <span class="text-emerald-600 font-semibold">Calculado no checkout</span>
              </div>
              <div class="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Estimado</span>
                <span>R$ {{ subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>

            <button
              @click="goToCheckout"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Finalizar Compra</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

