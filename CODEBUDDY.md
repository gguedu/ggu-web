# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Commonly Used Commands

- **Install dependencies**: `pnpm install` - Install project dependencies using pnpm
- **Start development server**: `pnpm dev` - Run Nuxt dev server on http://localhost:3000
- **Build for production**: `pnpm build` - Build the application for production deployment
- **Preview production build**: `pnpm preview` - Preview the built application locally
- **Run linter**: `pnpm lint` - Run ESLint to check code quality
- **Type check**: `pnpm typecheck` - Run TypeScript type checking via nuxt typecheck
- **Post-install setup**: `pnpm postinstall` - Runs nuxt prepare to generate type declarations (auto-triggered after install)

## Architecture Overview

This is a **Nuxt 4** web application built on Vue 3 with TypeScript, using **@nuxt/ui** for the component library and **Tailwind CSS** for styling. The project serves as a mail client interface (mail.ggu.edu.kg) with additional pages.

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI Library**: @nuxt/ui (based on Reka UI and Tailwind)
- **Styling**: Tailwind CSS v4 with custom dark theme
- **Content**: @nuxt/content for markdown content in `/content/`
- **State**: Pinia with persisted state plugin (pinia-plugin-persistedstate)
- **Utilities**: VueUse for composables, dayjs for dates, lodash-es, axios, echarts
- **Database**: Dexie (IndexedDB wrapper) for client-side storage
- **Deployment**: Cloudflare Workers via wrangler.toml

### Project Structure

```
app/
├── pages/           # Route pages (Nuxt file-based routing)
│   ├── index.vue    # Home page (prerendered)
│   ├── mail.vue    # Mail module wrapper
│   └── mail/        # Mail sub-pages (SSR disabled)
│       ├── login.vue, inbox.vue, compose.vue
│       ├── drafts.vue, sent.vue, starred.vue
│       ├── message.vue, settings.vue
├── composables/     # Shared composables
│   ├── useMailApi.ts      # API request wrapper with auth handling
│   ├── useMailState.ts    # Auth state management (token, user)
│   ├── useMailFetch.ts    # Mail list/data fetching
│   ├── useMailDrafts.ts   # Draft management
│   └── useMailService.ts  # Mail operations service
├── types/
│   └── mail.ts      # TypeScript interfaces for mail domain
├── middleware/      # Nuxt middleware
├── assets/css/      # Global styles
app.vue              # Root Vue component
```

### Mail Module Architecture

The mail section uses a layered architecture:

1. **useMailApi** - Low-level API client wrapping `$fetch` with:
   - Base URL from runtime config (`NUXT_PUBLIC_MAIL_API_BASE_URL`)
   - Automatic auth token injection from `useMailState`
   - 401 unauthorized handling with session cleanup and redirect
   - Standard response envelope unwrapping (`{ code, message, data }`)

2. **useMailState** - Session state with persisted storage for:
   - Authentication token
   - User info and account preferences

3. **useMailFetch / useMailService** - Domain-specific operations built on useMailApi

### Rendering Strategy

The project uses hybrid rendering configured in `nuxt.config.ts`:

- `/` (index): **Prerendered** at build time
- `/mail/**`: **Client-side only** (`ssr: false`) for SPA experience
- Route rules: `routeRules: { '/': { prerender: true }, '/mail': { ssr: false } }`

### Configuration

- **nuxt.config.ts**: Main Nuxt configuration with modules, CSS, content settings, runtime config
- **app.config.ts**: UI theme customization (primary: green, prose styling, dark theme overrides)
- **wrangler.toml**: Cloudflare Workers deployment configuration with build preset

### Key Patterns

- **API responses**: Standard envelope format `{ code: number, message: string, data: T }`
- **Auth flow**: Token stored in state, injected in API headers, 401 redirects to login
- **Styling**: Tailwind with custom dark prose/card/code themes in app.config.ts
- **Icons**: @iconify/vue with lucide and simple-icons collections
- **i18n**: vue-i18n configured for internationalization

@DESIGN.md