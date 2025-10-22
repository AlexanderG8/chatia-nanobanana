// Aquí se definen las interfaces

// Aquí se define la interfaz GameMassage que representa un mensaje en el juego
export interface GameMassage {
    id: string;
    role: "user" | "assistant";
    content: string;
    image?: string;
    imageLoading?: string
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
}

export interface GenerateStoryResponse{
    narrative: string;
    imagePrompt: string;
}

export interface GenerateImageRequest{
    imagePrompt: string;
}