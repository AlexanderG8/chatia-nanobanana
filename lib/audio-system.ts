// Sistema de gestión de audio para el juego

export type MusicTrack = 'ambient-zombie' | 'tension' | 'ending';
export type SoundEffect = 'pickup-item' | 'door-open' | 'zombie-groan' | 'footsteps' | 'message-send' | 'notification';

interface AudioConfig {
    musicVolume: number;
    sfxVolume: number;
    isMuted: boolean;
}

export class AudioManager {
    private static instance: AudioManager;
    private musicAudio: HTMLAudioElement | null = null;
    private currentTrack: MusicTrack | null = null;
    private sfxAudioPool: Map<SoundEffect, HTMLAudioElement[]> = new Map();
    private config: AudioConfig = {
        musicVolume: 0.3,
        sfxVolume: 0.5,
        isMuted: false
    };
    private isInitialized = false;
    private fadingOut = false;

    private constructor() {
        // Cargar configuración guardada
        this.loadConfig();
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    // Inicializar audio (debe llamarse después de una interacción del usuario)
    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Crear audio de música
            this.musicAudio = new Audio();
            this.musicAudio.loop = true;
            this.musicAudio.volume = this.config.isMuted ? 0 : this.config.musicVolume;

            // Pre-cargar efectos de sonido en el pool
            const sfxList: SoundEffect[] = ['pickup-item', 'door-open', 'zombie-groan', 'footsteps', 'message-send', 'notification'];

            for (const sfx of sfxList) {
                // Crear pool de 3 instancias para cada efecto
                const pool: HTMLAudioElement[] = [];
                for (let i = 0; i < 3; i++) {
                    const audio = new Audio(`/audio/sfx/${sfx}.mp3`);
                    audio.volume = this.config.isMuted ? 0 : this.config.sfxVolume;
                    pool.push(audio);
                }
                this.sfxAudioPool.set(sfx, pool);
            }

            this.isInitialized = true;
        } catch (error) {
            console.warn('Error initializing audio:', error);
        }
    }

    // Reproducir música
    public async playMusic(track: MusicTrack, fadeIn: boolean = true): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.musicAudio) return;

        // Si ya está reproduciendo la misma pista, no hacer nada
        if (this.currentTrack === track && !this.musicAudio.paused) {
            return;
        }

        // Detener música actual si existe
        if (this.currentTrack && !this.musicAudio.paused) {
            await this.stopMusic(true);
        }

        try {
            this.currentTrack = track;
            this.musicAudio.src = `/audio/music/${track}.mp3`;
            this.musicAudio.volume = fadeIn ? 0 : (this.config.isMuted ? 0 : this.config.musicVolume);

            await this.musicAudio.play();

            // Fade in
            if (fadeIn && !this.config.isMuted) {
                this.fadeIn(this.musicAudio, this.config.musicVolume);
            }
        } catch (error) {
            console.warn(`Error playing music track "${track}":`, error);
        }
    }

    // Detener música
    public async stopMusic(fadeOut: boolean = true): Promise<void> {
        if (!this.musicAudio || this.musicAudio.paused) return;

        if (fadeOut && !this.config.isMuted) {
            await this.fadeOut(this.musicAudio);
        }

        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
        this.currentTrack = null;
    }

    // Pausar música
    public pauseMusic(): void {
        if (this.musicAudio && !this.musicAudio.paused) {
            this.musicAudio.pause();
        }
    }

    // Reanudar música
    public resumeMusic(): void {
        if (this.musicAudio && this.musicAudio.paused && this.currentTrack) {
            this.musicAudio.play().catch(err => console.warn('Error resuming music:', err));
        }
    }

    // Reproducir efecto de sonido
    public playSFX(sound: SoundEffect, volume?: number): void {
        if (!this.isInitialized || this.config.isMuted) return;

        const pool = this.sfxAudioPool.get(sound);
        if (!pool) return;

        // Buscar una instancia disponible en el pool
        const audio = pool.find(a => a.paused || a.ended) || pool[0];

        audio.volume = volume !== undefined ? volume : this.config.sfxVolume;
        audio.currentTime = 0;
        audio.play().catch(err => console.warn(`Error playing SFX "${sound}":`, err));
    }

    // Cambiar volumen de música
    public setMusicVolume(volume: number): void {
        this.config.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicAudio && !this.config.isMuted) {
            this.musicAudio.volume = this.config.musicVolume;
        }
        this.saveConfig();
    }

    // Cambiar volumen de efectos
    public setSFXVolume(volume: number): void {
        this.config.sfxVolume = Math.max(0, Math.min(1, volume));
        if (!this.config.isMuted) {
            this.sfxAudioPool.forEach(pool => {
                pool.forEach(audio => {
                    audio.volume = this.config.sfxVolume;
                });
            });
        }
        this.saveConfig();
    }

    // Silenciar/Activar audio
    public toggleMute(): boolean {
        this.config.isMuted = !this.config.isMuted;

        if (this.musicAudio) {
            this.musicAudio.volume = this.config.isMuted ? 0 : this.config.musicVolume;
        }

        this.sfxAudioPool.forEach(pool => {
            pool.forEach(audio => {
                audio.volume = this.config.isMuted ? 0 : this.config.sfxVolume;
            });
        });

        this.saveConfig();
        return this.config.isMuted;
    }

    // Getters
    public getMusicVolume(): number {
        return this.config.musicVolume;
    }

    public getSFXVolume(): number {
        return this.config.sfxVolume;
    }

    public isMutedState(): boolean {
        return this.config.isMuted;
    }

    public getCurrentTrack(): MusicTrack | null {
        return this.currentTrack;
    }

    public getIsInitialized(): boolean {
        return this.isInitialized;
    }

    // Fade in
    private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number = 2000): void {
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(interval);
            }
        }, stepDuration);
    }

    // Fade out
    private fadeOut(audio: HTMLAudioElement, duration: number = 1000): Promise<void> {
        return new Promise((resolve) => {
            if (this.fadingOut) {
                resolve();
                return;
            }

            this.fadingOut = true;
            const startVolume = audio.volume;
            const steps = 20;
            const stepDuration = duration / steps;
            const volumeStep = startVolume / steps;
            let currentStep = 0;

            const interval = setInterval(() => {
                currentStep++;
                audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);

                if (currentStep >= steps) {
                    clearInterval(interval);
                    this.fadingOut = false;
                    resolve();
                }
            }, stepDuration);
        });
    }

    // Guardar configuración en localStorage
    private saveConfig(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem('chatia_audio_config', JSON.stringify(this.config));
        } catch (error) {
            console.warn('Error saving audio config:', error);
        }
    }

    // Cargar configuración desde localStorage
    private loadConfig(): void {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem('chatia_audio_config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Error loading audio config:', error);
        }
    }

    // Manejar visibilidad de la página
    public handleVisibilityChange(isVisible: boolean): void {
        if (isVisible) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }
    }
}

// Exportar instancia singleton
export const audioManager = AudioManager.getInstance();
