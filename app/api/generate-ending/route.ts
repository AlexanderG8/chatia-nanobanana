import { google } from "@ai-sdk/google";
import { generateText } from 'ai';
import { type NextRequest, NextResponse } from 'next/server';
import { GAME_PROMPTS } from "@/lib/prompts";
import { GAME_CONFIG } from "@/lib/consts";

// Defino la ruta POST para generar un final épico
export async function POST(request: NextRequest) {
    try {
        const { endingType, endingTitle, statistics } = await request.json();

        const prompt = GAME_PROMPTS.ENDING_SCENE(endingType, endingTitle, statistics);

        const { text } = await generateText({
            model: google('gemini-2.5-flash-lite'),
            prompt
        });

        const [narrative, imagePrompt] = text.split(GAME_CONFIG.IMAGE.SEPARATOR);

        return NextResponse.json({
            narrative: narrative.trim(),
            imagePrompt: imagePrompt?.trim() || `${endingType} ending zombie apocalypse pixel art`
        });

    } catch (error) {
        console.error('Error generating ending: ', error);
        return NextResponse.json({ error: "Error generating ending" }, { status: 500 });
    }
}
