import { NextRequest, NextResponse } from 'next/server'
import { loadGameFromDB } from '@/lib/db-save-system'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const saveId = searchParams.get('saveId')

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

    // Cargar partida
    const savedGame = await loadGameFromDB(userId, saveId)

    if (!savedGame) {
      return NextResponse.json(
        { error: 'Partida no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(savedGame, { status: 200 })
  } catch (error: any) {
    console.error('Error en /api/saves/load:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
