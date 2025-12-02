import { NextRequest, NextResponse } from 'next/server'
import { unlockEnding } from '@/lib/db-endings-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, endingId } = body

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    if (!endingId) {
      return NextResponse.json(
        { error: 'endingId es requerido' },
        { status: 400 }
      )
    }

    // Desbloquear final
    const success = await unlockEnding(userId, endingId)

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo desbloquear el final' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error en /api/endings/unlock:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
