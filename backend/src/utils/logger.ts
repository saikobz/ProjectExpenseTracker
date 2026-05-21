import { env } from '../config/env.js'

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.log(`[${env.NODE_ENV}] ${message}`, meta)
      return
    }
    console.log(`[${env.NODE_ENV}] ${message}`)
  },

  error(message: string, err?: unknown) {
    if (env.NODE_ENV === 'production') {
      console.error(`[error] ${message}`)
      return
    }
    console.error(`[error] ${message}`, err)
  },
}
