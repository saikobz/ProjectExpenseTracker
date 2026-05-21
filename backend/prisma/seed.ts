import { PrismaClient } from '@prisma/client'
import { ALL_DEFAULT_CATEGORIES } from '../src/constants/defaultCategories.js'
import { hashPassword } from '../src/utils/password.js'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@moneymind.app'
const DEMO_PASSWORD = 'password123'
const DEMO_NAME = 'Demo User'

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD)

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: DEMO_NAME, passwordHash },
    create: {
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      passwordHash,
    },
  })

  await prisma.category.createMany({
    data: ALL_DEFAULT_CATEGORIES.map((seed) => ({
      userId: user.id,
      name: seed.name,
      type: seed.type,
      color: seed.color,
    })),
    skipDuplicates: true,
  })

  const categories = await prisma.category.findMany({ where: { userId: user.id } })
  const byName = (name: string) => categories.find((c) => c.name === name)

  const salary = byName('Salary')
  const food = byName('Food')
  const transport = byName('Transportation')
  const rent = byName('Rent')

  if (!salary || !food || !transport || !rent) {
    throw new Error('Expected default categories were not found after seeding')
  }

  const year = new Date().getUTCFullYear()
  const month = new Date().getUTCMonth() + 1

  await prisma.transaction.deleteMany({ where: { userId: user.id } })
  await prisma.budget.deleteMany({ where: { userId: user.id } })

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        categoryId: salary.id,
        type: 'income',
        amount: 45000,
        description: 'Monthly salary',
        transactionDate: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
        paymentMethod: 'bank transfer',
      },
      {
        userId: user.id,
        categoryId: food.id,
        type: 'expense',
        amount: 3200,
        description: 'Groceries and dining',
        transactionDate: new Date(`${year}-${String(month).padStart(2, '0')}-05`),
        paymentMethod: 'credit card',
      },
      {
        userId: user.id,
        categoryId: transport.id,
        type: 'expense',
        amount: 1500,
        description: 'Fuel and transit',
        transactionDate: new Date(`${year}-${String(month).padStart(2, '0')}-08`),
        paymentMethod: 'e-wallet',
      },
      {
        userId: user.id,
        categoryId: rent.id,
        type: 'expense',
        amount: 12000,
        description: 'Apartment rent',
        transactionDate: new Date(`${year}-${String(month).padStart(2, '0')}-10`),
        paymentMethod: 'bank transfer',
      },
    ],
  })

  await prisma.budget.createMany({
    data: [
      { userId: user.id, categoryId: food.id, month, year, amount: 5000 },
      { userId: user.id, categoryId: transport.id, month, year, amount: 2500 },
      { userId: user.id, categoryId: rent.id, month, year, amount: 12000 },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed successfully.')
  console.log(`Demo account: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
