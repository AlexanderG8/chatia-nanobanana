import { EndingType, GameEnding, GameStatistics, InventoryItem, GameMassage } from './types';

// Definición de todos los finales posibles
export const GAME_ENDINGS: GameEnding[] = [
    {
        id: 'death-combat',
        type: EndingType.DEATH,
        title: 'Muerte en Combate',
        description: 'Caíste en batalla contra los zombies. Tu valentía será recordada.',
        achieved: false,
    },
    {
        id: 'escape-safe',
        type: EndingType.ESCAPE,
        title: 'Escape Exitoso',
        description: 'Lograste escapar de la zona infectada y encontraste refugio seguro.',
        achieved: false,
    },
    {
        id: 'cure-found',
        type: EndingType.CURE,
        title: 'La Cura',
        description: 'Encontraste los componentes necesarios para desarrollar la cura del virus.',
        achieved: false,
    },
    {
        id: 'sacrifice-hero',
        type: EndingType.SACRIFICE,
        title: 'Sacrificio Heroico',
        description: 'Te sacrificaste para salvar a otros supervivientes.',
        achieved: false,
    },
    {
        id: 'infection-turned',
        type: EndingType.INFECTION,
        title: 'Infectado',
        description: 'El virus te alcanzó. Ahora eres uno de ellos.',
        achieved: false,
    },
    {
        id: 'survivor-lone',
        type: EndingType.SURVIVOR,
        title: 'Superviviente Solitario',
        description: 'Sobreviviste solo, adaptándote al nuevo mundo.',
        achieved: false,
    },
    {
        id: 'leader-group',
        type: EndingType.LEADER,
        title: 'Líder de Supervivientes',
        description: 'Te convertiste en el líder de un grupo de supervivientes.',
        achieved: false,
    },
];

// Función para verificar condiciones de finales
export function checkEndingConditions(
    statistics: GameStatistics,
    inventory: InventoryItem[],
    messageHistory: GameMassage[]
): GameEnding | null {
    // Verificar si el juego ha durado suficiente para un final (mínimo 5 turnos)
    if (statistics.turnsPlayed < 5) {
        return null;
    }

    // Analizar el último mensaje para detectar keywords de finales
    const lastMessage = messageHistory[messageHistory.length - 1];
    const lastContent = lastMessage?.content?.toLowerCase() || '';

    // PRIORIDAD 1: Muerte en combate
    if (
        (statistics.combatActions >= 3 && lastContent.includes('muerte')) ||
        lastContent.includes('mueres') ||
        lastContent.includes('has muerto') ||
        (lastContent.includes('zombie') && lastContent.includes('muerde'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'death-combat') || null;
    }

    // PRIORIDAD 2: Infección
    if (
        lastContent.includes('infectado') ||
        lastContent.includes('mordida') ||
        (lastContent.includes('virus') && lastContent.includes('conviertes'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'infection-turned') || null;
    }

    // PRIORIDAD 3: Encontrar la cura (requiere items médicos y turnos de exploración)
    const hasMedicalItems = inventory.some(item => item.type === 'medical');
    if (
        hasMedicalItems &&
        statistics.explorationActions >= 4 &&
        (lastContent.includes('cura') || lastContent.includes('antídoto') || lastContent.includes('laboratorio'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'cure-found') || null;
    }

    // PRIORIDAD 4: Escape exitoso (requiere exploración y encontrar salida)
    if (
        statistics.explorationActions >= 5 &&
        (lastContent.includes('escapas') ||
        lastContent.includes('logras salir') ||
        lastContent.includes('refugio seguro') ||
        lastContent.includes('zona segura'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'escape-safe') || null;
    }

    // PRIORIDAD 5: Sacrificio heroico (requiere acciones sociales)
    if (
        statistics.socialActions >= 3 &&
        (lastContent.includes('sacrificas') ||
        lastContent.includes('salvar a otros') ||
        lastContent.includes('dar tu vida'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'sacrifice-hero') || null;
    }

    // PRIORIDAD 6: Líder de grupo (requiere muchas acciones sociales y supervivencia)
    if (
        statistics.socialActions >= 5 &&
        statistics.turnsPlayed >= 10 &&
        (lastContent.includes('líder') ||
        lastContent.includes('grupo') ||
        lastContent.includes('comunidad'))
    ) {
        return GAME_ENDINGS.find(e => e.id === 'leader-group') || null;
    }

    // PRIORIDAD 7: Superviviente solitario (muchos turnos sin acciones sociales)
    if (
        statistics.turnsPlayed >= 12 &&
        statistics.socialActions <= 1 &&
        statistics.explorationActions >= 6
    ) {
        return GAME_ENDINGS.find(e => e.id === 'survivor-lone') || null;
    }

    return null;
}

// Función para obtener un final basado en tipo
export function getEndingByType(type: EndingType): GameEnding | undefined {
    return GAME_ENDINGS.find(e => e.type === type);
}

// Función para categorizar una acción del jugador
export function categorizeAction(userMessage: string): {
    combat: boolean;
    exploration: boolean;
    social: boolean;
} {
    const message = userMessage.toLowerCase();

    const combatKeywords = ['atacar', 'luchar', 'pelear', 'disparar', 'golpear', 'defender', 'arma', 'matar', 'eliminar'];
    const explorationKeywords = ['buscar', 'explorar', 'examinar', 'investigar', 'revisar', 'mirar', 'inspeccionar', 'abrir', 'ir', 'caminar', 'avanzar'];
    const socialKeywords = ['hablar', 'preguntar', 'ayudar', 'gritar', 'llamar', 'conversar', 'unir', 'grupo', 'persona', 'gente'];

    return {
        combat: combatKeywords.some(keyword => message.includes(keyword)),
        exploration: explorationKeywords.some(keyword => message.includes(keyword)),
        social: socialKeywords.some(keyword => message.includes(keyword)),
    };
}
