import { NextRequest, NextResponse } from 'next/server'
import { listUserGames } from '@/lib/db-save-system'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Listar partidas del usuario
    const saves = await listUserGames(userId)

    return NextResponse.json(saves, { status: 200 })
  } catch (error: any) {
    console.error('Error en /api/saves/list:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
