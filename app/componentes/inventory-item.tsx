'use client';

import { InventoryItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface InventoryItemComponentProps {
    item: InventoryItem;
    onUse?: (itemId: string) => void;
    onExamine?: (itemId: string) => void;
}

export function InventoryItemComponent({ item, onUse, onExamine }: InventoryItemComponentProps) {
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

    return (
        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
                <span className="text-4xl">{item.icon || '📦'}</span>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex gap-2 mt-1">
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

            <p className="text-sm text-muted-foreground">{item.description}</p>

            <div className="flex gap-2">
                {onExamine && (
                    <button
                        onClick={() => onExamine(item.id)}
                        className="flex-1 px-3 py-2 text-sm rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Examinar
                    </button>
                )}
                {item.usable && onUse && (
                    <button
                        onClick={() => onUse(item.id)}
                        className="flex-1 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Usar
                    </button>
                )}
            </div>
        </div>
    );
}
