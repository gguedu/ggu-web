export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/mail')) {
    return
  }
  if (to.path === '/mail/login') {
    return
  }

  const { token } = useMailState()
  if (import.meta.client && !token.value) {
    const cached = localStorage.getItem('token') || localStorage.getItem('mail_token')
    if (cached) {
      token.value = cached.startsWith('Bearer ') ? cached.slice(7).trim() : cached
    }
  }

  if (!token.value) {
    return navigateTo('/mail/login')
  }
})
