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
  const cookieToken = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
  const cookieUser = useCookie<User | null>('auth_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })
  const cookieTenant = useCookie<Tenant | null>('auth_tenant', { maxAge: 60 * 60 * 24 * 7, path: '/' })

  const user = useState<User | null>('auth_user', () => cookieUser.value || null)
  const tenant = useState<Tenant | null>('auth_tenant', () => cookieTenant.value || null)
  const token = useState<string | null>('auth_token', () => cookieToken.value || null)
  const loading = useState<boolean>('auth_loading', () => false)

  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = cookieToken.value || localStorage.getItem('auth_token')
      const savedUser = cookieUser.value || localStorage.getItem('auth_user')
      const savedTenant = cookieTenant.value || localStorage.getItem('auth_tenant')

      if (savedToken) {
        token.value = savedToken
        cookieToken.value = savedToken
      }

      if (savedUser) {
        try {
          const parsed = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser
          user.value = parsed
          cookieUser.value = parsed
        } catch {}
      }

      if (savedTenant) {
        try {
          const parsed = typeof savedTenant === 'string' ? JSON.parse(savedTenant) : savedTenant
          tenant.value = parsed
          cookieTenant.value = parsed
        } catch {}
      }
    }
  }

  const setAuth = (arg1: any, arg2?: any, arg3?: any) => {
    let newToken = ''
    let newUser: any = null
    let newTenant: any = null

    // Support flexible signature:
    // setAuth(token, user, tenant) OR setAuth(user, token, tenant) OR setAuth({ token, user, tenant })
    if (typeof arg1 === 'string') {
      newToken = arg1
      newUser = arg2 || null
      newTenant = arg3 || newUser?.tenant || null
    } else if (arg1 && typeof arg2 === 'string') {
      newUser = arg1
      newToken = arg2
      newTenant = arg3 || newUser?.tenant || null
    } else if (arg1 && arg1.token) {
      newToken = arg1.token
      newUser = arg1.user || null
      newTenant = arg1.tenant || newUser?.tenant || null
    }

    token.value = newToken || null
    user.value = newUser || null
    tenant.value = newTenant || null

    cookieToken.value = newToken || null
    cookieUser.value = newUser || null
    cookieTenant.value = newTenant || null

    if (import.meta.client) {
      if (newToken) localStorage.setItem('auth_token', newToken)
      else localStorage.removeItem('auth_token')

      if (newUser) localStorage.setItem('auth_user', JSON.stringify(newUser))
      else localStorage.removeItem('auth_user')

      if (newTenant) localStorage.setItem('auth_tenant', JSON.stringify(newTenant))
      else localStorage.removeItem('auth_tenant')
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    tenant.value = null

    cookieToken.value = null
    cookieUser.value = null
    cookieTenant.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_tenant')
      navigateTo('/admin/login')
    }
  }

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const headers = options.headers || {}
    const activeToken = token.value || cookieToken.value
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`
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

