process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://moneymind:moneymind_secret@localhost:5432/moneymind?schema=public'
process.env.CLIENT_URL = 'http://localhost:5173'
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test_jwt_secret_at_least_32_characters_long'
process.env.JWT_EXPIRES_IN = '7d'
