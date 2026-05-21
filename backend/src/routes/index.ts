import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { categoryRouter } from './category.routes.js'
import { dashboardRouter } from './dashboard.routes.js'
import { healthRouter } from './health.routes.js'
import { transactionRouter } from './transaction.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use(authRouter)
apiRouter.use(categoryRouter)
apiRouter.use(transactionRouter)
apiRouter.use(dashboardRouter)
