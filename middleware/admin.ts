export default defineNuxtRouteMiddleware((to) => {
  const { token, initAuth } = useAuth()
  initAuth()

  const cookieToken = useCookie('auth_token').value
  const hasToken = !!(token.value || cookieToken)

  if (!hasToken) {
    return navigateTo('/admin/login')
  }
})

