'use client'

import { useState, useEffect, useRef } from 'react';
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { GameInput } from "./componentes/game-input";
import { GameLoader } from "./componentes/game-loader";
import { GameMessage } from "./componentes/game-message";
import { GameInventory } from "./componentes/game-inventory";
import { ItemDetailDialog } from "./componentes/item-detail-dialog";
import { EndingScreen } from "./componentes/ending-screen";
import { EndingsGallery } from "./componentes/endings-gallery";
import { SaveDialog } from "./componentes/save-dialog";
import { LoadDialog } from "./componentes/load-dialog";
import { GameMenu } from "./componentes/game-menu";
import { AudioControls } from "./componentes/audio-controls";
import { useZombieGame } from "./hooks/use-zombie-game";
import { InventoryItem, SaveGameMetadata } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { GAME_CONFIG } from "@/lib/consts";

export default function Home() {
  const {
    messages,
    input,
    isLoading,
    inventory,
    inventoryFull,
    statistics,
    gameEnded,
    achievedEnding,
    isSaving,
    lastSaveTime,
    handleSubmit,
    handleInputChange,
    useItem,
    removeItemFromInventory,
    restartGame,
    saveCurrentGame,
    loadGameState,
    listSaves,
    deleteSave,
  } = useZombieGame();

  const { toast } = useToast();
  const prevInventoryLength = useRef(inventory.length);
  const prevInventoryFull = useRef(inventoryFull);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saves, setSaves] = useState<SaveGameMetadata[]>([]);

  // Detectar cuando se agregan nuevos items y mostrar notificación
  useEffect(() => {
    if (inventory.length > prevInventoryLength.current) {
      // Se agregaron items nuevos
      const newItems = inventory.slice(prevInventoryLength.current);
      newItems.forEach((item) => {
        toast({
          title: `${item.icon || '📦'} ¡Nuevo item encontrado!`,
          description: `${item.name} agregado al inventario`,
          duration: 3000,
        });
      });
    }
    prevInventoryLength.current = inventory.length;
  }, [inventory, toast]);

  // Detectar cuando el inventario se llena y mostrar advertencia
  useEffect(() => {
    if (inventoryFull && !prevInventoryFull.current) {
      toast({
        title: '⚠️ Inventario lleno',
        description: `No puedes llevar más de ${GAME_CONFIG.INVENTORY.MAX_ITEMS} tipos de items. Descarta algo para recoger nuevos items.`,
        variant: 'destructive',
        duration: 5000,
      });
    }
    prevInventoryFull.current = inventoryFull;
  }, [inventoryFull, toast]);

  // Actualizar lista de guardados cuando se abren los diálogos
  useEffect(() => {
    if (saveDialogOpen || loadDialogOpen) {
      const currentSaves = listSaves();
      setSaves(currentSaves);
    }
  }, [saveDialogOpen, loadDialogOpen, listSaves]);

  // Handlers para guardado/carga
  const handleOpenSaveDialog = () => {
    setSaveDialogOpen(true);
  };

  const handleOpenLoadDialog = () => {
    setLoadDialogOpen(true);
  };

  const handleSave = async (saveName: string): Promise<boolean> => {
    return await saveCurrentGame(saveName, false);
  };

  const handleLoad = async (saveId: string): Promise<boolean> => {
    const success = await loadGameState(saveId);
    if (success) {
      // Actualizar la lista de guardados después de cargar
      const currentSaves = listSaves();
      setSaves(currentSaves);
    }
    return success;
  };

  const handleDelete = (saveId: string): boolean => {
    const success = deleteSave(saveId);
    if (success) {
      // Actualizar la lista de guardados después de eliminar
      const currentSaves = listSaves();
      setSaves(currentSaves);
    }
    return success;
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleUseItem = (itemId: string) => {
    useItem(itemId);
    setDialogOpen(false);
  };

  const handleDiscardItem = (itemId: string) => {
    removeItemFromInventory(itemId, 1);
    setDialogOpen(false);
  };

  return (
    <div className="font-sans h-screen mx-auto">
      {/* Pantalla de final */}
      {gameEnded && achievedEnding && (
        <EndingScreen
          ending={achievedEnding}
          statistics={statistics}
          onRestart={restartGame}
          onViewGallery={() => setGalleryOpen(true)}
        />
      )}

      <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
        {/* Panel principal del juego */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Menú del juego */}
          <GameMenu
            onSave={handleOpenSaveDialog}
            onLoad={handleOpenLoadDialog}
            onViewEndings={() => setGalleryOpen(true)}
            lastSaveTime={lastSaveTime}
            isSaving={isSaving}
            gameEnded={gameEnded}
          />

          <Conversation>
            <ConversationContent className="max-w-xl mx-auto">
              {
                messages.map((message) => (
                  <GameMessage key={message.id} message={message} />
                ))
              }
              {isLoading && <GameLoader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="max-w-2xl w-full mx-auto pb-4">
            <GameInput
              input={input}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Panel del inventario - lateral en desktop, arriba en móvil */}
        <div className="lg:w-80 order-first lg:order-last">
          <GameInventory
            inventory={inventory}
            onItemClick={handleItemClick}
            maxItems={GAME_CONFIG.INVENTORY.MAX_ITEMS}
            isFull={inventoryFull}
          />
        </div>
      </div>

      {/* Diálogo de detalles del item */}
      <ItemDetailDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUse={handleUseItem}
        onDiscard={handleDiscardItem}
      />

      {/* Galería de finales */}
      <EndingsGallery
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />

      {/* Diálogo de guardar partida */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSave}
        currentSavesCount={saves.length}
        maxSaves={5}
        isSaving={isSaving}
      />

      {/* Diálogo de cargar partida */}
      <LoadDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        onLoad={handleLoad}
        onDelete={handleDelete}
        saves={saves}
      />

      {/* Controles de audio */}
      <AudioControls />
    </div>
  );
}
