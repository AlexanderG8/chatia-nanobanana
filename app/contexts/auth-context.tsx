'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthUser } from '@/lib/types'

interface AuthContextType {
  currentUser: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, email: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_ID_KEY = 'chatia_user_id'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  // Función para verificar autenticación
  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const userId = localStorage.getItem(USER_ID_KEY)

      if (!userId) {
        setCurrentUser(null)
        setIsLoading(false)
        return
      }

      // Verificar con el servidor que el usuario existe
      const response = await fetch(`/api/auth/me?userId=${userId}`)

      if (!response.ok) {
        // Usuario no encontrado, limpiar localStorage
        localStorage.removeItem(USER_ID_KEY)
        setCurrentUser(null)
        setIsLoading(false)
        return
      }

      const user = await response.json()
      setCurrentUser({
        ...user,
        createdAt: new Date(user.createdAt),
      })
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para iniciar sesión o registrarse
  const login = async (username: string, email: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar sesión')
      }

      const user = await response.json()

      // Guardar userId en localStorage
      localStorage.setItem(USER_ID_KEY, user.id)

      setCurrentUser({
        ...user,
        createdAt: new Date(user.createdAt),
      })
    } catch (error: any) {
      console.error('Error en login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem(USER_ID_KEY)
    setCurrentUser(null)
  }

  const value: AuthContextType = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
