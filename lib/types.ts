// Aquí se definen las interfaces

// Enum para tipos de items
export enum ItemType {
    WEAPON = "weapon",
    FOOD = "food",
    MEDICAL = "medical",
    TOOL = "tool",
    KEY = "key",
    MISC = "misc"
}

// Interface para items del inventario
export interface InventoryItem {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    usable: boolean;
    quantity: number;
    icon?: string; // Emoji o identificador de icono
}

// Aquí se define la interfaz GameMassage que representa un mensaje en el juego
export interface GameMassage {
    id: string;
    role: "user" | "assistant";
    content: string;
    image?: GeneratedImage;
    imageLoading?: boolean;
    itemsFound?: InventoryItem[]; // Items encontrados en esta escena
}
// Aquí se define la interfaz GeneratedImage que representa una imagen generada
export interface GeneratedImage {
    // Cadena codificada en Base64 de la imagen generada (se usa para incrustar fácilmente en etiquetas HTML/img)
    base64Data: string;
    // Tipo MIME de la imagen (por ejemplo, "image/png", "image/jpeg")
    mediaType: string;
    // Datos binarios sin procesar opcionales como Uint8Array (útil para procesamiento del lado del servidor o guardar en disco)
    uint8ArrayData?: Uint8Array;
}

export interface ConversationMessage{
    role: "user" | "assistant";
    content: string;
}

export interface GenerateStoryRequest{
    userMessage: string;
    conversationHistory: ConversationMessage[];
    isStart: boolean;
    currentInventory?: InventoryItem[]; // Inventario actual del jugador
}

export interface GenerateStoryResponse{
    narrative: string;
    imagePrompt: string;
    itemsFound?: InventoryItem[]; // Items encontrados en la escena
}

export interface GenerateImageRequest{
    imagePrompt: string;
}

// Enum para tipos de finales
export enum EndingType {
    DEATH = "death",
    ESCAPE = "escape",
    CURE = "cure",
    SACRIFICE = "sacrifice",
    INFECTION = "infection",
    SURVIVOR = "survivor",
    LEADER = "leader"
}

// Interface para estadísticas del juego
export interface GameStatistics {
    decisionsCount: number;      // Total de decisiones tomadas
    combatActions: number;        // Acciones de combate
    explorationActions: number;   // Acciones de exploración
    socialActions: number;        // Interacciones sociales
    itemsUsed: number;            // Items usados
    turnsPlayed: number;          // Turnos jugados
    startTime: Date;              // Timestamp de inicio
    survivalTime: number;         // Tiempo de supervivencia en minutos
}

// Interface para finales del juego
export interface GameEnding {
    id: string;
    type: EndingType;
    title: string;
    description: string;
    achieved: boolean;
    achievedAt?: Date;
    narrative?: string;           // Narrativa generada del final
}

// Interface para finales guardados
export interface SavedEnding {
    id: string;
    type: EndingType;
    title: string;
    achievedAt: Date;
    statistics: GameStatistics;
}

// Interface para partidas guardadas
export interface SavedGame {
    id: string;
    name: string;
    timestamp: Date;
    messages: GameMassage[];
    inventory: InventoryItem[];
    statistics: GameStatistics;
    turnNumber: number;
    thumbnail?: string; // Base64 de la última imagen
    version: string; // Versión del formato de guardado
}

// Interface para metadata de partidas guardadas
export interface SaveGameMetadata {
    id: string;
    name: string;
    timestamp: Date;
    turnNumber: number;
    thumbnail?: string;
    survivalTime: number; // En minutos
}