import { AppError } from '../middlewares/error.middleware.js'
import { categoryService } from './category.service.js'
import { userRepository } from '../repositories/user.repository.js'
import type { SafeUser } from '../types/auth.js'
import { signToken } from '../utils/jwt.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import type { LoginInput, RegisterInput } from '../validations/auth.validation.js'

function toSafeUser(user: { id: string; name: string; email: string }): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

function buildAuthResult(user: SafeUser) {
  const token = signToken({ userId: user.id })
  return { user, token }
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) {
      throw new AppError(409, 'Email already registered')
    }

    const passwordHash = await hashPassword(input.password)
    const user = await userRepository.create({ ...input, passwordHash })
    await categoryService.seedDefaultsForUser(user.id)

    return buildAuthResult(toSafeUser(user))
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    const isValid = await comparePassword(input.password, user.passwordHash)
    if (!isValid) {
      throw new AppError(401, 'Invalid email or password')
    }

    return buildAuthResult(toSafeUser(user))
  },

  async getMe(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return toSafeUser(user)
  },
}
