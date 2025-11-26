'use client';

import { useEffect, useState } from 'react';
import { SavedEnding } from '@/lib/types';
import { GAME_ENDINGS } from '@/lib/endings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'motion/react';

interface EndingsGalleryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EndingsGallery({ open, onOpenChange }: EndingsGalleryProps) {
    const [savedEndings, setSavedEndings] = useState<SavedEnding[]>([]);

    useEffect(() => {
        if (open) {
            const endings = JSON.parse(localStorage.getItem('chatia_endings') || '[]');
            setSavedEndings(endings);
        }
    }, [open]);

    const getEndingEmoji = (type: string) => {
        switch (type) {
            case 'death':
                return '💀';
            case 'escape':
                return '🏃';
            case 'cure':
                return '💉';
            case 'sacrifice':
                return '⚔️';
            case 'infection':
                return '🧟';
            case 'survivor':
                return '🎖️';
            case 'leader':
                return '👑';
            default:
                return '🎮';
        }
    };

    const isEndingAchieved = (endingId: string) => {
        return savedEndings.some(saved => saved.id === endingId);
    };

    const getAchievedCount = () => {
        const uniqueEndings = new Set(savedEndings.map(e => e.id));
        return uniqueEndings.size;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        🏆 Galería de Finales
                        <Badge variant="secondary" className="ml-auto">
                            {getAchievedCount()}/{GAME_ENDINGS.length} Desbloqueados
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {GAME_ENDINGS.map((ending, index) => {
                        const achieved = isEndingAchieved(ending.id);
                        const savedEnding = savedEndings.find(s => s.id === ending.id);

                        return (
                            <motion.div
                                key={ending.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={achieved ? 'border-primary' : 'border-muted opacity-60'}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-3xl">
                                                {achieved ? getEndingEmoji(ending.type) : '❓'}
                                            </span>
                                            <div className="flex-1">
                                                <div className="text-lg">
                                                    {achieved ? ending.title : '???'}
                                                </div>
                                                {achieved && savedEnding && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Alcanzado el{' '}
                                                        {new Date(savedEnding.achievedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {achieved ? ending.description : 'Final bloqueado. Sigue jugando para desbloquearlo.'}
                                        </p>
                                        {achieved && savedEnding && (
                                            <div className="mt-4 flex gap-2 text-xs">
                                                <Badge variant="outline">
                                                    {savedEnding.statistics.turnsPlayed} turnos
                                                </Badge>
                                                <Badge variant="outline">
                                                    {savedEnding.statistics.survivalTime}min
                                                </Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
