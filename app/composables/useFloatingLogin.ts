interface FloatingLoginOptions {
  reason?: string
  afterLogin?: () => void | Promise<void>
}

export const useFloatingLogin = () => {
  const isOpen = useState('floating_login_open', () => false)
  const reason = useState('floating_login_reason', () => '登录后继续使用 GGU 服务')
  const afterLogin = useState<(() => void | Promise<void>) | null>('floating_login_after', () => null)

  const openLoginModal = (options: FloatingLoginOptions = {}) => {
    reason.value = options.reason || '登录后继续使用 GGU 服务'
    afterLogin.value = options.afterLogin || null
    isOpen.value = true
  }

  const closeLoginModal = () => {
    isOpen.value = false
  }

  const completeLogin = async () => {
    const callback = afterLogin.value
    afterLogin.value = null
    isOpen.value = false
    if (callback) await callback()
  }

  return {
    isOpen,
    reason,
    openLoginModal,
    closeLoginModal,
    completeLogin
  }
}
