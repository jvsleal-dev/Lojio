export default defineNuxtRouteMiddleware((to) => {
  const { token, user, initAuth } = useAuth()
  initAuth()

  const cookieToken = useCookie('auth_token').value
  const cookieUser = useCookie<any>('auth_user').value
  const activeToken = token.value || cookieToken
  const activeUser = user.value || cookieUser

  if (!activeToken) {
    return navigateTo('/master/login')
  }

  if (activeUser?.role !== 'SUPERADMIN' && activeUser?.role !== 'MASTER') {
    return navigateTo('/master/login')
  }
})

