# PLAUSIBLE

> *"Sonar bien no es estar bien."*  
> Demo interactiva y presentación para el paper académico:  
> **"Retos y limitaciones de los LLM en la práctica clínica"**  
> *(Jose Miguel Armas · Luis Felipe Cadena — Universidad Icesi)*

---

## 🎯 Sobre el Proyecto
Plausible es una plataforma web cinematográfica que sustituye las diapositivas tradicionales de exposición médica por una experiencia interactiva en vivo con:
- **Slide Deck (9 secciones a 100dvh):** Navegación fluida por teclado (flechas, espacio, números `1`–`9`, tecla `F` para fullscreen) y diseño con monitor clínico y línea ECG.
- **Juego en Vivo "¿Humano o Loro?" (`/stage` y `/play`):** Dinámica multijugador en tiempo real con WebSocket. La audiencia escanea un QR desde sus celulares y vota entre conductas médicas. Demuestra que la respuesta más elocuente y autoritaria suele ser una alucinación peligrosa generada por LLMs.
- **Simulador "El Loro Estocástico":** Visualizador probabilístico token por token con control de Temperatura Softmax y sello de alerta *NADIE VERIFICÓ ESTO*.
- **Simulador "Torre Monte Carlo":** Canvas 2D a 60 FPS demostrando matemáticamente que la correlación de error en capas de LLM propaga sesgos en vez de eliminarlos.
- **Resiliencia Total:** Modo Ensayo automático si no hay conexión de red disponible en el auditorio.

---

## 🚀 Ejecución Local

### Prerrequisitos
- Node.js 20+
- pnpm 11+

### Instalación
```bash
pnpm install
```

### Iniciar Desarrollo
```bash
# Iniciar frontend y servidor WebSocket concurrentemente:
pnpm dev

# O individualmente:
pnpm dev:web   # http://localhost:3000
pnpm dev:live  # http://localhost:4000
```

---

## 🕹️ Accesos en Vivo

| Rol | Ruta | Descripción |
|---|---|---|
| **Auditorio / Proyector** | `http://localhost:3000` | Presentación principal completa |
| **Presentador (Controles)** | `http://localhost:3000/stage?key=plausible-admin-2026` | Panel de control en vivo (S: iniciar, R: revelar, N: siguiente, 0: reset) |
| **Audiencia Móvil** | `http://localhost:3000/play` | Pantalla de votación rápida para celulares |
| **Health Check** | `http://localhost:4000/health` | Estado del backend WebSocket |

---

## 🧪 Pruebas y Validación (Playwright)
```bash
# Ejecutar suite e2e completa (Desktop 1080p + Mobile 390x844):
pnpm test:e2e

# Ejecutar prueba de carga con 60 clientes concurrentes:
pnpm --filter @plausible/live exec tsx ../../scripts/load-test.ts
```

---

## 📄 Licencia y Marco Académico
Trabajo desarrollado para la Facultad de Ciencias de la Salud e Ingeniería — Universidad Icesi, Cali, Colombia (2026).  
*Todo caso clínico incluido en esta plataforma es de carácter ilustrativo y no constituye consejo médico real.*
