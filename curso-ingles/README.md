# English Immersion A2 → B2 · 90 días

Curso completo de inglés en formato aplicación web. **Una hora al día, noventa días, tres niveles**
(un nivel por mes), con audio integrado, repetición espaciada y evaluación continua.

👉 **Abrir el curso:** [`index.html`](index.html) — publicado en
<https://danielcantinortiz-svg.github.io/riscoarquitectos/curso-ingles/>

No requiere instalación, servidor, cuenta ni conexión permanente: es HTML, CSS y JavaScript sin
dependencias externas. El progreso se guarda en el navegador y puede exportarse a un archivo JSON.

## El método

Reproduce, comprimida en 60 minutos diarios, la secuencia con la que se adquiere una lengua materna
—escucha antes que lectura, imitación antes que análisis, patrón antes que regla— acelerada con las
tres herramientas que un adulto sí puede usar: shadowing, repetición espaciada y feedback inmediato.

| # | Bloque | Min | Función cognitiva |
|---|--------|-----|-------------------|
| 1 | Calentamiento y repaso (SRS) | 6 | Recuperación activa antes de añadir material nuevo |
| 2 | Input: escucha a ciegas | 8 | Segmentación fonológica sin contaminación ortográfica |
| 3 | Texto y vocabulario | 10 | Anclaje forma–sonido–significado |
| 4 | Shadowing y pronunciación | 10 | Reentrenamiento motor: ritmo, formas débiles, linking |
| 5 | Gramática inductiva | 8 | Extracción del patrón antes de leer la regla |
| 6 | Producción: hablar y escribir | 10 | Hipótesis de output: producir revela lo que falta |
| 7 | Test del día | 8 | Efecto de examen: evaluar consolida más que repasar |

## Contenido

- **90 días** de contenido original: A2 (mes 1), B1 (mes 2), B2 (mes 3).
- **900 palabras y expresiones** con traducción, ejemplo y audio, todas en el SRS.
- **90 diálogos** bilingües de 10 líneas, con audio y comprensión auditiva.
- **90 puntos de gramática** presentados de forma inductiva, con ejercicios.
- **720 ítems de test** de opción múltiple, más dictados y traducción inversa generados dinámicamente.
- **3 exámenes de nivel** de 40 ítems (gramática, léxico, listening y traducción).

## Evaluación

- **Test diario** (10 ítems): se necesita **≥ 70 %** para completar el día y desbloquear el siguiente.
- **Repaso semanal** los días 7, 14, 21 y 28 de cada mes: el test se amplía con la semana anterior.
- **Examen de nivel** al terminar cada mes: 40 ítems, **≥ 75 % = APTO**.
- **SRS Leitner de 6 cajas** (1, 2, 4, 8, 16 y 30 sesiones).

## Audio y voz

- La síntesis de voz usa la **Web Speech API** del navegador: voz, velocidad y reproducción
  automática son configurables desde el botón «Audio».
- El botón 🎤 del bloque de shadowing usa reconocimiento de voz para comparar tu pronunciación
  con la frase modelo. Requiere Chrome o Edge; en el resto de navegadores se degrada sin romper nada.
- Recomendado: Chrome o Edge de escritorio, con auriculares.

## Estructura de archivos

```
curso-ingles/
├── index.html      Estructura de la aplicación
├── styles.css      Estilos (tema claro y oscuro automáticos)
├── app.js          Motor: rutas, audio, SRS, tests y exámenes
└── data/
    ├── curso.js    Método, bloques y objetivos de cada nivel
    ├── a2.js       Mes 1 · 30 días
    ├── b1.js       Mes 2 · 30 días
    └── b2.js       Mes 3 · 30 días
```

Cada día es un objeto con la misma forma: `tema`, `objetivo`, `chunks`, `vocab`, `dial`, `esc`
(comprensión oral), `gram` (regla + ejercicios), `prod` (hablar, escribir, modelo, traducción)
y `test`. Añadir o modificar contenido no requiere tocar el motor.
