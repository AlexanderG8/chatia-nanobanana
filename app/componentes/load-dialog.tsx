'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SaveGameMetadata } from '@/lib/types';
import { getAutoSave } from '@/lib/save-system';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '@/components/ui/use-toast';

interface LoadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoad: (saveId: string) => Promise<boolean>;
    onDelete: (saveId: string) => boolean;
    saves: SaveGameMetadata[];
}

export function LoadDialog({
    open,
    onOpenChange,
    onLoad,
    onDelete,
    saves
}: LoadDialogProps) {
    const [hasAutoSave, setHasAutoSave] = useState(false);
    const [loadingSaveId, setLoadingSaveId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            // Verificar si existe auto-guardado
            const autoSave = getAutoSave();
            setHasAutoSave(!!autoSave);
        }
    }, [open]);

    const handleLoad = async (saveId: string) => {
        setLoadingSaveId(saveId);
        const success = await onLoad(saveId);

        if (success) {
            toast({
                title: '✅ Partida cargada',
                description: 'La partida se ha cargado exitosamente',
                duration: 3000,
            });
            onOpenChange(false);
        } else {
            toast({
                title: '❌ Error al cargar',
                description: 'No se pudo cargar la partida',
                variant: 'destructive',
                duration: 3000,
            });
        }
        setLoadingSaveId(null);
    };

    const handleDelete = (saveId: string, saveName: string) => {
        if (confirm(`¿Estás seguro de eliminar "${saveName}"?`)) {
            const success = onDelete(saveId);
            if (success) {
                toast({
                    title: '🗑️ Partida eliminada',
                    description: `"${saveName}" eliminado exitosamente`,
                    duration: 3000,
                });
            } else {
                toast({
                    title: '❌ Error al eliminar',
                    description: 'No se pudo eliminar la partida',
                    variant: 'destructive',
                    duration: 3000,
                });
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        📂 Cargar Partida
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Auto-guardado */}
                    {hasAutoSave && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-primary">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">⚡</span>
                                                <h3 className="font-semibold">Auto-guardado</h3>
                                                <Badge variant="secondary">Automático</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Última partida guardada automáticamente
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => handleLoad('autosave')}
                                            disabled={loadingSaveId !== null}
                                            size="sm"
                                        >
                                            {loadingSaveId === 'autosave' ? 'Cargando...' : 'Cargar'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Guardados manuales */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Partidas Guardadas ({saves.length})
                        </h3>

                        <AnimatePresence mode="popLayout">
                            {saves.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    <p className="text-4xl mb-2">📭</p>
                                    <p>No hay partidas guardadas</p>
                                    <p className="text-sm mt-1">Guarda tu progreso para verlo aquí</p>
                                </motion.div>
                            ) : (
                                saves.map((save, index) => (
                                    <motion.div
                                        key={save.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    {/* Thumbnail */}
                                                    {save.thumbnail && (
                                                        <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                            <img
                                                                src={save.thumbnail}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Información */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold truncate">{save.name}</h3>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {formatDate(save.timestamp)}
                                                        </p>
                                                        <div className="flex gap-2 mt-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                Turno {save.turnNumber}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {save.survivalTime} min
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Acciones */}
                                                    <div className="flex flex-col gap-2">
                                                        <Button
                                                            onClick={() => handleLoad(save.id)}
                                                            disabled={loadingSaveId !== null}
                                                            size="sm"
                                                            className="w-20"
                                                        >
                                                            {loadingSaveId === save.id ? '...' : 'Cargar'}
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(save.id, save.name)}
                                                            disabled={loadingSaveId !== null}
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-20"
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
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
