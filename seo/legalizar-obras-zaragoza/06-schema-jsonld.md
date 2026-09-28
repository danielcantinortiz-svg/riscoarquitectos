# Schema JSON-LD — Pilar «Legalizar obras sin licencia en Zaragoza»

Pegar en la página del pilar (bloque «HTML personalizado» de Gutenberg o widget HTML de Elementor). Yoast ya genera `Organization`, `WebSite` y `WebPage`: **no duplicarlos**. Validar en <https://search.google.com/test/rich-results> y <https://validator.schema.org/>.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://riscoarquitectos.es/#estudio",
      "name": "Risco Arquitectos",
      "url": "https://riscoarquitectos.es/",
      "telephone": "+34651190588",
      "email": "proyectos@riscoarquitectos.es",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle Fray Luis Amigó, 2",
        "postalCode": "50007",
        "addressLocality": "Zaragoza",
        "addressRegion": "Aragón",
        "addressCountry": "ES"
      },
      "founder": {
        "@type": "Person",
        "name": "Patricia Rengifo",
        "jobTitle": "Arquitecta colegiada COAA nº 6513"
      },
      "sameAs": [
        "https://www.linkedin.com/company/risco-arquitectos",
        "https://www.instagram.com/riscoarquitectos/",
        "https://www.facebook.com/RiscoArquitectos"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://riscoarquitectos.es/legalizar-obras-sin-licencia-zaragoza/#servicio",
      "name": "Legalización de obras sin licencia en Zaragoza",
      "serviceType": "Legalización de obras sin licencia",
      "description": "Estudio de viabilidad, proyecto de legalización visado y tramitación ante el Ayuntamiento de obras ejecutadas sin licencia: cerramientos de terraza, ampliaciones, casas de campo, cambios de uso, piscinas, porches y naves.",
      "provider": { "@id": "https://riscoarquitectos.es/#estudio" },
      "url": "https://riscoarquitectos.es/legalizar-obras-sin-licencia-zaragoza/",
      "areaServed": [
        { "@type": "City", "name": "Zaragoza" },
        { "@type": "City", "name": "Cuarte de Huerva" },
        { "@type": "City", "name": "Cadrete" },
        { "@type": "City", "name": "María de Huerva" },
        { "@type": "City", "name": "Utebo" },
        { "@type": "City", "name": "La Puebla de Alfindén" },
        { "@type": "City", "name": "Villanueva de Gállego" },
        { "@type": "City", "name": "Zuera" },
        { "@type": "City", "name": "San Mateo de Gállego" },
        { "@type": "City", "name": "Alfajarín" },
        { "@type": "City", "name": "Pastriz" },
        { "@type": "City", "name": "Pinseque" },
        { "@type": "City", "name": "La Muela" },
        { "@type": "City", "name": "Muel" },
        { "@type": "City", "name": "Botorrita" },
        { "@type": "City", "name": "Fuentes de Ebro" },
        { "@type": "City", "name": "El Burgo de Ebro" },
        { "@type": "AdministrativeArea", "name": "Provincia de Zaragoza" }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://riscoarquitectos.es/" },
        { "@type": "ListItem", "position": 2, "name": "Legalización de obras", "item": "https://riscoarquitectos.es/legalizar-obras-sin-licencia-zaragoza/" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Se puede legalizar una obra hecha sin licencia en Zaragoza?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí, siempre que lo construido cumpla el Plan General de Ordenación Urbana y la normativa técnica. Un arquitecto redacta la documentación de legalización y la presenta en la Gerencia de Urbanismo. Si no cumple, puede legalizarse la parte conforme y adaptar el resto." }
        },
        {
          "@type": "Question",
          "name": "¿Qué multa hay por hacer una obra sin licencia en Aragón?",
          "acceptedAnswer": { "@type": "Answer", "text": "Según el Texto Refundido de la Ley de Urbanismo de Aragón: infracción leve (obra legalizable) de 600 a 6.000 €; grave (no legalizable) de 6.000,01 a 60.000 €; muy grave de 60.000,01 a 300.000 €. Si se legaliza antes de que el Ayuntamiento abra expediente, lo habitual es pagar solo tasas e impuesto de obras." }
        },
        {
          "@type": "Question",
          "name": "¿Cuántos años tienen que pasar para que una obra sin licencia no se pueda denunciar en Aragón?",
          "acceptedAnswer": { "@type": "Answer", "text": "Depende de la gravedad: 1 año si es leve, 4 si es grave y 10 si es muy grave, desde la terminación de la obra (artículos 269 y 284 del TRLUA). En suelo no urbanizable especial, zonas verdes y sistemas generales no hay límite. Pasado el plazo, la obra no queda legalizada." }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto tarda la legalización de una obra?",
          "acceptedAnswer": { "@type": "Answer", "text": "El trabajo técnico suele llevar de 2 a 4 semanas. La resolución depende del Ayuntamiento y del tipo de título habilitante (declaración responsable o licencia)." }
        },
        {
          "@type": "Question",
          "name": "¿Necesito un proyecto visado para legalizar?",
          "acceptedAnswer": { "@type": "Answer", "text": "En obras de entidad (ampliaciones, estructura, cambios de uso, cerramientos de terraza en Zaragoza) sí: proyecto técnico de arquitecto visado por el Colegio. En obras menores puede bastar una memoria técnica con planos." }
        },
        {
          "@type": "Question",
          "name": "¿Qué pasa si la obra no es legalizable?",
          "acceptedAnswer": { "@type": "Answer", "text": "El Ayuntamiento puede ordenar demoler o reponer y sancionar. Antes de llegar ahí se estudia legalizar una parte, adaptar la obra a la norma o acreditar la antigüedad si el plazo de actuación ya ha pasado." }
        },
        {
          "@type": "Question",
          "name": "¿Trabajáis fuera de Zaragoza capital?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí: en todo el área metropolitana (Cuarte de Huerva, Cadrete, María de Huerva, Utebo, La Puebla de Alfindén, Villanueva de Gállego, Zuera…) y en el resto de la provincia de Zaragoza." }
        }
      ]
    }
  ]
}
</script>
```

> Nota: desde 2023 Google solo muestra resultados enriquecidos de FAQ a webs gubernamentales y sanitarias muy autorizadas, pero el marcado FAQPage sigue ayudando a que Google y los buscadores con IA entiendan y citen las respuestas.
