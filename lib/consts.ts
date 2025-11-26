// Aquí se definen las constantes que se usan en el juego.

export const UI_MESSAGES = {
    LOADING: {
        STORY: 'Generando historia...',
        IMAGE: 'Generando imagen...'
    },
    ERROR: {
        STORY_GENERATION: 'Error al generar historia',
        IMAGE_GENERATION: 'Error al generar imagen',
        MISSING_PROMPT: 'Por favor, ingresa un prompt para generar la historia'
    },
    PLACEHOLDERS: {
        INPUT: 'Describe qué quiere hacer, a donde ir, qué examinar o como reaccionar...'
    }
}
/* Esto en caso de que el usuario no ingrese un prompt para generar la imagen,
el usuario no haya ingresado un buen prompt o se haya roto algo durante la generación de la imagen.*/
export const GAME_CONFIG = {
    IMAGE: {
        DEFAULT_PROMPT: 'zombie apocalypse scene pixel art style',
        SEPARATOR: 'IMAGEN: '
    },
    INVENTORY: {
        MAX_ITEMS: 10 // Límite máximo de tipos de items diferentes en el inventario
    }
}