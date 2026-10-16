# PLANTILLA · Páginas locales «Legalizar obras en [Municipio]»

> Usar solo para municipios con demanda real (clientes previos, consultas en GSC o GBP). Cada página necesita **≥ 40 % de contenido único**. No publicar más de 2 por semana.

## Municipios prioritarios (orden sugerido)

| Municipio | Por qué | Tipología dominante a enfatizar |
|---|---|---|
| Cuarte de Huerva | Mucho crecimiento residencial, unifamiliares | Ampliaciones, porches, piscinas |
| Cadrete | Unifamiliares y parcelas | Ampliaciones, casetas, piscinas |
| María de Huerva | Urbanizaciones | Porches, piscinas, casas en parcela |
| Utebo | Gran población, pisos y adosados | Terrazas, ampliaciones de adosados |
| Villanueva de Gállego | Urbanizaciones y suelo rústico | Casas de campo, ampliaciones |
| La Puebla de Alfindén | Adosados + naves | Ampliaciones, naves |
| Zuera | Urbanizaciones y suelo rústico | Casas de campo, parcelas |

## Brief

| Campo | Valor |
|---|---|
| URL | `/legalizar-obras-[municipio]/` |
| Keyword | legalizar obra [municipio] · arquitecto [municipio] · legalizar casa [municipio] |
| H1 | Legalizar obras sin licencia en [Municipio] |
| Title | Legalizar obras sin licencia en [Municipio] · Arquitecta |
| Meta | ¿Obra sin licencia en [Municipio]? Estudiamos si es legalizable según el planeamiento de [Municipio] y la tramitamos en su Ayuntamiento. Arquitecta COAA. |

## Estructura (campos marcados ★ = contenido único obligatorio)

1. **Párrafo-respuesta** (40-60 palabras): en [Municipio] las obras sin licencia se legalizan ante **su Ayuntamiento** (no en la Gerencia de Urbanismo de Zaragoza) conforme a **su planeamiento** ★ (PGOU / Normas Subsidiarias / Plan General simplificado — verificar cuál está vigente).
2. **Obras más habituales en [Municipio]** ★ — según la tipología de la tabla superior, con ejemplos concretos del tipo de vivienda de la zona.
3. **Qué revisamos del planeamiento de [Municipio]** ★ — zona/ordenanza aplicable, edificabilidad, ocupación, retranqueos a linderos, altura, suelo urbano vs no urbanizable en el término.
4. **Plazos en Aragón** (resumen de 3 líneas + enlace a `/obras-sin-licencia-prescripcion-aragon/`).
5. **Proceso** (resumen + enlace al pilar).
6. **Caso real anonimizado en [Municipio]** ★ — «Legalización de un porche cerrado en [zona/urbanización]»: problema, solución, plazo. Con foto propia.
7. **Tasas**: el Ayuntamiento de [Municipio] aplica su propia ordenanza fiscal (tasa + ICIO) ★ si se conoce el tipo, indicarlo con fuente.
8. **FAQ local** (3 preguntas) ★ — p. ej. «¿Dónde se presenta la legalización en [Municipio]?», «¿Mi parcela en [Municipio] es suelo urbano o rústico?».
9. **CTA** + mapa/zona de trabajo + enlace al pilar con anchor «legalizar obras en Zaragoza y alrededores».

## Schema
`Service` con `areaServed: { "@type": "City", "name": "[Municipio]" }` + `FAQPage` + `BreadcrumbList` (Inicio › Legalización de obras › [Municipio]).

## Control de calidad antes de publicar
- [ ] ¿Se ha verificado qué instrumento de planeamiento está vigente en el municipio?
- [ ] ¿Hay al menos un caso o foto propia del municipio?
- [ ] ¿El texto único supera el 40 %? (comparar con otra página de municipio)
- [ ] ¿Enlaza al pilar y a prescripción?
