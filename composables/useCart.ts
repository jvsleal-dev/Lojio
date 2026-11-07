export interface CartItem {
  productId: string
  variantId?: string | null
  name: string
  variantName?: string | null
  price: number
  quantity: number
  imageUrl?: string
  tenantSubdomain?: string
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart_items', () => [])
  const isOpen = useState<boolean>('cart_is_open', () => false)
  const isInitialized = useState<boolean>('cart_initialized', () => false)
  const route = useRoute()

  const getActiveTenantKey = () => {
    if (import.meta.client) {
      const q = (route.query.tenant as string)?.toLowerCase()?.trim()
      if (q && !['none', 'saas', 'plataforma', 'home', ''].includes(q)) {
        return q
      }
      const cookieVal = useCookie('selected_tenant').value
      if (cookieVal && !['none', 'saas', 'plataforma', 'home', ''].includes(cookieVal)) {
        return cookieVal
      }
      const host = window.location.hostname.split('.')[0]
      if (host && !['localhost', '127', 'lojio', 'www'].includes(host)) {
        return host
      }
    }
    return 'default'
  }

  const loadCartForCurrentTenant = () => {
    if (!import.meta.client) return
    const key = `lojio_cart_${getActiveTenantKey()}`
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        items.value = JSON.parse(saved)
      } else {
        items.value = []
      }
    } catch {
      items.value = []
    }
  }

  const saveCartForCurrentTenant = () => {
    if (!import.meta.client) return
    const key = `lojio_cart_${getActiveTenantKey()}`
    try {
      localStorage.setItem(key, JSON.stringify(items.value))
    } catch {}
  }

  onMounted(() => {
    if (!isInitialized.value) {
      loadCartForCurrentTenant()
      isInitialized.value = true
    }
  })

  // Watch route query to switch cart if tenant changes
  if (import.meta.client) {
    watch(
      () => route.query.tenant,
      (newTenant, oldTenant) => {
        if (newTenant !== oldTenant) {
          loadCartForCurrentTenant()
        }
      }
    )

    // Watch items to persist to current tenant's storage
    watch(
      items,
      () => {
        saveCartForCurrentTenant()
      },
      { deep: true }
    )
  }

  const addItem = (item: CartItem) => {
    const tenantKey = getActiveTenantKey()
    const existingIndex = items.value.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    )

    if (existingIndex > -1) {
      items.value[existingIndex].quantity += item.quantity
    } else {
      items.value.push({
        ...item,
        tenantSubdomain: item.tenantSubdomain || tenantKey,
      })
    }

    saveCartForCurrentTenant()
    isOpen.value = true
  }

  const removeItem = (productId: string, variantId?: string | null) => {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    )
    saveCartForCurrentTenant()
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
        saveCartForCurrentTenant()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    if (import.meta.client) {
      const key = `lojio_cart_${getActiveTenantKey()}`
      localStorage.removeItem(key)
    }
  }

  const count = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }

  return {
    items,
    isOpen,
    count,
    subtotal,
    open,
    close,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCartForCurrentTenant,
  }
}

