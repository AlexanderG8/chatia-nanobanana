'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function LoginDialog() {
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({ username: '', email: '' })

  const validateUsername = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, username: 'Username es requerido' }))
      return false
    }
    if (value.length < 3 || value.length > 20) {
      setErrors(prev => ({ ...prev, username: 'Debe tener entre 3 y 20 caracteres' }))
      return false
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setErrors(prev => ({ ...prev, username: 'Solo letras, números, guiones y guión bajo' }))
      return false
    }
    setErrors(prev => ({ ...prev, username: '' }))
    return true
  }

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, email: 'Email es requerido' }))
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }))
      return false
    }
    setErrors(prev => ({ ...prev, email: '' }))
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isUsernameValid = validateUsername(username)
    const isEmailValid = validateEmail(email)

    if (!isUsernameValid || !isEmailValid) {
      return
    }

    try {
      await login(username.trim(), email.trim())
      toast({
        title: '¡Bienvenido!',
        description: `Has iniciado sesión como ${username}`,
      })
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Intenta nuevamente',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-4"
      >
        <Card className="border-2 border-red-900/50 bg-zinc-950/95 p-8">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-red-500">
              🧟 Chatia NanoBanana
            </h1>
            <p className="text-sm text-zinc-400">
              Aventura de supervivencia zombie
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-zinc-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  validateUsername(e.target.value)
                }}
                placeholder="tu_username"
                className="mt-1 border-zinc-700 bg-zinc-900 text-zinc-100"
                disabled={isLoading}
                maxLength={20}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
              <p className="mt-1 text-xs text-zinc-500">
                3-20 caracteres alfanuméricos
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateEmail(e.target.value)
                }}
                placeholder="tu@email.com"
                className="mt-1 border-zinc-700 bg-zinc-900 text-zinc-100"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="rounded-lg bg-zinc-900 p-3 text-xs text-zinc-400">
              <p className="font-semibold text-zinc-300">
                👤 Usuarios existentes:
              </p>
              <p className="mt-1">
                Solo ingresa tu username para iniciar sesión
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Ingresando...
                </span>
              ) : (
                'Entrar al Juego'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-zinc-500">
            <p>Tu progreso se guardará automáticamente</p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
