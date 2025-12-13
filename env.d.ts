/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_WEBHOOK_URL: string
  readonly VITE_GENERAL_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
