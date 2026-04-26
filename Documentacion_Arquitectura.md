# Documentación de Arquitectura - Futbol Tracker

Este documento explica cómo está estructurada la aplicación, qué hace cada archivo principal y cómo se relacionan entre sí para formar el producto final.

---

## 1. Estructura General del Proyecto

La aplicación está construida utilizando **React** (una librería para construir interfaces de usuario) con **TypeScript** (JavaScript con tipos estrictos) y **Vite** (una herramienta de construcción muy rápida).

La estructura de carpetas principal es la siguiente:

```text
/
├── public/                 # Archivos estáticos públicos (imágenes, logos, PDFs)
├── src/                    # Código fuente principal de la aplicación
│   ├── components/         # Componentes visuales de React (pantallas y partes de la UI)
│   ├── lib/                # Librerías y utilidades (conexión a la API)
│   ├── App.tsx             # Componente raíz que maneja la navegación y el estado global
│   ├── main.tsx            # Punto de entrada de la aplicación
│   └── index.css           # Estilos globales (Tailwind CSS)
├── index.html              # Archivo HTML principal donde se monta la app
├── package.json            # Lista de dependencias y comandos del proyecto (npm run dev, build)
└── vite.config.ts          # Configuración del empaquetador Vite
```

---

## 2. Relación y Flujo de los Archivos

El flujo de la aplicación desde que el usuario entra hasta que ve los datos es el siguiente:

1. **`index.html`**: Es lo primero que carga el navegador. Este archivo tiene un `div` vacío con el id `root` y llama al archivo `src/main.tsx`.
2. **`src/main.tsx`**: Toma el componente principal (`App.tsx`) y lo "inyecta" dentro del `div root` del HTML.
3. **`src/App.tsx`**: Es el "cerebro" visual. Decide qué pantalla mostrar (Inicio, Grupos o Partidos) y qué torneo está seleccionado. Dependiendo de esto, renderiza uno de los componentes dentro de `src/components/`.
4. **`src/components/*`**: Son las pantallas. Cuando una pantalla necesita datos (como la lista de partidos), llama a las funciones definidas en `src/lib/api.ts`.
5. **`src/lib/api.ts`**: Se conecta a internet (a la API de ESPN), descarga los datos en formato JSON, los limpia y se los devuelve a la pantalla para que los dibuje.

---

## 3. Explicación Detallada de los Archivos Clave

### `src/App.tsx` (El Controlador Principal)
- **Propósito:** Maneja el diseño general (Cabecera con el logo, fondo animado, pie de página) y el sistema de "rutas" o navegación interna.
- **Funcionamiento:** Utiliza variables de estado (`useState`) para saber en qué vista estamos (`currentView`: 'home', 'groups', 'matches') y qué torneo estamos viendo (`tournament`: 'libertadores', 'sudamericana', 'uru.1'). Dependiendo de estas variables, muestra el componente correspondiente.

### `src/components/Home.tsx` (Pantalla de Inicio)
- **Propósito:** Es el menú principal donde el usuario elige el torneo y la sección que quiere ver.
- **Funcionamiento:** Muestra tarjetas grandes (Cards) para la Copa Libertadores, Sudamericana y Liga Uruguaya. Al hacer clic en los botones de "Posiciones" o "Partidos", le avisa a `App.tsx` que debe cambiar la vista.

### `src/components/Groups.tsx` (Pantalla de Posiciones)
- **Propósito:** Mostrar las tablas de clasificación.
- **Funcionamiento:** Al cargar, recibe el torneo seleccionado. Inmediatamente llama a `getStandings()` (de `api.ts`). Mientras espera, muestra un icono de carga. Cuando recibe los datos, dibuja una o varias tablas (dependiendo si es formato de grupos o liga de todos contra todos), extrayendo puntos, goles a favor, en contra, etc.

### `src/components/Matches.tsx` (Pantalla de Partidos)
- **Propósito:** Mostrar el fixture (partidos jugados y próximos).
- **Funcionamiento:** Llama a `getMatches()` (de `api.ts`). Luego, filtra los partidos en dos pestañas: "Jugados" (estado `post` o `in`) y "Próximos" (estado `pre`). Además, incluye botones para filtrar por equipos específicos si se está viendo la Liga Uruguaya.

### `src/lib/api.ts` (El Motor de Datos)
- **Propósito:** Centralizar todas las llamadas a la API externa.
- **Funcionamiento:** Contiene las interfaces (definiciones de tipos) que explican cómo vienen estructurados los datos de ESPN. Exporta dos funciones principales: `getStandings` y `getMatches`. Estas funciones usan `fetch` para hacer peticiones HTTP, convierten la respuesta a JSON y la devuelven a los componentes.

### `src/index.css` (Estilos)
- **Propósito:** Contiene la configuración de Tailwind CSS.
- **Funcionamiento:** En lugar de escribir CSS tradicional, la aplicación usa clases utilitarias de Tailwind directamente en el HTML (ej. `className="flex items-center text-white"`). Este archivo solo importa las bases de Tailwind.

---

## 4. Resumen del Ciclo de Vida de un Componente (Ej. Grupos)
1. El usuario hace clic en "Posiciones" en el Home.
2. `App.tsx` cambia su estado interno y renderiza `<Groups tournament="libertadores" />`.
3. `Groups.tsx` se monta en pantalla y ejecuta su `useEffect`.
4. El `useEffect` llama a `api.getStandings('libertadores')`.
5. La pantalla muestra "Cargando...".
6. La API responde con los datos.
7. `Groups.tsx` guarda los datos en su estado interno y se vuelve a dibujar, esta vez mostrando las tablas de posiciones.

*Nota: Se han añadido comentarios explicativos directamente en el código fuente de los archivos mencionados para facilitar su lectura técnica.*
