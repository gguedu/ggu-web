import type { MailAccount, MailItem, MailUser, MailWebsiteConfig } from '~/types/mail';

const TOKEN_KEY = 'mail_token';

const normalizeToken = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }
  return value.startsWith('Bearer ') ? value.slice(7).trim() : value;
};

export const useMailState = () => {
  const token = useState<string | null>('mail_token_state', () => null);
  const user = useState<MailUser | null>('mail_user', () => null);
  const config = useState<MailWebsiteConfig>('mail_config', () => ({
    title: 'Cloud Mail',
    domainList: [],
  }));
  const accounts = useState<MailAccount[]>('mail_accounts', () => []);
  const currentAccountId = useState<number | null>('mail_current_account_id', () => null);
  const selectedEmail = useState<MailItem | null>('mail_selected_email', () => null);

  const currentAccount = computed(() => {
    if (accounts.value.length === 0) {
      return null;
    }
    return (
      accounts.value.find((item) => item.accountId === currentAccountId.value) || accounts.value[0]
    );
  });

  const restoreToken = () => {
    if (!import.meta.client) {
      return;
    }
    if (token.value) {
      return;
    }
    // Migrate legacy key
    const legacy = localStorage.getItem('token');
    if (legacy) {
      localStorage.removeItem('token');
      localStorage.setItem(TOKEN_KEY, normalizeToken(legacy) || legacy);
    }
    const cached = localStorage.getItem(TOKEN_KEY);
    if (cached) {
      token.value = normalizeToken(cached);
    }
  };

  if (import.meta.client) {
    restoreToken();

    watch(
      token,
      (value) => {
        const normalized = normalizeToken(value);
        if (normalized) {
          localStorage.setItem(TOKEN_KEY, normalized);
          if (token.value !== normalized) {
            token.value = normalized;
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      },
      { immediate: true },
    );
  }

  const clearSession = () => {
    token.value = null;
    user.value = null;
    accounts.value = [];
    currentAccountId.value = null;
    selectedEmail.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return {
    token,
    user,
    config,
    accounts,
    currentAccountId,
    currentAccount,
    selectedEmail,
    clearSession,
    restoreToken,
  };
};
