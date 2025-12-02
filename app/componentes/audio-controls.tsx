'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAudio } from '../hooks/use-audio';
import { motion, AnimatePresence } from 'motion/react';

export function AudioControls() {
    const { isMuted, musicVolume, sfxVolume, setMusicVolume, setSFXVolume, toggleMute, isInitialized, initialize } = useAudio();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggleMute = () => {
        if (!isInitialized) {
            initialize();
        }
        toggleMute();
    };

    const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        setMusicVolume(volume);
    };

    const handleSFXVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        setSFXVolume(volume);
    };

    const getVolumeIcon = () => {
        if (isMuted) return '🔇';
        if (musicVolume === 0 && sfxVolume === 0) return '🔇';
        if (musicVolume < 0.3 || sfxVolume < 0.3) return '🔉';
        return '🔊';
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex flex-col items-end gap-2">
                    {/* Panel de controles */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="w-64 shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Controles de Audio</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Control de volumen de música */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">🎵 Música</label>
                                                <span className="text-xs text-muted-foreground">
                                                    {Math.round(musicVolume * 100)}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={musicVolume}
                                                onChange={handleMusicVolumeChange}
                                                disabled={isMuted}
                                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                                                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                                                    [&::-webkit-slider-thumb]:cursor-pointer
                                                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                                                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                                                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                            />
                                        </div>

                                        {/* Control de volumen de efectos */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">🔊 Efectos</label>
                                                <span className="text-xs text-muted-foreground">
                                                    {Math.round(sfxVolume * 100)}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={sfxVolume}
                                                onChange={handleSFXVolumeChange}
                                                disabled={isMuted}
                                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                                                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                                                    [&::-webkit-slider-thumb]:cursor-pointer
                                                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                                                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                                                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                            />
                                        </div>

                                        {/* Nota sobre archivos de audio */}
                                        {!isInitialized && (
                                            <p className="text-xs text-muted-foreground border-t pt-3">
                                                ℹ️ El audio se iniciará después de tu primera interacción
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Botón flotante */}
                    <CollapsibleTrigger asChild>
                        <Button
                            size="lg"
                            variant="default"
                            className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => {
                                // Si se hace clic en mute y el panel está cerrado, solo toggle mute
                                if (!isOpen && e.shiftKey) {
                                    e.stopPropagation();
                                    handleToggleMute();
                                }
                            }}
                        >
                            <span className="text-2xl" suppressHydrationWarning>{getVolumeIcon()}</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </Collapsible>

            {/* Botón de mute rápido */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2"
                >
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToggleMute}
                        className="rounded-full"
                    >
                        {isMuted ? 'Activar' : 'Silenciar'}
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
