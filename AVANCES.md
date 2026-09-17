# AVANCES — Football Tracker / Potrero Talent Hub

Bitácora viva del proyecto. Cada sesión de trabajo se registra al final, con fecha, qué se hizo y por qué. Sirve para retomar contexto rápido en la próxima sesión, aunque haya pasado tiempo.

> **Nota:** este proyecto va a renombrarse de carpeta a `Potrero` una vez cerrado el trabajo actual. Cuando eso pase, anotarlo acá como entrada de bitácora (no hace falta tocar nada del código, son solo rutas de carpeta locales).

---

## 📌 Qué es este proyecto

App de scouting y seguimiento de fútbol para **Potrero Talent Hub**. Permite:
- Ver tablas de posiciones y calendarios de varios torneos (Libertadores, Sudamericana, Liga Uruguaya 1ª/2ª, Liga MX 1ª/2ª, Rusia, Chile, Perú 1ª/2ª, A-League Australia).
- Hacer scouting de una lista fija de **18 jugadores seguidos** (`src/constants/players.ts`), mostrando su próximo partido en el Home y sus estadísticas de competencia al entrar al detalle.

## 🏗 Stack técnico

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 (tokens `@theme`) + `motion` (Framer Motion) + `lucide-react` + `date-fns`/`date-fns-tz`.
- **Backend:** Express (`server.ts`) corriendo junto a Vite en modo middleware (`npm run dev` → `tsx server.ts`, puerto 3000). En producción sirve el `dist/` estático.
- **Fuentes de datos (dos, sin mezclar):**
  1. **ESPN (API pública, sin key)** — usada directo desde el frontend (`src/lib/api.ts`) para `getStandings()` y `getMatches()`. Sin pasar por el backend, para velocidad y datos "en vivo".
  2. **API-Sports v3 (de pago, con key)** — solo para el scouting de jugadores (`PlayerSearch.tsx`). Pasa siempre por el proxy `server.ts`, que:
     - cachea respuestas 24h en `cache.json` (no versionado, se regenera solo),
     - limpia campos en `0`/`null` de las estadísticas (`removeZeros`),
     - protege la `API_SPORTS_KEY` (variable de entorno, con fallback hardcodeado en `server.ts:14` — **revisar si conviene sacar ese fallback antes de producción**).

## 🎨 Identidad de marca — Sistema Potrero (ya aplicado)

Ver detalle completo en memoria `project_potrero_brand`. Resumen de lo que ya está integrado en `src/index.css` y componentes:
- Paleta: `brand-navy #001c56`, `brand-magenta #FF0198`, `brand-lime #01FF2A`, `brand-orange #FF7D2A`, `brand-dark #060c1f`.
- Tipografías: Barlow Condensed (display), Ibarra Real Nova (editorial), Helvetica Neue/Arial (body).
- Logo mark SVG (`/public/logo-mark.svg`) + favicon (`/public/favicon.svg`) en header y footer.
- Texturas houndstooth/chevron **ya están guardadas** en `/public` (`texture-houndstooth.jpg`, `texture-chevron.jpg`) — lo que en la memoria previa figuraba como pendiente, **ya está resuelto**.
- Animaciones de marca: `animate-logo-float`, `animate-live-lime`, `animate-glow-magenta`, drift de texturas.

## ⏳ Pendientes detectados (a validar con el usuario)

- [ ] **Liga de Bélgica**: el usuario la mencionó pero no existe en la app. Falta el slug de ESPN de esa liga (ej. `bel.1`), y si corresponde sumar jugador(es) seguidos de esa liga en `src/constants/players.ts`.
- [ ] `public/logo-potrero-mark.png` y `public/logo-potrero-full.png` (versión PNG oficial del logo) **no están presentes** — actualmente el header usa el SVG generado (`logo-mark.svg`). Confirmar si se van a reemplazar por los PNG oficiales o si el SVG queda como definitivo.
- [ ] `server.ts:14` tiene una API key de API-Sports hardcodeada como fallback si no hay `.env`. Antes de deploy a producción o de subir el repo a un lugar más visible, conviene quitar ese fallback y forzar el uso de variable de entorno.
- [ ] Hay una carpeta `app/applet/` con ~70 archivos `test-*.js`/`.ts` (pruebas exploratorias de la API-Sports, aparentemente de una etapa de investigación previa) y varios `test-*.js` sueltos también en la raíz del repo. No forman parte del build (`vite build` solo toma `src/`), pero ensucian el repo. Evaluar si se archivan o se borran.
- [ ] Existe `dist.rar` (3.5 MB) commiteado en la raíz junto con la carpeta `dist/` ya buildeada. Confirmar si eso debe seguir versionado o es un artefacto de entrega puntual.
- [ ] `README.md` y `metadata.json` todavía tienen texto genérico de plantilla "AI Studio" / "Copa Libertadores 2026" — desactualizados respecto al alcance real (multi-torneo + scouting + marca Potrero). Se pueden actualizar cuando se cierre esta etapa.

## 🔜 Cuando se cierre esta etapa

- [ ] Renombrar la carpeta del proyecto a `Potrero` (pendiente, lo hace el usuario manualmente).
- [ ] Actualizar `README.md` / `metadata.json` con el nombre y alcance reales.

---

## 🗓 Bitácora de sesiones

### 2026-09-17 — Fix: "Próximos Juegos" no cargaba en ningún torneo
- **Causa raíz confirmada con `curl` directo a ESPN** (no era un problema del navegador ni de una liga en particular): el scoreboard de ESPN para fútbol **no acepta rangos de fechas** (`dates=YYYYMMDD-YYYYMMDD`) — devuelve siempre `400 {"code":400,"message":"Failed to get events endpoint."}`, incluso con un rango de solo 2 días. Solo acepta **una fecha exacta por pedido** (`dates=YYYYMMDD`). `getMatches()` en `src/lib/api.ts` pedía el año completo de una sola vez, así que fallaba **en todos los torneos por igual** (Libertadores, Sudamericana, Uruguaya, Chile, Rusia, Perú, México, Australia) — no era algo específico de Uruguay/Chile/Australia/Perú, esas ligas simplemente fueron las que el usuario probó.
- **Se buscó "Liga de Bélgica"** pedida por el usuario — **no existe configurada en la app** (no está en el tipo `Tournament`, ni en `Home.tsx`, ni hay jugador seguido de ese país). Falta definir con el usuario el slug de ESPN de la liga belga y si hay que sumar jugador(es) seguidos ahí.
- **Fix aplicado** en `src/lib/api.ts` (`getMatches`): ahora pide primero el día de hoy (que además trae el `calendar` de fechas válidas de la temporada cuando el torneo es de tipo liga/todos-contra-todos), arma una ventana de ±30 días alrededor de hoy, y:
  - Para **ligas** (Uruguay, Chile, Perú, México, Rusia, Australia): usa el `calendar` de ESPN para pedir solo los días donde efectivamente hay partidos dentro de esa ventana.
  - Para **copas por fases** (Libertadores/Sudamericana, que no traen calendario plano sino fases): recorre día por día la ventana de ±30 días.
  - Pide todos esos días en paralelo (`Promise.all`) y combina/deduplica los partidos por `id`.
- **Verificado con `curl`** que fechas puntuales devuelven `200` correctamente para Libertadores, Sudamericana, Uruguaya, Chile, Rusia, Perú y Australia. `npx tsc --noEmit` pasa sin errores.
- **Confirmado por el usuario en su navegador real**: los próximos partidos ya cargan bien en todas las ligas. Fix cerrado.

### 2026-09-17 — Plan para la próxima sesión (dictado por el usuario)
- [ ] **Quitar Liga Expansión MX**: ya no hay ningún jugador seguido ahí. Sacarla de `src/components/Home.tsx` (array `tournaments`), del tipo `Tournament` en `src/App.tsx` si no se usa en otro lado, y de los filtros de equipo en `Matches.tsx`.
- [ ] **2 jugadores nuevos a evaluar**: el usuario va a pasar información de 2 jugadores sobre los que tiene dudas, para decidir si se agregan a `src/constants/players.ts` o no.
- [ ] **Revisar vigencia de Copa Sudamericana**: confirmar si el torneo sigue activo. Si no, quitarla o hacerla oculta (misma lógica que Liga Expansión MX).
- [ ] **Revisar vigencia de Copa Libertadores**: mismo chequeo y mismo tratamiento que Sudamericana.
- [ ] **Revisar horarios/timezones del resto de las ligas** poco a poco. El problema de husos horarios que había con México debería resolverse solo al quitar Liga Expansión MX (era el único caso problemático detectado). Repasar Rusia, Chile, Perú, Australia, Uruguay para confirmar que la hora local + hora Uruguay se ven bien.
- [x] **Subir el proyecto a GitHub**. Confirmado el repo (`https://github.com/GerardoMexDev/potrero_talent_hub.git`), se hizo commit + push del fix de `api.ts` y este `AVANCES.md` a `master` (commit `5ab343e`).
- [x] **Rama por defecto del repo**: GitHub tenía `main` como default (solo con el commit inicial vacío, generado al crear el repo), mientras todo el proyecto real vivía en `master`. Se cambió el default branch a `master` desde la configuración del repo — ya no debería aparecer el aviso de "Compare & pull request". La rama `main` queda sin uso (se puede borrar cuando el usuario lo pida).

### 2026-09-17 — Revisión completa de contexto + creación de este archivo
- Se repasó toda la estructura del proyecto: `App.tsx`, `server.ts`, `src/lib/api.ts`, `src/components/*`, `src/constants/players.ts`, `src/index.css`, `public/`, docs existentes (`README.md`, `DOCUMENTATION.md`, `Documentacion_Arquitectura.md`) y la memoria de la integración de marca Potrero.
- Se confirmó que las texturas de marca (`texture-houndstooth.jpg`, `texture-chevron.jpg`) que antes figuraban como pendientes **ya están cargadas** en `/public`.
- Se detectaron los pendientes listados arriba (logos PNG oficiales, key hardcodeada, archivos de test sueltos, `dist.rar`, docs desactualizados).
- Se creó `AVANCES.md` para llevar registro de avances de ahora en adelante, de cara al renombre de la carpeta del proyecto a `Potrero`.
