import { prisma } from './prisma'
import { SavedEnding } from './types'

// Desbloquear un final para un usuario
export async function unlockEnding(
  userId: string,
  endingId: string
): Promise<boolean> {
  try {
    // Verificar si ya existe
    const existing = await prisma.unlockedEnding.findUnique({
      where: {
        userId_endingId: {
          userId,
          endingId,
        },
      },
    })

    if (existing) {
      // Ya está desbloqueado
      return true
    }

    // Crear nuevo registro
    await prisma.unlockedEnding.create({
      data: {
        userId,
        endingId,
      },
    })

    return true
  } catch (error) {
    console.error('Error unlocking ending:', error)
    return false
  }
}

// Obtener todos los finales desbloqueados de un usuario
export async function listUnlockedEndings(
  userId: string
): Promise<SavedEnding[]> {
  try {
    const unlockedEndings = await prisma.unlockedEnding.findMany({
      where: {
        userId,
      },
      orderBy: {
        achievedAt: 'desc',
      },
    })

    // Convertir a formato SavedEnding
    // Nota: Aquí solo retornamos los IDs y las fechas
    // El componente de UI necesitará combinar esto con los datos de endings.ts
    return unlockedEndings.map((ending) => ({
      id: ending.endingId,
      type: ending.endingId as any, // Se mapeará en el frontend
      title: '', // Se llenará en el frontend
      achievedAt: ending.achievedAt,
      statistics: {
        decisionsCount: 0,
        combatActions: 0,
        explorationActions: 0,
        socialActions: 0,
        itemsUsed: 0,
        turnsPlayed: 0,
        startTime: new Date(),
        survivalTime: 0,
      },
    }))
  } catch (error) {
    console.error('Error listing unlocked endings:', error)
    return []
  }
}

// Verificar si un usuario tiene un final desbloqueado
export async function hasUnlockedEnding(
  userId: string,
  endingId: string
): Promise<boolean> {
  try {
    const ending = await prisma.unlockedEnding.findUnique({
      where: {
        userId_endingId: {
          userId,
          endingId,
        },
      },
    })

    return !!ending
  } catch (error) {
    console.error('Error checking unlocked ending:', error)
    return false
  }
}

// Obtener IDs simples de finales desbloqueados
export async function getUnlockedEndingIds(userId: string): Promise<string[]> {
  try {
    const unlockedEndings = await prisma.unlockedEnding.findMany({
      where: {
        userId,
      },
      select: {
        endingId: true,
      },
    })

    return unlockedEndings.map((e) => e.endingId)
  } catch (error) {
    console.error('Error getting unlocked ending IDs:', error)
    return []
  }
}
