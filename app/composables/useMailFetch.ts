import { useRuntimeConfig, useCookie } from '#imports'

export const useMailFetch = (request, opts) => {
  const config = useRuntimeConfig()
  const token = useCookie('mail_token')

  return $fetch(request, {
    baseURL: config.public.mailApiBaseUrl,
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...opts?.headers
    },
    ...opts,
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        // Handle unauthorized
        token.value = null
        navigateTo('/mail/login')
      }
    }
  })
}
