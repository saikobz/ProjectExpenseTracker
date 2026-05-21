import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

async function getDatabaseStatus(): Promise<'connected' | 'disconnected'> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return 'connected'
  } catch {
    return 'disconnected'
  }
}

export async function getHealth(_req: Request, res: Response) {
  const database = await getDatabaseStatus()

  const status = database === 'connected' ? 'ok' : 'degraded'

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    service: 'moneymind-api',
    timestamp: new Date().toISOString(),
    database,
  })
}
