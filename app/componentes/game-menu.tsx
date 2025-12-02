'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface GameMenuProps {
    onSave: () => void;
    onLoad: () => void;
    onViewEndings: () => void;
    lastSaveTime: Date | null;
    isSaving: boolean;
    gameEnded: boolean;
}

export function GameMenu({
    onSave,
    onLoad,
    onViewEndings,
    lastSaveTime,
    isSaving,
    gameEnded
}: GameMenuProps) {
    const formatLastSaveTime = (date: Date | null) => {
        if (!date) return null;

        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutos

        if (diff < 1) return 'Guardado hace un momento';
        if (diff === 1) return 'Guardado hace 1 minuto';
        if (diff < 60) return `Guardado hace ${diff} minutos`;

        const hours = Math.floor(diff / 60);
        if (hours === 1) return 'Guardado hace 1 hora';
        if (hours < 24) return `Guardado hace ${hours} horas`;

        return date.toLocaleDateString('es-ES');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-2 mb-4 p-3 bg-muted/50 rounded-lg"
        >
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">🧟 Chatia: Supervivencia Zombie</h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {lastSaveTime && (
                    <Badge variant="secondary" className="hidden sm:flex" suppressHydrationWarning>
                        {formatLastSaveTime(lastSaveTime)}
                    </Badge>
                )}

                <Button
                    onClick={onLoad}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                >
                    📂 Cargar
                </Button>

                <Button
                    onClick={onSave}
                    variant="outline"
                    size="sm"
                    disabled={isSaving || gameEnded}
                >
                    {isSaving ? (
                        <>
                            <span className="animate-spin mr-1">⏳</span>
                            Guardando...
                        </>
                    ) : (
                        <>💾 Guardar</>
                    )}
                </Button>

                <Button
                    onClick={onViewEndings}
                    variant="outline"
                    size="sm"
                >
                    🏆 Finales
                </Button>
            </div>
        </motion.div>
    );
}
