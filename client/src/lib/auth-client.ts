import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BASEURL,
    fetchOptions: {credentials: 'include'},
    headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})

export const { signIn, signUp, useSession } = authClient;