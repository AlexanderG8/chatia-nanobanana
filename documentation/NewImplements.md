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

---

## 🗄️ 5. Sistema de Base de Datos y Autenticación (EN PROGRESO)

### 5.1 Instalación y Configuración de Prisma ✅
- [X] Instalar dependencias de Prisma:
  - `npm install prisma --save-dev`
  - `npm install @prisma/client`
- [X] Inicializar Prisma: `npx prisma init`
- [X] Configurar `.env` con DATABASE_URL (ya existe)
- [X] Configurar `prisma/schema.prisma` con provider PostgreSQL

### 5.2 Diseño de Esquema de Base de Datos ✅
- [X] Crear modelo `User` en `schema.prisma`:
  - `id`: String (UUID)
  - `username`: String (unique)
  - `email`: String (unique)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - Relación: `savedGames` (uno a muchos con SavedGame)
- [X] Crear modelo `SavedGame` en `schema.prisma`:
  - `id`: String (UUID)
  - `userId`: String (FK a User)
  - `name`: String
  - `turnNumber`: Int
  - `survivalTime`: Int
  - `thumbnail`: String? (base64 opcional)
  - `isAutoSave`: Boolean
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - Relación: `user` (muchos a uno con User)
  - Relación: `messages`, `inventory`, `statistics` (uno a uno)
- [X] Crear modelo `GameMessage` en `schema.prisma`:
  - `id`: String (UUID)
  - `savedGameId`: String (FK a SavedGame)
  - `role`: String (enum: user, assistant)
  - `content`: String (text largo)
  - `imageUrl`: String?
  - `items`: Json? (array de items encontrados)
  - `order`: Int (orden del mensaje)
  - Relación: `savedGame` (muchos a uno)
- [X] Crear modelo `Inventory` en `schema.prisma`:
  - `id`: String (UUID)
  - `savedGameId`: String (FK único a SavedGame)
  - `items`: Json (array de InventoryItem)
  - Relación: `savedGame` (uno a uno)
- [X] Crear modelo `GameStatistics` en `schema.prisma`:
  - `id`: String (UUID)
  - `savedGameId`: String (FK único a SavedGame)
  - `decisionsCount`: Int
  - `combatActions`: Int
  - `explorationActions`: Int
  - `socialActions`: Int
  - `itemsUsed`: Int
  - `turnsPlayed`: Int
  - `startTime`: DateTime
  - `survivalTime`: Int
  - Relación: `savedGame` (uno a uno)
- [X] Crear modelo `UnlockedEnding` en `schema.prisma`:
  - `id`: String (UUID)
  - `userId`: String (FK a User)
  - `endingId`: String
  - `achievedAt`: DateTime
  - Relación: `user` (muchos a uno)
  - Índice único en (userId, endingId)

### 5.3 Migraciones de Base de Datos ✅
- [X] Generar primera migración: `npx prisma migrate dev --name init`
- [X] Verificar que las tablas se crearon correctamente en NeonConsole
- [X] Generar Prisma Client: `npx prisma generate`
- [X] Verificar conexión a la base de datos

### 5.4 Configuración de Prisma Client ✅
- [X] Crear archivo `lib/prisma.ts`:
  - Singleton de PrismaClient para desarrollo y producción
  - Prevenir múltiples instancias en hot-reload
  - Manejo de conexiones
- [X] Agregar `prisma` al `.gitignore` (carpeta de migraciones se mantiene)
- [X] Documentar variables de entorno necesarias

### 5.5 Sistema de Autenticación Simple ✅
- [X] Crear interface `AuthUser` en `lib/types.ts`:
  - `id`: string
  - `username`: string
  - `email`: string
  - `createdAt`: Date
- [X] Crear archivo `lib/auth.ts` con funciones:
  - `createUser(username, email): Promise<User>`
  - `getUserByUsername(username): Promise<User | null>`
  - `getUserByEmail(email): Promise<User | null>`
  - `getUserById(id): Promise<User | null>`
  - Validaciones de username y email
- [X] Crear contexto `app/contexts/auth-context.tsx`:
  - Estado: `currentUser`, `isLoading`, `isAuthenticated`
  - Funciones: `login(username, email)`, `logout()`, `checkAuth()`
  - Persistir userId en localStorage ('chatia_user_id')
  - Auto-login al cargar si existe userId

### 5.6 API Routes de Autenticación ✅
- [X] Crear endpoint `/api/auth/login/route.ts`:
  - POST: Recibir `username` y `email`
  - Validar formato de email
  - Buscar usuario existente por username o email
  - Si no existe, crear nuevo usuario
  - Retornar datos del usuario (sin password)
- [X] Crear endpoint `/api/auth/logout/route.ts`:
  - POST: Limpiar sesión (opcional, se maneja en cliente)
- [X] Crear endpoint `/api/auth/me/route.ts`:
  - GET: Recibir userId por query
  - Retornar datos del usuario actual

### 5.7 Migración del Sistema de Guardado a Base de Datos ✅
- [X] Crear archivo `lib/db-save-system.ts` con funciones:
  - `saveGameToDB(userId, messages, inventory, statistics, saveName, isAutoSave): Promise<SavedGame>`
  - `loadGameFromDB(userId, saveId): Promise<SavedGame | null>`
  - `deleteGameFromDB(userId, saveId): Promise<boolean>`
  - `listUserGames(userId): Promise<SaveGameMetadata[]>`
  - `getAutoSave(userId): Promise<SavedGame | null>`
  - `countUserSaves(userId): Promise<number>`
- [X] Implementar límite de 10 guardados por usuario (5 manuales + 5 auto)
- [X] Convertir datos complejos a JSON para storage en DB

### 5.8 API Routes de Guardado con DB ✅
- [X] Crear endpoint `/api/saves/create/route.ts`:
  - POST: Crear nuevo guardado
  - Recibir: `userId`, `name`, `messages`, `inventory`, `statistics`, `isAutoSave`
  - Validar que el usuario no exceda el límite
  - Guardar en DB usando Prisma
  - Retornar SavedGame creado
- [X] Crear endpoint `/api/saves/load/route.ts`:
  - GET: Cargar guardado específico
  - Query params: `userId`, `saveId`
  - Incluir relaciones (messages, inventory, statistics)
  - Retornar SavedGame completo
- [X] Crear endpoint `/api/saves/list/route.ts`:
  - GET: Listar guardados de un usuario
  - Query param: `userId`
  - Retornar array de SaveGameMetadata
  - Ordenar por fecha (más reciente primero)
- [X] Crear endpoint `/api/saves/delete/route.ts`:
  - DELETE: Eliminar guardado
  - Body: `userId`, `saveId`
  - Validar ownership
  - Eliminar de DB en cascada

### 5.9 Actualización del Hook use-zombie-game ✅
- [X] Agregar dependencia de `useAuth` hook
- [X] Modificar `saveCurrentGame()`:
  - Verificar que usuario esté autenticado
  - Llamar a `/api/saves/create` en lugar de localStorage
  - Manejar errores de red
- [X] Modificar `loadGameState()`:
  - Llamar a `/api/saves/load` en lugar de localStorage
  - Validar ownership del guardado
- [X] Modificar `listSaves()`:
  - Llamar a `/api/saves/list` con userId
- [X] Modificar `deleteSave()`:
  - Llamar a `/api/saves/delete` con userId y saveId
- [X] Remover todas las referencias a localStorage para guardados
- [X] Mantener localStorage solo para preferencias (audio, finales desbloqueados)

### 5.10 Componentes UI de Autenticación ✅
- [X] Crear componente `app/componentes/login-dialog.tsx`:
  - Dialog modal obligatorio al iniciar
  - Input para username (validación: 3-20 caracteres alfanuméricos)
  - Input para email (validación: formato email válido)
  - Botón "Entrar" con estado de carga
  - Feedback de errores con toast
  - No se puede cerrar hasta autenticar
  - Mensaje: "Usuarios existentes: solo ingresa tu username"
- [X] Crear componente `app/componentes/user-profile.tsx`:
  - Badge o avatar con username
  - Dropdown menu con opciones:
    - Ver perfil
    - Cerrar sesión
  - Mostrar en GameMenu
- [X] Modificar `app/page.tsx`:
  - Mostrar LoginDialog si no está autenticado
  - Bloquear toda interacción hasta autenticación
  - Pasar userId a todas las funciones de guardado
- [X] Agregar AuthProvider en `app/layout.tsx`

### 5.11 Actualización de Componentes de Guardado ✅
- [X] Modificar `save-dialog.tsx`:
  - Obtener límite de guardados desde contador de DB
  - Mantener badge con `X/5` (guardados manuales)
  - Manejar estados de carga de red
  - Feedback de errores de red
- [X] Modificar `load-dialog.tsx`:
  - Cargar lista desde API en lugar de localStorage
  - Manejar estados de carga
  - Feedback si no hay conexión
  - Actualizado handleDelete a async

### 5.12 Migración de Datos Existentes (Opcional)
- [ ] Crear script de migración `scripts/migrate-local-to-db.ts`:
  - Leer guardados de localStorage
  - Pedir username/email al usuario
  - Crear usuario en DB
  - Migrar cada guardado a la DB
  - Limpiar localStorage después de migración exitosa
- [ ] Documentar proceso de migración en README

### 5.13 Manejo de Finales Desbloqueados ✅
- [X] Crear modelo `UnlockedEnding` en `schema.prisma`:
  - `id`: String (UUID)
  - `userId`: String (FK a User)
  - `endingId`: String
  - `achievedAt`: DateTime
  - Relación: `user` (muchos a uno)
  - Índice único en (userId, endingId)
- [X] Crear `lib/db-endings-system.ts` con funciones:
  - `unlockEnding(userId, endingId)`
  - `listUnlockedEndings(userId)`
  - `hasUnlockedEnding(userId, endingId)`
  - `getUnlockedEndingIds(userId)`
- [X] Migrar sistema de finales a DB:
  - Guardar finales desbloqueados en tabla UnlockedEnding
  - Cargar finales desde API
  - API endpoints: `/api/endings/unlock` y `/api/endings/list`
- [X] Actualizar `endings-gallery.tsx` para usar datos de DB
- [X] Actualizar `use-zombie-game.ts` para guardar finales en DB

### 5.14 Documentación
- [ ] Actualizar README.md con:
  - Instrucciones de configuración de Prisma
  - Variables de entorno necesarias
  - Comandos de migración
  - Estructura de la base de datos
- [ ] Documentar schema de Prisma
- [ ] Crear diagrama ER de la base de datos (opcional)

---

**Nueva Implementación Iniciada:** 2025-12-02
**Estado:** 🔄 EN PROGRESO
**Features:**
- 🗄️ **Prisma + PostgreSQL:** Pendiente
- 🔐 **Autenticación Simple:** Pendiente
- 💾 **Guardado en Base de Datos:** Pendiente
