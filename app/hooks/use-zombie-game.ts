import {useState, useEffect} from 'react';
import type { GameMassage, GenerateStoryResponse, InventoryItem, GameStatistics, GameEnding } from '@/lib/types';
import { GAME_CONFIG } from '@/lib/consts';
import { checkEndingConditions, categorizeAction } from '@/lib/endings';
import { saveGame, loadGame, autoSave, listSaves, deleteSave } from '@/lib/save-system';
import { useAudio } from './use-audio';

export function useZombieGame(){
    const { playSFX, playMusic, stopMusic, initialize } = useAudio();
    const [messages, setMessages] = useState<GameMassage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventoryFull, setInventoryFull] = useState(false);
    const [statistics, setStatistics] = useState<GameStatistics>({
        decisionsCount: 0,
        combatActions: 0,
        explorationActions: 0,
        socialActions: 0,
        itemsUsed: 0,
        turnsPlayed: 0,
        startTime: new Date(),
        survivalTime: 0
    });
    const [gameEnded, setGameEnded] = useState(false);
    const [achievedEnding, setAchievedEnding] = useState<GameEnding | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

    useEffect(() =>{
        startGame();
        // Inicializar audio y reproducir música ambiente
        initialize().then(() => {
            playMusic('ambient-zombie', true);
        });
    }, [])

    // Funciones de manejo de finales y estadísticas
    const triggerEnding = async (ending: GameEnding) => {
        setGameEnded(true);
        setAchievedEnding(ending);
        setIsLoading(true);

        // Cambiar a música de final
        await stopMusic(true);
        await playMusic('ending', true);

        try {
            // Calcular tiempo de supervivencia
            const survivalTime = Math.floor((new Date().getTime() - statistics.startTime.getTime()) / 60000);

            // Generar narrativa del final
            const statsText = `
Turnos jugados: ${statistics.turnsPlayed}
Tiempo de supervivencia: ${survivalTime} minutos
Acciones de combate: ${statistics.combatActions}
Acciones de exploración: ${statistics.explorationActions}
Acciones sociales: ${statistics.socialActions}
Items usados: ${statistics.itemsUsed}
`;

            const response = await fetch('/api/generate-ending', {
                method: 'POST',
                body: JSON.stringify({
                    endingType: ending.type,
                    endingTitle: ending.title,
                    statistics: statsText
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAchievedEnding({
                    ...ending,
                    narrative: data.narrative,
                    achieved: true,
                    achievedAt: new Date()
                });

                // Guardar final en localStorage
                const savedEndings = JSON.parse(localStorage.getItem('chatia_endings') || '[]');
                savedEndings.push({
                    id: ending.id,
                    type: ending.type,
                    title: ending.title,
                    achievedAt: new Date(),
                    statistics: {
                        ...statistics,
                        survivalTime
                    }
                });
                localStorage.setItem('chatia_endings', JSON.stringify(savedEndings));
            }
        } catch (error) {
            console.error('Error generating ending:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const restartGame = () => {
        setMessages([]);
        setInventory([]);
        setInventoryFull(false);
        setStatistics({
            decisionsCount: 0,
            combatActions: 0,
            explorationActions: 0,
            socialActions: 0,
            itemsUsed: 0,
            turnsPlayed: 0,
            startTime: new Date(),
            survivalTime: 0
        });
        setGameEnded(false);
        setAchievedEnding(null);
        setLastSaveTime(null);
        startGame();
    };

    // Funciones de guardado y carga
    const saveCurrentGame = async (saveName: string, isAutoSave: boolean = false): Promise<boolean> => {
        setIsSaving(true);
        try {
            // Calcular tiempo de supervivencia actualizado
            const survivalTime = Math.floor((new Date().getTime() - statistics.startTime.getTime()) / 60000);
            const updatedStats = {
                ...statistics,
                survivalTime
            };

            const savedGame = saveGame(messages, inventory, updatedStats, saveName, isAutoSave);

            if (savedGame) {
                setLastSaveTime(new Date());
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const loadGameState = async (saveId: string): Promise<boolean> => {
        try {
            const savedGame = loadGame(saveId);

            if (!savedGame) {
                console.error('No se pudo cargar la partida');
                return false;
            }

            // Restaurar todo el estado del juego
            setMessages(savedGame.messages);
            setInventory(savedGame.inventory);
            setStatistics(savedGame.statistics);
            setInventoryFull(savedGame.inventory.length >= GAME_CONFIG.INVENTORY.MAX_ITEMS);
            setGameEnded(false);
            setAchievedEnding(null);
            setLastSaveTime(savedGame.timestamp);

            return true;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    };

    // Funciones de manejo de inventario
    const addItemToInventory = (item: InventoryItem): boolean => {
        let added = false;
        setInventory(prevInventory => {
            // Verificar si el item ya existe
            const existingItem = prevInventory.find(i => i.id === item.id);
            if (existingItem) {
                // Si existe, incrementar cantidad
                added = true;
                return prevInventory.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }

            // Verificar límite antes de agregar nuevo item
            if (prevInventory.length >= GAME_CONFIG.INVENTORY.MAX_ITEMS) {
                setInventoryFull(true);
                added = false;
                return prevInventory;
            }

            // Si no existe y hay espacio, agregarlo
            added = true;
            setInventoryFull(false);
            return [...prevInventory, item];
        });

        // Reproducir sonido si se agregó exitosamente
        if (added) {
            playSFX('pickup-item');
        }

        return added;
    };

    const removeItemFromInventory = (itemId: string, quantity: number = 1) => {
        setInventory(prevInventory => {
            return prevInventory
                .map(item => {
                    if (item.id === itemId) {
                        const newQuantity = item.quantity - quantity;
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0);
        });
    };

    const useItem = async (itemId: string) => {
        const item = inventory.find(i => i.id === itemId);
        if (!item || !item.usable) return;

        // Simular uso del item enviando mensaje a la IA
        const useMessage = `Usar ${item.name}`;
        setInput(useMessage);

        // El item se removerá después de que la IA confirme el uso
        // por ahora solo lo marcamos
    };

    const startGame = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/generate-story',{
                method: 'POST',
                body: JSON.stringify({isStart: true})
            });

            if(!response.ok){
                throw new Error('Failed to generate story');
            }

            const data = await response.json();

            const messagesId = crypto.randomUUID();

            const newMessage: GameMassage = {
                id: messagesId,
                role: 'assistant',
                content: data.narrative,
                imageLoading: true
            }

            setMessages([newMessage]);
            generateImage(messagesId, data.imagePrompt);
        } catch (error) {
            console.log('Error generating story', error);
        } finally{
            setIsLoading(false);
        }
    }

    const generateImage = async (messageId:string, imagePrompt:string) => {
        try {
            const response = await fetch('/api/generate-image',{
                method: 'POST',
                body: JSON.stringify({
                    imagePrompt: imagePrompt
                })
            });

            if(!response.ok){
                throw new Error('Failed to generated image');
            }

            const imageData = await response.json();

            setMessages(prevMessages => prevMessages.map(messages => {
                if(messages.id === messageId){
                    return {...messages, image: imageData.image, imageLoading: false}
                }
                return messages;
            }))
        } catch (error) {
            console.log('Error generating image', error);
            setMessages(prevMessages => prevMessages.map(message => {
                if(message.id === messageId){
                    return {... message, imageLoading: false}
                }
                return message;
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!input.trim() || isLoading || gameEnded) return

        const userMessage: GameMassage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input,
        }

        // Reproducir sonido de envío de mensaje
        playSFX('message-send');

        // Categorizar la acción y actualizar estadísticas
        const actionType = categorizeAction(input);
        setStatistics(prev => ({
            ...prev,
            decisionsCount: prev.decisionsCount + 1,
            combatActions: prev.combatActions + (actionType.combat ? 1 : 0),
            explorationActions: prev.explorationActions + (actionType.exploration ? 1 : 0),
            socialActions: prev.socialActions + (actionType.social ? 1 : 0),
            turnsPlayed: prev.turnsPlayed + 1
        }));

        setIsLoading(true);
        setInput('');
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await fetch('/api/generate-story',{
                method: 'POST',
                body: JSON.stringify({
                    userMessage: input,
                    conversationHistory: messages,
                    isStart: false,
                    currentInventory: inventory,
                })
            })

            if(!response.ok){
                throw new Error('Failed to generate story');
            }

            const data = await response.json() as GenerateStoryResponse;

            const messageId = crypto.randomUUID();

            const assistantMessage: GameMassage = {
                id: messageId,
                role: 'assistant',
                content: data.narrative,
                imageLoading: true,
                itemsFound: data.itemsFound
            }

            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            generateImage(messageId, data.imagePrompt);

            // Reproducir sonidos contextuales basados en la narrativa
            const narrativeLower = data.narrative.toLowerCase();
            if (narrativeLower.includes('zombie') || narrativeLower.includes('muerto viviente')) {
                playSFX('zombie-groan', 0.4);
            } else if (narrativeLower.includes('puerta') || narrativeLower.includes('abrir')) {
                playSFX('door-open', 0.6);
            } else if (narrativeLower.includes('paso') || narrativeLower.includes('caminar') || narrativeLower.includes('correr')) {
                playSFX('footsteps', 0.3);
            }

            // Agregar items encontrados al inventario automáticamente
            if (data.itemsFound && data.itemsFound.length > 0) {
                const itemsNotAdded: string[] = [];
                data.itemsFound.forEach(item => {
                    const wasAdded = addItemToInventory(item);
                    if (!wasAdded) {
                        itemsNotAdded.push(item.name);
                    }
                });
            }

            // Verificar condiciones de final
            setTimeout(() => {
                const updatedMessages = [...messages, userMessage, assistantMessage];
                const ending = checkEndingConditions(statistics, inventory, updatedMessages);
                if (ending) {
                    triggerEnding(ending);
                }
            }, 1000);

            // Auto-guardado cada 5 turnos
            const currentTurns = statistics.turnsPlayed + 1;
            if (currentTurns % 5 === 0) {
                await saveCurrentGame('Auto-guardado', true);
            }

        } catch (error) {
            console.log('Error generating story', error);
        } finally{
            setIsLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        setInput(e.target.value);
    }

    return {
        messages,
        input,
        isLoading,
        inventory,
        inventoryFull,
        statistics,
        gameEnded,
        achievedEnding,
        isSaving,
        lastSaveTime,
        startGame,
        handleSubmit,
        handleInputChange,
        addItemToInventory,
        removeItemFromInventory,
        useItem,
        restartGame,
        saveCurrentGame,
        loadGameState,
        listSaves,
        deleteSave,
    }
}
