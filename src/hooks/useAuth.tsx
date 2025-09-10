import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { seedMockDatabase } from '../services/seed'
import { apiService } from '../services/mockApiService'

type AuthContextType = {
  currentUser: User | null
  loading: boolean
  login: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedMockDatabase()
    const stored = localStorage.getItem('hcm_current_user_email')
    ;(async () => {
      if (stored) {
        const u = await apiService.getUserById(stored)
        setCurrentUser(u)
      }
      setLoading(false)
    })()
  }, [])

  const login = async (email: string) => {
    setLoading(true)
    const u = await apiService.getUserById(email)
    if (!u) {
      setLoading(false)
      throw new Error('User not found. Try admin@market.com, trader1@market.com, or applicant@market.com')
    }
    setCurrentUser(u)
    localStorage.setItem('hcm_current_user_email', u.id)
    setLoading(false)
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('hcm_current_user_email')
  }

  return <AuthContext.Provider value={{ currentUser, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
