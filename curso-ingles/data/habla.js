/* HABLA · taller de pronunciación y fluidez para hispanohablantes.
   No es una prueba: es una clase. Cada sonido lleva por qué falla en español,
   qué hace la boca, un truco y pares mínimos para oír la diferencia.
   Después, repetición con corrección palabra a palabra, ritmo, lectura en voz
   alta y monólogo guiado. */
window.HABLA = {

intro: "Hablar bien inglés no es tener acento británico: es que <b>te entiendan a la primera</b>. Y casi todo lo que impide que te entiendan son <b>ocho o nueve sonidos concretos</b> que el español no tiene, más una forma distinta de repartir el peso dentro de la frase. No son cien cosas: son nueve. Esta pestaña las trabaja una por una, y luego te hace producirlas.",

metodo: [
 "<b>Oír antes que hablar.</b> No puedes pronunciar un sonido que todavía no distingues con el oído. Por eso cada sonido empieza con pares mínimos: dos palabras que solo se diferencian en él.",
 "<b>Saber qué hace la boca.</b> El sonido inglés no sale «poniendo acento»: sale colocando la lengua y los labios en un sitio concreto. Cuando sabes dónde, sale a la primera.",
 "<b>Repetir inmediatamente después de oír.</b> Entre oír el modelo y repetirlo no debe pasar ni un segundo: lo que copias es la huella acústica, y esa huella dura poco.",
 "<b>Grabarte y leer lo que se ha entendido.</b> Es la parte incómoda y la que más enseña: la transcripción es exactamente lo que oye tu interlocutor, no lo que tú creías estar diciendo.",
 "<b>Poco y todos los días.</b> Diez minutos diarios cambian una pronunciación en seis semanas. Dos horas el domingo no cambian nada."
],

/* sonidos: pares mínimos, posición de la boca y frases de trabajo */
sonidos: [

{ id: 'i', t: "/ɪ/ frente a /iː/ · <i>ship</i> y <i>sheep</i>",
  problema: "El español solo tiene una «i». El inglés tiene dos y distinguen palabras distintas: si dices siempre la española, <i>ship</i> (barco) y <i>sheep</i> (oveja) te salen iguales, y <i>live</i> (vivir) suena a <i>leave</i> (marcharse).",
  boca: "La <b>/iː/</b> es larga y tensa, con los labios estirados como en una sonrisa forzada: es casi la «i» española pero <b>alargada</b>. La <b>/ɪ/</b> es corta, relajada y algo más floja, a medio camino entre la «i» y la «e» españolas. La clave no es solo la duración: es que la corta va <b>relajada</b>.",
  truco: "Di «sí» estirando mucho la boca y alargando: eso es <i>see</i>. Ahora dilo con la boca casi quieta y en un golpe seco: eso es <i>sit</i>.",
  pares: ["ship|sheep", "live|leave", "bit|beat", "fill|feel", "sit|seat", "it|eat", "this|these", "hill|heal", "rich|reach", "list|least"],
  frases: ["This ship is cheap.", "I live here, I don't leave.", "Sit on the seat, please.", "These bricks fit."] },

{ id: 'ae', t: "/æ/ frente a /e/ · <i>bad</i> y <i>bed</i>",
  problema: "El español tiene una sola «e» y una sola «a». El inglés mete un sonido intermedio, la /æ/, y sin él <i>man</i> y <i>men</i>, o <i>bad</i> y <i>bed</i>, se confunden en cualquier conversación de trabajo.",
  boca: "Para la <b>/æ/</b> abre la boca como para decir «a» pero pon la lengua como para «e»: sale un sonido ancho, casi de queja. Es el sonido de <i>cat</i>, <i>flat</i>, <i>man</i>. La <b>/e/</b> es la «e» española normal, más cerrada y más corta.",
  truco: "Piensa en el sonido que haces cuando algo te da asco: «aeee». Esa es la /æ/ de <i>bad</i>.",
  pares: ["bad|bed", "man|men", "sat|set", "had|head", "flat|fleet", "sad|said", "land|lend", "band|bend"],
  frases: ["That flat has a bad crack.", "Ten men and ten plans.", "The land is flat."] },

{ id: 'schwa', t: "La /ə/ · el sonido más frecuente del inglés",
  problema: "Es el sonido más común del idioma y en español no existe. Todas las sílabas <b>sin acento</b> se reducen a una vocal neutra, floja y cortísima. El hispanohablante las pronuncia enteras y claras, y por eso suena marcado y le cuesta seguir a un nativo: no es que hablen rápido, es que <b>se comen las sílabas átonas</b>.",
  boca: "Boca entreabierta, lengua en reposo, sin esfuerzo ninguno. Es el sonido de alguien a quien le da igual todo: «uh».",
  truco: "En <i>architect</i> solo suena fuerte la primera sílaba: <b>AR</b>-kə-tekt. En <i>computer</i>, la del medio: kəm-<b>PYU</b>-tər. Marca la fuerte y deja caer las demás; no las pronuncies «bien», pronúncialas mal a propósito.",
  pares: ["architect|arquitecto", "comfortable|confortable", "vegetable|vegetal", "different|diferente", "interesting|interesante", "temperature|temperatura"],
  frases: ["The architect is comfortable.", "It's a different problem.", "Photography, photographer, photographic."] },

{ id: 'bv', t: "/b/ frente a /v/ · <i>berry</i> y <i>very</i>",
  problema: "En español la «b» y la «v» suenan exactamente igual. En inglés no, y son palabras distintas: <i>vote</i> y <i>boat</i>, <i>vest</i> y <i>best</i>.",
  boca: "La <b>/b/</b> junta los dos labios. La <b>/v/</b> <b>no junta los labios</b>: apoya los dientes de arriba sobre el labio de abajo y hace vibrar el aire, como una «f» con voz.",
  truco: "Muérdete suavemente el labio inferior y di «fff»; ahora añade voz sin soltar: eso es la /v/. Practícalo en <i>very, value, invoice, variation, survey</i>, que las vas a decir todos los días.",
  pares: ["berry|very", "boat|vote", "best|vest", "ban|van", "curb|curve", "bat|vat"],
  frases: ["The invoice value is very high.", "We have a variation and a survey.", "Every visit adds value."] },

{ id: 'th', t: "/θ/ y /ð/ · <i>think</i> y <i>this</i>",
  problema: "La <i>th</i> tiene dos sonidos y ninguno es «t» ni «d» ni «s». Decir <i>tink</i> o <i>sink</i> por <i>think</i>, o <i>dis</i> por <i>this</i>, es la marca más reconocible del acento extranjero.",
  boca: "Saca <b>la punta de la lengua entre los dientes</b> y suelta aire. Sin voz es <b>/θ/</b> (<i>think, three, north, thick</i>); con voz es <b>/ð/</b> (<i>this, that, the, they, mother</i>). El castellano de España ya tiene la /θ/ en «cielo» o «zapato»: úsala.",
  truco: "Si eres de Zaragoza tienes media batalla ganada: la <i>th</i> de <i>think</i> es la «z» de «zapato». La otra, la de <i>this</i>, es la misma pero con la garganta vibrando.",
  pares: ["think|sink", "three|tree", "thin|tin", "path|pass", "they|day", "then|den", "breathe|breeze"],
  frases: ["I think this is the third one.", "There are three thin walls.", "They think that the north façade is thicker."] },

{ id: 'h', t: "La /h/ aspirada · <i>house</i>, <i>hotel</i>, <i>behind</i>",
  problema: "En español la «h» no suena nunca, así que se cae: <i>ouse</i>, <i>otel</i>. Y cuando se intenta pronunciar, sale la «j» española, demasiado áspera: <i>jouse</i>.",
  boca: "No es un sonido de garganta: es <b>aire</b>. Como cuando empañas un cristal para limpiarlo. La lengua no toca nada.",
  truco: "Empaña un cristal imaginario y encadena la palabra sin cortar el aire: h-h-<i>house</i>, h-h-<i>height</i>, h-h-<i>behind</i>.",
  pares: ["house|out", "hi|eye", "heat|eat", "hold|old", "hair|air"],
  frases: ["The house has a high hall.", "Hold the handrail behind you.", "How high is the heating unit?"] },

{ id: 'sc', t: "La <i>s</i> inicial · <i>Spain</i>, no <i>espain</i>",
  problema: "En español ninguna palabra empieza por «s» + consonante, así que la boca añade sola una «e» delante: <i>espain, estudy, esmall, estreet</i>. Es el error que más delata y el más fácil de corregir.",
  boca: "Empieza directamente con el siseo, <b>sin abrir la boca antes</b>. La «s» se sostiene un instante y luego entra la consonante.",
  truco: "Piensa la palabra como si empezara antes de tiempo: <i>sssss-pain</i>, <i>sssss-tudy</i>, <i>sssss-tructure</i>. Practica alargando la ese hasta que te resulte natural entrar sin vocal.",
  pares: ["Spain|espain", "study|estudy", "street|estreet", "school|eschool", "structure|estructure", "space|espace", "scale|escale"],
  frases: ["The steel structure is stable.", "We study the space and the scale.", "Speak to the specialist in Spain."] },

{ id: 'ed', t: "Las terminaciones <i>-ed</i> · tres sonidos, no dos sílabas",
  problema: "Casi nadie añade una sílaba en <i>worked</i>, pero muchos hispanohablantes dicen <i>work-ed</i>. La terminación <i>-ed</i> solo es sílaba aparte en un caso de tres.",
  boca: "Después de sonido <b>sordo</b> (p, k, f, s, sh, ch) suena <b>/t/</b>: <i>worked, stopped, finished</i>. Después de sonido <b>sonoro</b> o vocal suena <b>/d/</b>: <i>planned, called, opened</i>. Solo después de <b>/t/ o /d/</b> añade sílaba, <b>/ɪd/</b>: <i>needed, wanted, started, decided</i>.",
  truco: "Pon la mano en la garganta. Si el sonido anterior vibra, es /d/; si no vibra, es /t/. Y si ya termina en t o d, entonces sí: una sílaba más.",
  pares: ["worked|work-ed", "planned|plan-ed", "needed|need-ed", "finished|finish-ed", "decided|decide-ed"],
  frases: ["We finished the works and started the report.", "They called and asked.", "I decided, planned and delivered."] },

{ id: 'ng', t: "La /ŋ/ final · <i>building</i>, sin «g» dura",
  problema: "El hispanohablante remata <i>building</i> con una «g» seca de «gato». En inglés la <i>-ng</i> es un único sonido nasal que <b>no acaba en golpe</b>.",
  boca: "El aire sale por la nariz con la parte de atrás de la lengua tocando el paladar blando. La boca se queda abierta y no hay explosión final.",
  truco: "Di «pan» y luego «pang» sin cerrar la boca al final. Esa nasal sostenida es la /ŋ/ de <i>drawing, building, meeting, planning</i>.",
  pares: ["building|buildin-g", "drawing|drawin-g", "meeting|meetin-g", "long|long-g"],
  frases: ["I'm bringing the drawings to the meeting.", "The building is going up.", "Planning takes as long as building."] },

{ id: 'stress', t: "El acento de la palabra · dónde cae el golpe",
  problema: "En inglés el acento no es un adorno: cambia la palabra y a veces su categoría. <i>PHOtograph</i>, <i>phoTOgrapher</i> y <i>photoGRAphic</i> llevan las mismas letras y tres golpes distintos. Poner el acento donde lo pondría el español es una de las principales causas de que no te entiendan aunque los sonidos sean correctos.",
  boca: "La sílaba tónica se dice <b>más larga, más alta y más clara</b>. Las demás se reducen a la /ə/ floja. No es cuestión de gritar: es de contraste.",
  truco: "Aprende cada palabra nueva <b>con su golpe marcado</b>, dando una palmada en la sílaba fuerte. Una palabra sin acento aprendido es una palabra a medias.",
  pares: ["ARchitect|archiTECT", "deSIGN|DEsign", "maTErial|mateRIAL", "conTRACtor|CONtractor", "enGIneer|ENgineer", "deVElopment|develOPment"],
  frases: ["The ARchitect approved the deSIGN.", "The conTRACtor sent the inVOICE.", "This maTErial is exPENsive."] }
],

/* Repetición graduada: se oye el modelo y se repite. La longitud sube poco a poco. */
repetir: [
 { t: "Nivel 1 · frases cortas de despacho", nota: "Tres o cuatro palabras. El objetivo no es el contenido, es que salgan limpias y sin pausa.", v: [
  "Good morning.", "Nice to meet you.", "Let me check.", "I'll send it today.", "That works for me.",
  "Can you repeat that?", "Just a moment, please.", "I'll come back to you.", "Thanks for waiting.", "See you on site."] },
 { t: "Nivel 2 · frases de trabajo", nota: "Ocho o diez palabras. Aquí ya hay que mantener el ritmo hasta el final sin acelerar.", v: [
  "I'm the architect in charge of this project.",
  "We're running about two weeks behind schedule.",
  "Could you send us a quote before Friday, please?",
  "The client asked for a bigger kitchen and one more bathroom.",
  "This wall is load-bearing, so we can't remove it.",
  "The invoice covers stages two, three and four.",
  "I'll talk you through the plans in a minute.",
  "We need the survey before we can start on site.",
  "The building regulations don't allow a fourth floor.",
  "Let me know if anything is unclear."] },
 { t: "Nivel 3 · frases largas, con subordinada", nota: "Quince palabras o más. Es donde se cae la fluidez: respira antes de empezar y no cortes en medio.", v: [
  "Although the plot is cheap, it's very far from the centre, so the client isn't convinced.",
  "If the licence arrives before the end of the month, we can still finish the works in June.",
  "The scheme is organised around a central courtyard, which brings daylight into every room.",
  "We opened up the north façade because the original windows were too small for the space.",
  "I'd rather tell you now than surprise you later, so I'm sending the revised budget today.",
  "As soon as the structural engineer confirms the foundations, I'll issue the construction drawings.",
  "The contractor says the steel will arrive next week, but I'd like that in writing before we proceed."] }
],

/* Ritmo de la frase: lo que va entre asteriscos es lo que lleva el golpe */
ritmo: {
 intro: "El español reparte el tiempo por sílabas: todas duran más o menos lo mismo. El inglés lo reparte <b>por golpes</b>: las palabras con contenido (sustantivos, verbos, adjetivos, adverbios) se acentúan y las demás —artículos, preposiciones, auxiliares, pronombres— se aplastan entre ellas. Por eso <i>I have to go to the meeting</i> dura casi lo mismo que <i>I go</i>. Copiar ese ritmo es lo que más rápido mejora que te entiendan.",
 regla: "Marca solo las palabras en negrita, da una palmada en cada una y deja que el resto pase de puntillas. Si te sale demasiado claro, está mal.",
 v: [
  "*I* *need* the *drawings* by *Friday*.",
  "The *client* *wants* a *bigger* *kitchen*.",
  "We *can't* *start* until the *licence* *arrives*.",
  "I'll *send* you the *invoice* this *afternoon*.",
  "There's a *crack* in the *wall* of the *bathroom*.",
  "The *meeting* has been *moved* to *Thursday*.",
  "*Could* you *check* the *levels* before we *pour*?",
  "It's a *lovely* *building* but it's *too* *expensive*.",
  "We've *finished* the *works* on the *ground* *floor*.",
  "I'd *like* to *talk* about the *budget* *first*."]
},

/* Lectura en voz alta cronometrada */
lectura: [
 { t: "Presentarte a un cliente", nota: "Ciento veinte palabras. Objetivo: entre 110 y 140 palabras por minuto sin tropezar.", txt:
  "Good morning, and thank you for making the time. My name is Patricia and I am the architect in charge of this project. Before we look at the drawings, I would like to explain how we work. First, we visit the site and take measurements. Then we prepare a first proposal and we discuss it with you. Nothing goes to the council until you are happy with it. Our fee covers the design, the planning application and the site visits during the works. If anything is unclear at any point, please stop me and ask. It is much easier to change a drawing than a wall." },
 { t: "Explicar un retraso", nota: "Malas noticias, con causa y solución. Es la lectura más útil de todas.", txt:
  "I wanted to update you on the programme. We are running about two weeks behind, and I would rather tell you now than surprise you later. The delay is due to the steel, which has not arrived yet. The supplier has confirmed the new date in writing. In the meantime, the team is working on the ground floor, so we are not losing time on site. Realistically, we are looking at the middle of March instead of the end of February. If the steel arrives earlier, we can bring that forward. I am sorry about this, and I will keep you informed every week." },
 { t: "Visita de obra", nota: "Frases cortas y directas, como se habla en obra de verdad.", txt:
  "Good morning. Before we start, please put on a hard hat. Mind your step here, there is rebar sticking out. How are we getting on with the second floor? Are we on schedule? Right. This is not what is on the drawing. The opening should be one metre twenty, not one metre. I am afraid this will have to be taken down and redone. Can you talk me through how you fixed the frame? Fine. I will send you the instruction in writing this afternoon, and we will look at it again on Thursday." }
],

/* Monólogo guiado: dos minutos hablando con guion */
monologo: [
 "Preséntate como profesional: quién eres, qué haces y qué tipo de proyectos te gustan.|Di tu nombre y tu profesión · Cuenta un proyecto concreto · Explica por qué te interesa ese tipo de trabajo",
 "Describe el último espacio que has proyectado o reformado.|Dónde está y qué tamaño tiene · Qué problema resolvía · Qué materiales elegiste y por qué",
 "Explícale a un cliente por qué su presupuesto no llega y qué propones.|Di la cifra con claridad · Explica qué la ha subido · Ofrece dos alternativas concretas",
 "Cuenta cómo es un día normal de trabajo, de la mañana a la tarde.|Usa el presente simple · Ordena con first, then, after that, finally · Menciona al menos tres tareas distintas",
 "Convence a alguien de que una casa vieja merece rehabilitarse en vez de derribarse.|Da dos razones técnicas · Da una razón económica · Reconoce un inconveniente y respóndelo",
 "Describe la ciudad donde vives a alguien que no la conoce.|Qué tipo de edificios tiene · Cómo ha cambiado · Qué le enseñarías en un día"
]
};
