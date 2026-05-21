import type { CategoryType } from '@prisma/client'

export type CategoryDto = {
  id: string
  name: string
  type: CategoryType
  color: string | null
  createdAt: string
  updatedAt: string
}
