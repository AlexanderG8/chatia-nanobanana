import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByUsername, getUserByEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email } = body

    // Validaciones básicas
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe por username
    let user = await getUserByUsername(username)

    if (user) {
      // Usuario existe, retornarlo (login)
      return NextResponse.json(user, { status: 200 })
    }

    // Verificar si el email ya está en uso
    const existingEmailUser = await getUserByEmail(email)

    if (existingEmailUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado con otro usuario' },
        { status: 409 }
      )
    }

    // Usuario no existe, crear nuevo (registro)
    user = await createUser(username, email)

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error('Error en /api/auth/login:', error)

    // Errores de validación
    if (error.message.includes('inválido') || error.message.includes('ya está en uso')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
