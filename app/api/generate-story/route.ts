import { google } from "@ai-sdk/google";
import {generateText, generateObject} from 'ai';
import { z } from 'zod';

import {type NextRequest, NextResponse} from 'next/server';
import { GAME_PROMPTS } from "@/lib/prompts";
import { GAME_CONFIG } from "@/lib/consts";
import { GenerateStoryRequest, InventoryItem, ItemType } from "@/lib/types";

// Schema de Zod para la extracción de items
const itemExtractionSchema = z.object({
    items: z.array(z.object({
        name: z.string().describe('Nombre del item encontrado'),
        description: z.string().describe('Descripción breve del item'),
        type: z.enum(['weapon', 'food', 'medical', 'tool', 'key', 'misc']).describe('Tipo de item'),
        icon: z.string().describe('Emoji que representa el item'),
        usable: z.boolean().describe('Si el item se puede usar directamente'),
    }))
});

// Función helper para extraer items usando IA
async function extractItemsWithAI(narrative: string, currentInventory?: InventoryItem[]): Promise<InventoryItem[]> {
    try {
        // Lista de items que el jugador ya tiene
        const inventoryNames = currentInventory?.map(item => item.name.toLowerCase()) || [];

        const { object } = await generateObject({
            model: google('gemini-2.5-flash-lite'),
            schema: itemExtractionSchema,
            prompt: `Analiza la siguiente narrativa de un juego de supervivencia zombie y extrae ÚNICAMENTE los items útiles que se mencionan explícitamente y que el jugador podría recoger.

Narrativa: "${narrative}"

Items que el jugador YA tiene: ${inventoryNames.length > 0 ? inventoryNames.join(', ') : 'ninguno'}

REGLAS IMPORTANTES:
1. Solo extrae items mencionados EXPLÍCITAMENTE en la narrativa
2. NO incluyas items que el jugador ya tiene en su inventario
3. NO incluyas escenarios, lugares, zombies o personajes
4. Solo items físicos que puedan recogerse (armas, comida, medicina, herramientas, llaves, objetos útiles)
5. Cada item debe tener un emoji apropiado
6. Si no hay items útiles mencionados, retorna un array vacío

Tipos de items:
- weapon: armas o herramientas de combate
- food: comida y bebida
- medical: medicina, vendas, primeros auxilios
- tool: herramientas útiles (linterna, cuerda, etc.)
- key: llaves o tarjetas de acceso
- misc: otros objetos útiles`
        });

        // Convertir a InventoryItem con IDs únicos
        return object.items.map(item => ({
            id: crypto.randomUUID(),
            name: item.name,
            description: item.description,
            type: item.type as ItemType,
            usable: item.usable,
            quantity: 1,
            icon: item.icon
        }));
    } catch (error) {
        console.error('Error extracting items with AI:', error);
        return [];
    }
}

// Defino la ruta POST para generar una historia
export async function POST(request: NextRequest){
    try {
        const {userMessage, conversationHistory, isStart, currentInventory} : GenerateStoryRequest = await request.json();

        let prompt : string = GAME_PROMPTS.INITIAL_STORY;

        if(!isStart){
            const historyText = conversationHistory.map(
                (message) => `${message.role}: ${message.content}`
            ).join('\n');

            // Crear texto del inventario para el contexto
            const inventoryText = currentInventory && currentInventory.length > 0
                ? currentInventory.map(item => `${item.name} (x${item.quantity})`).join(', ')
                : '';

            prompt = GAME_PROMPTS.CONTINUE_STORY(historyText, userMessage, inventoryText);
        }

        const {text} = await generateText({
            model: google('gemini-2.5-flash-lite'),
            prompt
        });

        const [narrative, imagePrompt] = text.split(GAME_CONFIG.IMAGE.SEPARATOR);

        // Extraer items de la narrativa usando IA, excluyendo items que ya tiene el jugador
        const itemsFound = await extractItemsWithAI(narrative, currentInventory);

        return NextResponse.json({
            narrative: narrative.trim(),
            imagePrompt: imagePrompt?.trim() || 'zombie apocalypse scene',
            itemsFound: itemsFound.length > 0 ? itemsFound : undefined
        });

    } catch (error) {
        console.error('Error generating story: ', error);
        return NextResponse.json({error: "Error generating story"}, {status: 500});
    }
}