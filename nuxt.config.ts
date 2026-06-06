// https://nuxt.com/docs/api/configuration/nuxt-config
const normalizeUnderscoreEmphasis = (value: string) => {
  const segments = value.split(/(```[\s\S]*?```|`[^`\n]*`)/g)

  return segments
    .map((segment) => {
      if (segment.startsWith('```') || segment.startsWith('`')) {
        return segment
      }

      return segment
        .replace(/___([^_\n][^_\n]*?)___/g, '***$1***')
        .replace(/__([^_\n][^_\n]*?)__/g, '**$1**')
        .replace(/(^|[^\w])_([^_\n][^_\n]*?)_([^\w]|$)/g, '$1*$2*$3')
    })
    .join('')
}

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/content'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark'
        }
      }
    },
    experimental: { nativeSqlite: true }
  },

  runtimeConfig: {
    public: {
      // 留空由运行时环境变量 NUXT_PUBLIC_MAIL_API_BASE_URL 注入
      mailApiBaseUrl: ''
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/mail': { ssr: false },
    '/mail/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['pdfjs-dist', 'motion-v']
    }
  },

  hooks: {
    'content:file:beforeParse': ({ file }) => {
      if (file.extension === 'md') {
        file.body = normalizeUnderscoreEmphasis(file.body)
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
