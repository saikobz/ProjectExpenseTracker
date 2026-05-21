import { createApp } from './app.js'
import { env } from './config/env.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`MoneyMind API running on http://localhost:${env.PORT}`)
  console.log(`Health check: http://localhost:${env.PORT}/api/health`)
})
