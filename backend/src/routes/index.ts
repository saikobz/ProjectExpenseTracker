import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { categoryRouter } from './category.routes.js'
import { healthRouter } from './health.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use(authRouter)
apiRouter.use(categoryRouter)
