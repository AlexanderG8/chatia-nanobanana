import { prisma } from './prisma'
import { AuthUser } from './types'

// Validar formato de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar username (3-20 caracteres alfanuméricos, guiones y guiones bajos)
function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

// Crear un nuevo usuario
export async function createUser(
  username: string,
  email: string
): Promise<AuthUser> {
  // Validaciones
  if (!isValidUsername(username)) {
    throw new Error('Username inválido. Debe tener 3-20 caracteres alfanuméricos')
  }

  if (!isValidEmail(email)) {
    throw new Error('Email inválido')
  }

  // Crear usuario en la base de datos
  try {
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
      },
    })

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }
  } catch (error: any) {
    // Manejar errores de unicidad (username o email ya existen)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo'
      throw new Error(`El ${field} ya está en uso`)
    }
    throw new Error('Error al crear usuario: ' + error.message)
  }
}

// Obtener usuario por username
export async function getUserByUsername(
  username: string
): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase().trim(),
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error('Error al buscar usuario por username:', error)
    return null
  }
}

// Obtener usuario por email
export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error('Error al buscar usuario por email:', error)
    return null
  }
}

// Obtener usuario por ID
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error('Error al buscar usuario por ID:', error)
    return null
  }
}
