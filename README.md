# 🧟‍♂️ Chatia NanoBanana - Juego de Supervivencia Zombie

Un juego de aventura conversacional de supervivencia zombie con estilo pixel art, desarrollado con Next.js y potenciado por IA generativa.

## 🎮 Descripción del Proyecto

**Chatia NanoBanana** es un juego interactivo de supervivencia zombie donde los jugadores toman decisiones que afectan el desarrollo de la historia. El juego utiliza inteligencia artificial para generar narrativas dinámicas e imágenes en estilo pixel art que acompañan cada escena.

### ✨ Características Principales

- 🎯 **Narrativa Interactiva**: Historia generada dinámicamente basada en las decisiones del jugador
- 🎨 **Imágenes Pixel Art**: Generación automática de imágenes en estilo retro 16-bit
- 🤖 **IA Avanzada**: Utiliza Google Gemini para generar contenido y imágenes
- 📱 **Interfaz Responsiva**: Diseño moderno y adaptable con Tailwind CSS
- ⚡ **Tiempo Real**: Experiencia fluida con carga asíncrona de contenido

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 16.0.0** - Framework de React para aplicaciones web
- **React 19.2.0** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework de CSS utilitario
- **Radix UI** - Componentes de interfaz accesibles

### Backend & IA
- **AI SDK** - Integración con modelos de IA
- **Google Gemini** - Modelo de IA para generación de texto e imágenes
- **Next.js API Routes** - Endpoints del servidor

### Herramientas de Desarrollo
- **ESLint** - Linter para código JavaScript/TypeScript
- **PostCSS** - Procesador de CSS

## 📁 Estructura del Proyecto

```
chatia-nanobanana/
├── app/
│   ├── api/
│   │   ├── generate-story/     # API para generar narrativa
│   │   └── generate-image/     # API para generar imágenes
│   ├── componentes/
│   │   ├── game-input.tsx      # Componente de entrada del jugador
│   │   ├── game-loader.tsx     # Indicador de carga
│   │   └── game-message.tsx    # Componente de mensajes del juego
│   ├── hooks/
│   │   └── use-zombie-game.ts  # Hook principal del juego
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página principal del juego
├── components/
│   ├── ai-elements/            # Componentes de IA reutilizables
│   └── ui/                     # Componentes de interfaz
├── lib/
│   ├── consts.ts              # Constantes del juego
│   ├── prompts.ts             # Prompts para la IA
│   ├── types.ts               # Definiciones de tipos TypeScript
│   └── utils.ts               # Utilidades generales
└── public/                    # Archivos estáticos
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Clave API de Google AI Studio

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd chatia-nanobanana
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env.local` en la raíz del proyecto:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=tu_clave_api_aqui
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   Visita `http://localhost:3000`

## 🎯 Cómo Jugar

1. **Inicio del Juego**: Al cargar la página, se genera automáticamente la escena inicial del apocalipsis zombie
2. **Interacción**: Escribe en el campo de texto qué acción quieres realizar (ej: "Busco un arma", "Voy hacia el norte")
3. **Decisiones**: El juego responderá con las consecuencias de tus acciones y te presentará nuevas opciones
4. **Imágenes**: Cada escena viene acompañada de una imagen generada en estilo pixel art
5. **Supervivencia**: Toma decisiones inteligentes para sobrevivir en el mundo zombie

## 🔧 Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Ejecutar linter
```

## 🎨 Características del Juego

### Sistema de Narrativa
- **Inicio Automático**: El juego comienza con una escena inicial generada por IA
- **Continuidad**: Cada acción del jugador influye en el desarrollo de la historia
- **Contexto**: El sistema mantiene el historial de conversación para coherencia narrativa

### Generación de Imágenes
- **Estilo Pixel Art**: Todas las imágenes siguen una estética retro de 16-bit
- **Formato 16:9**: Imágenes en formato panorámico para mejor visualización
- **Carga Asíncrona**: Las imágenes se generan en segundo plano mientras continúa el juego

### Interfaz de Usuario
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Indicadores de Carga**: Feedback visual durante la generación de contenido
- **Scroll Automático**: La conversación se desplaza automáticamente al nuevo contenido

## 🐛 Problemas Conocidos

- Las imágenes pueden tardar en cargar dependiendo de la respuesta de la API

<!-- ## 🔮 Próximas Características

- [ ] Sistema de inventario
- [ ] Múltiples finales
- [ ] Guardado de partidas
- [ ] Modo multijugador
- [ ] Sonidos y música de fondo -->

---

Desarrollado con ❤️ usando Next.js y Google Gemini AI