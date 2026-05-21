import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'
import { apiRouter } from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({
      name: 'MoneyMind API',
      version: '0.1.0',
      docs: '/api/health',
    })
  })

  app.use('/api', apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
