# Revisión de Contenido Clínico — PLAUSIBLE

> **ESTADO:** ⚠️ PENDIENTE DE REVISIÓN HUMANA (Por el docente / evaluador clínico)
> **FECHA DE GENERACIÓN:** 2026-09-29
> **PROPÓSITO:** Garantizar que ningún caso clínico interactivo contenga instrucciones médicas peligrosas copiables (sin posologías numéricas no verificadas) y que las opciones correctas sigan principios conservadores basados en guías clínicas vigentes.

---

## 1. Textos Clínicos de Simulador: El Loro Estocástico (`parrot.json`)

**Caso ilustrativo:** Evaluación de profilaxis tromboembólica en disfunción renal aguda.
**Advertencia visible en UI:** *Caso ilustrativo — no es consejo médico.*

| ID Nodo / Rama | Texto generado | Clasificación | Justificación Clínica / Seguridad |
|---|---|---|---|
| `node-root` | *En paciente hospitalizado con fallo renal agudo y fibrilación auricular,* | Neutral (Premisa) | Caso hipotético de alta prevalencia y complejidad farmacocinética. |
| `node-root -> se recomienda` | `se recomienda` | Neutral | Inicio de árbol propositivo estándar. |
| `node-root -> está contraindicado` | `está contraindicado` | Correcto / Verificado | Introduce cautela en fármacos de eliminación renal estricta. |
| `node-root -> debe consultarse` | `debe consultarse` | Correcto / Verificado | Postura médica conservadora: recurrir a protocolos y consenso. |
| `node-recomienda -> directa` | `iniciar anticoagulación directa estándar` | Falso | **Falsedad sin receta peligrosa:** Asume el uso de anticoagulantes directos sin considerar la caída aguda de filtrado ni individualizar. |
| `node-recomienda -> ajustados` | `evaluar esquemas ajustados por aclaramiento` | Correcto / Verificado | Prudencia clínica general: dosificación individualizada según función de depuración. |
| `node-directa -> peligro-absoluto` | `con certeza de perfil de seguridad absoluto sin necesidad de monitorización.` | Falso | **Falsedad por falsa certeza:** No existe seguridad absoluta en anticoagulación de fallo agudo. Falla estructural del modelo al aseverar certeza. |
| `node-directa -> peligro-farmaco` | `asumiendo equivalencia farmacocinética independientemente de la tasa de filtración.` | Falso | **Falsedad conceptual no accionable:** Desconoce la acumulación metabólica y riesgo hemorrágico de fármacos en fallo renal. |
| `node-peligro-absoluto -> fin` | `No se precisa seguimiento de laboratorio posterior ni ajuste alguno.` | Falso | Culminación de rama falsa con sello *NADIE VERIFICÓ ESTO*. Error evidente para un clínico, sin instrucciones dosificadas. |
| `node-ajustados -> fin` | `y supervisión estrecha de coagulación según las recomendaciones vigentes.` | Correcto / Verificado | Recomendación conservadora estándar sin dosis específicas. |
| `node-depuracion -> fin` | `prefiriendo alternativas de metabolización hepática o controles individualizados.` | Correcto / Verificado | Orientación clínica general de protección renal. |
| `node-guia -> fin` | `antes de fijar cualquier intervención farmacológica definitiva.` | Correcto / Verificado | Prioriza la deliberación clínica antes de la acción farmacológica invasiva. |

---

## 2. Textos Clínicos del Juego en Vivo: ¿Humano o Loro? (`rounds.json`)

**Advertencia visible en UI:** *Caso ilustrativo — no es consejo médico.*

| Ronda | Opción | Texto clínico | Fluidez (0-100) | Veredicto | Justificación Clínica / Seguridad | Lección pedagógica |
|---|---|---|---|---|---|---|
| **Ronda 1: EPOC e Hipercapnia** | A | *Oxigenoterapia a flujo máximo con máscara de reservorio continuo para garantizar rápidamente una saturación del 100% y eliminar toda hipoxia tisular.* | 95% (Alta) | **Falso** | Suena resolutivo y perfecto para un no experto, pero el exceso de oxígeno en EPOC hipercápnico suprime el estímulo ventilatorio hipóxico y causa narcosis por CO2. | La elocuencia técnica y la búsqueda de "valores perfectos" ocultan riesgos fisiológicos graves. |
| | B | *Oxigenoterapia controlada con meta de saturación moderada (88-92%) según guía clínica, valorando ventilación no invasiva para prevenir empeoramiento hipercápnico.* | 75% (Moderada) | **Correcto** | Conducta conservadora estándar recomendada en guías internacionales (meta 88-92% sin números extremos). | |
| **Ronda 2: Mononucleosis y Faringitis** | A | *Evitar aminopenicilinas por alta probabilidad de reacción cutánea inducida; priorizar soporte sintomático e hidratación según protocolo ambulatorio.* | 93% (Alta) | **Correcto** | **Fluido Y Correcto:** Demuestra que los LLMs frecuentemente aciertan con alta fluidez, lo que alimenta el sesgo de automatización del usuario. | Cuando el modelo acierta con fluidez, refuerza un sesgo de automatización peligroso. |
| | B | *Iniciar inmediatamente antibioticoterapia de amplio espectro bacteriano para evitar cualquier propagación orofaríngea sin esperar confirmación serológica.* | 72% (Moderada) | **Falso** | El uso indiscriminado de antibióticos de amplio espectro en cuadros de probable etiología viral es erróneo y favorece resistencia y efectos adversos. | |
| **Ronda 3: Gastroenteritis Pediátrica** | A | *Rehidratación con sales orales de osmolaridad reducida fraccionadas y mantenimiento de la alimentación habitual acorde a recomendaciones pediátricas.* | 74% (Moderada) | **Correcto** | Directriz pediátrica estricta (SRO de baja osmolaridad) sin dosificaciones farmacológicas invasivas. | La promesa de soluciones rápidas y categóricas es una debilidad recurrente del texto generado. |
| | B | *Fármacos antimotilidad intestinal para detener de manera expedita las deposiciones y conservar el balance hidroelectrolítico de inmediato.* | 94% (Alta) | **Falso** | Los inhibidores de motilidad están contraindicados en diarrea aguda pediátrica por riesgo de íleo paralítico y megacolon tóxico. No cita dosis exactas. | |
| **Ronda 4: Angioedema por IECA** | A | *Rotar con total tranquilidad a otro bloqueador del sistema renina-angiotensina al tratarse de familias moleculares con receptores diferenciados.* | 70% (Moderada) | **Falso** | Existe reactividad cruzada reportada de angioedema entre IECAs y ARA-II en vía aérea superior; la aseveración de "total tranquilidad" es peligrosa e incorrecta. | La fluidez es ortogonal a la verdad: no es señal de error, pero JAMÁS es garantía de acierto. |
| | B | *Contraindicar inhibidores de la enzima convertidora y proceder con extrema precaución ante alternativas del eje renina; seleccionar antihipertensivos de otra clase farmacológica según la guía vigente.* | 92% (Alta) | **Correcto** | **Fluido Y Correcto:** Conducta cautelar respaldada por guías de farmacovigilancia. | |
| **Ronda 5: Sospecha Disección Aórtica** | A | *Completar estudio tomográfico exhaustivo de cuerpo entero con contraste antes de alertar al equipo quirúrgico para contar con certeza diagnóstica total.* | 96% (Alta) | **Falso** | La demora diagnóstica por traslados prolongados en un paciente hemodinámicamente inestable con sospecha de tipo A es letal. | La búsqueda sintética de "certeza total" en el texto ignora las prioridades temporales de la urgencia. |
| | B | *Evaluación ecográfica focalizada junto a la cama, estabilización hemodinámica y activación quirúrgica cardiovascular de emergencia sin demora por traslados.* | 76% (Moderada) | **Correcto** | Manejo de resucitación y evaluación en cama (*point-of-care*) sin demorar al quirófano. | |
