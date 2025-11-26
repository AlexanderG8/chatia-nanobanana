# 📋 Nuevas Implementaciones - Chatia NanoBanana

Este documento detalla las tareas necesarias para implementar las nuevas características del juego.

---

## 🎒 1. Sistema de Inventario ✅ COMPLETADO

### 1.1 Backend y Tipos
- [X] Crear interface `InventoryItem` en `lib/types.ts`
  - Propiedades: `id`, `name`, `description`, `type`, `usable`, `quantity`
- [X] Agregar campo `inventory: InventoryItem[]` a la interface `GameMassage` (mensajes del asistente)
- [X] Crear interface `GameState` que incluya el inventario actual del jugador
- [X] Actualizar `GenerateStoryRequest` para incluir `currentInventory: InventoryItem[]`

### 1.2 Modificación de Prompts
- [X] Actualizar `GAME_PROMPTS.INITIAL_STORY` en `lib/prompts.ts`
  - Incluir instrucción para mencionar items disponibles en la escena inicial
  - Formato de respuesta debe incluir items encontrados
- [X] Actualizar `GAME_PROMPTS.CONTINUE_STORY`
  - Agregar contexto del inventario actual del jugador
  - Instrucciones para mencionar items en nuevas escenas
  - Validar uso de items según contexto
- [X] Crear nuevo prompt `GAME_PROMPTS.PARSE_ITEMS` para extraer items de la narrativa

### 1.3 Lógica del Hook
- [X] Agregar estado `inventory: InventoryItem[]` en `use-zombie-game.ts`
- [X] Crear función `addItemToInventory(item: InventoryItem)`
- [X] Crear función `removeItemFromInventory(itemId: string)`
- [X] Crear función `useItem(itemId: string)` que:
  - Valide si el item es usable
  - Envíe acción a la IA
  - Actualice inventario
- [X] Modificar `startGame()` para inicializar inventario vacío
- [X] Modificar `handleSubmit()` para incluir inventario en el request

### 1.4 API Routes
- [X] Actualizar `/api/generate-story/route.ts`:
  - Recibir `currentInventory` en el request
  - Incluir inventario en el prompt contextual
  - Parsear respuesta para extraer items mencionados (usando AI con Zod schemas)
  - Retornar `{narrative, imagePrompt, itemsFound: InventoryItem[]}`
- [X] Crear endpoint `/api/use-item/route.ts` (opcional - integrado en generate-story)
  - Validar uso de item según contexto
  - Generar consecuencias del uso

### 1.5 Componentes UI
- [X] Crear componente `app/componentes/game-inventory.tsx`:
  - Mostrar lista de items con icono/nombre
  - Grid o lista responsiva
  - Click en item para ver detalles
  - Botón "Usar" si el item es usable
- [X] Crear componente `app/componentes/inventory-item.tsx`:
  - Tarjeta individual de item (integrado en game-inventory)
  - Props: `item`, `onUse`, `onExamine`
  - Icono, nombre, cantidad
- [X] Crear componente `app/componentes/item-detail-dialog.tsx`:
  - Dialog/Modal con detalles completos
  - Descripción, imagen (opcional)
  - Acciones disponibles (Usar, Descartar)
- [X] Agregar sección de inventario en `app/page.tsx`:
  - Sidebar o panel colapsable
  - Indicador visual de cantidad de items
  - Badge con número de items

### 1.6 Estilos y UX
- [X] Agregar animaciones de aparición de nuevos items (Motion)
- [X] Notificación toast cuando se encuentra un item
- [X] Límite máximo de items (10 items configurables)
- [X] Icono o emoji para cada tipo de item
- [X] Estado "disabled" para items que no se pueden usar en el contexto actual

---

## 🎭 2. Múltiples Finales ✅ COMPLETADO

### 2.1 Sistema de Estadísticas y Decisiones
- [X] Crear interface `GameStatistics` en `lib/types.ts`:
  - `decisionsCount: number`
  - `combatActions: number`
  - `explorationActions: number`
  - `socialActions: number`
  - `itemsUsed: number`
  - `turnsPlayed: number`
  - `startTime: Date`
  - `survivalTime: number`
- [X] Crear interface `GameEnding` en `lib/types.ts`:
  - `id: string`
  - `type: EndingType` (muerte, escape, cura, sacrificio, etc.)
  - `title: string`
  - `description: string`
  - `achieved: boolean`
  - `achievedAt?: Date`
  - `narrative?: string`
- [X] Crear enum `EndingType` con tipos de finales (7 tipos)
- [X] Agregar `statistics: GameStatistics` al estado del hook

### 2.2 Condiciones de Finales
- [X] Crear archivo `lib/endings.ts` con definición de finales:
  - 7 finales diferentes implementados
  - Condiciones claras para cada final con keywords
  - Descripción y narrativa de cada final
- [X] Crear función `checkEndingConditions(stats, inventory, history)`:
  - Evaluar condiciones de cada final
  - Retornar el final alcanzado o `null`
  - Sistema de prioridad implementado
- [X] Crear función `categorizeAction()` para categorizar acciones del jugador

### 2.3 Modificación de Prompts
- [X] Actualizar `GAME_PROMPTS.CONTINUE_STORY`:
  - Incluir instrucciones sobre posibles finales
  - Indicadores de progreso hacia finales
  - Pistas sutiles sobre decisiones críticas
- [X] Crear `GAME_PROMPTS.ENDING_SCENE`:
  - Prompt específico para generar escena de final
  - Incluir tipo de final alcanzado
  - Narrativa dramática y conclusiva

### 2.4 Lógica del Hook
- [X] Agregar estado `gameEnded: boolean`
- [X] Agregar estado `achievedEnding: GameEnding | null`
- [X] Modificar `handleSubmit()`:
  - Actualizar estadísticas según tipo de acción
  - Verificar condiciones de final después de cada turno
  - Si se alcanza un final, ejecutar `triggerEnding()`
- [X] Crear función `triggerEnding(ending: GameEnding)`:
  - Marcar juego como terminado
  - Guardar final alcanzado
  - Generar escena de final con IA
  - Registrar logro en localStorage
- [X] Crear función `restartGame()`:
  - Resetear todo el estado
  - Volver a llamar `startGame()`

### 2.5 API Routes
- [X] Actualizar `/api/generate-story/route.ts`:
  - Recibir `statistics` y detectar proximidad a finales
  - Agregar pistas sutiles en la narrativa
- [X] Crear endpoint `/api/generate-ending/route.ts`:
  - Generar escena de final épica con Gemini
  - Recibir tipo de final y estadísticas
  - Retornar narrativa conclusiva e imagen final

### 2.6 Componentes UI
- [X] Crear componente `app/componentes/ending-screen.tsx`:
  - Pantalla completa con fondo oscuro y backdrop-blur
  - Título del final alcanzado con emoji
  - Descripción y narrativa
  - Estadísticas de la partida en grid
  - Botones: "Jugar de Nuevo", "Ver Todos los Finales"
  - Animaciones con Motion
- [X] Crear componente `app/componentes/endings-gallery.tsx`:
  - Galería de finales desbloqueados
  - Finales bloqueados mostrados con ???
  - Click para ver detalles de finales alcanzados
  - Contador de finales desbloqueados
- [X] Modificar `app/page.tsx`:
  - Renderizar condicionalmente `<EndingScreen>` si `gameEnded === true`
  - Agregar botón para ver galería de finales

### 2.7 Persistencia
- [X] Guardar finales alcanzados en localStorage ('chatia_endings')
- [X] Crear sistema de logros para finales (SavedEnding interface)
- [X] Timestamp de cuando se alcanzó cada final

---

## 💾 3. Guardado de Partidas ✅ COMPLETADO

### 3.1 Sistema de Guardado
- [X] Crear interface `SavedGame` en `lib/types.ts`:
  - `id: string`
  - `name: string`
  - `timestamp: Date`
  - `messages: GameMassage[]`
  - `inventory: InventoryItem[]`
  - `statistics: GameStatistics`
  - `turnNumber: number`
  - `thumbnail?: string` (imagen de la última escena en base64)
  - `version: string` (versión del formato)
- [X] Crear interface `SaveGameMetadata` para lista de partidas:
  - `id`, `name`, `timestamp`, `turnNumber`, `thumbnail`, `survivalTime`

### 3.2 Funciones de Guardado
- [X] Crear archivo `lib/save-system.ts` con funciones:
  - `saveGame(messages, inventory, statistics, saveName, isAutoSave): SavedGame`
  - `loadGame(saveId): SavedGame | null`
  - `deleteSave(saveId): boolean`
  - `listSaves(): SaveGameMetadata[]`
  - `autoSave(messages, inventory, statistics): SavedGame | null`
  - `getLatestSave(): SavedGame | null`
  - `getAutoSave(): SavedGame | null`
  - `getStorageStats(): {used, total, percentage}`
- [X] Implementar validación de integridad al cargar (versión, estructura)
- [X] Manejo de errores QuotaExceededError

### 3.3 LocalStorage Management
- [X] Definir keys de localStorage:
  - `chatia_saves_list`: metadata de partidas
  - `chatia_save_{id}`: datos completos de cada partida
  - `chatia_autosave`: guardado automático
- [X] Implementar límite de guardados (5 manuales + 1 auto)
- [X] Manejo de cuota excedida de localStorage con alerta al usuario
- [X] Auto-eliminación del guardado más antiguo cuando se alcanza el límite

### 3.4 Lógica del Hook
- [X] Crear función `saveCurrentGame(name: string, isAutoSave: boolean): Promise<boolean>`
- [X] Crear función `loadGameState(saveId: string): Promise<boolean>`
- [X] Agregar estado `isSaving: boolean`
- [X] Agregar estado `lastSaveTime: Date | null`
- [X] Implementar auto-guardado cada 5 turnos
- [X] Modificar `handleSubmit()` para llamar auto-save automáticamente
- [X] Exportar funciones `listSaves` y `deleteSave` del hook

### 3.5 Componentes UI
- [X] Crear componente `app/componentes/save-dialog.tsx`:
  - Dialog para guardar partida
  - Input para nombre de la partida (máx 50 caracteres)
  - Badge mostrando slots usados (X/5)
  - Botón "Guardar" con estado de carga
  - Feedback de éxito/error con toast
  - Validación de nombre requerido
  - Advertencia cuando inventario está lleno
- [X] Crear componente `app/componentes/load-dialog.tsx`:
  - Dialog con lista de partidas guardadas
  - Sección especial para auto-save
  - Cards de cada partida con:
    - Thumbnail (última imagen base64)
    - Nombre y fecha formateada
    - Número de turnos y tiempo de supervivencia
    - Botón "Cargar"
    - Botón "Eliminar" (con confirmación confirm())
  - Ordenar por fecha (más reciente primero)
  - Estado vacío con mensaje amigable
  - Animaciones con Motion
- [X] Crear componente `app/componentes/game-menu.tsx`:
  - Barra superior con título del juego
  - Opciones:
    - "Guardar Partida" (💾)
    - "Cargar Partida" (📂)
    - "Ver Finales" (🏆)
  - Badge con tiempo desde último guardado
  - Estado disabled para guardar cuando juego terminó
- [X] Agregar componentes en `app/page.tsx`:
  - GameMenu en la parte superior
  - SaveDialog y LoadDialog integrados
  - Handlers para abrir/cerrar diálogos
  - Estado para lista de saves actualizado

### 3.6 UX y Feedback
- [X] Notificación toast al guardar exitosamente
- [X] Notificación toast al cargar exitosamente
- [X] Notificación toast al eliminar exitosamente
- [X] Confirmación antes de eliminar guardado (confirm dialog)
- [X] Indicador visual de guardado en progreso (spinner en botón)
- [X] Prevenir múltiples guardados simultáneos (disabled state)
- [X] Actualización automática de lista de saves después de operaciones

---

## 🎵 4. Sonidos y Música de Fondo ✅ COMPLETADO

### 4.1 Assets de Audio
- [X] Crear carpeta `public/audio/`
- [X] Subcarpetas:
  - `public/audio/music/` (música de fondo)
  - `public/audio/sfx/` (efectos de sonido)
- [X] Documentar archivos de audio necesarios (README.md):
  - `music/ambient-zombie.mp3` - Música principal (loop)
  - `music/tension.mp3` - Música de situaciones tensas
  - `music/ending.mp3` - Música de final
  - `sfx/pickup-item.mp3` - Recoger item
  - `sfx/door-open.mp3` - Abrir puerta
  - `sfx/zombie-groan.mp3` - Gemido zombie
  - `sfx/footsteps.mp3` - Pasos
  - `sfx/message-send.mp3` - Enviar mensaje
  - `sfx/notification.mp3` - Notificación general
- [X] Formatos: MP3 (compatible con todos los browsers)
- [X] Sistema funcional (archivos opcionales - funciona sin ellos)

### 4.2 Sistema de Audio
- [X] Crear archivo `lib/audio-system.ts`:
  - Clase `AudioManager` con singleton pattern
  - Pool de audio para SFX (3 instancias por efecto)
- [X] Implementar funciones:
  - `playMusic(trackName, fadeIn)` - Con soporte para fade in
  - `stopMusic(fadeOut)` - Con soporte para fade out
  - `pauseMusic()` y `resumeMusic()`
  - `playSFX(soundName, volume)` - Usa pool para múltiples reproducciones
  - `setMusicVolume(volume)` y `setSFXVolume(volume)`
  - `toggleMute()` - Toggle global de silencio
  - `initialize()` - Inicialización después de interacción del usuario
- [X] Manejo de múltiples capas de audio (música + múltiples SFX simultáneos)
- [X] Fade in/out suaves (2s fade in, 1s fade out)
- [X] Getters para estado (getMusicVolume, getSFXVolume, isMutedState)

### 4.3 Contexto de Audio
- [X] Crear `app/contexts/audio-context.tsx`:
  - Provider con AudioManager singleton
  - Estado global: `isMuted`, `musicVolume`, `sfxVolume`, `currentTrack`, `isInitialized`
  - Funciones expuestas: todas las del AudioManager
  - Hook `useAudioContext()` para acceder al contexto
- [X] Wrap la app en `layout.tsx` con `<AudioProvider>`
- [X] Manejo de Page Visibility API (pausar/resumir según visibilidad)

### 4.4 Hook de Audio
- [X] Crear `app/hooks/use-audio.ts`:
  - Hook que consume AudioContext (alias de useAudioContext)
  - Simplifica importaciones en componentes
  - Retorna todas las funciones y estado del contexto

### 4.5 Integración en el Juego
- [X] Modificar `use-zombie-game.ts`:
  - Importar `useAudio`
  - Reproducir música ambiente al iniciar juego
  - Reproducir SFX en eventos:
    - Mensaje enviado → `message-send.mp3`
    - Item encontrado → `pickup-item.mp3`
    - Contextos detectados → `door-open.mp3`, `zombie-groan.mp3`, `footsteps.mp3`
- [X] Parsear narrativa para detectar eventos sonoros:
  - Keywords: "zombie", "muerto viviente" → zombie-groan
  - Keywords: "puerta", "abrir" → door-open
  - Keywords: "paso", "caminar", "correr" → footsteps
- [X] Cambiar música en finales → `ending.mp3` con fade out/in

### 4.6 Componentes UI
- [X] Crear componente `app/componentes/audio-controls.tsx`:
  - Botón flotante redondo con icono de volumen
  - Panel colapsable con sliders de volumen (música y SFX)
  - Botón de mute/unmute rápido
  - Indicador visual de porcentaje de volumen
  - Diseño responsivo con Motion animations
  - Estados disabled cuando está en mute
- [X] Agregar controles en `app/page.tsx`:
  - Botón flotante en esquina inferior derecha
  - Posición fija con z-index alto
- [X] Estilos:
  - Diseño minimalista con Card de shadcn/ui
  - Emojis como iconos (🔇🔉🔊)
  - Animaciones suaves con Motion

### 4.7 Persistencia de Preferencias
- [X] Guardar preferencias de audio en localStorage:
  - Key: `chatia_audio_config` (objeto JSON completo)
  - Incluye: `musicVolume`, `sfxVolume`, `isMuted`
- [X] Cargar preferencias al iniciar AudioManager
- [X] Aplicar preferencias guardadas automáticamente
- [X] Guardar en cada cambio de configuración

### 4.8 Consideraciones Técnicas
- [X] Manejo de auto-play policy de browsers:
  - Música inicia después de primera interacción del usuario
  - Initialize() debe llamarse manualmente
  - Mensaje informativo al usuario en controles
- [X] Lazy loading de archivos de audio (carga bajo demanda)
- [X] Fallback silencioso si audio falla en cargar (console.warn)
- [X] Pausar música cuando tab no está visible (Page Visibility API integrado)
- [X] Try/catch en todas las operaciones de audio
- [X] Pool de SFX para permitir múltiples reproducciones simultáneas

---

## 📝 Notas de Implementación

### Orden Sugerido de Implementación
1. **Sistema de Inventario** (base para otras features)
2. **Múltiples Finales** (depende del inventario para algunos finales)
3. **Guardado de Partidas** (requiere que inventario y finales estén completos)
4. **Sonidos y Música** (feature independiente, puede hacerse en paralelo)

### Consideraciones Generales
- Todas las features deben mantener el tipado estricto de TypeScript
- Mantener la estructura de código existente
- Agregar tests si es posible
- Documentar funciones complejas
- Optimizar performance (especialmente en guardado/carga)
- Mobile-first responsive design
- Accesibilidad (a11y) en todos los componentes

### Archivos Principales a Modificar
- `app/hooks/use-zombie-game.ts` (todas las features)
- `lib/types.ts` (todas las features)
- `lib/prompts.ts` (inventario y finales)
- `app/page.tsx` (todas las features)
- `app/api/generate-story/route.ts` (inventario y finales)

### Testing
- [ ] Probar guardado/carga con diferentes estados
- [ ] Verificar que todos los finales son alcanzables
- [ ] Testear inventario con diferentes items
- [ ] Verificar audio en diferentes browsers
- [ ] Test de performance con partidas largas

---

**Última actualización:** 2025-11-26
**Estado de Implementación:**
- ✅ **Sistema de Inventario:** COMPLETADO (100%)
- ✅ **Múltiples Finales:** COMPLETADO (7 finales implementados)
- ✅ **Guardado de Partidas:** COMPLETADO (100%)
- ✅ **Sonidos y Música de Fondo:** COMPLETADO (100%)

**🎉 TODAS LAS FEATURES IMPLEMENTADAS EXITOSAMENTE 🎉**
