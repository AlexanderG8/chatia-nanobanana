'use client';

import { InventoryItem } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ItemDetailDialogProps {
    item: InventoryItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUse?: (itemId: string) => void;
    onDiscard?: (itemId: string) => void;
}

export function ItemDetailDialog({
    item,
    open,
    onOpenChange,
    onUse,
    onDiscard,
}: ItemDetailDialogProps) {
    if (!item) return null;

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'weapon':
                return 'destructive';
            case 'medical':
                return 'default';
            case 'food':
                return 'secondary';
            case 'tool':
                return 'outline';
            case 'key':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'weapon':
                return 'Arma';
            case 'medical':
                return 'Medicina';
            case 'food':
                return 'Comida';
            case 'tool':
                return 'Herramienta';
            case 'key':
                return 'Llave';
            case 'misc':
                return 'Varios';
            default:
                return type;
        }
    };

    const handleUse = () => {
        if (onUse && item.usable) {
            onUse(item.id);
            onOpenChange(false);
        }
    };

    const handleDiscard = () => {
        if (onDiscard) {
            onDiscard(item.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-5xl">{item.icon || '📦'}</span>
                        <div className="flex-1">
                            <DialogTitle className="text-xl">{item.name}</DialogTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant={getTypeColor(item.type)}>
                                    {getTypeName(item.type)}
                                </Badge>
                                {item.quantity > 1 && (
                                    <Badge variant="outline">x{item.quantity}</Badge>
                                )}
                                {item.usable && (
                                    <Badge variant="secondary" className="text-xs">
                                        Usable
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        {item.description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {onDiscard && (
                        <Button
                            variant="outline"
                            onClick={handleDiscard}
                            className="w-full sm:w-auto"
                        >
                            Descartar
                        </Button>
                    )}
                    {item.usable && onUse && (
                        <Button
                            onClick={handleUse}
                            className="w-full sm:w-auto"
                        >
                            Usar
                        </Button>
                    )}
                    {!item.usable && !onDiscard && (
                        <Button
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
