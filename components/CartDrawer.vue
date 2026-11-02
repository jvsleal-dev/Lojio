<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const { items, isOpen, subtotal, count, updateQuantity, removeItem, clearCart } = useCart()

const { data: storeData } = await useFetch('/api/store/info')
const store = computed(() => storeData.value?.store)

const close = () => {
  isOpen.value = false
}

const goToCheckout = () => {
  close()
  navigateTo('/checkout')
}

const checkoutViaWhatsapp = () => {
  if (items.value.length === 0) return
  const listText = items.value
    .map(i => `• ${i.quantity}x ${i.name}${i.variantName ? ` (${i.variantName})` : ''} - R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}`)
    .join('\n')
  const storeName = store.value?.name || 'sua loja'
  const msg = `👋 Olá, ${storeName}!\n\nGostaria de fechar o pedido com os seguintes itens da minha sacola:\n\n${listText}\n\n💰 *Total Estimado: R$ ${subtotal.value.toFixed(2).replace('.', ',')}*\n\nComo posso combinar o pagamento e o envio com você?`
  const cleanPhone = (store.value?.contactWhatsapp || '11999998888').replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank')
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
                class="mt-6 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full transition-colors"
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
                      class="text-slate-400 hover:text-red-500 text-xs p-1"
                      title="Remover"
                    >
                      ✕
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
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Finalizar Compra</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- WhatsApp Checkout Button directly in Drawer -->
            <button
              @click="checkoutViaWhatsapp"
              type="button"
              class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Pedir Sacola via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

