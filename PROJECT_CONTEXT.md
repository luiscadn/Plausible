# PLAUSIBLE — Contexto del proyecto (fuente de verdad)

> "Sonar bien no es estar bien."
> Demo web interactiva + presentación para el paper
> "Retos y limitaciones de los LLM en la práctica clínica"
> (Jose Miguel Armas · Luis Felipe Cadena — Universidad Icesi).

## 1. Misión
Construir un sitio web que ES la presentación: 9 secciones a pantalla completa
(una por diapositiva), con simulaciones interactivas incrustadas y un juego en
vivo donde la audiencia vota desde el celular. Se presenta MAÑANA ante un jurado
universitario. Prioridades, en este orden:
1. Que funcione sin fallar en vivo (robustez > features).
2. Que sea fluido (60 fps, carga rápida, funciona en celulares de gama media).
3. Que se vea espectacular.
4. Que comunique fielmente la tesis del paper.

## 2. Tesis del paper (no inventar contenido fuera de esto)
- La fluidez lingüística de los LLM genera confianza, pero fluidez ≠ fiabilidad.
- Las "alucinaciones" son en realidad indiferencia algorítmica hacia la verdad
  (Hicks et al.). El término antropomorfiza y alimenta la sobreconfianza.
- Los LLM predicen la palabra más probable; son "loros estocásticos" (Bender et al.).
  La falla es estructural, no se corrige con más datos.
- Reproducen sesgos de sus datos y son opacos.
- Soluciones evaluadas:
  - LLM en capas: mejora incremental, pero propaga errores y aumenta dependencia.
  - XAI: explica patrones estadísticos, no razonamiento.
  - IA neurosimbólica: prometedora, difícil de escalar y rígida ante ambigüedad clínica.
- Falta de reproducibilidad: misma pregunta, respuestas distintas.
- Desregulación por cabildeo → el médico carga con verificar todo ("ética delegada").
- Conclusión: uso complementario (documentación, resúmenes, búsqueda preliminar),
  nunca diagnóstico autónomo. Interfaces con puntajes de confianza, conexión a bases
  médicas verificadas, validación clínica rigurosa. Responsabilidad compartida:
  desarrolladores, instituciones de salud, legisladores.
- Referencias: [1] Bélisle-Pipon, Front. Med. 2024. [2] Lu et al., JAMIA 2024.

## 3. Mapa de secciones
| # | Título | Contenido interactivo |
|---|--------|-----------------------|
| 01 | Retos y limitaciones de los LLM en la práctica clínica | Portada animada + autores |
| 02 | Fluidez ≠ fiabilidad | Juego en vivo "¿Humano o Loro?" (QR + resultados en tiempo real) |
| 03 | Las "alucinaciones" son indiferencia a la verdad | Contraste "Lo que garantiza: texto coherente / Lo que no: veracidad clínica" |
| 04 | Los LLM predicen palabras, no razonan | SIM: El Loro Estocástico |
| 05 | Sesgos y opacidad persisten | SIM: Torre de Validación + tarjetas de las 3 soluciones |
| 06 | La desregulación traslada el riesgo al médico | Contador visual de carga de verificación (animación simple) |
| 07 | Apoyar, no reemplazar | Tabla Sí / No animada |
| 08 | Sin validación clínica no hay uso seguro | 5 requisitos + responsabilidad compartida (1-2-3) |
| 09 | ¿Preguntas? | Referencias + QR al sitio |

## 4. Reglas de contenido (no negociables)
- Todo caso clínico es FICTICIO y lleva la etiqueta visible "Caso ilustrativo".
- Ninguna respuesta del demo puede presentarse como consejo médico real.
- NO se llama a ningún LLM en vivo. Todo el contenido interactivo sale de JSON
  predefinidos y validados. (Esto es coherente con la tesis: controlamos cada salida.)
- Idioma de la UI: español. Tono: académico, claro, contundente.

## 5. Arquitectura
Monorepo con pnpm workspaces:

Arquitectura del Proyecto: Monorepo

Este documento describe la estructura de directorios, responsabilidades de cada módulo y los entornos de despliegue para guiar el desarrollo y contexto de agentes de IA.

1. Árbol de Directorios

plausible/
├── PROJECT_CONTEXT.md
├── apps/
│   ├── web/                     # Frontend principal (Next.js 15 App Router + TS) → Despliegue: Vercel
│   │   ├── app/                 # Rutas de la aplicación (Next.js App Router)
│   │   │   ├── page.tsx         # Presentación interactiva principal (9 secciones)
│   │   │   ├── play/
│   │   │   │   └── page.tsx     # Vista optimizada para móvil (jugadores)
│   │   │   └── stage/
│   │   │       └── page.tsx     # Panel del presentador (controles en vivo + resultados)
│   │   ├── components/          # Componentes modulares de interfaz
│   │   │   ├── deck/            # Shell de diapositivas, navegación y secciones
│   │   │   ├── sims/            # Simuladores interactivos
│   │   │   │   ├── parrot/      # Simulación: Loro Estocástico
│   │   │   │   └── tower/       # Simulación: Torre de Validación
│   │   │   ├── live/            # Componentes cliente para comunicación en tiempo real
│   │   │   └── ui/              # Componentes base / primitivas de UI compartidas
│   │   └── e2e/                 # Pruebas End-to-End con Playwright
│   └── live/                    # Servidor WebSocket en tiempo real (Node.js 20 + Socket.IO + TS) → Despliegue: Railway
└── packages/
    └── content/                 # Paquete compartido: Esquemas Zod, contratos TypeScript y data JSON


Stack: Next.js 15, React 19, TypeScript strict, Tailwind CSS v4, Motion (framer-motion),
Canvas 2D para simulaciones, Zod, Socket.IO, Playwright.
Prohibido: librerías de UI pesadas, three.js, llamadas a APIs de IA, localStorage
para estado crítico.

## 6. Contratos de datos (packages/content)
- `parrot.json`: árbol de generación. Cada nodo:
  `{ id, token, candidates: [{ token, p, next, truth: "ok"|"false"|"neutral" }] }`
  Probabilidades de cada nodo suman 1. Al menos 1 ruta de alta probabilidad
  termina en una afirmación falsa pero fluida.
- `rounds.json`: rondas del juego:
  `{ id, prompt, a: { text, fluency }, b: { text, fluency }, correct: "a"|"b", explanation }`
  En la mayoría de rondas la respuesta FALSA es la más fluida.
- `tower.defaults.json`: `{ layers, errorRate, correlation, particles, seed }`
- Eventos Socket.IO (tipados en `packages/content/src/live.ts`):
  - cliente → servidor: `join {room}`, `vote {room, roundId, choice}`
  - presentador → servidor (con `ADMIN_KEY`): `round:start`, `round:reveal`, `round:next`
  - servidor → todos: `state {round, phase, counts, participants}`

## 7. Sistema de diseño
- Concepto: "cuaderno de laboratorio" + editorial científico. Claro, preciso,
  con la exactitud de un instrumento de medición (evolución del concepto
  original "monitor clínico nocturno": misma estructura editorial —
  asimetría, hairlines, marcas de figura FIG. N, watermarks de número de
  sección — sobre una piel clara en vez de oscura).
- Tokens (verificados AA sobre `--bg`, ver `apps/web/app/globals.css`):
  - `--bg #FAFAF7` (papel), `--surface #FFFFFF`, `--line #E4E4DE`
  - `--text #14161A`, `--muted #5E646C` (5.71:1)
  - `--truth #0F766E` (teal profundo = verificado, 5.23:1)
  - `--false #C2410C` (coral/rojo profundo = falso pero plausible, 4.95:1)
  - `--uncertain #B45309` (ámbar oscuro = incertidumbre, 4.80:1)
  - Todo lo que no tiene significado semántico va en escala de grises.
- Tipografía (next/font): Space Grotesk (títulos), Inter (texto),
  JetBrains Mono (tokens, probabilidades, números, etiquetas de figura).
- Motivos: línea de ECG como separador, retícula de puntos muy tenue (grano de
  papel científico), números de sección como marca de agua, notas al margen
  ("Nota: …") para ideas secundarias.
- Movimiento (principios de Emil Kowalski, ver `.claude/skills/emil-design-eng/`):
  solo `transform`/`opacity`; `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para
  entradas, nunca `ease-in`; microinteracciones ≤250 ms, transiciones de
  sección ≤400 ms; `:active` en controles usa `scale(0.97)`; nada de bounce ni
  easing elástico. Respetar `prefers-reduced-motion` (colapsa a solo opacidad).

## 8. Presupuestos de rendimiento
- JS inicial de `/` < 200 KB gzip. Simulaciones con `next/dynamic` y `ssr:false`,
  cargadas cuando su sección se acerca al viewport.
- Simulaciones a 60 fps en laptop y ≥ 45 fps en celular gama media.
  Torre: máximo 1500 partículas en móvil, RNG con semilla (reproducible).
- `/play` usable en 390×844, botones ≥ 48 px, carga < 1.5 s en 4G.
- Lighthouse Performance ≥ 90 en `/` y `/play`.

## 9. Resiliencia en vivo y controles
- Si el servidor de Railway no responde en 3 s, `/stage` y la sección 02 pasan a
  "modo ensayo": votos simulados animados, con un indicador discreto.
- Reconexión automática de Socket.IO. Estado del juego vive en el servidor
  (en memoria, una sola instancia).
- Navegación del Deck: scroll-snap vertical estricto (1 sección = 100dvh).
  Hash en URL (`#04`) reactivo y sincronizado.
- Propiedad del teclado:
  - El deck es dueño exclusivo de: ←/→, ↑/↓, Espacio, PageUp/PageDown, tecla `F` (pantalla completa), números `1`–`9`.
  - Dentro de una sección, un componente interactivo puede capturar teclas solo mientras el foco está en un control (slider, input) o invocando `onCaptureKeys(true)`; el deck ignora la navegación mientras la captura esté activa.
  - Sliders: flechas mueven el slider solo con foco; tecla Escape devuelve el foco al deck.
  - Controles del presentador del juego usan teclas dedicadas que el deck no escucha:
    `S` = iniciar ronda, `R` = revelar, `N` = siguiente ronda, `0` = reset.
- Seguridad del presentador:
  - `ADMIN_KEY` NUNCA en variables `NEXT_PUBLIC_*` ni en el bundle del cliente.
  - El presentador abre `/stage?key=<ADMIN_KEY>` o `/?key=<ADMIN_KEY>#02`; el cliente lo almacena únicamente en memoria y lo adjunta en los payloads de control. Sin key, `/stage` opera en solo lectura.
  - El servidor valida la key con comparación de tiempo constante (`crypto.timingSafeEqual`) y rechaza acciones no autorizadas.
  - Un voto por socket por ronda; se rechazan votos fuera de la fase `voting`.

## 10. Definition of Done (global)
- `pnpm build` y `pnpm typecheck` sin errores; ESLint limpio.
- Suite Playwright en verde (ver sección 11).
- Desplegado: web en Vercel, live en Railway, variables configuradas, `/health` ok.
- Probado con ≥ 3 clientes simultáneos votando.

## 11. Gates de validación Playwright
1. Deck: carga, navega 01→09 con teclado, hash funciona, sin errores de consola.
2. Loro: al elegir candidatos cambia la frase; el slider de temperatura cambia
   la distribución; la ruta falsa muestra el sello de "no verificado".
3. Torre: el canvas renderiza; mover sliders cambia la precisión reportada;
   medir fps con `requestAnimationFrame` durante 3 s ≥ 50.
4. Juego: 3 contextos de navegador (2 celulares + stage) → votan → stage actualiza
   conteos en < 500 ms → reveal muestra la correcta.
5. Resiliencia: con el servidor apagado, stage entra en modo ensayo sin romperse.
6. Móvil: `/play` en viewport 390×844 sin scroll horizontal, capturas guardadas.
7. Accesibilidad básica: contraste AA en texto, foco visible, `aria-label` en controles.
