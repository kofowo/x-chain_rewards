/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_CONTRACT_NAME: string
  readonly VITE_STACKS_NETWORK: string
  readonly VITE_DEFAULT_TARGET_CHAIN: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_ENABLE_MOCK_ORACLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}