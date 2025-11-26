import { SavedGame, SaveGameMetadata, GameMassage, InventoryItem, GameStatistics } from './types';

const SAVE_VERSION = '1.0.0';
const MAX_MANUAL_SAVES = 5;
const STORAGE_KEYS = {
    SAVES_LIST: 'chatia_saves_list',
    SAVE_PREFIX: 'chatia_save_',
    AUTOSAVE: 'chatia_autosave'
};

// Función para guardar una partida
export function saveGame(
    messages: GameMassage[],
    inventory: InventoryItem[],
    statistics: GameStatistics,
    saveName: string,
    isAutoSave: boolean = false
): SavedGame | null {
    try {
        const saveId = isAutoSave ? 'autosave' : `save_${Date.now()}`;
        const thumbnail = extractThumbnail(messages);

        const savedGame: SavedGame = {
            id: saveId,
            name: saveName,
            timestamp: new Date(),
            messages: messages,
            inventory: inventory,
            statistics: statistics,
            turnNumber: statistics.turnsPlayed,
            thumbnail: thumbnail,
            version: SAVE_VERSION
        };

        // Guardar en localStorage
        const saveKey = isAutoSave ? STORAGE_KEYS.AUTOSAVE : `${STORAGE_KEYS.SAVE_PREFIX}${saveId}`;
        localStorage.setItem(saveKey, JSON.stringify(savedGame));

        // Actualizar lista de guardados (solo para guardados manuales)
        if (!isAutoSave) {
            updateSavesList(savedGame);
        }

        return savedGame;
    } catch (error) {
        console.error('Error saving game:', error);
        // Verificar si es error de cuota excedida
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            alert('No hay suficiente espacio para guardar. Elimina partidas antiguas.');
        }
        return null;
    }
}

// Función para cargar una partida
export function loadGame(saveId: string): SavedGame | null {
    try {
        const saveKey = saveId === 'autosave'
            ? STORAGE_KEYS.AUTOSAVE
            : `${STORAGE_KEYS.SAVE_PREFIX}${saveId}`;

        const savedData = localStorage.getItem(saveKey);
        if (!savedData) {
            return null;
        }

        const savedGame: SavedGame = JSON.parse(savedData);

        // Validar integridad
        if (!validateSaveIntegrity(savedGame)) {
            console.error('Save file corrupted or invalid version');
            return null;
        }

        // Convertir fechas de string a Date
        savedGame.timestamp = new Date(savedGame.timestamp);
        savedGame.statistics.startTime = new Date(savedGame.statistics.startTime);

        return savedGame;
    } catch (error) {
        console.error('Error loading game:', error);
        return null;
    }
}

// Función para eliminar una partida
export function deleteSave(saveId: string): boolean {
    try {
        const saveKey = `${STORAGE_KEYS.SAVE_PREFIX}${saveId}`;
        localStorage.removeItem(saveKey);

        // Actualizar lista
        const savesList = listSaves();
        const updatedList = savesList.filter(save => save.id !== saveId);
        localStorage.setItem(STORAGE_KEYS.SAVES_LIST, JSON.stringify(updatedList));

        return true;
    } catch (error) {
        console.error('Error deleting save:', error);
        return false;
    }
}

// Función para listar todas las partidas guardadas
export function listSaves(): SaveGameMetadata[] {
    try {
        const savesListData = localStorage.getItem(STORAGE_KEYS.SAVES_LIST);
        if (!savesListData) {
            return [];
        }

        const savesList: SaveGameMetadata[] = JSON.parse(savesListData);

        // Convertir fechas
        return savesList.map(save => ({
            ...save,
            timestamp: new Date(save.timestamp)
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Más recientes primero
    } catch (error) {
        console.error('Error listing saves:', error);
        return [];
    }
}

// Función de auto-guardado
export function autoSave(
    messages: GameMassage[],
    inventory: InventoryItem[],
    statistics: GameStatistics
): SavedGame | null {
    return saveGame(messages, inventory, statistics, 'Auto-guardado', true);
}

// Función para obtener el guardado más reciente
export function getLatestSave(): SavedGame | null {
    const saves = listSaves();
    if (saves.length === 0) {
        return null;
    }

    return loadGame(saves[0].id);
}

// Función para obtener el auto-guardado
export function getAutoSave(): SavedGame | null {
    return loadGame('autosave');
}

// Función helper para actualizar la lista de guardados
function updateSavesList(savedGame: SavedGame): void {
    let savesList = listSaves();

    // Agregar nuevo guardado
    const metadata: SaveGameMetadata = {
        id: savedGame.id,
        name: savedGame.name,
        timestamp: savedGame.timestamp,
        turnNumber: savedGame.turnNumber,
        thumbnail: savedGame.thumbnail,
        survivalTime: savedGame.statistics.survivalTime
    };

    savesList.push(metadata);

    // Verificar límite y eliminar el más antiguo si es necesario
    if (savesList.length > MAX_MANUAL_SAVES) {
        const oldestSave = savesList[savesList.length - 1]; // El último es el más antiguo (están ordenados)
        deleteSave(oldestSave.id);
        savesList = savesList.slice(0, MAX_MANUAL_SAVES);
    }

    localStorage.setItem(STORAGE_KEYS.SAVES_LIST, JSON.stringify(savesList));
}

// Función para extraer thumbnail (última imagen del juego)
function extractThumbnail(messages: GameMassage[]): string | undefined {
    // Buscar el último mensaje con imagen
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.image?.base64Data) {
            return message.image.base64Data;
        }
    }
    return undefined;
}

// Función para validar integridad del guardado
function validateSaveIntegrity(savedGame: SavedGame): boolean {
    // Verificar campos requeridos
    if (!savedGame.id || !savedGame.name || !savedGame.messages || !savedGame.inventory || !savedGame.statistics) {
        return false;
    }

    // Verificar versión (por ahora solo soportamos 1.0.0)
    if (savedGame.version !== SAVE_VERSION) {
        console.warn(`Save version mismatch. Expected ${SAVE_VERSION}, got ${savedGame.version}`);
        // Por ahora aceptamos versiones diferentes, pero podrías rechazarlas
    }

    return true;
}

// Función para obtener estadísticas de almacenamiento
export function getStorageStats(): { used: number; total: number; percentage: number } {
    let used = 0;

    // Calcular tamaño usado
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            used += localStorage[key].length + key.length;
        }
    }

    // Estimación del total (5MB en la mayoría de navegadores)
    const total = 5 * 1024 * 1024;
    const percentage = (used / total) * 100;

    return {
        used: Math.round(used / 1024), // KB
        total: Math.round(total / 1024), // KB
        percentage: Math.round(percentage)
    };
}
