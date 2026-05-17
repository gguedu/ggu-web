export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/mail')) {
    return;
  }
  if (to.path === '/mail/login') {
    return;
  }

  const { token, restoreToken } = useMailState();
  if (!token.value) {
    restoreToken();
  }

  if (!token.value) {
    return navigateTo('/mail/login');
  }
});
