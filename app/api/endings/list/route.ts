import { NextRequest, NextResponse } from 'next/server'
import { getUnlockedEndingIds } from '@/lib/db-endings-system'

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

    // Obtener IDs de finales desbloqueados
    const endingIds = await getUnlockedEndingIds(userId)

    return NextResponse.json(endingIds, { status: 200 })
  } catch (error: any) {
    console.error('Error en /api/endings/list:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
