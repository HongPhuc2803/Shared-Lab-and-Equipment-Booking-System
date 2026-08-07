/**
 * Centralized, typed access to runtime configuration.
 * Never read `import.meta.env` directly elsewhere — import from here.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'LabSpace',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE ?? 'vi',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export type AppEnv = typeof env
