export interface CartItem {
  productId: string
  variantId?: string | null
  name: string
  variantName?: string | null
  price: number
  quantity: number
  imageUrl?: string
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart_items', () => [])
  const isOpen = useState<boolean>('cart_is_open', () => false)

  // Initialize from localStorage on client side
  onMounted(() => {
    try {
      const saved = localStorage.getItem('saas_cart')
      if (saved) {
        items.value = JSON.parse(saved)
      }
    } catch {}
  })

  // Watch for changes to persist
  if (import.meta.client) {
    watch(
      items,
      (newItems) => {
        try {
          localStorage.setItem('saas_cart', JSON.stringify(newItems))
        } catch {}
      },
      { deep: true }
    )
  }

  const addItem = (item: CartItem) => {
    const existingIndex = items.value.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    )

    if (existingIndex > -1) {
      items.value[existingIndex].quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }

    isOpen.value = true
  }

  const removeItem = (productId: string, variantId?: string | null) => {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    )
  }

  const updateQuantity = (productId: string, quantity: number, variantId?: string | null) => {
    const item = items.value.find(
      (i) => i.productId === productId && i.variantId === variantId
    )
    if (item) {
      if (quantity <= 0) {
        removeItem(productId, variantId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
    if (import.meta.client) {
      localStorage.removeItem('saas_cart')
    }
  }

  const count = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  return {
    items,
    isOpen,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}

