import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from '@/features/auth/auth-context'
import { getToken, removeToken, setToken } from '@/lib/token'
import * as authService from '@/services/auth.service'
import { setUnauthorizedHandler } from '@/services/api'
import type { AuthUser } from '@/types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
    })
  }, [clearSession])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const token = getToken()
      if (!token) {
        if (!cancelled) {
          setUser(null)
          setIsLoading(false)
        }
        return
      }

      try {
        const profile = await authService.fetchMe()
        if (!cancelled) {
          setUser(profile)
        }
      } catch {
        if (!cancelled) {
          clearSession()
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedInUser, token } = await authService.login(email, password)
    setToken(token)
    setUser(loggedInUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: newUser, token } = await authService.register(name, email, password)
    setToken(token)
    setUser(newUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logoutApi()
    } catch {
      // Token may already be invalid; still clear local session
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
