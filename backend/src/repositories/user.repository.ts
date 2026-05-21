import type { User } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import type { RegisterInput } from '../validations/auth.validation.js'

export const userRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  create(data: RegisterInput & { passwordHash: string }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
    })
  },
}
