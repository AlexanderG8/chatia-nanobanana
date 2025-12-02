import { NextRequest, NextResponse } from 'next/server'
import { deleteGameFromDB } from '@/lib/db-save-system'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, saveId } = body

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    if (!saveId) {
      return NextResponse.json(
        { error: 'saveId es requerido' },
        { status: 400 }
      )
    }

    // Eliminar partida
    const success = await deleteGameFromDB(userId, saveId)

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo eliminar la partida' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error en /api/saves/delete:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
