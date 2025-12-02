'use client';

import { useEffect, useState } from 'react';
import { SavedEnding } from '@/lib/types';
import { GAME_ENDINGS } from '@/lib/endings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/auth-context';

interface EndingsGalleryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EndingsGallery({ open, onOpenChange }: EndingsGalleryProps) {
    const { currentUser } = useAuth();
    const [unlockedEndingIds, setUnlockedEndingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUnlockedEndings = async () => {
            if (open && currentUser) {
                setLoading(true);
                try {
                    const response = await fetch(`/api/endings/list?userId=${currentUser.id}`);
                    if (response.ok) {
                        const endingIds = await response.json();
                        setUnlockedEndingIds(endingIds);
                    }
                } catch (error) {
                    console.error('Error loading unlocked endings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUnlockedEndings();
    }, [open, currentUser]);

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
        return unlockedEndingIds.includes(endingId);
    };

    const getAchievedCount = () => {
        return unlockedEndingIds.length;
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

                {loading ? (
                    <div className="text-center py-8">
                        <p>Cargando finales...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {GAME_ENDINGS.map((ending, index) => {
                            const achieved = isEndingAchieved(ending.id);

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
                                                    {achieved && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Final desbloqueado
                                                        </div>
                                                    )}
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {achieved ? ending.description : 'Final bloqueado. Sigue jugando para desbloquearlo.'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
