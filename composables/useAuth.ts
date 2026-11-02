export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Tenant {
  id: string
  name: string
  subdomain: string
  primaryColor?: string
  accentColor?: string
  announcementBar?: string
  showAnnouncement?: boolean
  logoUrl?: string
  bannerUrl?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const tenant = useState<Tenant | null>('auth_tenant', () => null)
  const token = useState<string | null>('auth_token', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      const savedTenant = localStorage.getItem('auth_tenant')

      if (savedToken) token.value = savedToken
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch {}
      }
      if (savedTenant) {
        try {
          tenant.value = JSON.parse(savedTenant)
        } catch {}
      }
    }
  }

  const setAuth = (newToken: string, newUser: User, newTenant: Tenant) => {
    token.value = newToken
    user.value = newUser
    tenant.value = newTenant

    if (import.meta.client) {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      localStorage.setItem('auth_tenant', JSON.stringify(newTenant))
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    tenant.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_tenant')
      navigateTo('/admin/login')
    }
  }

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const headers = options.headers || {}
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return $fetch(url, {
      ...options,
      headers,
    })
  }

  return {
    user,
    tenant,
    token,
    loading,
    isAuthenticated: computed(() => !!token.value),
    initAuth,
    setAuth,
    setSession: setAuth,
    logout,
    fetchWithAuth,
  }
}

