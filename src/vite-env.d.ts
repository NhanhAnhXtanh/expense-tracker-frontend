/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_BASE_PATH: string
    readonly VITE_OAUTH2_TOKEN_URL: string
    readonly VITE_OAUTH2_CLIENT_ID: string
    readonly VITE_OAUTH2_CLIENT_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
