'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { audioManager, MusicTrack, SoundEffect } from '@/lib/audio-system';

interface AudioContextType {
    // Estado
    isMuted: boolean;
    musicVolume: number;
    sfxVolume: number;
    currentTrack: MusicTrack | null;
    isInitialized: boolean;

    // Funciones
    initialize: () => Promise<void>;
    playMusic: (track: MusicTrack, fadeIn?: boolean) => Promise<void>;
    stopMusic: (fadeOut?: boolean) => Promise<void>;
    pauseMusic: () => void;
    resumeMusic: () => void;
    playSFX: (sound: SoundEffect, volume?: number) => void;
    setMusicVolume: (volume: number) => void;
    setSFXVolume: (volume: number) => void;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(audioManager.isMutedState());
    const [musicVolume, setMusicVolumeState] = useState(audioManager.getMusicVolume());
    const [sfxVolume, setSFXVolumeState] = useState(audioManager.getSFXVolume());
    const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(audioManager.getCurrentTrack());
    const [isInitialized, setIsInitialized] = useState(audioManager.getIsInitialized());

    // Inicializar audio
    const initialize = useCallback(async () => {
        if (!isInitialized) {
            await audioManager.initialize();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Reproducir música
    const playMusic = useCallback(async (track: MusicTrack, fadeIn: boolean = true) => {
        await audioManager.playMusic(track, fadeIn);
        setCurrentTrack(track);
    }, []);

    // Detener música
    const stopMusic = useCallback(async (fadeOut: boolean = true) => {
        await audioManager.stopMusic(fadeOut);
        setCurrentTrack(null);
    }, []);

    // Pausar música
    const pauseMusic = useCallback(() => {
        audioManager.pauseMusic();
    }, []);

    // Reanudar música
    const resumeMusic = useCallback(() => {
        audioManager.resumeMusic();
    }, []);

    // Reproducir efecto de sonido
    const playSFX = useCallback((sound: SoundEffect, volume?: number) => {
        audioManager.playSFX(sound, volume);
    }, []);

    // Cambiar volumen de música
    const setMusicVolume = useCallback((volume: number) => {
        audioManager.setMusicVolume(volume);
        setMusicVolumeState(volume);
    }, []);

    // Cambiar volumen de SFX
    const setSFXVolume = useCallback((volume: number) => {
        audioManager.setSFXVolume(volume);
        setSFXVolumeState(volume);
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        const newMutedState = audioManager.toggleMute();
        setIsMuted(newMutedState);
    }, []);

    // Manejar visibilidad de la página (pausar música cuando no está visible)
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            audioManager.handleVisibilityChange(isVisible);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const value: AudioContextType = {
        isMuted,
        musicVolume,
        sfxVolume,
        currentTrack,
        isInitialized,
        initialize,
        playMusic,
        stopMusic,
        pauseMusic,
        resumeMusic,
        playSFX,
        setMusicVolume,
        setSFXVolume,
        toggleMute,
    };

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioContext() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
}
