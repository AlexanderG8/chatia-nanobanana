'use client';

import { GameEnding, GameStatistics } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface EndingScreenProps {
    ending: GameEnding;
    statistics: GameStatistics;
    onRestart: () => void;
    onViewGallery?: () => void;
}

export function EndingScreen({ ending, statistics, onRestart, onViewGallery }: EndingScreenProps) {
    const getEndingColor = (type: string) => {
        switch (type) {
            case 'death':
            case 'infection':
                return 'destructive';
            case 'escape':
            case 'cure':
                return 'default';
            case 'sacrifice':
                return 'secondary';
            case 'survivor':
            case 'leader':
                return 'outline';
            default:
                return 'secondary';
        }
    };

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

    const survivalTime = Math.floor((new Date().getTime() - statistics.startTime.getTime()) / 60000);

    return (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
            >
                <Card className="border-2">
                    <CardContent className="p-8 space-y-6">
                        {/* Título del final */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center space-y-4"
                        >
                            <div className="text-6xl mb-4">
                                {getEndingEmoji(ending.type)}
                            </div>
                            <h1 className="text-4xl font-bold">{ending.title}</h1>
                            <Badge variant={getEndingColor(ending.type)} className="text-lg px-4 py-1">
                                Final Alcanzado
                            </Badge>
                        </motion.div>

                        {/* Narrativa del final */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-invert max-w-none"
                        >
                            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                                {ending.narrative || ending.description}
                            </p>
                        </motion.div>

                        {/* Estadísticas */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-muted/50 rounded-lg p-6"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-center">📊 Estadísticas de la Partida</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">{statistics.turnsPlayed}</div>
                                    <div className="text-sm text-muted-foreground">Turnos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">{survivalTime}</div>
                                    <div className="text-sm text-muted-foreground">Minutos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-destructive">{statistics.combatActions}</div>
                                    <div className="text-sm text-muted-foreground">Combates</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-500">{statistics.explorationActions}</div>
                                    <div className="text-sm text-muted-foreground">Exploraciones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-500">{statistics.socialActions}</div>
                                    <div className="text-sm text-muted-foreground">Interacciones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-500">{statistics.itemsUsed}</div>
                                    <div className="text-sm text-muted-foreground">Items Usados</div>
                                </div>
                                <div className="text-center col-span-2">
                                    <div className="text-3xl font-bold text-purple-500">{statistics.decisionsCount}</div>
                                    <div className="text-sm text-muted-foreground">Decisiones Tomadas</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Botones de acción */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                onClick={onRestart}
                                className="flex-1 sm:flex-none"
                            >
                                🔄 Jugar de Nuevo
                            </Button>
                            {onViewGallery && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={onViewGallery}
                                    className="flex-1 sm:flex-none"
                                >
                                    🏆 Ver Todos los Finales
                                </Button>
                            )}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
