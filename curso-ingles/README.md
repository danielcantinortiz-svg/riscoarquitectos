# English Immersion · Módulo 0 + A2 → C1 · 150 días

Curso completo de inglés en formato aplicación web. **Ciento cincuenta días**: un **Módulo 0** que
parte de cero (A0 → A1+) y el itinerario de **cuatro niveles** (A2, B1, B2 y C1), con audio integrado,
mnemotecnia, repetición espaciada, evaluación oral y escrita automática y exámenes con formato
Cambridge. Una hora al día en cuatro meses, o dos horas al día en dos.

Los dos itinerarios son **independientes**: empezar el Módulo 0 no bloquea ni altera el avance en el
camino A2 → C1, y se pueden alternar. Internamente los días del Módulo 0 se numeran 121-150 —el
módulo se añadió después— precisamente para que la numeración de los días ya completados no se mueva;
en pantalla se muestran como «Módulo 0 · Día 1…30».

👉 **Abrir el curso:** [`index.html`](index.html) — publicado en
<https://danielcantinortiz-svg.github.io/riscoarquitectos/curso-ingles/>

No requiere instalación, servidor, cuenta ni conexión permanente: es HTML, CSS y JavaScript sin
dependencias externas. El progreso se guarda en el navegador y puede exportarse a un archivo JSON.

## Un solo archivo

```
python3 build.py            # genera curso-ingles.html
python3 build.py destino.html
```

Empaqueta estilos, datos y motor dentro de un único HTML de unos 875 KB, sin dependencias. Se puede
abrir con doble clic o subir suelto a cualquier hosting. Desde `file://` el navegador lo trata como
contexto seguro, así que el micrófono y la síntesis de voz siguen funcionando —a diferencia de lo que
ocurre dentro de visores que ejecutan la página en un iframe sin permiso de micrófono.

El progreso se guarda por dirección de origen, de modo que cada copia lleva el suyo. Para llevártelo
de una a otra, usa **Trasladar progreso a otra dirección** en el pie de página.

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

- **150 días** de contenido original: Módulo 0 (desde cero), A2 (mes 1), B1 (mes 2), B2 (mes 3), C1 (mes 4).
- **1 500 palabras y expresiones** con traducción, ejemplo, audio y ganchos mnemotécnicos.
- **150 diálogos** bilingües de 10 líneas, con audio y comprensión auditiva.
- **150 puntos de gramática** presentados de forma inductiva, con ejercicios.
- **1 200 ítems de test** de opción múltiple, más dictados y traducción inversa generados dinámicamente.
- **Banco Cambridge**: open cloze, word formation y key word transformation para los cuatro niveles;
  el Módulo 0 tiene open cloze y word formation básicos, sin key word transformation (no existe a
  ese nivel), sustituida por una parte de vocabulario del módulo.
- **5 exámenes de nivel** de 40 ítems con la estructura del *Reading & Use of English*.
- **4 simulacros completos** con el formato del examen oficial de cada nivel (A2 Key, B1 Preliminary,
  B2 First, C1 Advanced): comprensión lectora larga, gapped text, multiple matching, listening,
  writing con extensión medida y speaking en sus partes reales.
- **25 anexos profesionales** de arquitectura y negocios (300 términos, 125 frases de uso real y
  125 ítems de test), en los días de repaso 7, 14, 21 y 28 y en el cierre de cada mes. Los cinco del
  Módulo 0 cubren inglés laboral de supervivencia: presentarse, la oficina, números y dinero, el
  teléfono y el primer correo profesional.

## Módulo 0 · desde cero (A0 → A1+)

Treinta días con la misma metodología de siete bloques, pensados para quien parte de cero o quiere
reconstruir la base. Progresión: sonidos y saludos · *to be* · números y edad · artículos · plurales ·
*have got* · presente simple (afirmativo, tercera persona, negativo, interrogativo) · la hora y las
preposiciones de tiempo · rutina y secuenciadores · *can* · *there is/are* · preposiciones de lugar ·
adjetivos · *like* + *-ing* · presente continuo · *was/were* · pasado regular · diez irregulares
esenciales · preguntas y negativas en pasado · *going to* · comparativos · conectores. Cierra con un
día de consolidación que deja lista la entrada al mes 1.

## Gimnasio · ejercicios de asociación

Series de uno a tres minutos para lo que no se aprende leyendo. Cuatro formatos, cada uno con una
función distinta:

| Juego | Qué entrena | Contenido |
|---|---|---|
| **Parejas contrarreloj** | La asociación bruta, con presión de tiempo | Derivadas, conectores, adjetivos y sus contrarios, expresiones coloquiales |

En las parejas, al pulsar una palabra inglesa **se pronuncia y aparece debajo qué significa**, sin salir de
la aplicación: se oyen las doce mientras se juega y se resuelve cualquier duda sobre la marcha. Al terminar
la ronda se listan las doce parejas juntas, con el mismo comportamiento, que es el momento natural de
repasarlas. La misma pulsación funciona en la tabla de palabras derivadas.

**La traducción, a la vista y con interruptor.** Antes había que pulsar cada palabra, de una en una, para ver
qué significaba, y nada lo indicaba: en la práctica la traducción no aparecía. Ahora la lleva debajo **cada
palabra inglesa de las tablas** —derivadas, raíces, el resumen de las doce parejas— y el interruptor «Ver la
traducción al español» la enciende y la apaga **en todo el curso** a la vez, guardando la elección. Dentro de
las partidas de emparejar sigue apareciendo solo al pulsar: si estuviera a la vista, emparejar dejaría de tener
mérito.

El diccionario de apoyo (`data/es.js`) tiene 615 entradas y cubre por completo el vocabulario del gimnasio
y de las tablas de derivadas y de familias —raíces, derivadas, las 220 formas de las 51 familias, adjetivos y
conectores—, comprobado con un test que falla si aparece una palabra sin traducción. La columna «Qué es» de la
tabla de derivadas está también en español (*adjetivo*, *sustantivo (persona)*, *adverbio*), que es lo que
necesita quien está aprendiendo justamente esas palabras. Distingue los pares que más se confunden: *boring* es «aburrido (la
cosa)» y *bored* «aburrido (la persona)»; *economic* es «de la economía» y *economical* «que ahorra».
Para las frases de ejemplo completas, que un diccionario de palabras sueltas no puede cubrir, se mantiene
el enlace al traductor.
| **Ordena la frase** | El orden rígido del inglés, que el español coloca al revés | Cinco reglas de orden + adjetivos encadenados |
| **¿Cuál encaja?** | El criterio de elección, con el *por qué* de cada respuesta | Conectores, preposiciones, much/many, usos UK / US |
| **Velocidad · 60 s** | El automatismo: reconocer sin traducir | Mezcla de todo lo anterior |

El panel de arriba señala el punto más flojo **a partir de los fallos reales registrados**, no de una
suposición, y recomienda por dónde empezar. En el Módulo 0 el gimnasio entra en la propia sesión: el
bloque 1 de los días de preposiciones, adjetivos, conectores, orden de palabras y comparativos abre
directamente el ejercicio que toca, y los días de repaso proponen la serie de velocidad.

### Huecos del Módulo 0 que cubre

Auditando el contenido salieron cuatro temas con cobertura cero que son error clásico del
hispanohablante, y el gimnasio los añade: **orden de palabras** (el sujeto nunca se omite, el
adjetivo va delante), **genitivo sajón** (*my brother's office*, no *the office of my brother*),
**posición de los adverbios de frecuencia** (*I always work*, no *I work always*) y el contraste
**much / many**.

### Comprensión lectora

Seis herramientas, una por cada destreza que compone la comprensión lectora, sobre **ocho textos graduados de
A2 a C1** con su traducción completa plegada —un anuncio de alquiler, un correo de cliente, un informe de
visita de obra, dos artículos, dos ensayos y un texto científico divulgativo—. La premisa: leer para hacerse
una idea y leer para encontrar un dato son operaciones **opuestas**, y entrenarlas juntas produce lo peor de
las dos, que es leer entero y despacio sin quedarse con nada.

| Herramienta | Qué entrena | Cómo funciona |
|---|---|---|
| **Idea principal** | *Skimming* | Se cronometra la lectura y después **se tapa el texto**. Si hay que volver a mirarlo, no era skimming |
| **Buscar el dato** | *Scanning* | La pregunta va primero y el texto queda delante; mide segundos por dato |
| **Deducir** | Inferencia | Cada explicación señala la línea concreta que sostiene la respuesta |
| **Palabra por contexto** | Vocabulario sin diccionario | La explicación nombra la pista del texto que la define |
| **¿A qué se refiere?** | Referencia pronominal | *it*, *this*, *they*, *which* — incluidos los *this* que recogen la idea entera de la frase anterior |
| **Velocidad lectora** | Palabras por minuto **con control de comprensión** | Tras leer, tres preguntas con el texto tapado: la velocidad sin comprensión no puntúa |

La traducción de cada texto va **plegada a propósito**, con un aviso: abrirla antes de responder no es
entrenar comprensión lectora, es leer en español. Todos los resultados se registran en la destreza
«Comprensión lectora» de la pantalla de Progreso, y cuando esa es la barra más baja el panel del gimnasio
manda directamente aquí. En el itinerario, un día de cada cinco propone abrir la lectura antes de empezar.

### Modo profesor

Cada juego del gimnasio lleva desplegado un bloque **«Modo profesor»** con tres apartados: *por qué existe
este ejercicio*, *cómo se hace bien* y *qué hacer exactamente cuando fallo*, más el error concreto que se
quiere desterrar. El de «¿Cuál encaja?» es el más largo a propósito, porque es el ejercicio central: explica
que los conectores y las preposiciones **no se traducen, se eligen**, y da un protocolo de cuatro pasos para
responder y otro de cinco para después de un fallo. Ese protocolo vuelve a aparecer **en la propia pantalla
cada vez que se falla**, que es cuando sirve de algo.

### Corrección palabra a palabra

Cuando lo que falla es una frase entera —ordenar palabras, traducir al inglés, un dictado, una
transformación— enseñar la solución no basta. La corrección compara lo escrito con el modelo por
subsecuencia común más larga y muestra las dos líneas enfrentadas: **tachado lo que sobra, subrayado lo que
falta**. Debajo nombra el error, con las categorías que de verdad comete un hispanohablante: sujeto omitido,
artículo que falta o que sobra, auxiliar ausente, `-s` de tercera persona, preposición cambiada, orden de
palabras, y el caso de «solo era una mayúscula o el punto final», que se dice tal cual en vez de fingir que
el fallo era gramatical.

## Familias de palabras · pestaña «Familias»

Parte de una idea sencilla: las cien palabras más frecuentes del inglés cubren casi la mitad de todo lo que se
dice, y las mil primeras más del ochenta por ciento. Aprender la palabra número tres mil rinde poquísimo;
exprimir del todo la número doce, muchísimo. Y exprimirla significa **no aprender palabras sino familias**: al
encontrarse *decide* no se ha aprendido una palabra, se han aprendido cinco —*decide, decision, decisive,
decisively, undecided*—.

**51 familias en seis grupos**, con 220 formas derivadas, 44 phrasal verbs y 118 combinaciones fijas:

1. **Los ocho motores** (*be, have, do, make, get, take, give, go*) — las más frecuentes y las que menos
   derivan. Su dificultad no está en el sufijo sino en la combinación, así que aquí se estudian sus phrasal
   verbs y sus colocaciones.
2. **Pensar, decir y decidir** — donde manda la derivación en `-ion`, `-ment`, `-ance`, `-ive` y `-able`.
3. **Trabajar y hacer cosas** — el vocabulario del oficio, con la distinción entre **la persona** que lo hace
   (`-er`, `-or`) y **la cosa o el proceso** (`-ion`, `-ment`), que es media prueba de word formation.
4. **Cambiar y mejorar** — verbos de proceso, muchos de ellos verbo y sustantivo sin cambiar nada
   (*a change*, *an increase*), cosa que el español no hace y despista.
5. **Querer, necesitar y poder** — los verbos con los que se negocia, con la preposición o la estructura fija
   que rigen: *apply for*, *allow someone to*.
6. **Salir bien o salir mal** — con su pareja opuesta al lado.

Cuatro ejercicios generados de la propia tabla: **Completa la familia** (se tapa un miembro dentro de su
frase y se da la raíz, formato de la Parte 3 del examen), **¿Qué falta?** (tres candidatos de la misma
familia, para no confundir la cosa con la persona), **Phrasal verbs** y **Combinaciones fijas** — este último
sobre el error clásico de *take a decision* por *make a decision*.

El modo profesor de la pestaña nombra los tres fallos típicos y cómo se corrige cada uno: haber puesto el
verbo donde iba el sustantivo, haber acertado la categoría pero no el sufijo, y haber confundido la cosa con
la persona.

## Los 44 fonemas · dentro de «Habla»

El inglés tiene **44 sonidos**; el español, **24**. Veinte sonidos que la boca no ha hecho nunca y que el oído,
de entrada, no distingue: por eso se puede saber mucho vocabulario y aun así no entender una conversación.

El inventario completo, agrupado en vocales cortas, vocales largas, diptongos, consonantes que el español no
tiene y consonantes fáciles. Cada ficha lleva el símbolo, tres o cuatro palabras de ejemplo que suenan
seguidas al pulsarlo, qué hace exactamente la boca, el error típico y —lo que de verdad ordena el trabajo— la
**dificultad real para un hispanohablante**: 12 de dificultad alta, 14 media y 18 que prácticamente coinciden
con el español y no necesitan ni un minuto. El botón **«Solo los difíciles»** deja los doce que importan.

Dos ejercicios: **¿Cuál lleva este sonido?** (tres palabras, hay que decir cuál lleva la vocal indicada;
se pregunta por la vocal porque es el único sonido que una palabra de una sílaba tiene una sola vez) y
**Pares mínimos**, con 39 pares de todo el inventario y el nombre de los dos fonemas en juego.

## Corrección de la escritura con la rejilla de Cambridge

El texto del bloque de escritura ya no se puntúa con una heurística: se corrige con los **cuatro criterios
reales del *Writing* de Cambridge** —Contenido, Logro comunicativo, Organización y Lenguaje, cada uno sobre 5—
y el **Contenido es eliminatorio**, como en el examen: una tarea sin hacer no se salva por estar bien escrita.

- **Comprueba lo que pedía el enunciado.** Si la tarea dice «un diálogo de 6 líneas» o «unas 80 palabras», lo
  cuenta y lo dice. Antes no se miraba, así que un diálogo de dos líneas podía sacar buena nota.
- **Corrige de verdad.** Cincuenta reglas con el error típico del hispanohablante, cada una con el **fragmento
  real del texto** y, cuando la corrección es inequívoca, el reemplazo aplicado: al final se muestran el texto
  original y el corregido enfrentados. Lo que no tiene una única solución posible se explica y se deja para
  que lo arregle ella, que es lo que fija la corrección.
- **Revisa la presentación**: mayúscula inicial, punto final, minúscula después de punto, el pronombre *I*.
- **Separa la nota de la banda.** La nota dice lo bien hecha que está *esta* tarea; la banda estima el nivel, y
  para eso no basta con no fallar: se miden **estructuras de nivel** (subordinación, pasiva, tiempos perfectos,
  condicionales) y la longitud media de frase. Un texto impecable hecho de frases cortas es un A2 bien escrito,
  no un C1.

## Taller de expresión oral · pestaña «Habla»

La pestaña **Oral** mide; la pestaña **Habla** enseña. La premisa: un hispanohablante adulto no falla en
«todo el inglés», falla en unos pocos sonidos que su boca nunca ha tenido que hacer y en una forma distinta
de repartir el peso dentro de la frase. Cinco apartados, en este orden por método:

1. **Los sonidos que te delatan** — diez fichas: `/ɪ/` frente a `/iː/` (*ship* / *sheep*), `/æ/` frente a
   `/e/` (*bad* / *bed*), la schwa `/ə/`, `/b/` frente a `/v/`, las dos *th*, la *h* aspirada, la *s* inicial
   (*Spain*, no *espain*), las terminaciones `-ed`, la `/ŋ/` final y el acento de palabra. Cada una explica
   por qué falla en español, **qué hace exactamente la boca**, un truco y pares mínimos. Y una **prueba de
   oído**: se pronuncia una de las dos palabras y hay que decir cuál era, porque no se puede producir un
   sonido que aún no se distingue.
2. **Repite y compara** — tres niveles por longitud. Suena el modelo, se repite al micrófono y el
   reconocimiento de voz devuelve la corrección palabra a palabra: lo subrayado es lo que no se ha
   entendido. No es un examinador, es un espejo.
3. **El ritmo de la frase** — diez frases con los golpes marcados en negrita. El español reparte el tiempo
   por sílabas; el inglés, por acentos.
4. **Lectura en voz alta** — tres textos profesionales cronometrados, con palabras por minuto, porcentaje
   entendido y la lista de las que se han perdido.
5. **Monólogo guiado** — noventa segundos sobre un tema de trabajo con tres puntos obligatorios, con
   transcripción y recuento de muletillas.

Todo lo que no necesita micrófono —sonidos, pares mínimos, ritmo, lecturas— funciona en cualquier navegador.

**Traducción al español.** Cada palabra, cada frase de ejemplo, cada frase de repetición, cada frase de ritmo
y los tres textos de lectura llevan debajo su equivalente en español, para no repetir nunca algo sin saber qué
se está diciendo. Un interruptor arriba la apaga y la enciende, y la elección se guarda. Los pares vienen en
tres formas distintas según el sonido: **pares mínimos** de verdad (`ship` / `sheep`, con las dos traducciones),
**bien dicho frente a mal dicho** (`Spain` / *espain*, donde solo suena la buena porque la mala no existe como
palabra) y **la inglesa frente a la española** (`architect` / *arquitecto*, para ver cuántas sílabas se pierden
al cruzar el Canal). La prueba de oído solo aparece en los cinco sonidos con pares mínimos reales, que son los
únicos donde tiene sentido preguntar cuál se ha oído.

### El micrófono

Todo el reconocimiento de voz del curso —la prueba oral, el botón 🎤 del shadowing y los cinco ejercicios del
taller de habla— pasa por **un único gestor**. Antes cada ejercicio creaba su propio reconocedor, y como el
navegador solo admite uno activo a la vez, abrir un segundo ejercicio sin cerrar el primero dejaba el micrófono
peleándose consigo mismo. Ahora hay uno solo, con estas garantías:

- **Un reconocedor nuevo por grabación.** Reutilizar uno solo parecía más limpio y era la causa de un fallo
  difícil de ver: al abortar el anterior, su `onend` llegaba con retraso y arrancaba la grabación nueva por su
  cuenta; el arranque legítimo se encontraba entonces el reconocedor ocupado, lanzaba `InvalidStateError` y la
  grabación moría nada más empezar. Se notaba sobre todo en la prueba oral, porque es donde lo natural es
  comprobar el micrófono justo antes de grabar.
- **Parada garantizada.** El botón vuelve siempre al reposo: al parar, al fallar y también cuando otra pantalla
  toma el micrófono. Antes, un error dejaba el botón en «Parar» para siempre.
- **Sin bucles.** El navegador cierra el reconocimiento en cuanto hay un silencio, así que se rearranca solo;
  pero si se corta más de seis veces seguidas se rinde y lo explica, en vez de reintentar sin fin.
- **Nunca se graba mientras habla el sintetizador**: al empezar a grabar se corta el audio, para que el
  micrófono no transcriba la voz del modelo en lugar de la tuya.
- **Se cierra al cambiar de pantalla**, así que el indicador de grabación del navegador no se queda encendido.
- **Errores en castellano y con la solución**: permiso denegado, micrófono ocupado por otra aplicación, sin
  micrófono conectado, sin conexión (Chrome envía el audio a un servidor: sin internet no transcribe), o voz
  sin reconocimiento disponible.

Y en las pestañas **Habla** y **Oral** hay un **comprobador**: verifica navegador, contexto seguro, conexión y
estado del permiso, y hace una prueba de seis segundos mostrando lo que se ha entendido. Si el problema está
fuera del curso, lo dice y explica en qué orden se arregla.

## Referencias de consulta

- **Palabras derivadas (word formation)** — 219 palabras en diez familias de sufijos y prefijos, con el
  tipo que es cada una y una frase de trabajo real. Incluye el caso que más se falla, `-ing` frente a
  `-ed` (*the film was boring* / *I was bored*), y un **generador de práctica** que convierte la propia
  tabla en veinte huecos con el formato de la Parte 3 del examen.
- **Verbos** — 109 verbos con pasado, participio y ejemplo, agrupados por patrón (las tres formas
  iguales, pasado y participio iguales, las tres distintas) más los regulares de arquitectura y negocios.
- **Frases de trabajo** — 210 entradas en tres capas. (1) 115 **frases hechas por situación profesional**:
  reunión y videollamada, correo al cliente, presentación de proyecto, visita de obra, honorarios y
  facturas, plazos y negociación, y cómo discrepar sin romper la relación. (2) 52 **pares Reino Unido /
  Estados Unidos** donde las dos orillas no dicen lo mismo: *ground floor* frente a *first floor*
  —el error que manda al cliente a otra planta—, *snagging list* / *punch list*, *quantity surveyor* /
  *cost estimator*, *tender* / *bid*, *variation* / *change order*, *render* / *stucco*,
  *plasterboard* / *drywall*, *pavement* / *sidewalk*. (3) 43 **expresiones coloquiales** con lo que
  significan de verdad, incluido el eufemismo británico, que es donde se producen los malentendidos
  caros: *«that's an interesting idea»* es un no, y *«I hear what you say»* cierra la discusión.
  Trae 30 huecos propios con las trampas UK / US y alimenta las parejas contrarreloj del gimnasio.

Todas se muestran en inglés, con audio al pulsar cualquier palabra y un enlace al traductor de Google
por si hace falta; en la tabla de verbos el español está detrás de un interruptor, apagado por defecto.

## Evaluación

- **Test diario** (12 ítems, dos de ellos con formato Cambridge): **≥ 70 %** para completar el día.
- **Ritmo de la corrección.** Al acertar se avanza solo tras un segundo, porque no hay nada que leer.
  Al fallar **no hay cuenta atrás**: la solución y su explicación se quedan en pantalla hasta que
  pulsas «Continuar» o la tecla Intro. Leer por qué se ha fallado es la parte que enseña, y no puede
  depender de la velocidad de lectura de cada uno.
- **Repaso semanal** los días 7, 14, 21 y 28 de cada mes: el test se amplía con la semana anterior.
- **Examen de nivel** al terminar cada mes, **≥ 75 % = APTO**, con las seis partes del examen oficial:
  multiple-choice cloze (8), open cloze (8), word formation (8), key word transformation (6),
  dictado (6) y transformación de frases (4).
- **Evaluación oral** con reconocimiento de voz: palabras por minuto, densidad léxica, cobertura de
  las estructuras objetivo y banda estimada (A2-C1). La tarea es siempre la **del día que eliges**
  —se selecciona en la propia vista o se entra desde el bloque 6 de la sesión— y el resultado queda
  guardado en ese día concreto, de modo que la rejilla marca cuáles ya tienen prueba oral hecha.
- **Evaluación escrita** automática: extensión, riqueza léxica, madurez sintáctica, uso del material
  del día y detección de los veintitrés errores fosilizados más frecuentes del hispanohablante.
- **Panel de progreso**: racha, ritmo, evolución de notas, aciertos por destreza, estado de la
  memoria por cajas, palabras que se resisten y proyección de fin de curso.
- **SRS Leitner de 6 cajas por fechas reales** (1, 2, 4, 8, 16 y 35 días), de modo que hacer dos
  sesiones diarias no comprime los intervalos de memoria.

## Simulacros Cambridge

Cada nivel tiene un simulacro con el formato de **su propio examen oficial**, que no es el mismo en
todos los niveles:

| Nivel | Examen | Secciones del simulacro |
|-------|--------|-------------------------|
| A2 | A2 Key | Reading Part 2 (multiple matching) · Part 3 (texto largo) · Listening gap fill · Writing Part 6 (mensaje de 25 palabras) · Speaking en 2 partes |
| B1 | B1 Preliminary | Reading Part 3 (texto largo) · Part 4 (gapped text) · Listening gap fill · Writing Part 1 (correo de 100 palabras) · Speaking en 4 partes |
| B2 | B2 First | Part 5 (multiple choice) · Part 6 (gapped text) · Part 7 (multiple matching) · Listening sentence completion · Writing Part 1 (essay 140-190) · Speaking en 4 partes |
| C1 | C1 Advanced | Part 5 · Part 6 (cross-text) · Part 7 (gapped text) · Part 8 (multiple matching) · Listening · Writing Part 1 (essay 220-260) · Speaking en 4 partes |

El writing se corrige contra los criterios reales del examen (extensión, párrafos, conectores,
registro y corrección) y se compara con una respuesta modelo. El *speaking* enlaza con el
evaluador oral por reconocimiento de voz.

**Nota honesta sobre A2 y B1:** los exámenes oficiales de esos niveles no incluyen *word formation*
ni *key word transformation*. En el curso se trabajan igualmente desde el primer mes como
preparación hacia el B2 First; los simulacros, en cambio, respetan el formato real de cada examen.

## Anexos de arquitectura y negocios

Los días 7, 14, 21, 28 y 30 de cada mes incorporan un octavo bloque de seis minutos con terminología
profesional, frases listas para copiar en un correo y una nota de uso (falsos amigos, diferencias
entre el sistema británico y el español, registro). Progresan por nivel:

| Nivel | Anexos |
|-------|--------|
| A2 | El estudio y las personas · Partes del edificio · Materiales y herramientas · Planos y espacios · El dinero del estudio |
| B1 | El encargo y el cliente · Licencias y normativa · En la obra · Presupuestar y facturar · Correos y reuniones |
| B2 | Reforma y cambio de uso · Estructura y patología · Sostenibilidad y eficiencia · Negociar con clientes y proveedores · Captación y marketing |
| C1 | Contratos y responsabilidad · Urbanismo y planeamiento · El discurso de proyecto · Dirección de obra y riesgos · La estrategia del estudio |

Su terminología entra en el SRS, en el test de ese día y en el examen del mes.

## Doble sesión

El modo doble sesión (activable desde el panel) reorganiza la jornada en dos horas separadas por un
mínimo de cuatro horas: material nuevo por la mañana, consolidación por la tarde, microrepaso a
mediodía y tres minutos de escucha antes de dormir. Permite completar los 120 días en dos meses.

## Audio y voz

- La síntesis de voz usa la **Web Speech API** del navegador: voz, velocidad y reproducción
  automática son configurables desde el botón «Audio».
- El botón 🎤 del bloque de shadowing usa reconocimiento de voz para comparar tu pronunciación
  con la frase modelo. Requiere Chrome o Edge; en el resto de navegadores se degrada sin romper nada.
- Recomendado: Chrome o Edge de escritorio, con auriculares.

## Micrófono y traslado de progreso

El reconocimiento de voz (prueba oral y botón 🎤 del shadowing) necesita permiso de micrófono, que el
navegador solo concede a una página **abierta en su propia pestaña sobre HTTPS**, en Chrome o Edge.
Dentro de un visor incrustado en otra aplicación no funciona nunca. Todo lo demás del curso —audio,
tests, exámenes, simulacros, evaluación escrita, SRS— funciona en cualquier contexto.

Como el progreso se guarda en `localStorage` y va asociado a la dirección, cambiar de dirección
implicaría empezar de cero. Para evitarlo, el pie de página tiene **«Trasladar progreso a otra
dirección»**: genera un código con todo el estado (días, tarjetas, ganchos mnemotécnicos, cajas del
SRS, historial, textos y resultados) que se copia y se pega en la dirección nueva.

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
