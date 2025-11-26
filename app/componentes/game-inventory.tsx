'use client';

import { InventoryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

interface GameInventoryProps {
    inventory: InventoryItem[];
    onItemClick?: (item: InventoryItem) => void;
    maxItems?: number;
    isFull?: boolean;
}

export function GameInventory({ inventory, onItemClick, maxItems = 10, isFull = false }: GameInventoryProps) {
    if (inventory.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        🎒 Inventario
                        <Badge variant="secondary" className="ml-auto">0</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Tu inventario está vacío. Explora para encontrar items útiles.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    🎒 Inventario
                    <div className="ml-auto flex items-center gap-2">
                        <motion.div
                            key={inventory.length}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                            <Badge variant={isFull ? "destructive" : "secondary"}>
                                {inventory.length}/{maxItems}
                            </Badge>
                        </motion.div>
                        {isFull && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs text-destructive"
                            >
                                ¡Lleno!
                            </motion.span>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    <div className="grid grid-cols-2 gap-2">
                        <AnimatePresence mode="popLayout">
                            {inventory.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        delay: index * 0.05
                                    }}
                                    onClick={() => onItemClick?.(item)}
                                    className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-2xl">{item.icon || '📦'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        {item.quantity > 1 && (
                                            <Badge variant="outline" className="text-xs mt-1">
                                                x{item.quantity}
                                            </Badge>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
