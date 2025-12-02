import { prisma } from './prisma'
import { SavedGame, SaveGameMetadata, GameMassage, InventoryItem, GameStatistics } from './types'

// Límite de guardados por usuario (5 manuales + 5 auto)
const MAX_MANUAL_SAVES = 5
const MAX_AUTO_SAVES = 5

// Guardar partida en la base de datos
export async function saveGameToDB(
  userId: string,
  messages: GameMassage[],
  inventory: InventoryItem[],
  statistics: GameStatistics,
  saveName: string,
  isAutoSave: boolean = false
): Promise<SavedGame> {
  try {
    // Verificar límite de guardados
    const saveCount = await prisma.savedGame.count({
      where: {
        userId,
        isAutoSave,
      },
    })

    const limit = isAutoSave ? MAX_AUTO_SAVES : MAX_MANUAL_SAVES

    // Si se alcanzó el límite, eliminar el guardado más antiguo
    if (saveCount >= limit) {
      const oldestSave = await prisma.savedGame.findFirst({
        where: {
          userId,
          isAutoSave,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      if (oldestSave) {
        await prisma.savedGame.delete({
          where: { id: oldestSave.id },
        })
      }
    }

    // Obtener thumbnail de la última imagen
    const lastMessageWithImage = [...messages]
      .reverse()
      .find((msg) => msg.image?.base64Data)
    const thumbnail = lastMessageWithImage?.image?.base64Data || null

    // Crear el guardado con todas sus relaciones
    const savedGame = await prisma.savedGame.create({
      data: {
        userId,
        name: saveName,
        turnNumber: statistics.turnsPlayed,
        survivalTime: statistics.survivalTime,
        thumbnail,
        isAutoSave,
        // Crear mensajes relacionados
        messages: {
          create: messages.map((msg, index) => ({
            role: msg.role,
            content: msg.content,
            imageUrl: msg.image?.base64Data || null,
            items: msg.itemsFound || null,
            order: index,
          })),
        },
        // Crear inventario relacionado
        inventory: {
          create: {
            items: inventory,
          },
        },
        // Crear estadísticas relacionadas
        statistics: {
          create: {
            decisionsCount: statistics.decisionsCount,
            combatActions: statistics.combatActions,
            explorationActions: statistics.explorationActions,
            socialActions: statistics.socialActions,
            itemsUsed: statistics.itemsUsed,
            turnsPlayed: statistics.turnsPlayed,
            startTime: statistics.startTime,
            survivalTime: statistics.survivalTime,
          },
        },
      },
      include: {
        messages: {
          orderBy: { order: 'asc' },
        },
        inventory: true,
        statistics: true,
      },
    })

    // Convertir a SavedGame
    return convertPrismaToSavedGame(savedGame)
  } catch (error: any) {
    console.error('Error guardando partida en DB:', error)
    throw new Error('Error al guardar partida: ' + error.message)
  }
}

// Cargar partida desde la base de datos
export async function loadGameFromDB(
  userId: string,
  saveId: string
): Promise<SavedGame | null> {
  try {
    const savedGame = await prisma.savedGame.findUnique({
      where: {
        id: saveId,
        userId, // Verificar ownership
      },
      include: {
        messages: {
          orderBy: { order: 'asc' },
        },
        inventory: true,
        statistics: true,
      },
    })

    if (!savedGame) {
      return null
    }

    return convertPrismaToSavedGame(savedGame)
  } catch (error) {
    console.error('Error cargando partida desde DB:', error)
    return null
  }
}

// Eliminar partida de la base de datos
export async function deleteGameFromDB(
  userId: string,
  saveId: string
): Promise<boolean> {
  try {
    await prisma.savedGame.delete({
      where: {
        id: saveId,
        userId, // Verificar ownership
      },
    })
    return true
  } catch (error) {
    console.error('Error eliminando partida de DB:', error)
    return false
  }
}

// Listar partidas de un usuario
export async function listUserGames(userId: string): Promise<SaveGameMetadata[]> {
  try {
    const savedGames = await prisma.savedGame.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        turnNumber: true,
        thumbnail: true,
        survivalTime: true,
        createdAt: true,
        isAutoSave: true,
      },
    })

    return savedGames.map((game) => ({
      id: game.id,
      name: game.name,
      timestamp: game.createdAt,
      turnNumber: game.turnNumber,
      thumbnail: game.thumbnail || undefined,
      survivalTime: game.survivalTime,
    }))
  } catch (error) {
    console.error('Error listando partidas de usuario:', error)
    return []
  }
}

// Obtener el auto-save más reciente
export async function getAutoSave(userId: string): Promise<SavedGame | null> {
  try {
    const autoSave = await prisma.savedGame.findFirst({
      where: {
        userId,
        isAutoSave: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        messages: {
          orderBy: { order: 'asc' },
        },
        inventory: true,
        statistics: true,
      },
    })

    if (!autoSave) {
      return null
    }

    return convertPrismaToSavedGame(autoSave)
  } catch (error) {
    console.error('Error obteniendo auto-save:', error)
    return null
  }
}

// Contar guardados de un usuario
export async function countUserSaves(userId: string): Promise<number> {
  try {
    return await prisma.savedGame.count({
      where: {
        userId,
        isAutoSave: false,
      },
    })
  } catch (error) {
    console.error('Error contando guardados:', error)
    return 0
  }
}

// Función auxiliar para convertir datos de Prisma a SavedGame
function convertPrismaToSavedGame(prismaGame: any): SavedGame {
  const messages: GameMassage[] = prismaGame.messages.map((msg: any) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    image: msg.imageUrl
      ? {
          base64Data: msg.imageUrl,
          mediaType: 'image/png',
        }
      : undefined,
    itemsFound: msg.items || undefined,
  }))

  const inventory: InventoryItem[] = prismaGame.inventory?.items || []

  const statistics: GameStatistics = {
    decisionsCount: prismaGame.statistics.decisionsCount,
    combatActions: prismaGame.statistics.combatActions,
    explorationActions: prismaGame.statistics.explorationActions,
    socialActions: prismaGame.statistics.socialActions,
    itemsUsed: prismaGame.statistics.itemsUsed,
    turnsPlayed: prismaGame.statistics.turnsPlayed,
    startTime: prismaGame.statistics.startTime,
    survivalTime: prismaGame.statistics.survivalTime,
  }

  return {
    id: prismaGame.id,
    name: prismaGame.name,
    timestamp: prismaGame.createdAt,
    messages,
    inventory,
    statistics,
    turnNumber: prismaGame.turnNumber,
    thumbnail: prismaGame.thumbnail || undefined,
    version: '2.0', // Versión con DB
  }
}
