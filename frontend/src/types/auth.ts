export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthSuccessResponse = {
  success: true
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export type MeSuccessResponse = {
  success: true
  message: string
  data: {
    user: AuthUser
  }
}

export type ApiErrorResponse = {
  success: false
  message: string
}
