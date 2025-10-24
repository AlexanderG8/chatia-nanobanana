import {useState, useEffect} from 'react';
import type { GameMassage, GenerateStoryResponse } from '@/lib/types';

export function useZombieGame(){
    const [messages, setMessages] = useState<GameMassage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() =>{
        startGame()
    }, [])
    
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
        debugger;
        e.preventDefault();
        if(!input.trim() || isLoading) return

        const userMessage: GameMassage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input,
        }

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
                imageLoading: true
            }

            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            generateImage(messageId, data.imagePrompt);
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
        startGame,
        handleSubmit,
        handleInputChange,
    }
}
