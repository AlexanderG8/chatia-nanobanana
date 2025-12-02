import { NextRequest, NextResponse } from 'next/server'
import { saveGameToDB, countUserSaves } from '@/lib/db-save-system'
import { GameMassage, InventoryItem, GameStatistics } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, messages, inventory, statistics, isAutoSave } = body

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    if (!name && !isAutoSave) {
      return NextResponse.json(
        { error: 'Nombre de partida es requerido' },
        { status: 400 }
      )
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    if (!inventory || !Array.isArray(inventory)) {
      return NextResponse.json(
        { error: 'inventory es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    if (!statistics) {
      return NextResponse.json(
        { error: 'statistics es requerido' },
        { status: 400 }
      )
    }

    // Validar límite de guardados manuales (solo si no es auto-save)
    if (!isAutoSave) {
      const saveCount = await countUserSaves(userId)
      if (saveCount >= 5) {
        return NextResponse.json(
          { error: 'Has alcanzado el límite de 5 guardados manuales' },
          { status: 400 }
        )
      }
    }

    // Convertir startTime a Date si viene como string
    const statsWithDate: GameStatistics = {
      ...statistics,
      startTime: new Date(statistics.startTime),
    }

    // Guardar en la base de datos
    const savedGame = await saveGameToDB(
      userId,
      messages as GameMassage[],
      inventory as InventoryItem[],
      statsWithDate,
      name || `Auto-save ${new Date().toLocaleString()}`,
      isAutoSave || false
    )

    return NextResponse.json(savedGame, { status: 201 })
  } catch (error: any) {
    console.error('Error en /api/saves/create:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
