'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { useToast } from '@/components/ui/use-toast';

interface SaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (saveName: string) => Promise<boolean>;
    currentSavesCount: number;
    maxSaves: number;
    isSaving: boolean;
}

export function SaveDialog({
    open,
    onOpenChange,
    onSave,
    currentSavesCount,
    maxSaves,
    isSaving
}: SaveDialogProps) {
    const [saveName, setSaveName] = useState('');
    const { toast } = useToast();

    const handleSave = async () => {
        if (!saveName.trim()) {
            toast({
                title: '⚠️ Nombre requerido',
                description: 'Por favor ingresa un nombre para la partida',
                variant: 'destructive',
                duration: 3000,
            });
            return;
        }

        const success = await onSave(saveName);

        if (success) {
            toast({
                title: '✅ Partida guardada',
                description: `"${saveName}" guardado exitosamente`,
                duration: 3000,
            });
            setSaveName('');
            onOpenChange(false);
        } else {
            toast({
                title: '❌ Error al guardar',
                description: 'No se pudo guardar la partida. Intenta de nuevo.',
                variant: 'destructive',
                duration: 3000,
            });
        }
    };

    const isFull = currentSavesCount >= maxSaves;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        💾 Guardar Partida
                        <Badge variant={isFull ? "destructive" : "secondary"} className="ml-auto">
                            {currentSavesCount}/{maxSaves}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {isFull ? (
                            <span className="text-destructive font-medium">
                                Has alcanzado el límite de partidas guardadas. Se eliminará la más antigua.
                            </span>
                        ) : (
                            'Ingresa un nombre para identificar esta partida.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="save-name">Nombre de la partida</Label>
                        <Input
                            id="save-name"
                            placeholder="Ej: Mi supervivencia épica"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            maxLength={50}
                            disabled={isSaving}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isSaving) {
                                    handleSave();
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            {saveName.length}/50 caracteres
                        </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSaveName('');
                                onOpenChange(false);
                            }}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !saveName.trim()}
                        >
                            {isSaving ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    💾 Guardar
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
