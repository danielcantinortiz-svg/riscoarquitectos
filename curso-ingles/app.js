/* English Immersion · motor del curso
   150 días · Módulo 0 (desde cero) + itinerario A2 → C1 · audio · SRS por fechas
   · evaluación oral y escrita
   · tests y exámenes con formato Cambridge (B2 First / C1 Advanced) */
(function () {
'use strict';

var C = window.CURSO;
var CAM = window.CAMBRIDGE || {};
var ANX = window.ANEXOS || {};
var SIM = window.SIMULACRO || {};
var VRB = window.VERBOS || { grupos: [] };
var DRV = window.DERIVADAS || { familias: [] };
var GYM = window.GIMNASIO || {};
var FRS = window.FRASES || {};
var DIC = window.ES || {};
// Significado de una palabra suelta, para mostrarlo al pulsarla.
function traduccion(t) { return DIC[String(t).trim().toLowerCase()] || null; }
// Enlace al traductor de Google, para no tener que poner el español en pantalla.
function trad(t) { return '<a class="tr" target="_blank" rel="noopener" title="Abrir en el traductor de Google" href="https://translate.google.com/?sl=en&amp;tl=es&amp;op=translate&amp;text=' + encodeURIComponent(t) + '">translate</a>'; }
function anexoDe(id, k) { return (ANX[id] || {})[k] || null; }
var LEVELS = [
  { id: 'A2', nom: 'A2 → A2+ · Consolidación', mes: 1, dias: window.DIAS_A2, meta: C.metas.A2 },
  { id: 'B1', nom: 'B1 · Autonomía', mes: 2, dias: window.DIAS_B1, meta: C.metas.B1 },
  { id: 'B2', nom: 'B2 · Fluidez', mes: 3, dias: window.DIAS_B2, meta: C.metas.B2 },
  { id: 'C1', nom: 'C1 · Precisión y matiz', mes: 4, dias: window.DIAS_C1, meta: C.metas.C1 },
  // Módulo 0 va el último en el array (días 121-150) para no mover la numeración
  // de los días ya completados, y el primero en pantalla mediante ORDEN.
  { id: 'A1', nom: 'Módulo 0 · Desde cero (A0 → A1+)', mes: 0, dias: window.DIAS_A1, meta: C.metas.A1 }
];
var ORDEN = [4, 0, 1, 2, 3];
var CORE = 120;
var TOTAL = LEVELS.length * 30;
function lvlOf(n) { return LEVELS[Math.floor((n - 1) / 30)]; }
function dayData(n) { var L = lvlOf(n); return L.dias[(n - 1) % 30]; }
function lvlIndex(id) { for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return i; return 0; }

// ---------- estado ----------
var KEY = 'cursoEN.v1';
var S = load();
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      o.dias = o.dias || {}; o.srs = o.srs || {}; o.ex = o.ex || {};
      o.stats = o.stats || {}; o.hist = o.hist || []; o.oral = o.oral || []; o.escr = o.escr || [];
      o.fallos = o.fallos || {}; o.fechas = o.fechas || {};
      o.sim = o.sim || {};
      if (o.rate == null) o.rate = 0.95; if (o.auto == null) o.auto = true;
      return o;
    }
  } catch (e) {}
  return { dias: {}, srs: {}, ex: {}, sim: {}, stats: {}, hist: [], oral: [], escr: [], fallos: {}, fechas: {},
           ses: 0, voz: '', rate: 0.95, auto: true, doble: false, inicio: hoy() };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function hoy() { return new Date().toISOString().slice(0, 10); }
function addDays(iso, n) { var t = new Date(iso + 'T12:00:00'); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); }
function diffDays(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
function doneDays() { return Object.keys(S.dias).filter(function (k) { return S.dias[k].fin; }).map(Number); }
function maxDone() { var d = doneDays(); return d.length ? Math.max.apply(null, d) : 0; }
// Dos itinerarios independientes: Módulo 0 (121-150) y el camino A2→C1 (1-120).
// Empezar el módulo básico no bloquea el otro ni al revés.
function tramo(n) { return n > CORE ? [CORE + 1, TOTAL] : [1, CORE]; }
function maxEn(a, b) { var d = doneDays().filter(function (n) { return n >= a && n <= b; }); return d.length ? Math.max.apply(null, d) : a - 1; }
function unlocked(n) { var t = tramo(n); return n <= maxEn(t[0], t[1]) + 1; }
// Los días del Módulo 0 se numeran internamente 121-150 para no mover la
// numeración del itinerario, pero en pantalla se muestran como 1-30.
function etiquetaDia(n) { return n > CORE ? 'Módulo 0 · Día ' + ((n - 1) % 30 + 1) : 'Día ' + n; }
function siguiente(n) { var t = tramo(n); return Math.min(t[1], maxEn(t[0], t[1]) + 1); }

// ---------- SRS v2: repetición espaciada por FECHAS ----------
var GAPS_D = [0, 1, 2, 4, 8, 16, 35];
(function migrate() {
  if (S.srsV === 2) return;
  for (var k in S.srs) { var it = S.srs[k]; it.box = it.box || 1; it.lapses = it.lapses || 0; it.due = hoy(); }
  S.srsV = 2; save();
})();
function srsAdd(id, front, back, ex, gancho) {
  if (S.srs[id]) return;
  S.srs[id] = { f: front, b: back, e: ex || '', g: gancho || '', box: 1, due: hoy(), lapses: 0 };
}
function srsDue() {
  var t = hoy(), out = [];
  for (var k in S.srs) if (S.srs[k].due <= t) out.push(Object.assign({ id: k }, S.srs[k]));
  return out.sort(function (a, b) { return (a.box - b.box) || (a.due < b.due ? -1 : 1); });
}
function srsGrade(id, ok) {
  var it = S.srs[id]; if (!it) return;
  if (ok) { it.box = Math.min(6, it.box + 1); it.due = addDays(hoy(), GAPS_D[it.box]); }
  else { it.box = 1; it.lapses = (it.lapses || 0) + 1; it.due = addDays(hoy(), 1); }
  save();
}
function leeches() {
  var out = [];
  for (var k in S.srs) if ((S.srs[k].lapses || 0) >= 3) out.push(Object.assign({ id: k }, S.srs[k]));
  return out.sort(function (a, b) { return b.lapses - a.lapses; });
}

// ---------- audio ----------
var voices = [], voice = null;
function loadVoices() {
  voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(function (v) { return /^en/i.test(v.lang); });
  var sel = document.getElementById('voiceSel');
  if (!sel) return;
  sel.innerHTML = '';
  if (!voices.length) { sel.innerHTML = '<option>— sin voces inglesas —</option>'; return; }
  voices.forEach(function (v, i) { var o = document.createElement('option'); o.value = i; o.textContent = v.name + ' (' + v.lang + ')'; sel.appendChild(o); });
  var idx = voices.findIndex(function (v) { return v.name === S.voz; });
  if (idx < 0) idx = voices.findIndex(function (v) { return /en-GB/i.test(v.lang); });
  if (idx < 0) idx = 0;
  sel.value = idx; voice = voices[idx];
}
// Siglas que sí queremos que se deletreen; cualquier otra palabra en
// mayúsculas (RELAX, INFORM) el sintetizador la lee letra a letra, así que
// se pasa a minúsculas antes de hablar. Y nunca se lee texto en español
// con una voz inglesa: sale un galimatías.
var SIGLAS = { UK: 1, US: 1, USA: 1, VAT: 1, CV: 1, RIBA: 1, BIM: 1, EPC: 1, HVAC: 1, PDF: 1, DWG: 1 };
function decible(t) {
  return String(t).replace(/\b[A-Z][A-Z'-]{1,}\b/g, function (w) {
    return SIGLAS[w] ? w : w.toLowerCase();
  });
}
function speak(text, opt) {
  if (!window.speechSynthesis) return;
  opt = opt || {};
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(decible(text).replace(/_+/g, ' blank '));
  if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-GB'; }
  u.rate = opt.rate || S.rate; u.pitch = 1;
  if (opt.onend) u.onend = opt.onend;
  speechSynthesis.speak(u);
}
function speakSeq(list, rate) { var i = 0; (function nx() { if (i >= list.length) return; speak(list[i++], { rate: rate, onend: nx }); })(); }
function stopAudio() { if (window.speechSynthesis) speechSynthesis.cancel(); }

// ---------- micrófono: un único gestor para todo el curso ----------
// Antes cada ejercicio se creaba su propio reconocedor. El navegador solo
// admite uno activo a la vez, así que al abrir un segundo ejercicio sin
// cerrar el primero el micrófono se peleaba consigo mismo y dejaba de
// funcionar. Aquí hay uno solo, con parada garantizada y errores en
// castellano en vez de códigos en inglés.
var MIC = (function () {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var r = null, ses = null, cortes = 0, ultimo = 0;

  var MSG = {
    'not-allowed': 'El navegador no tiene permiso para usar el micrófono. Pulsa el candado 🔒 de la barra de direcciones, pon el micrófono en «Permitir» y recarga la página.',
    'service-not-allowed': 'El sistema está bloqueando el micrófono. En Windows: Configuración → Privacidad → Micrófono, y activa el acceso para las aplicaciones de escritorio. En Mac: Preferencias → Seguridad → Micrófono.',
    'audio-capture': 'No se detecta ningún micrófono conectado. Comprueba que está enchufado y que es el que tiene seleccionado el sistema.',
    'network': 'El reconocimiento de voz de Chrome envía el audio a un servidor, así que necesita conexión a internet. Compruébala y vuelve a intentarlo.',
    'aborted': 'La grabación se ha interrumpido.',
    'no-speech': 'No se ha oído nada. Acércate al micrófono y habla algo más alto.',
    'bad-grammar': 'Error interno del reconocedor. Recarga la página.',
    'language-not-supported': 'La voz elegida no tiene reconocimiento disponible. Cambia a otra voz inglesa en la pestaña Audio.'
  };
  var FATAL = { 'not-allowed': 1, 'service-not-allowed': 1, 'audio-capture': 1, 'network': 1, 'language-not-supported': 1 };

  function cerrar(texto) {
    var s = ses; ses = null;
    soltar();
    if (s && s.onFin) s.onFin(texto);
  }
  // Cada grabación estrena su propio reconocedor. Reutilizar uno solo parecía
  // más limpio y era la causa del fallo: al abortar el anterior, su onend
  // llegaba tarde y arrancaba la grabación nueva por su cuenta; el arranque
  // legítimo se encontraba entonces el reconocedor ocupado, lanzaba
  // InvalidStateError y la grabación moría nada más empezar. Se veía sobre
  // todo en la prueba oral, porque allí es normal probar el micrófono antes.
  function soltar() {
    if (!r) return;
    r.onresult = null; r.onerror = null; r.onend = null;   // que no nos hable ya
    try { r.abort(); } catch (x) {}
    r = null;
  }
  function crear() {
    r = new SR();
    r.continuous = true; r.interimResults = true;
    r.onresult = function (e) {
      if (!ses) return;
      var suelto = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) ses.texto += e.results[i][0].transcript + ' ';
        else suelto += e.results[i][0].transcript;
      }
      ses.onParcial && ses.onParcial(ses.texto, suelto);
    };
    r.onerror = function (e) {
      if (!ses) return;
      var m = MSG[e.error] || ('Fallo del micrófono (' + e.error + ').');
      if (FATAL[e.error]) {
        ses.fatal = true;
        ses.onError && ses.onError(m, true);
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        ses.onError && ses.onError(m, false);
      }
    };
    // El navegador corta el reconocimiento en cuanto hay un silencio. Como
    // aquí se graba durante minutos, se vuelve a arrancar solo; pero si se
    // corta muchas veces seguidas es que algo va mal y hay que rendirse en
    // vez de entrar en un bucle infinito, que era el fallo de antes.
    r.onend = function () {
      if (!ses) return;
      if (ses.parando || ses.fatal) { cerrar(ses.texto); return; }
      var ahora = Date.now();
      cortes = (ahora - ultimo < 500) ? cortes + 1 : 0;
      ultimo = ahora;
      // Si ya está entrando texto, los cortes son los normales del navegador
      // ante un silencio y no hay nada que avisar.
      if (cortes > 6 && !ses.texto) {
        ses.onError && ses.onError('El micrófono se corta nada más empezar. Suele ser el permiso del sistema o que otra aplicación lo tiene ocupado (una videollamada, por ejemplo). Ciérrala y vuelve a intentarlo.', true);
        cerrar(ses.texto); return;
      }
      try { r.start(); } catch (x) { cerrar(ses.texto); }
    };
  }

  return {
    hay: function () { return !!SR; },
    grabando: function () { return !!ses && !ses.parando; },
    // o = { onParcial(textoFinal, textoSuelto), onFin(texto), onError(msg, esFatal) }
    start: function (o) {
      o = o || {};
      if (!SR) { o.onError && o.onError('Este navegador no reconoce la voz. Necesitas Chrome o Edge de escritorio.', true); return false; }
      stopAudio();                       // nunca grabar mientras habla el sintetizador
      // Si había otra grabación en marcha se descarta, y se avisa a su pantalla
      // para que su botón vuelva al reposo en vez de quedarse en «Parar».
      var previa = ses; ses = null;
      soltar();
      if (previa) previa.onCancel && previa.onCancel();
      crear();
      r.lang = (voice && voice.lang) || 'en-GB';
      ses = { texto: '', onParcial: o.onParcial, onFin: o.onFin, onError: o.onError, onCancel: o.onCancel, parando: false, fatal: false };
      cortes = 0; ultimo = 0;
      try { r.start(); }
      catch (x) {
        ses = null;
        soltar();
        o.onError && o.onError('El micrófono no ha arrancado. Cierra cualquier programa que lo esté usando, recarga la página y vuelve a intentarlo.', true);
        o.onCancel && o.onCancel();
        return false;
      }
      return true;
    },
    stop: function () {
      if (!ses) return;
      ses.parando = true;
      if (!r) { cerrar(ses.texto); return; }
      try { r.stop(); } catch (x) { cerrar(ses.texto); }
    },
    // Al cambiar de pantalla: se corta sin avisar a nadie.
    abort: function () {
      var s2 = ses; ses = null;
      soltar();
      if (s2) s2.onCancel && s2.onCancel();
    }
  };
})();

// ---------- utilidades ----------
function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function pick(a, n) { return shuffle(a).slice(0, n); }
function norm(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim(); }
function vparts(v) { var p = v.split('|'); return { w: p[0], es: p[1], ex: p[2] || '', g: p[3] || '' }; }
function spkBtn(text, rate) {
  var b = el('<button class="spk" title="Escuchar" aria-label="Escuchar">▶</button>');
  b.onclick = function (e) { e.stopPropagation(); speak(text, { rate: rate }); };
  return b;
}
function gapHtml(q) { return esc(q).replace(/___+/g, '<b class="gap">_______</b>'); }

// ---------- estadísticas ----------
var CATS = { gram: 'Gramática', lex: 'Léxico', read: 'Comprensión lectora', list: 'Comprensión oral', prod: 'Producción escrita', cam: 'Uso del inglés (Cambridge)' };
function rec(cat, ok, label) {
  if (!cat) return;
  var s = S.stats[cat] = S.stats[cat] || { ok: 0, tot: 0 };
  s.tot++; if (ok) s.ok++;
  if (!ok && label) { var t = String(label).replace(/<[^>]+>/g, '').slice(0, 90); S.fallos[t] = (S.fallos[t] || 0) + 1; }
}
function pctCat(c) { var s = S.stats[c]; return s && s.tot ? Math.round(s.ok / s.tot * 100) : null; }

// ---------- constructores de ítems ----------
function qMC(q, ops, k, exp, cat) { return { t: 'mc', q: q, o: ops, k: k, exp: exp || '', cat: cat || (/significa/i.test(q) ? 'lex' : 'gram') }; }
function qDic(s) { return { t: 'dic', s: s, cat: 'list' }; }
function qTr(es, en) { return { t: 'tr', es: es, en: en, cat: 'prod' }; }
function qOC(str) { var p = str.split('|'); return { t: 'oc', q: p[0], a: p[1], cat: 'cam', part: 'Part 2 · Open cloze' }; }
function qWF(str) { var p = str.split('|'); return { t: 'wf', q: p[0], root: p[1], a: p[2], cat: 'cam', part: 'Part 3 · Word formation' }; }
function qKWT(str, lo, hi) { var p = str.split('|'); return { t: 'kwt', orig: p[0], key: p[1], q: p[2], a: p[3], lo: lo || 2, hi: hi || 5, cat: 'cam', part: 'Part 4 · Key word transformation' }; }
function camPool(id, type) { return (CAM[id] && CAM[id][type]) || []; }
function camItems(id, type, n) {
  var pool = camPool(id, type); if (!pool.length) return [];
  var lo = (id === 'C1') ? 3 : 2, hi = (id === 'C1') ? 6 : 5;
  return pick(pool, n).map(function (s) { return type === 'oc' ? qOC(s) : type === 'wf' ? qWF(s) : qKWT(s, lo, hi); });
}
function anexoQuestions(id, n) {
  var pool = [];
  var A = ANX[id] || {};
  Object.keys(A).forEach(function (k) { (A[k].test || []).forEach(function (t) { pool.push(t); }); });
  return pick(pool, n).map(function (t) { var q = qMC(t.q, t.o, t.k, t.exp, 'lex'); q.part = 'Anexo · Arquitectura y negocios'; return q; });
}
function vocabQuestions(days, n) {
  var all = [];
  days.forEach(function (d) { d.vocab.forEach(function (v) { all.push(vparts(v)); }); });
  return pick(all, n).map(function (v) {
    var wrong = pick(all.filter(function (x) { return x.es !== v.es; }), 3).map(function (x) { return x.es; });
    var ops = shuffle([v.es].concat(wrong));
    return qMC('<b>' + esc(v.w) + '</b> significa…', ops, ops.indexOf(v.es), v.ex, 'lex');
  });
}
function gramQuestions(days, n) {
  var all = [];
  days.forEach(function (d) { (d.test || []).forEach(function (t) { if (t.o) all.push(t); }); });
  return pick(all, n).map(function (t) { return qMC(t.q, t.o, t.k, t.exp); });
}
function dicQuestions(days, n) {
  var all = []; days.forEach(function (d) { d.chunks.forEach(function (c) { all.push(c); }); });
  return pick(all, n).map(qDic);
}
function trQuestions(days, n) {
  var all = []; days.forEach(function (d) { if (d.prod && d.prod.tr) all.push(d.prod.tr); });
  return pick(all, n).map(function (p) { return qTr(p[0], p[1]); });
}

// ---------- router ----------
var app = document.getElementById('app');
function go(v, arg) { stopAudio(); location.hash = arg != null ? v + '/' + arg : v; }
window.addEventListener('hashchange', route);
function route() {
  MIC.abort();                       // nunca dejar el micrófono abierto al cambiar de pantalla
  pararCrono();                      // ni un cronómetro corriendo contra una pantalla que ya no está
  var h = location.hash.replace('#', '') || 'home';
  var p = h.split('/');
  document.querySelectorAll('.tab[data-go]').forEach(function (b) { b.classList.toggle('on', b.dataset.go === p[0]); });
  window.scrollTo(0, 0);
  app.classList.toggle('sin-tr', S.trad === false);   // la traducción al español, encendida o apagada, en toda la aplicación
  ({ home: vHome, plan: vPlan, repaso: vRepaso, progreso: vProgreso, oral: vOral, habla: vHabla, verbos: vVerbos, derivadas: vDerivadas, familias: vFamilias, frases: vFrases, gimnasio: vGimnasio, examenes: vExamenes, dia: vDia, examen: vExamen, simulacro: vSimulacro }[p[0]] || vHome)(p[1]);
}

// ---------- motor de tests ----------
function runTest(host, items, opts, done) {
  opts = opts || {};
  var i = 0, aciertos = 0, fallos = [], porCat = {};
  host.innerHTML = '<div id="tq"></div>';
  var box = host.querySelector('#tq');
  paint();

  function next(ok, item) {
    if (ok) aciertos++; else fallos.push(item);
    porCat[item.cat] = porCat[item.cat] || { ok: 0, tot: 0 };
    porCat[item.cat].tot++; if (ok) porCat[item.cat].ok++;
    rec(item.cat, ok, item.t === 'mc' ? item.q : item.t === 'dic' ? item.s : item.t === 'tr' ? item.es : item.q);
    i++;
    var seguir = function () { i < items.length ? paint() : end(); };
    if (ok) { setTimeout(seguir, 900); return; }
    // Al fallar hay algo que leer: la solución y su explicación. Nada de
    // cuenta atrás — se avanza cuando tú quieras, con el botón o con Enter.
    var q = box.querySelector('#qq') || box;
    // Un fallo es el momento en que más se aprende, así que aquí se recuerda
    // qué hacer con él en vez de dejar pasar la pregunta.
    if (opts.protocolo) q.appendChild(el('<div class="proto"><b>Qué hacer ahora</b>' + opts.protocolo + '</div>'));
    var r = el('<div class="row" style="margin-top:12px"></div>');
    var b = el('<button class="btn small">Continuar →</button>');
    b.onclick = function () { document.removeEventListener('keydown', tecla); seguir(); };
    function tecla(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.removeEventListener('keydown', tecla); seguir(); }
    }
    document.addEventListener('keydown', tecla);
    r.appendChild(b);
    r.appendChild(el('<span class="dim small">Tómate el tiempo que necesites. También vale la tecla Intro.</span>'));
    q.appendChild(r);
    b.focus();
  }
  function end() {
    stopAudio(); save();
    var pct = Math.round(aciertos / items.length * 100);
    var pass = pct >= (opts.min || 70);
    var det = Object.keys(porCat).map(function (c) {
      return '<div class="small dim">' + (CATS[c] || c) + ': <b>' + porCat[c].ok + '/' + porCat[c].tot + '</b></div>';
    }).join('');
    box.innerHTML = '<div class="card" style="text-align:center"><span class="score ' + (pass ? 'ok-t' : 'bad-t') + '">' + pct + '%</span>' +
      '<p>' + aciertos + ' de ' + items.length + ' correctas · ' + (pass ? '<b class="ok-t">' + (opts.pasoTxt || 'Superado') + '</b>' : '<b class="bad-t">No superado — repite y vuelve a intentarlo</b>') + '</p>' +
      '<div class="row" style="justify-content:center;gap:18px;margin:10px 0">' + det + '</div>' +
      (fallos.length ? '<div style="text-align:left"><h3>Para repasar</h3>' + fallos.map(function (f) {
        var txt = f.t === 'dic' ? f.s : f.t === 'tr' ? f.en : f.t === 'mc' ? (f.q + ' → ' + f.o[f.k]) : (f.q + ' → ' + f.a);
        return '<div class="small dim">• ' + esc(txt.replace(/<[^>]+>/g, '')) + '</div>';
      }).join('') + '</div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:16px" id="tend"></div></div>';
    var again = el('<button class="btn sec">Repetir test</button>');
    again.onclick = function () { runTest(host, shuffle(items), opts, done); };
    box.querySelector('#tend').appendChild(again);
    done && done(pct, pass, box.querySelector('#tend'));
  }

  function paint() {
    var it = items[i];
    box.innerHTML = '';
    var head = '<div class="row between"><span class="dim small">Pregunta ' + (i + 1) + ' de ' + items.length + '</span>' +
      (it.part ? '<span class="tagp">' + esc(it.part) + '</span>' : '') + '</div>';
    var c = el('<div class="card">' + head + '<div id="qq"></div></div>');
    box.appendChild(c);
    var q = c.querySelector('#qq');

    if (it.t === 'mc') {
      // La explicación se pinta como HTML: viene de nuestros datos, no de lo
      // que escribe nadie, y muchas llevan la palabra clave en negrita.
      q.appendChild(el('<div class="qt">' + it.q + '</div>'));
      it.o.forEach(function (o, oi) {
        var b = el('<button class="opt">' + esc(o) + '</button>');
        b.onclick = function () {
          q.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var ok = oi === it.k;
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) q.querySelectorAll('.opt')[it.k].classList.add('ok');
          q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ Correcto.' : '✖ La respuesta es: ' + esc(it.o[it.k])) + (it.exp ? ' <span class="dim">' + it.exp + '</span>' : '') + '</div>'));
          if (it.say) speak(it.say);   // se oye la frase inglesa resuelta, no la explicación en español
          next(ok, it);
        };
        q.appendChild(b);
      });
      return;
    }

    // tipos con respuesta escrita
    var prompt = '', hint = '', audio = null;
    if (it.t === 'dic') { prompt = 'Escucha y escribe la frase exacta'; audio = it.s; }
    else if (it.t === 'tr') { prompt = 'Traduce al inglés: <i>' + esc(it.es) + '</i>'; }
    else if (it.t === 'oc') { prompt = 'Completa el hueco con <b>UNA sola palabra</b>:<br>' + gapHtml(it.q); }
    else if (it.t === 'wf') {
      prompt = 'Cambia la terminación de <b>' + esc(it.root) + '</b> para que encaje en el hueco:<br>' + gapHtml(it.q);
      hint = 'No se traduce: se escribe otra palabra de la misma familia (RELAX → relaxing, relaxed, relaxation). ' +
        'Mira qué pide el hueco —sustantivo, adjetivo o adverbio— y si el sentido es negativo. ' +
        '<a href="#derivadas" target="_blank">Ver la tabla de derivadas</a>.';
    }
    else if (it.t === 'kwt') {
      prompt = 'Reescribe la frase con la palabra clave, sin cambiarla:<br><i>' + esc(it.orig) + '</i><br><b class="key">' + esc(it.key) + '</b><br>' + gapHtml(it.q);
      hint = 'Entre ' + it.lo + ' y ' + it.hi + ' palabras.';
    }
    q.appendChild(el('<div class="qt">' + prompt + '</div>'));
    if (hint) q.appendChild(el('<div class="small dim" style="margin-bottom:6px">' + hint + '</div>'));
    if (it.t === 'oc') q.appendChild(el('<div class="small dim" style="margin-bottom:6px">Va una palabra gramatical: preposición, auxiliar, artículo, pronombre o conjunción. Nunca un verbo con significado propio.</div>'));
    if (audio) {
      var rw = el('<div class="row" style="margin:8px 0"></div>');
      rw.appendChild(spkBtn(audio));
      var slow = el('<button class="btn sec small">Más despacio</button>');
      slow.onclick = function () { speak(audio, { rate: 0.62 }); };
      rw.appendChild(slow); q.appendChild(rw);
    }
    var inp = el('<input type="text" autocomplete="off" spellcheck="false" placeholder="' + (it.t === 'dic' ? 'Escribe lo que oyes…' : 'Tu respuesta…') + '">');
    q.appendChild(inp);
    var send = el('<button class="btn small" style="margin-top:10px">Comprobar</button>');
    send.onclick = function () {
      var mine = norm(inp.value), sol = norm(it.t === 'dic' ? it.s : it.t === 'tr' ? it.en : it.a);
      var ok = mine === sol;
      if (!ok && it.t === 'kwt') { var alt = norm(it.a.replace(/ not /g, " n't ")); ok = mine === alt; }
      var words = mine ? mine.split(' ').length : 0;
      var lenBad = it.t === 'kwt' && ok === false && (words < it.lo || words > it.hi);
      inp.disabled = true; send.disabled = true;
      var sol = it.t === 'dic' ? it.s : it.t === 'tr' ? it.en : it.a;
      var msg = ok ? '✔ Correcto.' : '✖ Solución: <b>' + esc(sol) + '</b>' + (lenBad ? ' <span class="dim">(tu respuesta tenía ' + words + ' palabras)</span>' : '');
      q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + msg + '</div>'));
      // Con frases enteras la solución sola no enseña nada: se marca palabra a
      // palabra lo que sobra y lo que falta, y se nombra el tipo de error.
      if (!ok && toks(sol).length >= 3) q.appendChild(el(correccion(inp.value, sol)));
      if (it.t === 'dic' || it.t === 'tr') speak(it.t === 'dic' ? it.s : it.en);
      next(ok, it);
    };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') send.click(); });
    q.appendChild(send);
    if (audio) speak(audio);
    setTimeout(function () { inp.focus(); }, 60);
  }
}

// ---------- corrección modo profesor: diferencia palabra a palabra ----------
// Cuando fallas una frase entera no basta con enseñarte la solución: hay que
// enseñarte QUÉ palabra falló y POR QUÉ. Se compara lo que has escrito con el
// modelo por subsecuencia común más larga y se marca lo que sobra, lo que
// falta y lo que está cambiado de sitio. Luego se diagnostica el tipo de fallo.
function toks(t) { return String(t).trim().split(/\s+/).filter(Boolean); }
function limpiaTok(w) { return String(w).toLowerCase().replace(/[’']/g, "'").replace(/[.,;:!?"«»()]/g, ''); }

function diffPalabras(mias, buenas) {
  var A = mias.map(limpiaTok), B = buenas.map(limpiaTok);
  var n = A.length, m = B.length, i, j;
  var L = []; for (i = 0; i <= n; i++) { L[i] = []; for (j = 0; j <= m; j++) L[i][j] = 0; }
  for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
    L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  var out = []; i = 0; j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push({ op: '=', w: buenas[j] }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out.push({ op: '-', w: mias[i] }); i++; }
    else { out.push({ op: '+', w: buenas[j] }); j++; }
  }
  while (i < n) { out.push({ op: '-', w: mias[i] }); i++; }
  while (j < m) { out.push({ op: '+', w: buenas[j] }); j++; }
  return out;   // '=' coincide · '-' sobra en la tuya · '+' falta, está en la buena
}

var ART = { a: 1, an: 1, the: 1 };
var SUJ = { i: 1, you: 1, he: 1, she: 1, it: 1, we: 1, they: 1, there: 1 };
var AUX = { do: 1, does: 1, did: 1, is: 1, are: 1, was: 1, were: 1, am: 1 };
var AUXP = { have: 1, has: 1, had: 1, will: 1, would: 1, can: 1, could: 1, should: 1, must: 1 };
var TERC = { he: 1, she: 1, it: 1 };
var PREP = { in: 1, on: 1, at: 1, to: 1, for: 1, from: 1, of: 1, with: 1, by: 1, into: 1, under: 1, over: 1 };

// Diagnóstico: los errores típicos del hispanohablante, nombrados con su regla.
function diagnostico(mias, buenas, d) {
  var faltan = d.filter(function (x) { return x.op === '+'; }).map(function (x) { return limpiaTok(x.w); });
  var sobran = d.filter(function (x) { return x.op === '-'; }).map(function (x) { return limpiaTok(x.w); });
  var msg = [];
  var mismasPalabras = mias.length === buenas.length && !faltan.length && !sobran.length;
  // Si no hay ni una palabra distinta, lo único que cambiaba era una mayúscula,
  // una tilde o un punto: decir «falló el orden» sería mentirte.
  if (!faltan.length && !sobran.length && mias.join(' ') !== buenas.join(' ')) {
    return ['<b>Las palabras eran todas correctas y estaban en su sitio.</b> Lo único que ha fallado ha sido la escritura: ' +
      'una mayúscula, una coma o el punto final. En el examen escrito eso resta, así que conviene cogerlo como costumbre: ' +
      'mayúscula inicial, punto al final y <b class="en">I</b> siempre en mayúscula, vaya donde vaya.'];
  }
  var setM = {}, setB = {};
  mias.forEach(function (w) { setM[limpiaTok(w)] = 1; });
  buenas.forEach(function (w) { setB[limpiaTok(w)] = 1; });
  var mismoLexico = Object.keys(setB).every(function (k) { return setM[k]; }) &&
                    Object.keys(setM).every(function (k) { return setB[k]; });

  if (mismasPalabras) {
    msg.push('<b>Tenías todas las palabras.</b> Lo único que falló fue el orden, que en inglés es mucho más rígido que en español: sujeto + verbo + complemento, y el adjetivo siempre delante del sustantivo.');
  } else if (mismoLexico) {
    msg.push('<b>Las palabras eran las correctas y las has repetido, pero no en su sitio.</b> En inglés la posición de una palabra es parte de su significado: cambiarla de sitio cambia lo que dices.');
  }
  // Cuando el léxico es idéntico y solo cambia el orden, hablar de palabras
  // «que faltan» o «que sobran» despista: no falta ninguna, están movidas.
  if (mismoLexico || mismasPalabras) {
    var prim = null;
    for (var z = 0; z < d.length; z++) if (d[z].op !== '=') { prim = d[z].w; break; }
    if (prim) msg.push('La primera palabra que se sale de sitio es <b class="en">' + esc(prim) +
      '</b>. Reconstruye la frase desde el principio preguntándote, en este orden: ¿quién lo hace? ¿qué hace? ¿a qué o a quién? ' +
      'y solo al final el resto (dónde, cuándo, cómo).');
    return msg.slice(0, 3);
  }
  faltan.forEach(function (w) {
    if (SUJ[w]) msg.push('Te has dejado el sujeto <b class="en">' + esc(w) + '</b>. En español se puede decir «llueve» o «es caro»; en inglés <b>el sujeto nunca se omite</b>: <i>it rains</i>, <i>it is expensive</i>, <i>there is</i>.');
    else if (ART[w]) msg.push('Falta el artículo <b class="en">' + esc(w) + '</b>. El inglés lo exige delante de un sustantivo contable en singular: <i>an architect</i>, no <i>architect</i>.');
    else if (AUX[w]) msg.push('Falta el auxiliar <b class="en">' + esc(w) + '</b>. Las preguntas y las negativas en inglés no se hacen con la entonación como en español: necesitan <i>do / does / did</i> o el verbo <i>be</i>.');
    else if (AUXP[w]) msg.push('Falta <b class="en">' + esc(w) + '</b>. En inglés el tiempo verbal se construye con un auxiliar delante del participio o del infinitivo (<i>I have worked</i>, <i>I will send</i>): el verbo solo no basta, aunque en español baste.');
    else if (PREP[w]) msg.push('Falta la preposición <b class="en">' + esc(w) + '</b>. No se traduce desde el español: va pegada a la palabra que la rige y se aprende con ella.');
    else if (/^to$/.test(w)) msg.push('Falta el <b class="en">to</b> del infinitivo.');
  });
  sobran.forEach(function (w) {
    if (ART[w]) msg.push('Sobra el artículo <b class="en">' + esc(w) + '</b>. En inglés no se pone delante de nombres en plural o incontables cuando se habla en general: <i>architects work…</i>, no <i>the architects work…</i>.');
    else if (PREP[w]) msg.push('Sobra la preposición <b class="en">' + esc(w) + '</b>: ese verbo en inglés va directo, sin preposición detrás.');
  });
  // concordancia de tercera persona y plurales
  for (var i = 0; i < d.length - 1; i++) {
    if (d[i].op === '-' && d[i + 1].op === '+') {
      var a = limpiaTok(d[i].w), b = limpiaTok(d[i + 1].w);
      if (b === a + 's' || b === a + 'es') {
        var antes = i > 0 ? limpiaTok(d[i - 1].w) : '';
        msg.push('Escribiste <b class="en">' + esc(a) + '</b> y era <b class="en">' + esc(b) + '</b>: ' +
          (TERC[antes] ? 'falta la <b>-s</b> de la tercera persona. Con <i>he</i>, <i>she</i> e <i>it</i> el verbo la lleva siempre en presente: <i>he works</i>, <i>she designs</i>, <i>it costs</i>.'
                       : 'falta una <b>-s</b>: o es el plural del sustantivo o es la tercera persona del verbo. En inglés el plural se marca aunque haya un número delante: <i>three walls</i>, no <i>three wall</i>.'));
      }
      else if (a === b + 's' || a === b + 'es') msg.push('Escribiste <b class="en">' + esc(a) + '</b> y era <b class="en">' + esc(b) + '</b>: aquí sobra la -s.');
      else if (PREP[a] && PREP[b]) msg.push('Cambiaste <b class="en">' + esc(a) + '</b> por <b class="en">' + esc(b) + '</b>. Es un fallo de preposición, no de vocabulario: repásalas en el gimnasio, en «¿Cuál encaja?».');
      else if (a.replace(/[^a-z]/g, '') === b.replace(/[^a-z]/g, '')) msg.push('Solo cambiaba un signo o una mayúscula: <b class="en">' + esc(b) + '</b>.');
    }
  }
  if (!msg.length) msg.push('Compara las dos líneas de arriba palabra por palabra: lo tachado sobra y lo subrayado falta. Ese hueco es exactamente lo que hay que memorizar.');
  return msg.slice(0, 4);
}

// La corrección completa: tu frase marcada, la buena marcada y el porqué.
function correccion(mio, bueno) {
  var mias = toks(mio), buenas = toks(bueno);
  var d = diffPalabras(mias, buenas);
  var tuya = d.filter(function (x) { return x.op !== '+'; }).map(function (x) {
    return x.op === '-' ? '<s class="sobra">' + esc(x.w) + '</s>' : esc(x.w);
  }).join(' ');
  var suya = d.filter(function (x) { return x.op !== '-'; }).map(function (x) {
    return x.op === '+' ? '<u class="falta">' + esc(x.w) + '</u>' : esc(x.w);
  }).join(' ');
  var dg = diagnostico(mias, buenas, d);
  return '<div class="corr">' +
    '<div class="corr-l"><span class="et">Lo que has escrito</span><p class="en">' + (tuya || '<span class="dim">(en blanco)</span>') + '</p></div>' +
    '<div class="corr-l ok"><span class="et">Cómo se dice</span><p class="en">' + suya + '</p></div>' +
    '<p class="small dim leyenda"><s class="sobra">tachado</s> sobra · <u class="falta">subrayado</u> falta</p>' +
    '<div class="porque"><b>Por qué:</b><ul>' + dg.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
    '</div>';
}

// ---------- ítems en inglés generados del propio día ----------
// El test diario venía con cada vez más español según subía el nivel: en C1
// dos de cada tres preguntas estaban en castellano. En el examen real de
// Cambridge no hay una sola palabra de español, así que a partir de B1 las
// preguntas con apoyo en español se van sustituyendo por estas, construidas
// con las frases inglesas del propio día.
var ES_RE = /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|que|de|para|con|es|son|qué|cuál|cuándo|significa|quiere decir|elige|incorrecta|traduce)\b/i;
function tieneEspanol(t) {
  if (ES_RE.test(String(t.q || ''))) return true;
  return (t.o || []).some(function (o) { return ES_RE.test(String(o)); });
}
// Cuánto español se tolera en el test de cada nivel. En A1 y A2 el apoyo en
// la lengua materna ayuda; a partir de B2 estorba, y en C1 no pinta nada.
var CUPO_ES = { A1: 1, A2: 1, B1: 0.65, B2: 0.25, C1: 0 };

var GRAMATICALES = ['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by',
  'that', 'which', 'it', 'there', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had',
  'do', 'does', 'did', 'not', 'and', 'but', 'so', 'if', 'as', 'than', 'too', 'up', 'out', 'about'];
var VACIAS = { i: 1, you: 1, he: 1, she: 1, we: 1, they: 1, my: 1, your: 1, this: 1, these: 1, very: 1, please: 1 };

// Frases inglesas del día: los chunks y la parte inglesa del diálogo.
function frasesDelDia(D) {
  var v = (D.chunks || []).slice();
  (D.dial && D.dial.l || []).forEach(function (l) {
    var p = String(l).split('|');
    if (p.length >= 2 && p[1]) v.push(p[1]);
  });
  return v.filter(function (f) { return String(f).split(/\s+/).length >= 5; });
}

function itemsIngles(D, L, cuantos) {
  var frases = frasesDelDia(D), out = [];
  if (!frases.length) return out;
  var voc = (D.vocab || []).map(vparts).map(function (x) { return x.w; })
    .filter(function (w) { return /^[a-z]+$/i.test(w); });

  shuffle(frases).forEach(function (f) {
    if (out.length >= cuantos) return;
    var pal = f.replace(/[.!?]$/, '').split(/\s+/);
    // open cloze: se tapa una palabra gramatical y se escribe
    var idx = [];
    pal.forEach(function (w, i) {
      if (i === 0) return;
      if (GRAMATICALES.indexOf(w.toLowerCase().replace(/[^a-z']/g, '')) >= 0) idx.push(i);
    });
    if (idx.length && out.length < cuantos) {
      var i0 = idx[Math.floor(Math.random() * idx.length)];
      var sol = pal[i0].replace(/[^A-Za-z']/g, '');
      var copia = pal.slice(); copia[i0] = '___';
      out.push({ t: 'oc', q: copia.join(' '), a: sol, cat: 'cam', part: 'Open cloze · una sola palabra' });
    }
    // multiple-choice cloze: se tapa una palabra con contenido y se elige
    if (out.length < cuantos && voc.length >= 3) {
      var cand = [];
      pal.forEach(function (w, i) {
        var limpio = w.toLowerCase().replace(/[^a-z']/g, '');
        if (limpio.length < 4) return;
        if (GRAMATICALES.indexOf(limpio) >= 0 || VACIAS[limpio]) return;
        cand.push(i);
      });
      if (cand.length) {
        var i1 = cand[Math.floor(Math.random() * cand.length)];
        var buena = pal[i1].replace(/[^A-Za-z'-]/g, '');
        // Los señuelos se eligen con la misma terminación que la palabra tapada
        // siempre que se pueda: un distractor que no encaja ni gramaticalmente
        // se descarta solo y no mide nada.
        var fin = (buena.match(/(ing|ed|ly|tion|ment|ness|s)$/i) || [''])[0].toLowerCase();
        var libres = voc.filter(function (w) { return w.toLowerCase() !== buena.toLowerCase(); });
        var iguales = fin ? libres.filter(function (w) { return w.toLowerCase().slice(-fin.length) === fin; }) : [];
        var malas = pick(iguales, 3);
        if (malas.length < 3) malas = malas.concat(pick(libres.filter(function (w) { return malas.indexOf(w) < 0; }), 3 - malas.length));
        if (malas.length === 3) {
          var c2 = pal.slice(); c2[i1] = '___';
          var ops = shuffle([buena].concat(malas));
          var q = qMC('Choose the word that fits:<br>' + gapHtml(c2.join(' ')), ops, ops.indexOf(buena),
            'The full sentence is: <b class="en">' + esc(f) + '</b>', 'lex');
          q.part = 'Multiple-choice cloze';
          q.say = f;
          out.push(q);
        }
      }
    }
  });
  return out.slice(0, cuantos);
}

// Sustituye las preguntas con español por otras en inglés, según el nivel.
function ajustaNivel(base, D, L) {
  var cupo = CUPO_ES[L.id];
  if (cupo === undefined) cupo = 1;
  var conEs = base.filter(tieneEspanol), sinEs = base.filter(function (t) { return !tieneEspanol(t); });
  var dejar = Math.round(conEs.length * cupo);
  var quitar = conEs.length - dejar;
  if (quitar <= 0) return { items: base, cambiados: 0, total: base.length };
  var nuevos = itemsIngles(D, L, quitar);
  var items = sinEs.concat(pick(conEs, dejar), nuevos);
  return { items: items, cambiados: nuevos.length, total: items.length };
}

// ---------- examen de nivel con formato Cambridge ----------
function buildExam(L) {
  var id = L.id;
  var p1 = gramQuestions(L.dias, 4).concat(vocabQuestions(L.dias, 2));
  p1.forEach(function (x) { x.part = 'Part 1 · Multiple-choice cloze'; });
  p1 = p1.concat(anexoQuestions(id, 2));
  var p2 = camItems(id, 'oc', 8);
  var p3 = camItems(id, 'wf', 8);
  var p4 = camItems(id, 'kwt', 6);
  if (!p4.length) { p4 = vocabQuestions(L.dias, 6); p4.forEach(function (x) { x.part = 'Part 4 · Vocabulario del módulo'; }); }
  var p5 = dicQuestions(L.dias, 6); p5.forEach(function (x) { x.part = 'Listening · Dictation'; });
  var p6 = trQuestions(L.dias, 4); p6.forEach(function (x) { x.part = 'Writing · Sentence transformation'; });
  return p1.concat(p2, p3, p4, p5, p6);
}

// ---------- evaluador de expresión escrita ----------
// Cada regla trae, además de la explicación, el reemplazo que la corrige
// cuando la corrección es segura. Así el texto no solo se puntúa: se devuelve
// corregido y enfrentado al original, que es de donde se aprende.
var ERRORES = [
  [/\bi am agree\b/gi, 'I am agree → <b>I agree</b>', 'I agree'],
  [/\bi (?:have|had) (\d+|one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty) years\b/gi, 'I have X years → <b>I am X years old</b>', 'I am $1 years old'],
  [/\b(the )?people (is|was|has)\b/gi, 'people is → <b>people are</b> (people ya es plural)', null],
  [/\b(explain|say|suggest)\s+(me|him|her|us|them)\b/gi, 'explain me → <b>explain it to me</b> (say y suggest tampoco llevan la persona directa)', '$1 it to $2'],
  [/\binformations\b/gi, 'information es incontable: no tiene plural', 'information'],
  [/\badvices\b/gi, 'advice es incontable: no tiene plural', 'advice'],
  [/\bfurnitures\b/gi, 'furniture es incontable: no tiene plural', 'furniture'],
  [/\b(knowledges|equipments|softwares|works of me)\b/gi, 'sustantivo incontable en plural → <b>knowledge, equipment, software</b>', null],
  [/\bdepend(s|ed)? (of|in)\b/gi, 'depend of → <b>depend on</b>', 'depend$1 on'],
  [/\bsince (\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few) (years|months|days|weeks|hours)\b/gi, 'since + duración → <b>for</b> + duración (since se usa con un punto de partida: since 2019, since Monday)', 'for $1 $2'],
  [/\bchilds\b/gi, 'plural irregular → <b>children</b>', 'children'],
  [/\bmans\b/gi, 'plural irregular → <b>men</b>', 'men'],
  [/\bwomans\b/gi, 'plural irregular → <b>women</b>', 'women'],
  [/\bpeoples\b/gi, 'people ya es plural → <b>people</b>', 'people'],
  [/\b(a|an) (advice|information|news|furniture|homework)\b/gi, 'incontable con artículo indefinido → <b>a piece of advice</b>, <b>some information</b>', 'some $2'],
  [/\bassist(ed)? to\b/gi, 'assist to → <b>attend</b> (assist significa ayudar)', 'attend'],
  [/\bdespite of\b/gi, 'despite of → <b>despite</b> (sin of) o <b>in spite of</b>', 'despite'],
  [/\bmore (easy|big|cheap|fast|happy|simple|early|small|young|old|high|low)\b/gi, 'adjetivo corto: no lleva more, lleva <b>-er</b>', null],
  [/\bmore better\b/gi, 'more better → <b>better</b>', 'better'],
  [/\bmore worse\b/gi, 'more worse → <b>worse</b>', 'worse'],
  [/\bthe most (easy|big|cheap|fast|happy|simple|early|small|young|old|high|low)\b/gi, 'adjetivo corto: no lleva the most, lleva <b>the -est</b>', null],
  [/\b(am|is|are|was|were) used to (\w+?)(?!ing)\b(?=\s|[.,;])/gi, 'be used to + <b>-ing</b>: I am used to work<b>ing</b>', null],
  [/(^|[.!?]\s+)Is\s+(very|a |an |the |not |good|bad|important|possible|difficult|easy)/g, 'falta el sujeto: <b>It is…</b> El inglés nunca omite el sujeto', '$1It is $2'],
  [/(^|[.!?]\s+)(?:Are|Were|Was|Am)\s+(very|a |an |the |not |good|bad|important|possible|difficult|easy)/g, 'falta el sujeto. El inglés nunca lo omite: <b>It is</b>, <b>They are</b>, <b>There is</b>…', null],
  [/\bin the actuality\b/gi, 'in the actuality → <b>currently</b> / <b>at the moment</b>', 'currently'],
  [/\bactually,? (i|we) (live|work|study)\b/gi, '«actually» no es «actualmente»: significa «en realidad» → <b>currently</b>', null],
  [/\bfor to (\w+)/gi, 'for to do → <b>to do</b>', 'to $1'],
  [/\bi\s+(think|believe|hope)\s+that\s+yes\b/gi, 'I think that yes → <b>I think so</b>', 'I $1 so'],
  [/\bdo(?:n't| not) (know|have) nothing\b/gi, 'doble negación → <b>do not know anything</b>', "don't $1 anything"],
  [/\b(he|she|it)\s+(have)\b/gi, 'tercera persona → <b>$1 has</b>', '$1 has'],
  [/\b(he|she|it)\s+(do)\b(?!\s+not)/gi, 'tercera persona → <b>$1 does</b>', '$1 does'],
  [/\b(he|she|it)\s+go\b/gi, 'tercera persona → <b>goes</b> (no «gos»)', '$1 goes'],
  [/\b(he|she|it)\s+(work|live|want|need|make|take|say|think|like|know|come|look|seem|cost|open|close)\b/gi, 'tercera persona sin -s: el verbo la lleva siempre con he, she e it', '$1 $2s'],
  [/\bthe next (week|month|year|time)\b/gi, 'the next week → <b>next week</b> (sin artículo)', 'next $1'],
  [/\bthe last (week|month|year|time|night)\b/gi, 'the last week → <b>last week</b> (sin artículo)', 'last $1'],
  [/\bhow is called\b/gi, 'how is called → <b>what is it called</b>', 'what is it called'],
  [/\bi am (agree|boring|afraid of that)\b/gi, 'cuidado: <b>I agree</b>, y <b>I am bored</b> si te aburres tú', null],
  [/\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, 'los días llevan <b>on</b>, no in', 'on $1'],
  [/\bin the morning of\b/gi, 'una fecha concreta lleva <b>on</b>: on the morning of…', 'on the morning of'],
  [/\bdifferent of\b/gi, 'different of → <b>different from</b>', 'different from'],
  [/\bmarried with\b/gi, 'married with → <b>married to</b>', 'married to'],
  [/\bthink in\b/gi, 'think in → <b>think about</b> / <b>think of</b>', 'think about'],
  [/\bdiscuss about\b/gi, 'discuss about → <b>discuss</b> (sin preposición)', 'discuss'],
  [/\benter to\b/gi, 'enter to → <b>enter</b> (sin preposición)', 'enter'],
  [/\bi am accord\b/gi, 'I am accord → <b>I agree</b>', 'I agree'],
  [/\bare agree\b/gi, 'are agree → <b>agree</b>', 'agree'],
  [/\bi'?m going to (\w+ing)\b/gi, 'be going to + <b>infinitivo</b>, no -ing', null],
  [/\bmake a (photo|party|question|mistake of)\b/gi, 'make a photo → <b>take a photo</b>; make a party → <b>have a party</b>; make a question → <b>ask a question</b>', null],
  [/\btake a decision\b/gi, 'take a decision → <b>make a decision</b>', 'make a decision'],
  [/\bdo a mistake\b/gi, 'do a mistake → <b>make a mistake</b>', 'make a mistake'],
  [/\bsince \d{4} (i|we) (work|live|study)\b/gi, 'con since el verbo va en <b>present perfect</b>: I have worked…', null],
  [/\bi\b(?=\s)/g, 'el pronombre <b>I</b> va siempre en mayúscula', 'I'],
  [/\b(can|could|must|should|will|would|may|might)\s+((?:i|you|he|she|we|they|it)\s+)?to\s+(\w+)/gi, 'los verbos modales van con <b>infinitivo sin to</b>: can pay, must go', '$1 $2$3'],
  [/(^|[.!?]\s+|\n)\s*(is|are|was|were)\s+(very|a |an |the |not |good|bad|important|possible|difficult|easy|expensive|cheap)/gi, 'falta el sujeto. El inglés nunca lo omite: <b>It is…</b>, <b>They are…</b>, <b>There is…</b>', null],
  [/\bevery days\b/gi, 'every days → <b>every day</b>', 'every day']
];
// Comprueba lo que pide el enunciado cuando trae una cifra: «6 líneas»,
// «80 palabras». Antes no se miraba, así que un diálogo de dos líneas podía
// sacar buena nota.
function pideEnunciado(txt) {
  var t = String(txt || '');
  var m = t.match(/(\d+)\s*(l[ií]neas?|frases?|palabras?|intervenciones?)/i);
  if (!m) return null;
  var k = m[2].toLowerCase();
  return { n: parseInt(m[1], 10), que: /palabra/.test(k) ? 'palabras' : /l[ií]nea|intervenc/.test(k) ? 'lineas' : 'frases' };
}

// Estructuras que separan un texto de A2 de uno de B2: subordinación,
// pasiva, tiempos perfectos y condicionales. Un texto sin errores pero
// hecho de frases cortas y sueltas no es C1: es A2 bien escrito.
var COMPLEJAS = [
  /\bbecause\b/i, /\balthough\b/i, /\beven though\b/i, /\bthough\b/i, /\bhowever\b/i,
  /\bwhich\b/i, /\bwhile\b/i, /\bwhereas\b/i, /\bdespite\b/i, /\bin spite of\b/i,
  /\bunless\b/i, /\bwhether\b/i, /\bso that\b/i, /\bin order to\b/i, /\brather than\b/i,
  /\bnot only\b/i, /\bas soon as\b/i, /\btherefore\b/i, /\bmoreover\b/i, /\bnevertheless\b/i,
  /\bas long as\b/i, /\bwould have\b/i, /\bcould have\b/i, /\bhad been\b/i,
  /\b(have|has|had) (been|worked|done|made|finished|lived|seen|taken|written|built)\b/i,
  /\b(was|were|is|are|been) (built|made|designed|finished|written|given|sent|used|opened)\b/i,
  /\bif .{3,40}\b(would|could|might)\b/i
];
function nivelPorComplejidad(r) {
  var t = r.original, usadas = 0;
  COMPLEJAS.forEach(function (re) { if (re.test(t)) usadas++; });
  var n = 1;                                   // 1=A2 2=B1 3=B2 4=C1
  if (r.avg >= 11 && usadas >= 2) n = 2;
  if (r.avg >= 14 && usadas >= 4 && r.ttr >= 48) n = 3;
  if (r.avg >= 17 && usadas >= 6 && r.ttr >= 55 && r.words >= 120) n = 4;
  if (r.words < 30) n = Math.min(n, 1);        // sin texto no hay pruebas
  else if (r.words < 60) n = Math.min(n, 2);
  if (r.errs.length >= 5) n = Math.min(n, 1);  // la corrección también manda
  else if (r.errs.length >= 3) n = Math.min(n, 2);
  return { n: n, usadas: usadas };
}

function evalEscrito(text, D, enunciado) {
  var t = String(text || '').trim();
  var words = t ? t.split(/\s+/).length : 0;
  var lineas = t.split(/\n+/).filter(function (l) { return l.trim().length > 1; }).length;
  var sents = t.split(/[.!?]+/).filter(function (x) { return x.trim().length > 2; });
  var avg = sents.length ? Math.round(words / sents.length) : 0;
  var tk = norm(t).split(' ').filter(Boolean);
  var uniq = {}; tk.forEach(function (w) { uniq[w] = 1; });
  var ttr = tk.length ? Math.round(Object.keys(uniq).length / tk.length * 100) : 0;

  // errores, con el trozo real del texto y la versión corregida
  var errs = [], corregido = t;
  ERRORES.forEach(function (r) {
    try {
      r[0].lastIndex = 0;
      var m = t.match(r[0]);
      if (!m) return;
      var frag = m[0].trim();
      if (!errs.some(function (e) { return e.txt.toLowerCase() === frag.toLowerCase(); }))
        errs.push({ txt: frag, exp: r[1], auto: !!r[2] });
      if (r[2]) { r[0].lastIndex = 0; corregido = corregido.replace(r[0], r[2]); }
    } catch (e) {}
  });

  // higiene: mayúsculas y punto final
  var forma = [];
  if (t && !/^[A-Z"“¿¡-]/.test(t)) forma.push('El texto empieza en minúscula.');
  if (t && !/[.!?"”]$/.test(t)) forma.push('Falta el punto final.');
  if (/[a-z]\s*\.\s*[a-z]/.test(t)) forma.push('Hay una frase que empieza en minúscula después de un punto.');

  // lo que pedía el enunciado
  var pide = enunciado || null, cumplePide = null;
  if (pide) {
    var hay = pide.que === 'palabras' ? words : pide.que === 'lineas' ? Math.max(lineas, sents.length) : sents.length;
    // Quedarse a un pelo no es incumplir: se da por bueno a partir del 90 %.
    cumplePide = { pedido: pide.n, hay: hay, que: pide.que, ok: hay >= Math.floor(pide.n * 0.9) };
  }

  var lt = t.toLowerCase();
  var chunksUsed = (D && D.chunks || []).filter(function (c) {
    var core = norm(c).split(' ').slice(0, 4).join(' ');
    return core.length > 6 && lt.indexOf(core) >= 0;
  });
  var vocabUsed = (D && D.vocab || []).map(vparts).filter(function (v) { return lt.indexOf(v.w.toLowerCase()) >= 0; });

  // Los cuatro criterios de Cambridge, cada uno sobre 5, como en el examen real
  var cont = 5;
  if (cumplePide && !cumplePide.ok) cont -= cumplePide.hay >= cumplePide.pedido * 0.7 ? 2 : 4;
  // La extensión solo se penaliza por palabras cuando la tarea no pedía otra
  // medida: un diálogo de seis líneas puede ser corto y estar perfecto.
  if (!(cumplePide && cumplePide.ok)) { if (words < 25) cont -= 3; else if (words < 40) cont -= 2; }
  cont = Math.max(0, Math.min(5, cont));

  var comu = 5;
  if (words < 30) comu -= 2;
  if (!chunksUsed.length) comu -= 1;
  comu = Math.max(0, Math.min(5, comu));

  var org = 5;
  if (sents.length < 3) org -= 2;
  if (avg > 28) org -= 2; else if (avg < 6 && sents.length > 2) org -= 1;
  if (forma.length) org -= Math.min(2, forma.length);
  org = Math.max(0, Math.min(5, org));

  var leng = 5;
  leng -= Math.min(4, errs.length);
  if (ttr < 45 && tk.length > 25) leng -= 1;
  if (vocabUsed.length >= 3) leng = Math.min(5, leng + 1);
  // Con menos de veinticinco palabras no hay pruebas suficientes para darle
  // un sobresaliente en lengua: no cometer errores no es lo mismo que acertar.
  if (words < 25) leng = Math.min(3, leng);
  leng = Math.max(0, Math.min(5, leng));

  var crit = [
    { t: 'Contenido', v: cont, q: 'Si has hecho lo que pedía la tarea y con la extensión pedida.' },
    { t: 'Logro comunicativo', v: comu, q: 'Si el texto cumple su función y usa el registro y las estructuras del día.' },
    { t: 'Organización', v: org, q: 'Si está ordenado, con frases de longitud razonable y bien puntuado.' },
    { t: 'Lenguaje', v: leng, q: 'Corrección gramatical y riqueza de vocabulario.' }
  ];
  var score = Math.round((cont + comu + org + leng) / 20 * 100);
  // En Cambridge el Contenido es eliminatorio: si no has hecho la tarea, no
  // importa lo bien escrito que esté lo que sí hiciste.
  if (cont <= 1) score = Math.min(score, 35);
  else if (cont === 2) score = Math.min(score, 55);

  var base = { words: words, sents: sents.length, lineas: lineas, avg: avg, ttr: ttr,
               errs: errs, forma: forma, pide: cumplePide, corregido: corregido,
               original: t, chunks: chunksUsed, vocab: vocabUsed,
               crit: crit, score: score };
  // La nota dice lo bien que has hecho ESTA tarea; la banda estima tu nivel,
  // y para eso no basta con no fallar: hace falta complejidad.
  var cx = nivelPorComplejidad(base);
  base.banda = ['A2', 'B1', 'B2', 'C1'][cx.n - 1];
  base.complejas = cx.usadas;
  return base;
}

function escritoHtml(r) {
  var h = '<div class="metrics">' +
    metric(r.words, 'palabras') + metric(r.sents, 'frases') + metric(r.avg, 'palabras/frase') +
    metric(r.ttr + '%', 'riqueza léxica') + metric(r.vocab.length, 'del vocabulario') + metric(r.chunks.length, 'chunks del día') +
    '</div>';

  h += '<div class="row between" style="margin-top:12px"><b>Puntuación de escritura</b>' +
    '<span><span class="pill ' + r.banda.toLowerCase() + '">' + r.banda + '</span> ' +
    '<span class="score sm ' + (r.score >= 70 ? 'ok-t' : r.score >= 50 ? '' : 'bad-t') + '">' + r.score + '</span></span></div>' +
    '<div class="bar"><i style="width:' + r.score + '%"></i></div>';

  // los cuatro criterios de Cambridge, como en el examen real
  h += '<h3>Los cuatro criterios de Cambridge</h3><div class="tablewrap"><table>' +
    '<tr><th>Criterio</th><th>Nota</th><th>Qué valora</th></tr>' +
    r.crit.map(function (c) {
      return '<tr><td><b>' + c.t + '</b></td><td class="' + (c.v >= 4 ? 'ok-t' : c.v <= 2 ? 'bad-t' : '') + '">' +
        c.v + ' / 5</td><td class="dim small">' + c.q + '</td></tr>';
    }).join('') + '</table></div>' +
    '<p class="small dim">Es la misma rejilla del <i>Writing</i> de Cambridge: cada criterio se puntúa de 0 a 5 y se suman. ' +
    'El <b>Contenido</b> es eliminatorio, como en el examen real: si la tarea no está hecha, da igual lo bien escrito que esté el resto.</p>' +
    '<div class="note small"><b>La nota y la banda miden cosas distintas.</b> La <b>nota</b> dice lo bien que has hecho <i>esta</i> tarea. ' +
    'La <b>banda</b> (' + r.banda + ') estima tu nivel, y para eso no basta con no cometer errores: hace falta <b>complejidad</b>. ' +
    'En este texto se han detectado <b>' + r.complejas + '</b> estructuras de nivel —subordinadas, pasiva, tiempos perfectos, condicionales— ' +
    'con una media de <b>' + r.avg + '</b> palabras por frase. Un texto impecable hecho de frases cortas y sueltas es un A2 bien escrito, no un C1.</div>';

  if (r.pide) {
    h += '<div class="note small ' + (r.pide.ok ? '' : 'aviso') + '"><b>Lo que pedía la tarea:</b> ' +
      r.pide.pedido + ' ' + r.pide.que + '. Has escrito <b>' + r.pide.hay + '</b>. ' +
      (r.pide.ok ? 'Cumplido.' : 'En el examen, no cumplir la extensión pedida es lo que más puntos cuesta, más que un error de gramática.') + '</div>';
  }

  if (r.errs.length) {
    h += '<h3>Correcciones (' + r.errs.length + ')</h3><ul class="errs">' +
      r.errs.map(function (e) {
        return '<li>En «<b class="en">' + esc(e.txt) + '</b>»: ' + e.exp +
          (e.auto ? '' : ' <span class="dim small">· esta la tienes que arreglar tú</span>') + '</li>';
      }).join('') + '</ul>';
    if (r.corregido !== r.original) {
      h += '<div class="corr"><div class="corr-l"><span class="et">Tu texto</span><p class="en">' + esc(r.original) + '</p></div>' +
        '<div class="corr-l ok"><span class="et">Corregido</span><p class="en">' + esc(r.corregido) + '</p></div>' +
        '<p class="small dim leyenda">Solo se corrigen automáticamente los errores que tienen una única solución posible. ' +
        'Los demás aparecen arriba explicados, para que los arregles tú: hacerlo tú es lo que fija la corrección.</p></div>';
    }
  } else if (r.words > 20) {
    h += '<p class="ok-t small" style="margin-top:10px">✔ Ningún error típico de hispanohablante detectado.</p>';
  }

  if (r.forma.length) {
    h += '<h3>Presentación</h3><ul class="errs">' + r.forma.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="small dim">Parece menor y no lo es: en el examen escrito la puntuación y las mayúsculas entran en el criterio de Organización.</p>';
  }

  if (r.vocab.length) h += '<p class="small dim">Vocabulario del día usado: ' + r.vocab.map(function (v) { return esc(v.w); }).join(', ') + '</p>';
  h += '<p class="small dim">El corrector cubre los cincuenta errores fosilizados más frecuentes del hispanohablante y la rejilla de Cambridge; ' +
    'no sustituye a una corrección humana, pero sí detecta lo que de verdad te está costando puntos.</p>';
  return h;
}

// ---------- gráficos (una sola serie · sin color categórico) ----------
function metric(v, l) { return '<div class="met"><b>' + v + '</b><span>' + l + '</span></div>'; }
function sparkline(vals, w, h) {
  if (vals.length < 2) return '<p class="small dim">Necesitas al menos dos días completados para ver la evolución.</p>';
  w = w || 640; h = h || 120;
  var pad = 14, n = vals.length;
  var x = function (i) { return pad + i * (w - pad * 2) / (n - 1); };
  var y = function (v) { return h - pad - (v / 100) * (h - pad * 2); };
  var d = vals.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
  var area = d + ' L' + x(n - 1).toFixed(1) + ' ' + (h - pad) + ' L' + x(0).toFixed(1) + ' ' + (h - pad) + ' Z';
  var grid = [0, 50, 70, 100].map(function (v) {
    return '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="gl' + (v === 70 ? ' thr' : '') + '"/>' +
      '<text x="2" y="' + (y(v) + 3) + '" class="gt">' + v + '</text>';
  }).join('');
  var last = vals[n - 1];
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="chart" role="img" aria-label="Evolución de las notas del test diario">' +
    grid + '<path d="' + area + '" class="sp-area"/><path d="' + d + '" class="sp-line"/>' +
    '<circle cx="' + x(n - 1) + '" cy="' + y(last) + '" r="4" class="sp-dot"><title>Último día: ' + last + '%</title></circle>' +
    '<text x="' + (x(n - 1) - 6) + '" y="' + (y(last) - 10) + '" class="gv" text-anchor="end">' + last + '%</text></svg>';
}
function bars(rows) {
  if (!rows.length) return '<p class="small dim">Aún no hay datos suficientes.</p>';
  return '<div class="bars">' + rows.map(function (r) {
    var v = r.v == null ? 0 : r.v;
    return '<div class="brow"><span class="blab">' + esc(r.l) + '</span>' +
      '<span class="btrack" title="' + esc(r.l) + ': ' + (r.v == null ? 'sin datos' : v + '%') + '"><i style="width:' + v + '%"></i></span>' +
      '<span class="bval">' + (r.v == null ? '—' : v + '%') + '</span>' +
      (r.n ? '<span class="bn">' + r.n + '</span>' : '<span class="bn"></span>') + '</div>';
  }).join('') + '</div>';
}

// ---------- vista: panel ----------
function vHome() {
  var done = doneDays().length;
  var hechoCore = doneDays().filter(function (n) { return n <= CORE; }).length;
  var hechoMod = done - hechoCore;
  var ultimo = maxDone();
  var next = siguiente(ultimo > 0 ? ultimo : 1);
  var h = '<h1>Tu plan</h1>' +
    '<p class="dim">Un Módulo 0 desde cero y el itinerario A2 → C1. Escuchar → imitar → entender → producir, una hora al día. ' +
    (S.doble ? '<b>Modo doble sesión activo</b>: dos días por jornada, mañana y tarde.' : 'Activa el <b>modo doble sesión</b> para hacer dos días diarios y llegar al C1 en tres meses.') + '</p>' +
    '<div class="card"><div class="row between"><div><b>' + hechoCore + ' / ' + CORE + '</b> días del itinerario A2 → C1' +
    (hechoMod ? ' <span class="dim small">· ' + hechoMod + '/30 del Módulo 0</span>' : '') +
    ' <span class="dim small">· ' + Object.keys(S.srs).length + ' palabras en el sistema · ' + srsDue().length + ' para repasar hoy</span></div>' +
    '<div class="row"><button class="btn sec small" id="dob">' + (S.doble ? '✓ Doble sesión' : 'Activar doble sesión') + '</button>' +
    '<button class="btn" id="cont">' + (done ? 'Continuar · ' + etiquetaDia(next) : 'Empezar Día 1') + '</button></div></div>' +
    '<div class="bar" style="margin-top:14px"><i style="width:' + (hechoCore / CORE * 100).toFixed(1) + '%"></i></div></div>';

  ORDEN.forEach(function (li) {
    var L = LEVELS[li], d0 = li * 30, dn = doneDays().filter(function (n) { return n > d0 && n <= d0 + 30; }).length;
    var ex = S.ex['exam' + L.id];
    h += '<div class="card"><div class="row between"><h2 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> ' + (L.mes ? 'Mes ' + L.mes + ' · ' : '') + L.nom + '</h2>' +
      '<span class="dim small mono">' + dn + '/30</span></div>' +
      (L.id === 'A1' ? '<div class="note small">Este módulo es <b>independiente</b>: puedes empezarlo hoy sin tocar tu avance del itinerario A2 → C1, y alternarlos. Sirve para reconstruir la base desde cero o para acompañar a alguien que empieza.</div>' : '') +
      '<p class="dim small">' + L.meta + '</p><div class="grid g5" id="g' + li + '"></div>' +
      '<div class="row" style="margin-top:14px">' +
      '<button class="btn sec small" data-ex="' + L.id + '"' + (dn < 30 ? ' disabled' : '') + '>Examen ' + L.id + (L.id === 'B2' || L.id === 'C1' ? ' · formato Cambridge' : '') + '</button>' +
      (ex ? '<span class="small ' + (ex.pass ? 'ok-t' : 'bad-t') + '">' + (ex.pass ? '✔ APTO' : '✖ no superado') + ' · ' + ex.pct + '%</span>'
          : '<span class="small dim">' + (dn < 30 ? 'se desbloquea al terminar los 30 días' : 'listo para examinarte') + '</span>') +
      '</div></div>';
  });
  app.innerHTML = h;

  ORDEN.forEach(function (li) {
    var L = LEVELS[li], g = document.getElementById('g' + li);
    for (var i = 1; i <= 30; i++) {
      var n = li * 30 + i, st = S.dias[n];
      var cls = 'day' + (st && st.fin ? ' done' : '') + (n === next ? ' now' : '') + (unlocked(n) ? '' : ' lock');
      var anx = !!anexoDe(L.id, i);
      var etq = st && st.fin ? st.pct + '%' : (i === 30 ? 'cierre' : i % 7 === 0 ? 'repaso' : '');
      var b = el('<div class="' + cls + (anx ? ' anxd' : '') + '" tabindex="0" title="' + (anx ? 'Incluye anexo profesional: ' + esc(anexoDe(L.id, i).tema) : etiquetaDia(n)) + '"><b>' + i + '</b><span class="sc">' + etq + '</span></div>');
      if (unlocked(n)) { b.onclick = (function (x) { return function () { go('dia', x); }; })(n); b.onkeydown = function (e) { if (e.key === 'Enter') this.click(); }; }
      g.appendChild(b);
    }
  });
  document.getElementById('cont').onclick = function () { go('dia', next); };
  document.getElementById('dob').onclick = function () { S.doble = !S.doble; save(); vHome(); };
  app.querySelectorAll('[data-ex]').forEach(function (b) { b.onclick = function () { go('examen', b.dataset.ex); }; });
}

// ---------- vista: método ----------
function vPlan() {
  var h = '<h1>El método</h1><p class="dim">' + C.metodo.intro + '</p>';
  h += '<div class="card"><h3>La hora, minuto a minuto</h3><div class="tablewrap"><table><tr><th>Bloque</th><th>Min</th><th>Qué hace tu cerebro</th></tr>';
  C.bloques.forEach(function (b, i) { h += '<tr><td><b>' + (i + 1) + '. ' + b.t + '</b></td><td>' + b.m + '</td><td class="dim">' + b.por + '</td></tr>'; });
  h += '</table></div></div>';
  h += '<div class="card"><h3>Doble sesión: dos días en una jornada</h3><p class="dim">' + C.doble.intro + '</p>' +
    '<div class="tablewrap"><table><tr><th>Franja</th><th>Min</th><th>Qué se hace y por qué</th></tr>' +
    C.doble.franjas.map(function (f) { return '<tr><td><b>' + f.t + '</b></td><td>' + f.m + '</td><td class="dim">' + f.por + '</td></tr>'; }).join('') +
    '</table></div><div class="note"><b>Regla innegociable</b><br>' + C.doble.regla + '</div></div>';
  h += '<div class="card"><h3>Mnemotecnia</h3><p class="dim">' + C.memo.intro + '</p><ol class="steps">' +
    C.memo.pasos.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol><div class="note">' + C.memo.ejemplo + '</div></div>';
  h += '<div class="card"><h3>Focalización mental</h3><ul>' + C.foco.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="card"><h3>Principios de adquisición</h3><ul>' + C.metodo.principios.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="card"><h3>Evaluación</h3><ul>' +
    '<li><b>Test diario</b> (12 ítems, con dos de formato Cambridge): ≥ 70 % para completar el día.</li>' +
    '<li><b>Repaso semanal</b> los días 7, 14, 21 y 28 de cada mes: el test se amplía con la semana anterior.</li>' +
    '<li><b>Examen de nivel</b> de 40 ítems al terminar cada mes, con la estructura del <b>Reading &amp; Use of English</b>: multiple-choice cloze, open cloze, word formation y key word transformation, más listening y transformación de frases. <b>≥ 75 % = APTO</b>.</li>' +
    '<li><b>Simulacro completo</b> por nivel, con el formato del examen oficial correspondiente —A2 Key, B1 Preliminary, B2 First y C1 Advanced—: comprensión lectora larga, gapped text, multiple matching, listening de formato oficial, writing con extensión medida y speaking en sus partes reales. Disponible desde el primer día, sin esperar a terminar el mes.</li>' +
    '<li><b>Evaluación oral</b> con reconocimiento de voz: fluidez, densidad léxica y uso de las estructuras objetivo.</li>' +
    '<li><b>Evaluación escrita</b> automática: longitud, riqueza léxica, uso del material del día y detección de los veinte errores fosilizados del hispanohablante.</li>' +
    '<li><b>SRS Leitner de 6 cajas por fechas reales</b> (1, 2, 4, 8, 16 y 35 días), de modo que hacer dos sesiones diarias no comprime los intervalos de memoria.</li></ul></div>';
  h += '<div class="card"><h3>Reglas de oro</h3><ul>' + C.metodo.reglas.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  app.innerHTML = h;
}

// ---------- vista: repaso SRS con mnemotecnia ----------
function vRepaso() {
  var due = srsDue();
  if (!due.length) {
    app.innerHTML = '<h1>Repaso</h1><div class="card"><p class="ok-t"><b>No hay tarjetas pendientes hoy.</b></p>' +
      '<p class="dim small">Tienes ' + Object.keys(S.srs).length + ' tarjetas en el sistema. Volverán según su caja: 1, 2, 4, 8, 16 y 35 días.</p></div>';
    return;
  }
  app.innerHTML = '<h1>Repaso · <span class="dim mono">' + due.length + ' tarjetas</span></h1>' +
    '<p class="dim small">Intenta recuperar la palabra <b>antes</b> de mostrarla. El esfuerzo de recuperación es lo que fija la memoria; leer la respuesta directamente no sirve de nada.</p><div id="fc"></div>';
  var i = 0;
  (function card() {
    var box = document.getElementById('fc');
    if (i >= due.length) { S.ses++; save(); box.innerHTML = '<div class="card"><p class="ok-t"><b>Repaso terminado.</b> Vuelve mañana.</p></div>'; return; }
    var it = due[i];
    box.innerHTML = '';
    var c = el('<div class="card"><div class="row between"><span class="dim small mono">' + (i + 1) + ' / ' + due.length + ' · caja ' + it.box + (it.lapses ? ' · ' + it.lapses + ' fallos' : '') + '</span></div>' +
      '<h2 class="en" style="margin:.35em 0">' + esc(it.f) + '</h2><div id="rev" class="hidden"></div>' +
      '<div class="row" style="margin-top:16px" id="acts"></div></div>');
    box.appendChild(c);
    c.querySelector('.row.between').appendChild(spkBtn(it.f));
    var rev = c.querySelector('#rev');
    rev.innerHTML = '<p><b>' + esc(it.b) + '</b></p>' + (it.e ? '<p class="dim small en"><i>' + esc(it.e) + '</i></p>' : '');
    var acts = c.querySelector('#acts');
    var showB = el('<button class="btn">Mostrar</button>');
    showB.onclick = function () {
      rev.classList.remove('hidden');
      var g = el('<div class="gancho"><label>Gancho mnemotécnico <span class="dim small">— una imagen absurda que enlace el sonido inglés con algo tuyo. El que escribes tú funciona mucho mejor que el que te dan.</span></label>' +
        '<textarea rows="2" placeholder="Ej.: SHREWD suena a «cru-do»: un negociador tan astuto que se come el trato crudo.">' + esc(it.g || '') + '</textarea></div>');
      rev.appendChild(g);
      var ta = g.querySelector('textarea');
      ta.oninput = function () { S.srs[it.id].g = ta.value; save(); };
      acts.innerHTML = '';
      var bad = el('<button class="btn sec">No lo sabía</button>'), ok = el('<button class="btn">Lo sabía</button>');
      bad.onclick = function () { srsGrade(it.id, false); i++; card(); };
      ok.onclick = function () { srsGrade(it.id, true); i++; card(); };
      acts.appendChild(bad); acts.appendChild(ok);
      speak(it.e || it.f);
    };
    acts.appendChild(showB);
    if (S.auto) speak(it.f);
  })();
}

// ---------- vista: progreso ----------
function racha() {
  var f = Object.keys(S.fechas).sort();
  if (!f.length) return 0;
  var last = f[f.length - 1], d = diffDays(last, hoy());
  if (d > 1) return 0;
  var n = 1, cur = last;
  for (var i = f.length - 2; i >= 0; i--) { if (diffDays(f[i], cur) === 1) { n++; cur = f[i]; } else break; }
  return n;
}
// Qué significa cada barra de «Aciertos por destreza» y qué hacer con ella.
// Va dentro de la propia vista para que no haya que preguntar fuera.
function explicaDestrezas() {
  var D = [
    ['Gramática', 'Las preguntas sobre cómo se construye la frase: tiempos verbales, orden de palabras, preposiciones, comparativos, condicionales. No es teoría: son los huecos donde eliges entre tres opciones que solo se diferencian en la forma.',
     'Ve al <b>Gimnasio</b>: «Ordena la frase» para el orden y «¿Cuál encaja?» para preposiciones y conectores. Y en cada fallo lee la explicación entera: dice por qué la buena es buena y por qué la que elegiste no lo es.'],
    ['Léxico', 'Vocabulario: reconocer una palabra, su contrario, la palabra que falta en una frase. Se alimenta del vocabulario de cada día y de las parejas contrarreloj.',
     'Haz el <b>Repaso</b> todos los días aunque no hagas día nuevo: el sistema de repaso espaciado es lo que convierte una palabra vista en una palabra tuya. Si una palabra aparece en «se te resisten», escríbele un gancho.'],
    ['Comprensión lectora', 'Leer un texto en inglés y responder sobre él sin traducirlo palabra por palabra. En realidad son seis destrezas distintas: idea principal, buscar un dato, deducir, adivinar vocabulario por contexto, saber a qué se refiere un pronombre y leer a velocidad.' +
     '<br><br><b>Cómo se calcula exactamente:</b> es el número de respuestas acertadas dividido entre el número de respuestas dadas, acumulado desde que empezaste, en las preguntas de este tipo: las del <b>bloque de lectura de cada día</b>, las de <b>comprensión del examen de nivel y de los simulacros</b>, y las <b>seis herramientas de comprensión lectora del gimnasio</b>. No es una estimación ni una media ponderada: son tus propias respuestas contadas una a una. Por eso baja al empezar una herramienta nueva y sube sola según practicas. Con menos de ocho respuestas en total el dato aún no es fiable.',
     'Tienes una herramienta para cada una de las seis, en el <b>Gimnasio</b>, con ocho textos graduados de A2 a C1: ' +
     '<a href="#gimnasio/lec-idea">Idea principal</a> · <a href="#gimnasio/lec-dato">Buscar el dato</a> · ' +
     '<a href="#gimnasio/lec-infer">Deducir</a> · <a href="#gimnasio/lec-vocab">Palabra por contexto</a> · ' +
     '<a href="#gimnasio/lec-ref">¿A qué se refiere?</a> · <a href="#gimnasio/lec-vel">Velocidad lectora</a>.' +
     '<br><br><b>Plan para subirla, por orden:</b> empieza por <b>Idea principal</b> con los textos de A2 hasta hacerlo en menos de treinta segundos; sigue con <b>Deducir</b>, que es la que más peso tiene en el examen; y deja <b>Velocidad lectora</b> para medirte una vez por semana, no todos los días. ' +
     'La regla de fondo, la que más sube esta barra: <b>traducir mientras lees es lo que la hunde</b>. Lee el texto entero y seguido, sin diccionario y sin volver atrás, antes de mirar ninguna pregunta; y cada respuesta justifícala señalando la línea exacta que la sostiene. Si no puedes señalarla, no es la respuesta.'],
    ['Comprensión oral', 'Entender el inglés hablado: los dictados, los diálogos del día y las preguntas sobre lo que has escuchado. Es la destreza que más se resiente si solo estudias con los ojos.',
     'Escucha primero a velocidad normal y solo después usa «Más despacio». Repite el mismo diálogo tres días seguidos: la segunda y la tercera vez oyes palabras que la primera no existían para ti. Si va muy por debajo del resto, baja la velocidad en la pestaña Audio y alarga el bloque de escucha.'],
    ['Producción escrita', 'Lo que escribes tú: las traducciones al inglés, los huecos que se rellenan tecleando y el texto del bloque final que se evalúa. Aquí no hay opciones donde elegir, así que mide lo que de verdad sabes producir.',
     'Escribe el texto del bloque 6 aunque tengas prisa, y pulsa «Evaluar mi texto». Fíjate en la lista de <b>errores recurrentes</b> de esta misma pantalla: corregir dos errores repetidos sube más la nota que aprender veinte palabras nuevas.'],
    ['Uso del inglés (Cambridge)', 'El apartado <i>Use of English</i> del examen: palabras derivadas (RELAX → relaxing), huecos de una sola palabra y transformaciones con palabra clave. Es la parte más técnica y la que más se entrena aparte.',
     'Es exactamente lo que practican las pestañas <b>Derivadas</b> y <b>Frases</b>. Veinte huecos de derivadas al día durante una semana mueven esta barra más que cualquier otra cosa del curso.']
  ];
  return '<p class="small dim">Cada barra sale de tus propias respuestas, no de una estimación. Con menos de ocho preguntas en una categoría el dato aún no es fiable.</p>' +
    D.map(function (d) {
      return '<div class="destreza"><h4>' + d[0] + '</h4>' +
        '<p class="small"><b>Qué mide:</b> ' + d[1] + '</p>' +
        '<p class="small"><b>Cómo subirla:</b> ' + d[2] + '</p></div>';
    }).join('') +
    '<p class="small dim">Regla práctica: trabaja siempre la barra más baja, no la que más te gusta. Subir del 55 % al 70 % en tu peor destreza vale más, para el nivel y para el examen, que pasar del 85 % al 90 % en la mejor.</p>';
}

function vProgreso() {
  var done = doneDays().length, hist = S.hist.slice(-24);
  var fechas = Object.keys(S.fechas).sort();
  var dias = fechas.length ? Math.max(1, diffDays(fechas[0], hoy()) + 1) : 1;
  var ritmo = done / dias;
  var restan = TOTAL - done;
  var fin = ritmo > 0 ? addDays(hoy(), Math.ceil(restan / ritmo)) : null;
  var media = hist.length ? Math.round(hist.reduce(function (a, x) { return a + x.pct; }, 0) / hist.length) : null;

  var h = '<h1>Tu progreso</h1>';
  if (!done) {
    app.innerHTML = h + '<div class="card"><p>Todavía no has completado ningún día. En cuanto termines el primer test del día empezarás a ver aquí tu evolución, tus puntos débiles y la proyección de fin de curso.</p></div>';
    return;
  }
  h += '<div class="metrics big">' +
    metric(done + '/' + TOTAL, 'días completados') +
    metric(racha(), 'días de racha') +
    metric(ritmo.toFixed(1), 'días de curso por jornada') +
    metric(media == null ? '—' : media + '%', 'nota media reciente') +
    metric(Object.keys(S.srs).length, 'palabras en el SRS') +
    metric(srsDue().length, 'para repasar hoy') + '</div>';
  h += '<div class="card"><div class="row between"><h3 style="margin:0">Evolución del test diario</h3><span class="small dim">línea de aprobado: 70 %</span></div>' +
    sparkline(hist.map(function (x) { return x.pct; })) +
    '<p class="small dim">Últimos ' + hist.length + ' días evaluados. Lo que importa no es una nota alta suelta, sino que la línea no baje cuando sube la dificultad del nivel.</p></div>';

  var rows = Object.keys(CATS).map(function (c) {
    var s = S.stats[c];
    return { l: CATS[c], v: pctCat(c), n: s ? s.ok + '/' + s.tot : '' };
  });
  h += '<div class="card"><h3>Aciertos por destreza</h3>' + bars(rows) +
    '<p class="small dim">Es el porcentaje de aciertos acumulado en cada tipo de pregunta desde que empezaste. La destreza más baja es la que decide tu nivel real: un examen de Cambridge no hace media, exige un mínimo en cada parte.</p>' +
    '<details class="expl" id="dExpl"><summary>Qué mide cada una y qué hacer para subirla</summary>' + explicaDestrezas() + '</details></div>';

  // oral
  h += '<div class="card"><div class="row between"><h3 style="margin:0">Expresión oral</h3><button class="btn small" id="goOral">Hacer una prueba oral</button></div>';
  if (S.oral.length) {
    var o = S.oral[S.oral.length - 1];
    h += '<div class="metrics">' + metric(o.score, 'puntuación') + metric(o.wpm, 'palabras/minuto') + metric(o.words, 'palabras') + metric(o.distinct + '%', 'léxico distinto') + metric(o.cov + '%', 'estructuras objetivo') + metric(o.band, 'banda estimada') + '</div>' +
      sparkline(S.oral.slice(-12).map(function (x) { return x.score; }), 640, 90) +
      '<p class="small dim">Referencia de fluidez: por debajo de 90 palabras por minuto se percibe entrecortado; 110-150 es el rango natural de un hablante competente.</p>';
  } else {
    h += '<p class="dim small">Aún no has hecho ninguna prueba oral. Necesitas Chrome o Edge y permiso de micrófono: se mide fluidez real, densidad léxica y cuántas estructuras del día te salen sin pensar.</p>';
  }
  h += '</div>';

  // escrito
  h += '<div class="card"><h3>Expresión escrita</h3>';
  if (S.escr.length) {
    var e = S.escr[S.escr.length - 1];
    h += '<div class="metrics">' + metric(e.score, 'puntuación') + metric(e.words, 'palabras') + metric(e.ttr + '%', 'riqueza léxica') + metric(e.avg, 'palabras/frase') + metric(e.errs, 'errores detectados') + metric(S.escr.length, 'textos evaluados') + '</div>' +
      sparkline(S.escr.slice(-12).map(function (x) { return x.score; }), 640, 90);
    var top = {}; S.escr.forEach(function (x) { (x.lista || []).forEach(function (t) { top[t] = (top[t] || 0) + 1; }); });
    var arr = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; }).slice(0, 5);
    if (arr.length) h += '<h3>Tus errores recurrentes</h3><ul class="errs">' + arr.map(function (t) { return '<li>' + t + ' <span class="dim small">· ' + top[t] + ' veces</span></li>'; }).join('') + '</ul>';
  } else {
    h += '<p class="dim small">Escribe el texto del bloque 6 de cualquier día y pulsa «Evaluar mi texto» para empezar a medir tu escritura.</p>';
  }
  h += '</div>';

  // SRS + leeches
  var boxes = [1, 2, 3, 4, 5, 6].map(function (b) {
    var n = 0; for (var k in S.srs) if (S.srs[k].box === b) n++;
    return { l: 'Caja ' + b + ' (' + GAPS_D[b] + ' días)', v: Object.keys(S.srs).length ? Math.round(n / Object.keys(S.srs).length * 100) : 0, n: n };
  });
  h += '<div class="card"><h3>Estado de la memoria</h3>' + bars(boxes) +
    '<p class="small dim">Una memoria sana tiene pocas tarjetas en la caja 1 y muchas en las cajas 4 a 6. Si la caja 1 se hincha, estás metiendo vocabulario nuevo más rápido de lo que lo consolidas.</p>';
  var lc = leeches();
  if (lc.length) {
    h += '<h3>Palabras que se te resisten</h3><p class="small dim">Han fallado tres veces o más. Escríbeles un gancho mnemotécnico en el repaso: es lo único que rompe el bloqueo.</p><ul class="errs">' +
      lc.slice(0, 8).map(function (x) { return '<li><b class="en">' + esc(x.f) + '</b> — ' + esc(x.b) + ' <span class="dim small">· ' + x.lapses + ' fallos</span></li>'; }).join('') + '</ul>';
  }
  h += '</div>';

  var fal = Object.keys(S.fallos).sort(function (a, b) { return S.fallos[b] - S.fallos[a]; }).slice(0, 8);
  if (fal.length) {
    h += '<div class="card"><h3>Preguntas que más fallas</h3><ul class="errs">' +
      fal.map(function (t) { return '<li>' + esc(t) + ' <span class="dim small">· ' + S.fallos[t] + ' veces</span></li>'; }).join('') + '</ul></div>';
  }

  h += '<div class="card"><h3>Proyección</h3><p>Al ritmo actual de <b>' + ritmo.toFixed(1) + '</b> días de curso por jornada, terminarías los ' + TOTAL + ' días ' +
    (fin ? 'alrededor del <b>' + fin.split('-').reverse().join('/') + '</b>' : 'sin fecha estimable todavía') + '.</p>' +
    '<p class="small dim">Con una sesión diaria son cuatro meses; con doble sesión sostenida, dos. Recuerda que el examen de nivel de cada mes solo se desbloquea al completar sus 30 días.</p></div>';

  app.innerHTML = h;
  var b = document.getElementById('goOral');
  if (b) b.onclick = function () { go('oral'); };
}

// Lista de días disponibles para la prueba oral, con marca de los ya evaluados.
function selectorDia(n) {
  var ops = '';
  for (var i = 1; i <= TOTAL; i++) {
    if (!unlocked(i)) continue;
    var o = (S.dias[i] || {}).oral;
    ops += '<option value="' + i + '"' + (i === n ? ' selected' : '') + '>' +
      esc(etiquetaDia(i)) + ' · ' + esc(lvlOf(i).id) + ' · ' + esc(dayData(i).tema) +
      (o ? '  ✔ ' + o.score : '') + '</option>';
  }
  return '<div class="card flat"><label class="small"><b>Día que quieres practicar</b> ' +
    '<select id="oralDia">' + ops + '</select></label>' +
    '<p class="small dim" style="margin:8px 0 0">Las tareas y las estructuras objetivo son las de ese día. Los días con ✔ ya tienen prueba oral guardada.</p></div>';
}

// ---------- modo profesor: por qué existe cada ejercicio y qué hacer al fallar ----------
// Un ejercicio sin explicación es un pasatiempo. Cada juego del gimnasio lleva
// desplegada su razón de ser, su método y —lo más importante— el protocolo
// exacto para cuando la respuesta sale mal.
function profe(qb) {
  return '<details class="prof"><summary>Modo profesor · por qué este ejercicio y qué hacer cuando fallo</summary>' +
    '<h4>Por qué existe</h4>' + qb.porque +
    '<h4>Cómo se hace bien</h4>' + qb.como +
    '<h4>Qué hacer exactamente cuando fallo</h4>' + qb.fallo +
    (qb.error ? '<h4>El error que quiero que dejes de cometer</h4>' + qb.error : '') +
    '</details>';
}

var PROTO_HUECOS =
  '<ol class="proto-l">' +
  '<li><b>No pases de pantalla.</b> El botón «Continuar» no tiene prisa: la pregunta ya está corregida y el tiempo que pases aquí es el único que cuenta.</li>' +
  '<li><b>Lee la explicación entera</b>, sobre todo la segunda mitad: dice por qué falla la opción que tú elegiste. Saber por qué la buena es buena no basta; el fallo se repite mientras la mala te siga pareciendo posible.</li>' +
  '<li><b>Lee la frase completa en voz alta ya resuelta.</b> La oirás además pronunciada. Estás guardando el ritmo de la frase entera, no una regla suelta.</li>' +
  '<li><b>Ponle nombre a la relación</b> en una palabra: contraste, causa, consecuencia, tiempo, condición. Esa palabra es la que vas a recordar dentro de una semana, no la lista de conectores.</li>' +
  '<li><b>Si fallas la misma dos veces</b>, escríbela a mano en un papel con su explicación. Lo escrito a mano se fija; lo leído en pantalla, no.</li></ol>';
// ---------- vista: gimnasio · ejercicios rápidos de asociación ----------
// Cuatro modos, todos cortos y con corrección inmediata: emparejar contra
// reloj, ordenar la frase, elegir el que encaja y velocidad de 60 segundos.
function mazoDe(id) {
  if (id === 'derivadas') {
    var v = [];
    DRV.familias.forEach(function (G) { G.v.forEach(function (l) { var p = l.split('|'); v.push([p[0], p[1]]); }); });
    return { t: 'Raíz y palabra derivada', v: v, izq: 'Raíz', der: 'Derivada', enIzq: true, enDer: true };
  }
  if (id === 'conectores') {
    var c = [];
    (GYM.conectores.grupos || []).forEach(function (G) { G.v.forEach(function (l) { var p = l.split('|'); c.push([p[0], p[1]]); }); });
    return { t: 'Conector y su función', v: c, izq: 'Conector', der: 'Para qué sirve', enIzq: true, enDer: false };
  }
  if (id === 'frases') {
    var e = [];
    (FRS.modismos || []).forEach(function (G) { G.v.forEach(function (l) { var p = l.split('|'); e.push([p[0], p[1]]); }); });
    return { t: 'Expresión y lo que significa de verdad', v: e, izq: 'Se dice', der: 'Significa', enIzq: true, enDer: false };
  }
  return { t: 'Adjetivo y su contrario', v: (GYM.adjetivos.opuestos || []).map(function (l) { return l.split('|'); }),
           izq: 'Adjetivo', der: 'Su contrario', enIzq: true, enDer: true };
}

// Qué ejercicio del gimnasio le corresponde a cada día, para poder entrar
// desde la propia sesión en vez de tener que buscarlo.
function gymDe(n) {
  var k = (n - 1) % 30 + 1, esMod0 = n > CORE;
  if (esMod0) {
    if (k === 12 || k === 17) return { id: 'hue-prepos', t: 'preposiciones', txt: 'Hoy tocan preposiciones. Doce huecos aquí te las dejan asentadas antes de empezar.' };
    if (k === 18) return { id: 'par-adjetivos', t: 'adjetivos y contrarios', txt: 'Hoy tocan adjetivos. Empieza emparejando cada uno con su contrario contra el reloj.' };
    if (k === 27) return { id: 'hue-cantidad', t: 'much y many', txt: 'Junto a los comparativos conviene tener claro el contraste much / many.' };
    if (k === 29) return { id: 'hue-conectores', t: 'conectores', txt: 'Hoy tocan conectores. Aquí se eligen por la relación entre las ideas, que es como se aciertan.' };
    if (k === 4 || k === 5 || k === 9) return { id: 'ord-1', t: 'orden de palabras', txt: 'El orden del inglés es más rígido que el del español. Dos minutos ordenando frases valen por media hora de teoría.' };
  }
  if (k % 7 === 0 || k === 30) return { id: 'vel', t: 'velocidad', txt: 'Día de repaso: sesenta segundos para ver qué tienes ya automatizado y qué no.' };
  if (k % 5 === 0) return { id: 'lec-idea', t: 'comprensión lectora', txt: 'Cinco minutos de lectura antes de empezar: un texto y su idea principal, cronometrado. Es lo que más rápido sube la velocidad de lectura.' };
  return null;
}

function vGimnasio(arg) {
  var h = '<h1>Gimnasio</h1>' +
    '<p class="dim">Series cortas y con corrección inmediata para lo que no se aprende leyendo: conectores, ' +
    'adjetivos, preposiciones, derivadas y orden de palabras. Cada partida dura entre uno y tres minutos, ' +
    'que es justo lo que aguanta la atención con este tipo de material.</p>' +
    profe({
      porque: '<p>Hay una parte del inglés que no se aprende entendiéndola, sino <b>usándola muchas veces seguidas</b>. ' +
        'Tú ya entiendes qué es un conector o una preposición: lo que falla es que, en el momento de hablar o de elegir en un examen, ' +
        'no te sale <i>sola</i> la palabra correcta. Eso no es un problema de conocimiento, es de <b>velocidad de acceso</b>. ' +
        'Y la velocidad de acceso solo sube con repeticiones cortas, frecuentes y corregidas al instante.</p>' +
        '<p>Por eso el gimnasio no explica teoría nueva: coge lo que ya has visto en los días del curso y te obliga a recuperarlo ' +
        'muchas veces en poco tiempo. Se llama <b>recuperación activa</b> y es, con diferencia, lo que más rinde por minuto invertido.</p>',
      como: '<p><b>Series cortas y a menudo.</b> Diez minutos al día en cuatro tandas rinden más que una hora del sábado. ' +
        'La memoria consolida en los intervalos, no durante el esfuerzo.</p>' +
        '<p><b>Responde rápido y sin traducir.</b> Si te descubres traduciendo al español para decidir, has perdido el ejercicio: ' +
        'aquí se entrena el reflejo, no el análisis. Prefiero que falles rápido a que aciertes lento.</p>' +
        '<p><b>Repite el mismo mazo dos veces seguidas.</b> La segunda vuelta inmediata es la que fija; la tercera ya no aporta. ' +
        'Y vuelve a él al día siguiente: ahí es donde se gana.</p>',
      fallo: '<p>Un fallo no es un suspenso, es <b>información</b>: te acaba de señalar exactamente dónde está el hueco. ' +
        'Lo único que no puedes hacer es pasar de pantalla sin mirarlo.</p>' + PROTO_HUECOS,
      error: '<p>Estudiar listas. Una lista de treinta conectores leída del tirón se olvida entera en dos días. ' +
        'Doce elegidos bajo presión, con su corrección, se quedan. El material de este gimnasio es el mismo; lo que cambia es que aquí ' +
        '<b>lo tienes que producir tú</b>.</p>'
    }) +
    interruptorTraduccion('En las tablas de repaso de este gimnasio y en el resto del curso. Dentro de las partidas la traducción sigue apareciendo solo al pulsar la palabra: si estuviera a la vista, emparejar dejaría de tener mérito.') +
    panelFlojo() +
    '<div class="card"><h2 style="margin-top:0">⏱ Parejas contrarreloj</h2>' +
    profe({
      porque: '<p>Emparejar es la forma más rápida de crear una <b>asociación</b>. No estás memorizando una definición: estás ' +
        'atando dos cosas en la cabeza, y el reloj impide que te apoyes en la traducción, que es la muleta que hay que quitar.</p>',
      como: '<p>Pincha una de la izquierda y su pareja de la derecha. Al pulsar una palabra inglesa <b>se pronuncia y aparece debajo ' +
        'qué significa</b>: así oyes las doce mientras juegas. No busques la pareja «correcta» leyendo las doce: coge la primera que ' +
        'te suene y comprueba. Fallar cuesta cinco segundos y enseña más que dudar treinta.</p>',
      fallo: '<p>Cada fallo suma cinco segundos, y eso es todo el castigo que hay. Al terminar aparecen <b>las doce parejas juntas</b>: ' +
        'ese es el momento de estudiar, no durante la partida. Míralas dos minutos, pulsa las que no reconocías para oírlas y ' +
        '<b>juega otra ronda inmediatamente</b>. Si el tiempo de la segunda ronda no baja, es que no las has mirado.</p>'
    }) +
    '<p class="dim small">Doce parejas. Pincha una de la izquierda y su pareja de la derecha. El reloj corre y cada fallo suma cinco segundos. Es el ejercicio que más rápido crea la asociación.</p>' +
    '<p class="dim small">Al pulsar una palabra inglesa <b>se pronuncia y aparece debajo qué significa</b>, así que oyes las doce mientras juegas y resuelves cualquier duda sin salir. Al terminar tienes las doce parejas juntas para repasarlas.</p>' +
    '<div class="row"><button class="btn" data-par="derivadas">Derivadas</button>' +
    '<button class="btn" data-par="conectores">Conectores</button>' +
    '<button class="btn" data-par="adjetivos">Adjetivos y contrarios</button>' +
    '<button class="btn" data-par="frases">Frases y expresiones</button></div><div id="gpar"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">🧩 Ordena la frase</h2>' +
    profe({
      porque: '<p>El español coloca las palabras casi como quiere porque las terminaciones dicen quién hace qué. El inglés no tiene ' +
        'esas terminaciones: <b>el orden es la gramática</b>. <i>The architect calls the client</i> y <i>The client calls the architect</i> ' +
        'tienen las mismas palabras y significan lo contrario. Por eso este ejercicio no es un puzle: es la regla más rentable del idioma.</p>',
      como: '<p>Antes de tocar nada, busca <b>el verbo</b> y pregúntate quién lo hace: ese es el sujeto y va delante, siempre. ' +
        'Después el complemento. Los adjetivos, delante del sustantivo (<i>a white wall</i>, nunca <i>a wall white</i>). ' +
        'Los adverbios de frecuencia, entre el sujeto y el verbo (<i>I always work</i>). Y el sujeto <b>no se omite jamás</b>.</p>',
      fallo: '<p>Al fallar ya no ves solo la frase buena: ves <b>tu frase y la correcta enfrentadas</b>, con lo que sobra tachado y lo que ' +
        'falta subrayado, y debajo el nombre del error que has cometido. Léelo, y antes de continuar <b>vuelve a construir la frase ' +
        'mentalmente de izquierda a derecha</b>. Si el aviso dice que tenías todas las palabras, el problema no es tu vocabulario: ' +
        'es que estás pensando en español y traduciendo el orden.</p>'
    }) +
    '<p class="dim small">Las palabras salen desordenadas y hay que colocarlas. Entrena las cinco reglas de orden que el español coloca al revés.</p>' +
    '<div class="row">' + (GYM.orden.grupos || []).map(function (G, i) {
      return '<button class="btn sec small" data-ord="' + i + '">' + esc(G.t.split('·')[0].trim()) + '</button>';
    }).join('') + '<button class="btn small" data-ord="adj">Varios adjetivos seguidos</button></div><div id="gord"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">🎯 ¿Cuál encaja?</h2>' +
    '<p class="dim small">Un hueco y tres candidatos. Al responder te dice <b>por qué</b> es ese y no el otro, que es lo que hace que la próxima vez lo aciertes.</p>' +
    profe({
      porque: '<p>Este es el ejercicio central del gimnasio y también el formato exacto de la primera parte del examen de Cambridge ' +
        '(<i>multiple-choice cloze</i>). Se entrena aquí por una razón muy concreta: <b>los conectores y las preposiciones no se ' +
        'traducen, se eligen</b>.</p>' +
        '<p>Si intentas traducir, te bloqueas, porque «como» puede ser <i>as</i>, <i>like</i>, <i>since</i> o <i>how</i> según lo que ' +
        'estés diciendo, y «en» puede ser <i>in</i>, <i>on</i> o <i>at</i>. Ninguna de esas parejas existe. Lo que sí existe es una ' +
        '<b>relación entre dos ideas</b> —contraste, causa, consecuencia, tiempo, condición— y una <b>forma de ver el espacio o el ' +
        'tiempo</b> —punto, superficie, interior—. En cuanto identificas la relación, la palabra sale sola y siempre es la misma. ' +
        'Por eso las tres opciones que te doy nunca se distinguen por el significado: se distinguen por la relación que marcan.</p>',
      como: '<p>Sigue siempre este orden, aunque creas que ya sabes la respuesta:</p>' +
        '<ol class="proto-l">' +
        '<li><b>Lee la frase entera antes de mirar las opciones</b>, incluida la parte que va detrás del hueco. La mitad de los fallos ' +
        'vienen de contestar habiendo leído solo hasta el hueco.</li>' +
        '<li><b>Tapa las opciones y pregúntate qué relación hay</b> entre lo de antes y lo de después. Dilo en una palabra en español: ' +
        '«contraste», «causa», «momento». No busques todavía la palabra inglesa.</li>' +
        '<li><b>Mira qué tipo de palabra cabe</b>: si detrás hay un sustantivo suelto (<i>the rain</i>) no cabe <i>because</i> sino ' +
        '<i>because of</i>; si detrás hay una frase con verbo, al revés. Esta comprobación mecánica resuelve un tercio de las preguntas ' +
        'sin pensar en el significado.</li>' +
        '<li><b>Ahora sí, elige</b>, y antes de pulsar dedica dos segundos a descartar en voz baja las otras dos: «esta no, porque ' +
        'marcaría contraste y aquí no lo hay».</li></ol>',
      fallo: '<p>Aquí es donde se aprende de verdad, así que este ejercicio <b>no avanza solo cuando fallas</b>: la pantalla se queda ' +
        'quieta hasta que tú pulses «Continuar». Aprovéchalo con este protocolo, en este orden:</p>' + PROTO_HUECOS +
        '<p class="small dim">Y una regla de higiene: si en una tanda de doce fallas más de cuatro, no hagas otra tanda inmediatamente. ' +
        'Repasa la tabla de conectores o de preposiciones cinco minutos y vuelve. Encadenar tandas con muchos fallos solo consolida el error.</p>',
      error: '<p>Elegir por parecido con el español. <i>Actually</i> no es «actualmente», <i>eventually</i> no es «eventualmente» y ' +
        '<i>since</i> casi nunca es «desde». Cuando una opción te suene bien <b>porque se parece a una palabra española</b>, ' +
        'desconfía: en este ejercicio ese parecido está puesto a propósito.</p>'
    }) +
    '<div class="row"><button class="btn" data-hue="conectores">Conectores</button>' +
    '<button class="btn" data-hue="prepos">Preposiciones</button>' +
    '<button class="btn" data-hue="cantidad">much / many</button>' +
    '<button class="btn" data-hue="frases">Frases · UK / US</button>' +
    '<button class="btn sec" data-hue="todo">Mezcla de todo</button></div><div id="ghue"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">📖 Comprensión lectora</h2>' +
    '<p class="dim small">Ocho textos graduados de A2 a C1 —un anuncio, un correo de cliente, un informe de obra, artículos y ensayos— con seis herramientas, una por cada destreza que compone la comprensión lectora. Cada texto trae su traducción, plegada, para comprobar <b>después</b> de responder.</p>' +
    profe({
      porque: '<p>' + LEC.intro + '</p>' +
        '<p>Y no es una destreza, son <b>seis</b>, que se estropean si se entrenan juntas: leer para hacerse una idea y leer para encontrar un dato son operaciones <b>opuestas</b>. La primera exige saltarse cosas; la segunda, ignorar el sentido y buscar una forma. Quien las mezcla acaba haciendo lo peor de las dos: leer entero y despacio sin quedarse con nada. Por eso aquí hay un botón para cada una.</p>' +
        '<ol class="proto-l">' + LEC.teoria.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>',
      como: '<p>El orden que funciona con cualquier texto, dentro y fuera del examen:</p><ol class="proto-l">' +
        LEC.metodo.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
        '<p><b>Empieza por textos fáciles.</b> Es contraintuitivo, pero la comprensión lectora se construye leyendo mucho de lo que ya entiendes casi todo, no poco de lo que no entiendes. Si tienes que parar más de una vez cada dos líneas, ese texto es demasiado difícil <b>para entrenar</b>, aunque puedas descifrarlo.</p>',
      fallo: '<p>Cada herramienta te dice al fallar en qué línea estaba la respuesta, porque casi siempre estaba escrita. Pero los tres fallos de fondo son estos, y ninguno se arregla estudiando más vocabulario:</p>' +
        '<ol class="proto-l">' +
        '<li><b>Traducir mientras lees.</b> Es la causa número uno de ir lento y perder el hilo. Se corrige a la fuerza: leer sin permitirse decir la frase en español, aunque al principio se entienda menos. La comprensión vuelve en unos días y ya sin la muleta.</li>' +
        '<li><b>Volver atrás continuamente.</b> Cada regresión rompe el sentido de la frase. Tapa con el dedo, o con una hoja, lo que ya has leído.</li>' +
        '<li><b>Parar en cada palabra desconocida.</b> No hace falta entenderlas todas para entender el texto: en el ejercicio de vocabulario por contexto verás que la propia frase te la define.</li></ol>',
      error: '<p>Medir el progreso en «palabras que sé». La comprensión lectora no crece por vocabulario, crece por <b>kilómetros</b>: cantidad de texto leído a una velocidad cómoda. Veinte minutos diarios de algo fácil rinden más que una hora semanal peleándose con un texto de C1.</p>'
    }) +
    '<div class="row"><button class="btn" data-lec="idea">Idea principal</button>' +
    '<button class="btn" data-lec="dato">Buscar el dato</button>' +
    '<button class="btn" data-lec="infer">Deducir</button>' +
    '<button class="btn sec" data-lec="vocab">Palabra por contexto</button>' +
    '<button class="btn sec" data-lec="ref">¿A qué se refiere?</button>' +
    '<button class="btn sec" data-lec="vel">Velocidad lectora</button></div><div id="glec"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">⚡ Velocidad · 60 segundos</h2>' +
    profe({
      porque: '<p>Saber una regla y poder usarla mientras hablas son dos cosas distintas. En una conversación no tienes tres segundos ' +
        'para pensar la preposición: o sale sola o no sale. Este ejercicio mide precisamente eso, y es el <b>termómetro</b> del gimnasio: ' +
        'te dice si lo que has estudiado ya está automatizado o todavía lo estás razonando.</p>',
      como: '<p>Sesenta segundos, sin explicaciones y sin volver atrás. <b>Contesta con el primer impulso.</b> Si dudas más de dos ' +
        'segundos, elige cualquiera y sigue: la duda ya es la respuesta que buscábamos. Hazlo una vez al final de cada sesión, ' +
        'siempre en las mismas condiciones, para poder comparar.</p>',
      fallo: '<p>Aquí los fallos no se estudian de uno en uno: se miran <b>al final, en bloque</b>. Fíjate en el número de aciertos y en ' +
        'la precisión. Menos de doce aciertos significa que todavía vas analizando, y la solución no es repetir esta prueba, sino volver ' +
        'a «Parejas» y a «¿Cuál encaja?», que son los que construyen. Vuelve aquí mañana: esta pantalla mide, no entrena.</p>' +
        '<p><b>La cifra a la que apuntamos:</b> veinte aciertos con más del ochenta por ciento de precisión. Ahí ya no traduces, reconoces.</p>'
    }) +
    '<p class="dim small">Sesenta segundos, las que puedas. Sin explicaciones y sin pensar: aquí se entrena el automatismo, no el análisis.</p>' +
    '<div class="row"><button class="btn" data-vel="1">Empezar</button></div><div id="gvel"></div></div>';
  app.innerHTML = h;
  cablearInterruptor();
  app.querySelectorAll('[data-par]').forEach(function (b) { b.onclick = function () { juegoParejas(b.dataset.par); }; });
  app.querySelectorAll('[data-ord]').forEach(function (b) { b.onclick = function () { juegoOrden(b.dataset.ord); }; });
  app.querySelectorAll('[data-hue]').forEach(function (b) { b.onclick = function () { juegoHuecos(b.dataset.hue); }; });
  app.querySelectorAll('[data-vel]').forEach(function (b) { b.onclick = function () { juegoVelocidad(); }; });
  app.querySelectorAll('[data-lec]').forEach(function (b) { b.onclick = function () { juegoLectura(b.dataset.lec, (LEC.textos[0] || {}).id); }; });
  if (arg) {
    var pa = String(arg).split('-'), resto = pa.slice(1).join('-');
    if (pa[0] === 'par') juegoParejas(resto);
    else if (pa[0] === 'hue') juegoHuecos(resto);
    else if (pa[0] === 'ord') juegoOrden(resto);
    else if (pa[0] === 'vel') juegoVelocidad();
    else if (pa[0] === 'lec') juegoLectura(resto || 'idea', (LEC.textos[0] || {}).id);
  }
}

// Recomendación a partir de los fallos reales, no de suposiciones.
function panelFlojo() {
  var st = S.stats || {}, peor = null;
  Object.keys(CATS).forEach(function (c) {
    var s = st[c]; if (!s || s.tot < 8) return;
    var p = s.ok / s.tot; if (!peor || p < peor.p) peor = { c: c, p: p, s: s };
  });
  if (!peor) return '<div class="note small">Haz unas cuantas series y aquí aparecerá, a partir de tus fallos reales, por dónde te conviene empezar.</div>';
  var reco = peor.c === 'cam' ? 'las <b>derivadas</b> y los <b>conectores</b>' :
             peor.c === 'gram' ? 'el <b>orden de palabras</b> y las <b>preposiciones</b>' :
             peor.c === 'lex' ? 'los <b>adjetivos y sus contrarios</b>' :
             peor.c === 'read' ? 'la <b>comprensión lectora</b> de aquí abajo, empezando por «Idea principal» y «Deducir»' :
             'las <b>parejas contrarreloj</b>, que fijan vocabulario rápido';
  return '<div class="note small"><b>Tu punto más flojo ahora mismo:</b> ' + CATS[peor.c] +
    ' (' + peor.s.ok + ' de ' + peor.s.tot + ' · ' + Math.round(peor.p * 100) + ' %). Empieza por ' + reco + '.</div>';
}


// --- juego 1: emparejar contrarreloj ---
function juegoParejas(id) {
  var M = mazoDe(id), pares = pick(M.v, Math.min(12, M.v.length));
  var host = document.getElementById('gpar');
  var t0 = Date.now(), penal = 0, fallos = 0, quedan = pares.length, elegida = null, iv = null;
  host.innerHTML = '<div class="row between" style="margin:14px 0 8px"><b>' + esc(M.t) + '</b>' +
    '<span class="timer" id="ptm">0:00</span></div>' +
    '<p class="small dim" style="margin:0 0 8px">Pulsa una palabra inglesa y <b>se pronuncia y aparece debajo qué significa</b>. Al terminar tienes las doce parejas juntas, con su traducción a la vista.</p>' +
    '<div class="pares"><div id="pA"></div><div id="pB"></div></div><div id="pfin"></div>';
  var A = host.querySelector('#pA'), B = host.querySelector('#pB'), tm = host.querySelector('#ptm');
  A.innerHTML = '<h3>' + esc(M.izq) + '</h3>'; B.innerHTML = '<h3>' + esc(M.der) + '</h3>';
  shuffle(pares.slice()).forEach(function (p) { A.appendChild(fila(p[0], p[0], true)); });
  shuffle(pares.slice()).forEach(function (p) { B.appendChild(fila(p[1], p[0], false)); });
  iv = setInterval(function () {
    var s2 = Math.round((Date.now() - t0) / 1000) + penal;
    tm.textContent = Math.floor(s2 / 60) + ':' + String(s2 % 60).padStart(2, '0');
  }, 500);

  // Cada ficha va acompañada de un enlace al traductor, para cuando haga falta.
  function fila(txt, clave, esIzq) {
    var ingles = esIzq ? M.enIzq : M.enDer;
    var f = el('<div class="fpar"></div>');
    f.appendChild(ficha(txt, clave, esIzq, ingles));
    return f;
  }
  function ficha(txt, clave, esIzq, ingles) {
    var es = ingles ? traduccion(txt) : null;
    var b = el('<button class="ficha' + (ingles ? ' en' : '') + '"' +
      (ingles ? ' title="Pulsa para oírla y ver qué significa"' : '') + '><span class="w">' + esc(txt) + '</span></button>');
    b.dataset.k = clave;
    b.onclick = function () {
      if (b.classList.contains('hecha')) return;
      if (ingles) {
        speak(txt);                       // se pronuncia
        if (es && !b.querySelector('.es'))  // y se revela el significado
          b.appendChild(el('<span class="sig">' + esc(es) + '</span>'));
      }
      if (!elegida) { limpiar(); elegida = b; b.classList.add('sel'); return; }
      if (elegida === b) { b.classList.remove('sel'); elegida = null; return; }
      if (elegida.parentNode.parentNode === b.parentNode.parentNode) { limpiar(); elegida = b; b.classList.add('sel'); return; }
      if (elegida.dataset.k === b.dataset.k) {
        elegida.classList.add('hecha'); b.classList.add('hecha');
        elegida.classList.remove('sel'); elegida = null; quedan--;
        if (!quedan) terminar();
      } else {
        fallos++; penal += 5;
        b.classList.add('mal'); elegida.classList.add('mal');
        var otra = elegida;
        setTimeout(function () { b.classList.remove('mal'); otra.classList.remove('mal', 'sel'); }, 500);
        elegida = null;
      }
    };
    return b;
  }
  function limpiar() { host.querySelectorAll('.ficha.sel').forEach(function (x) { x.classList.remove('sel'); }); }
  function terminar() {
    clearInterval(iv);
    var segs = Math.round((Date.now() - t0) / 1000), total = segs + penal;
    rec('lex', fallos <= 2, 'parejas · ' + id);
    S.ses++; save();
    var f = host.querySelector('#pfin');
    f.innerHTML = '<div class="card flat"><div class="metrics">' +
      metric(Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0'), 'tiempo con penalización') +
      metric(segs + ' s', 'tiempo real') + metric(fallos, 'fallos') + '</div>' +
      '<p class="small ' + (fallos === 0 ? 'ok-t' : fallos <= 2 ? 'dim' : 'bad-t') + '">' +
      (fallos === 0 ? 'Sin un solo fallo. Repite el mismo mazo mañana y verás bajar el tiempo: eso es la asociación consolidándose.'
        : fallos <= 2 ? 'Casi limpio. Vuelve a jugar ahora mismo el mismo mazo: la segunda vuelta inmediata es la que fija.'
        : 'Muchos fallos para doce parejas. Antes de repetir, mira la tabla de referencia dos minutos y vuelve.') + '</p>' +
      '<h3>Las doce parejas</h3><div class="tablewrap"><table><tr><th>' + esc(M.izq) + '</th><th>' + esc(M.der) + '</th></tr>' +
      pares.map(function (p) {
        return '<tr><td>' + celda(p[0], M.enIzq) + '</td><td>' + celda(p[1], M.enDer) + '</td></tr>';
      }).join('') + '</table></div>' +
      '<p class="small dim">Pulsa cualquier palabra para oírla otra vez. La traducción se apaga con el interruptor de arriba.</p></div>';
    cablearPalabras(f);
    var r = el('<div class="row"></div>');
    var b1 = el('<button class="btn small">Otra ronda</button>'); b1.onclick = function () { juegoParejas(id); };
    r.appendChild(b1); f.appendChild(r);
  }
  function celda(txt, ingles) { return ingles ? palabraES(txt) : esc(txt); }
}

// --- juego 2: ordenar la frase ---
function juegoOrden(which) {
  var host = document.getElementById('gord');
  var lote, regla, titulo;
  if (which === 'adj') {
    lote = pick(GYM.adjetivos.orden.v, 8).map(function (l) { return l.split('|')[0]; });
    regla = GYM.adjetivos.orden.regla; titulo = 'Varios adjetivos seguidos';
  } else {
    var G = GYM.orden.grupos[which | 0];
    lote = pick(G.v, Math.min(8, G.v.length)); regla = G.regla; titulo = G.t;
  }
  var i = 0, aciertos = 0;
  host.innerHTML = '<div class="card flat" style="margin-top:14px"><b>' + esc(titulo) + '</b>' +
    '<p class="small dim">' + regla + '</p></div><div id="ozona"></div>';
  paint();

  function paint() {
    var z = document.getElementById('ozona');
    if (i >= lote.length) {
      var pct = Math.round(aciertos / lote.length * 100);
      rec('gram', pct >= 70, 'ordenar frases · ' + titulo); S.ses++; save();
      z.innerHTML = '<div class="card flat"><div class="metrics">' + metric(pct + '%', 'aciertos') +
        metric(aciertos + '/' + lote.length, 'frases') + '</div></div>';
      var b = el('<button class="btn small">Otra tanda</button>');
      b.onclick = function () { juegoOrden(which); };
      z.appendChild(b); return;
    }
    var frase = lote[i], fin = /[.?]$/.test(frase) ? frase.slice(-1) : '';
    var limpio = fin ? frase.slice(0, -1) : frase;
    var palabras = limpio.split(' ');
    var puestas = [];
    z.innerHTML = '<p class="small dim">Frase ' + (i + 1) + ' de ' + lote.length + '</p>' +
      '<div class="bandeja en" id="obandeja"></div><div class="row" id="obolsa"></div>' +
      '<div class="row" style="margin-top:10px"><button class="btn small" id="ock">Comprobar</button>' +
      '<button class="btn sec small" id="ozap">Borrar</button></div><div id="ofb"></div>';
    var bandeja = z.querySelector('#obandeja'), bolsa = z.querySelector('#obolsa');
    var orden = shuffle(palabras.map(function (w, k) { return { w: w, k: k }; }));
    orden.forEach(function (o) {
      var b = el('<button class="ficha en">' + esc(o.w) + '</button>');
      b.onclick = function () {
        if (b.classList.contains('hecha')) return;
        b.classList.add('hecha'); puestas.push(o); pinta();
      };
      bolsa.appendChild(b); o.btn = b;
    });
    function pinta() { bandeja.textContent = puestas.map(function (o) { return o.w; }).join(' ') + (puestas.length ? fin : ''); }
    pinta();
    z.querySelector('#ozap').onclick = function () {
      puestas.forEach(function (o) { o.btn.classList.remove('hecha'); }); puestas = []; pinta();
    };
    z.querySelector('#ock').onclick = function () {
      var mia = puestas.map(function (o) { return o.w; }).join(' ');
      var ok = mia === limpio;
      if (ok) aciertos++;
      z.querySelector('#ofb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '">' +
        (ok ? '✔ Correcto.' : '✖ Era: <b class="en">' + esc(frase) + '</b>') + '</div>' +
        (ok ? '' : correccion(mia, limpio));
      if (ok) speak(frase);
      rec('gram', ok, 'orden: ' + frase);
      save();
      var seguir = function () { i++; paint(); };
      if (ok) { setTimeout(seguir, 1000); return; }
      var cont = el('<button class="btn small" style="margin-top:10px">Continuar →</button>');
      cont.onclick = seguir;
      z.querySelector('#ofb').appendChild(cont);
      cont.focus();
    };
  }
}

// --- juego 3: ¿cuál encaja? ---
function huecosDe(id) {
  var src = id === 'todo' ? [].concat(GYM.conectores.huecos, GYM.prepos.huecos, GYM.cantidad.huecos, FRS.huecos || [])
           : id === 'frases' ? (FRS.huecos || [])
                             : (GYM[id] || {}).huecos || [];
  return src.map(function (l) {
    var p = l.split('|');
    var ops = shuffle([p[1], p[2], p[3]]);
    var q = qMC('Completa el hueco:<br>' + gapHtml(p[0]), ops, ops.indexOf(p[1]), p[4], 'gram');
    q.say = p[0].replace(/___+/, p[1]);
    q.part = id === 'prepos' ? 'Preposiciones' : id === 'cantidad' ? 'much / many'
           : id === 'frases' ? 'Frases y usos UK / US' : 'Conectores';
    return q;
  });
}
function juegoHuecos(id) {
  var items = pick(huecosDe(id), 12);
  var host = document.getElementById('ghue');
  host.innerHTML = '';
  runTest(host, items, { min: 75, pasoTxt: 'Bien: ya los eliges por la relación, no por la traducción', protocolo: PROTO_HUECOS }, function (pct, pass, foot) {
    S.ses++; save();
    var b = el('<button class="btn sec small">Otra tanda</button>');
    b.onclick = function () { juegoHuecos(id); };
    foot.appendChild(b);
  });
}

// --- juego 4: velocidad 60 segundos ---
function juegoVelocidad() {
  var pool = shuffle(huecosDe('todo').concat(
    (GYM.adjetivos.opuestos || []).map(function (l) {
      var p = l.split('|'), malas = pick(GYM.adjetivos.opuestos.filter(function (x) { return x !== l; }), 2)
        .map(function (x) { return x.split('|')[Math.random() < 0.5 ? 0 : 1]; });
      var ops = shuffle([p[1]].concat(malas));
      return qMC('Lo contrario de <b class="en">' + esc(p[0]) + '</b>', ops, ops.indexOf(p[1]), '', 'lex');
    })));
  var host = document.getElementById('gvel');
  var i = 0, ok = 0, mal = 0, segs = 60, iv;
  host.innerHTML = '<div class="row between" style="margin:14px 0 8px"><b id="vsc">0 aciertos</b><span class="timer" id="vtm">1:00</span></div><div id="vzona"></div>';
  var sc = host.querySelector('#vsc'), tm = host.querySelector('#vtm');
  iv = setInterval(function () {
    segs--; tm.textContent = '0:' + String(Math.max(0, segs)).padStart(2, '0');
    if (segs <= 0) fin();
  }, 1000);
  paint();
  function paint() {
    if (segs <= 0) return;
    var it = pool[i % pool.length];
    var z = document.getElementById('vzona');
    z.innerHTML = '<div class="qt">' + it.q + '</div>';
    var row = el('<div class="opts"></div>');
    it.o.forEach(function (o, k) {
      var b = el('<button class="opt' + (/[a-z]{2}/.test(o) && !/ /.test(o) ? ' en' : '') + '">' + esc(o) + '</button>');
      b.onclick = function () {
        var acierto = k === it.k;
        row.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
        if (acierto) { ok++; b.classList.add('ok'); }
        else { mal++; b.classList.add('bad'); row.querySelectorAll('.opt')[it.k].classList.add('ok'); }
        rec(it.cat, acierto, it.q);
        sc.textContent = ok + (ok === 1 ? ' acierto' : ' aciertos');
        i++; setTimeout(paint, acierto ? 200 : 1100);  // al fallar, tiempo para ver la buena
      };
      row.appendChild(b);
    });
    z.appendChild(row);
  }
  function fin() {
    clearInterval(iv);
    var tot = ok + mal, prec = tot ? Math.round(ok / tot * 100) : 0;
    S.ses++; save();
    document.getElementById('vzona').innerHTML = '<div class="card flat"><div class="metrics">' +
      metric(ok, 'aciertos en 60 s') + metric(prec + '%', 'precisión') + metric(tot, 'intentos') + '</div>' +
      '<p class="small dim">' + (ok >= 20 ? 'Ese es el ritmo del automatismo: ya no traduces, reconoces.'
        : ok >= 12 ? 'Buen ritmo. El objetivo son veinte aciertos con más del ochenta por ciento de precisión.'
        : 'Todavía vas analizando cada frase. Es normal al principio: juega primero a parejas, que crea la asociación, y vuelve aquí.') + '</p></div>';
    var b = el('<button class="btn small">Otra vez</button>');
    b.onclick = function () { juegoVelocidad(); };
    document.getElementById('vzona').appendChild(b);
  }
}

// ---------- gimnasio · comprensión lectora ----------
// Seis herramientas, una por cada destreza que compone la comprensión lectora.
// No se entrenan juntas: leer para hacerse una idea y leer para encontrar un
// dato son operaciones opuestas, y mezclarlas es lo que deja a la gente
// leyendo despacio y sin entender.
var LEC = window.LECTURA || { textos: [] };

function textoDe(id) {
  for (var i = 0; i < LEC.textos.length; i++) if (LEC.textos[i].id === id) return LEC.textos[i];
  return LEC.textos[0];
}
function parrafos(t) {
  return String(t).split(/\n\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
}
function palabrasDe(t) { return String(t).trim().split(/\s+/).length; }

// Un solo cronómetro para toda la sección. Antes cada ejercicio abría el suyo
// y no lo cerraba: al cambiar de herramienta el reloj viejo seguía corriendo
// contra un elemento que ya no existía y reventaba cada medio segundo.
var lecIv = null;
function pararCrono() { if (lecIv) { clearInterval(lecIv); lecIv = null; } }
function crono(id, t0) {
  pararCrono();
  lecIv = setInterval(function () {
    var e = document.getElementById(id);
    if (!e) { pararCrono(); return; }
    var s2 = Math.round((Date.now() - t0) / 1000);
    e.textContent = Math.floor(s2 / 60) + ':' + String(s2 % 60).padStart(2, '0');
  }, 500);
}

// El texto, con su traducción plegada. Va plegada a propósito: si la tienes
// delante mientras lees, no estás entrenando comprensión lectora.
function panelTexto(T, oculto) {
  return '<div class="card lecc' + (oculto ? ' tapado' : '') + '" id="lectxt">' +
    '<div class="row between"><h3 style="margin:0">' + esc(T.t) + '</h3>' +
    '<span class="tagp">' + esc(T.nivel) + ' · ' + esc(T.tipo) + ' · ' + palabrasDe(T.txt) + ' palabras</span></div>' +
    '<div class="lect en">' + parrafos(T.txt) + '</div>' +
    '<details class="trad-txt"><summary>Ver el texto en español</summary>' +
    '<p class="small dim">Ábrelo <b>después</b> de responder, para comprobar. Si lo lees antes no estás entrenando comprensión lectora: estás leyendo en español.</p>' +
    '<div class="lect">' + parrafos(T.es) + '</div></details></div>';
}

function juegoLectura(modo, id) {
  pararCrono();
  var T = textoDe(id), host = document.getElementById('glec');
  var sel = '<div class="card flat"><label class="small"><b>Texto</b> <select id="lecSel">' +
    LEC.textos.map(function (x) {
      return '<option value="' + x.id + '"' + (x.id === T.id ? ' selected' : '') + '>' +
        esc(x.nivel) + ' · ' + esc(x.t) + '</option>';
    }).join('') + '</select></label>' +
    '<span class="dim small" style="margin-left:12px">Empieza por un nivel en el que entiendas casi todo: la comprensión lectora se entrena con textos fáciles leídos deprisa, no con textos difíciles leídos despacio.</span></div>';
  host.innerHTML = sel + '<div id="leczona"></div>';
  document.getElementById('lecSel').onchange = function () { juegoLectura(modo, this.value); };
  var z = document.getElementById('leczona');

  if (modo === 'idea') return modoIdea(z, T);
  if (modo === 'dato') return modoDato(z, T);
  if (modo === 'vel') return modoVelocidad(z, T);
  return modoPreguntas(z, T, modo);

  // --- 1 · idea principal: se lee contra reloj y luego se tapa el texto ---
  function modoIdea(z, T) {
    z.innerHTML = '<div class="note small"><b>Skimming.</b> No leas entero: lee el título, la <b>primera frase de cada párrafo</b> y la última del texto. ' +
      'En cuanto sepas de qué va, pulsa el botón. Se cronometra a propósito: aquí la velocidad es la destreza.</div>' +
      '<div class="row"><button class="btn" id="li0">Empezar a leer</button><span class="timer" id="lit">0:00</span></div><div id="lizona"></div>';
    var t0 = 0;
    document.getElementById('li0').onclick = function () {
      var b = this;
      if (!t0) {
        t0 = Date.now(); b.textContent = 'Ya sé de qué va →';
        document.getElementById('lizona').innerHTML = panelTexto(T);
        crono('lit', t0);
        return;
      }
      pararCrono();
      var segs = Math.max(1, Math.round((Date.now() - t0) / 1000));
      b.disabled = true;
      var ops = shuffle([T.idea[0], T.idea[1], T.idea[2]]);
      var it = qMC('¿De qué trata el texto?', ops, ops.indexOf(T.idea[0]), T.idea[3], 'read');
      it.part = 'Idea principal · ' + T.t;
      var zona = document.getElementById('lizona');
      zona.innerHTML = '<div class="note small">El texto se ha tapado a propósito. Si necesitas volver a mirarlo para responder, es que no has hecho skimming: has hecho lectura lenta.</div><div id="lipreg"></div>';
      runTest(zona.querySelector('#lipreg'), [it], { min: 100, pasoTxt: 'Acertaste la idea en ' + segs + ' segundos' }, function (pct, pass, foot) {
        S.ses++; save();
        var vel = Math.round(palabrasDe(T.txt) / (segs / 60));
        foot.insertAdjacentHTML('beforebegin', '<div class="metrics">' + metric(segs + ' s', 'tiempo de lectura') +
          metric(vel, 'palabras/minuto') + '</div><p class="small ' + (pass && segs <= 45 ? 'ok-t' : 'dim') + '">' +
          (!pass ? 'Fallar la idea principal casi siempre significa que te has quedado atascada en un párrafo. Vuelve a intentarlo con otro texto leyendo <b>solo</b> las primeras frases: da vértigo y funciona.'
            : segs <= 30 ? 'Eso es skimming de verdad: has captado el sentido sin leerlo todo. Es exactamente lo que hay que hacer en la primera pasada de un examen.'
            : segs <= 60 ? 'Bien, aunque todavía estás leyendo demasiado. Prueba a hacerlo en menos de treinta segundos: verás que sigues acertando.'
            : 'Has acertado, pero leyéndolo entero. El objetivo de este ejercicio no es acertar: es acertar deprisa.') + '</p>');
        var b2 = el('<button class="btn sec small">Otro texto</button>');
        b2.onclick = function () { juegoLectura('idea', LEC.textos[Math.floor(Math.random() * LEC.textos.length)].id); };
        foot.appendChild(b2);
      });
    };
  }

  // --- 2 · buscar el dato: la pregunta primero, el texto delante, contra reloj ---
  function modoDato(z, T) {
    var lote = pick(T.datos, Math.min(4, T.datos.length)), k = 0, ac = 0, t0 = Date.now();
    z.innerHTML = '<div class="note small"><b>Scanning.</b> Al revés que lo anterior: <b>lee primero la pregunta</b> y después barre el texto ' +
      'buscando solo la forma de esa palabra o de esa cifra. No leas las frases: búscalas con la vista.</div>' +
      '<div class="row between"><span class="dim small" id="ldn"></span><span class="timer" id="ldt">0:00</span></div>' +
      '<div id="ldpreg"></div>' + panelTexto(T);
    crono('ldt', t0);
    paso();
    function paso() {
      // Si ya no estamos en este ejercicio —se ha cambiado de herramienta o de
      // texto mientras corría el temporizador— no hay nada que pintar.
      var zz = document.getElementById('ldpreg'), cont = document.getElementById('ldn');
      if (!zz || !cont) { pararCrono(); return; }
      cont.textContent = 'Dato ' + Math.min(k + 1, lote.length) + ' de ' + lote.length;
      if (k >= lote.length) {
        pararCrono();
        var segs = Math.round((Date.now() - t0) / 1000), pct = Math.round(ac / lote.length * 100);
        rec('read', pct >= 75, 'scanning · ' + T.t); S.ses++; save();
        zz.innerHTML = '<div class="card flat"><div class="metrics">' + metric(pct + '%', 'aciertos') +
          metric(ac + '/' + lote.length, 'datos') + metric(segs + ' s', 'tiempo total') +
          metric(Math.round(segs / lote.length) + ' s', 'por dato') + '</div><p class="small ' + (pct >= 75 ? 'dim' : 'bad-t') + '">' +
          (segs / lote.length <= 15 && pct >= 75 ? 'Ese es el ritmo: menos de quince segundos por dato. En el examen esta parte no debe consumirte tiempo de pensar.'
            : pct >= 75 ? 'Los encuentras, pero tardando. Truco: fíjate en la <b>forma</b> de la palabra —una cifra, una mayúscula, una palabra larga— en vez de leer las frases.'
            : 'Se te escapan. Casi siempre es porque estás leyendo el texto en vez de barrerlo. Vuelve a intentarlo tapando mentalmente todo salvo lo que se parece a la respuesta.') + '</p></div>';
        var b = el('<button class="btn sec small">Otra tanda</button>');
        b.onclick = function () { juegoLectura('dato', T.id); };
        zz.appendChild(b); return;
      }
      var p = lote[k].split('|');
      zz.innerHTML = '<div class="card"><div class="qt">' + esc(p[0]) + '</div>' +
        '<input type="text" id="ldin" autocomplete="off" spellcheck="false" placeholder="Copia el dato tal y como aparece en el texto…">' +
        '<button class="btn small" id="ldok" style="margin-top:10px">Comprobar</button><div id="ldfb"></div></div>';
      var inp = zz.querySelector('#ldin');
      zz.querySelector('#ldok').onclick = function () {
        var mia = norm(inp.value), sol = norm(p[1]);
        var ok = mia === sol || (mia.length > 1 && sol.indexOf(mia) >= 0 && mia.length >= sol.length - 2);
        if (ok) ac++;
        inp.disabled = true; this.disabled = true;
        rec('read', ok, 'dato: ' + p[0]);
        zz.querySelector('#ldfb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '">' +
          (ok ? '✔ Correcto.' : '✖ Era <b class="en">' + esc(p[1]) + '</b>.') +
          ' <span class="dim">' + esc(p[2]) + '</span></div>';
        var c = el('<button class="btn small" style="margin-top:10px">Siguiente →</button>');
        c.onclick = function () { k++; paso(); };
        zz.querySelector('#ldfb').appendChild(c);
        if (ok) { k++; setTimeout(paso, 900); }
      };
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') zz.querySelector('#ldok').click(); });
      inp.focus();
    }
  }

  // --- 3, 4 y 5 · deducir, vocabulario por contexto y referencia ---
  function modoPreguntas(z, T, modo) {
    var fuente = modo === 'infer' ? T.infer : modo === 'vocab' ? T.vocab : T.ref;
    var titulo = modo === 'infer' ? 'Deducir' : modo === 'vocab' ? 'Vocabulario por contexto' : '¿A qué se refiere?';
    var aviso = modo === 'infer'
      ? '<b>Deducir.</b> La respuesta no está escrita con esas palabras, pero <b>siempre se apoya en una línea concreta</b> del texto. Antes de contestar, busca esa línea. Si no la encuentras, no es la respuesta.'
      : modo === 'vocab'
      ? '<b>Vocabulario por contexto.</b> Sin diccionario y sin traductor: eso es justo lo que hay que dejar de hacer. Mira lo que va <b>antes y después</b> de la palabra; el contexto casi siempre la define.'
      : '<b>Referencia.</b> Cada pregunta es un <i>it</i>, un <i>this</i> o un <i>they</i>. Regla: casi siempre se refieren a lo <b>último nombrado</b>, y cuando es <i>this</i> suele recoger <b>la idea entera</b> de la frase anterior, no una palabra.';
    var items = fuente.map(function (l) {
      var p = l.split('|');
      var ops = shuffle([p[1], p[2], p[3]]);
      var q = qMC(modo === 'vocab' ? '¿Qué significa <b class="en">' + esc(p[0]) + '</b> en este texto?'
                : modo === 'ref' ? '¿A qué se refiere <b class="en">' + esc(p[0]) + '</b>?'
                : esc(p[0]),
        ops, ops.indexOf(p[1]), p[4], 'read');
      q.part = titulo + ' · ' + T.t;
      return q;
    });
    z.innerHTML = '<div class="note small">' + aviso + '</div>' + panelTexto(T) + '<div id="lqz"></div>';
    runTest(document.getElementById('lqz'), shuffle(items), {
      min: 70, pasoTxt: 'Bien: te apoyas en el texto, no en la intuición',
      protocolo: '<ol class="proto-l"><li><b>Vuelve al texto y busca la línea</b> que sostiene la respuesta correcta. Está ahí; la explicación te dice dónde.</li>' +
        '<li><b>Pregúntate por qué te convenció la mala.</b> Casi siempre es porque suena verosímil pero el texto no lo dice: eso es exactamente lo que mide el examen.</li>' +
        '<li><b>Subraya mentalmente esa línea</b> antes de seguir. La próxima vez la reconocerás.</li></ol>'
    }, function (pct, pass, foot) {
      rec('read', pass, 'lectura · ' + modo); S.ses++; save();
      var b = el('<button class="btn sec small">Otro texto</button>');
      b.onclick = function () { juegoLectura(modo, LEC.textos[Math.floor(Math.random() * LEC.textos.length)].id); };
      foot.appendChild(b);
    });
  }

  // --- 6 · velocidad lectora con control de comprensión ---
  function modoVelocidad(z, T) {
    var pal = palabrasDe(T.txt);
    z.innerHTML = '<div class="note small"><b>Velocidad.</b> Lee el texto entero, de un tirón, <b>sin volver atrás y sin traducir</b>. ' +
      'Al terminar hay tres preguntas: la velocidad sin comprensión no cuenta. Referencia en lengua extranjera: 120-180 palabras por minuto.</div>' +
      '<div class="row"><button class="btn" id="lv0">Empezar</button><span class="timer" id="lvt">0:00</span>' +
      '<span class="dim small">' + pal + ' palabras</span></div><div id="lvzona"></div>';
    var t0 = 0;
    document.getElementById('lv0').onclick = function () {
      var b = this;
      if (!t0) {
        t0 = Date.now(); b.textContent = 'He terminado →';
        document.getElementById('lvzona').innerHTML = panelTexto(T);
        crono('lvt', t0);
        return;
      }
      pararCrono(); b.disabled = true;
      var segs = Math.max(1, Math.round((Date.now() - t0) / 1000));
      var wpm = Math.round(pal / (segs / 60));
      var ops = shuffle([T.idea[0], T.idea[1], T.idea[2]]);
      var items = [qMC('¿De qué trata el texto?', ops, ops.indexOf(T.idea[0]), T.idea[3], 'read')];
      pick(T.infer, Math.min(2, T.infer.length)).forEach(function (l) {
        var p = l.split('|'), o2 = shuffle([p[1], p[2], p[3]]);
        items.push(qMC(esc(p[0]), o2, o2.indexOf(p[1]), p[4], 'read'));
      });
      items.forEach(function (x) { x.part = 'Control de comprensión'; });
      var zona = document.getElementById('lvzona');
      zona.innerHTML = '<div class="metrics">' + metric(wpm, 'palabras/minuto') + metric(segs + ' s', 'tiempo') + metric(pal, 'palabras') + '</div>' +
        '<p class="small ' + (wpm >= 120 ? 'ok-t' : wpm >= 90 ? 'dim' : 'bad-t') + '">' +
        (wpm >= 180 ? 'Muy rápido. Comprueba con las preguntas que no has ido tan deprisa como para perder el sentido.'
          : wpm >= 120 ? 'Velocidad de lector competente en lengua extranjera. A partir de aquí lo que hay que cuidar es la comprensión, no el ritmo.'
          : wpm >= 90 ? 'Por debajo de lo cómodo. Casi siempre es traducción mental: prueba a leer el mismo texto otra vez sin permitirte decirlo en español.'
          : 'Muy despacio para comprender bien: a este ritmo no da tiempo a sostener el sentido de la frase mientras llegas al final. La causa casi siempre es volver atrás. Léelo otra vez tapando con el dedo lo ya leído.') + '</p>' +
        '<div class="note small">Ahora las preguntas, <b>con el texto tapado</b>. Velocidad sin comprensión no vale de nada.</div><div id="lvpreg"></div>';
      runTest(zona.querySelector('#lvpreg'), items, { min: 67, pasoTxt: 'Comprensión confirmada a ' + wpm + ' palabras por minuto' }, function (pct, pass, foot) {
        rec('read', pass, 'velocidad lectora'); S.ses++; save();
        foot.insertAdjacentHTML('beforebegin', '<p class="small ' + (pass ? 'ok-t' : 'bad-t') + '">' +
          (pass ? 'Velocidad <b>y</b> comprensión. Esa es la marca que hay que repetir en textos cada vez más largos.'
            : 'Has leído deprisa pero se ha perdido el sentido. Baja el ritmo un veinte por ciento y repite: la velocidad útil es la máxima a la que sigues entendiendo, no la máxima.') + '</p>');
        var b2 = el('<button class="btn sec small">Otro texto</button>');
        b2.onclick = function () { juegoLectura('vel', LEC.textos[Math.floor(Math.random() * LEC.textos.length)].id); };
        foot.appendChild(b2);
      });
    };
  }
}

// ---------- vista: palabras derivadas (word formation) ----------
// Palabra en inglés que se oye y muestra su significado al pulsarla.
function palabraES(w) {
  var es = traduccion(w);
  return '<b class="en vb pal" data-say="' + esc(w) + '" title="Pulsa para oírla">' + esc(w) + '</b>' +
    (es ? '<span class="trad-es">' + esc(es) + '</span>' : ' ' + trad(w));
}
function cablearPalabras(raiz) {
  raiz.querySelectorAll('.pal').forEach(function (x) {
    x.onclick = function () { speak(x.dataset.say); };
  });
}

// El interruptor de «ver la traducción», idéntico en todas las pestañas.
function interruptorTraduccion(nota) {
  return '<div class="card flat"><label class="small"><input type="checkbox" class="verEs"' +
    (S.trad === false ? '' : ' checked') + '> <b>Ver la traducción al español</b></label>' +
    '<span class="dim small" style="margin-left:12px">' +
    (nota || 'Debajo de cada palabra inglesa. Apágala cuando ya no la necesites: ese es justo el momento en que empieza a estorbar.') +
    '</span></div>';
}
function cablearInterruptor() {
  app.querySelectorAll('.verEs').forEach(function (chk) {
    chk.onchange = function () {
      S.trad = chk.checked; save();
      app.classList.toggle('sin-tr', !chk.checked);
      app.querySelectorAll('.verEs').forEach(function (o) { o.checked = chk.checked; });
    };
  });
}

function vDerivadas() {
  var h = '<h1>Palabras derivadas · word formation</h1>' +
    '<p class="dim">' + DRV.intro + '</p>' +
    '<div class="card"><h3>Cómo se resuelve el ejercicio</h3><ol>' +
    DRV.pasos.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol></div>' +
    '<div class="card"><div class="row between"><div><h3 style="margin:0">Practicar</h3>' +
    '<p class="small dim" style="margin:4px 0 0">Veinte huecos con el mismo formato del examen. Se corrigen al momento y te dice por qué.</p></div>' +
    '<div class="row"><button class="btn sec small" data-prac="familia">Solo -ing / -ed</button>' +
    '<button class="btn" data-prac="todo">Empezar práctica</button></div></div><div id="prac"></div></div>' +
    interruptorTraduccion('Debajo de cada raíz y de cada palabra derivada. Las frases de ejemplo, al ser frases enteras, siguen llevando el enlace al traductor.') +
    '<div class="card flat"><label class="small"><b>Buscar</b> ' +
    '<input id="dq" type="text" placeholder="una raíz o una terminación: RELAX, -ness, im-…" style="min-width:260px"></label>' +
    '<span class="dim small" id="dn" style="margin-left:10px"></span></div><div id="dlist"></div>';
  app.innerHTML = h;
  cablearInterruptor();
  app.querySelectorAll('[data-prac]').forEach(function (b) {
    b.onclick = function () { practicar(b.dataset.prac === 'familia'); };
  });

  // Genera huecos a partir de la propia tabla: se tapa la palabra derivada
  // dentro de su frase de ejemplo y se da la raíz, igual que en el examen.
  function practicar(soloIngEd) {
    var pool = [];
    DRV.familias.forEach(function (G, gi) {
      if (soloIngEd && gi !== 0) return;
      G.v.forEach(function (l) {
        var p = l.split('|');
        var re = new RegExp('\\b' + p[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (!re.test(p[3])) return;
        pool.push({ t: 'wf', root: p[0], a: p[1], q: p[3].replace(re, '___'), tipo: p[2], fam: G.t,
                    cat: 'cam', part: 'Word formation · ' + G.t });
      });
    });
    var items = pick(pool, Math.min(20, pool.length));
    var host = document.getElementById('prac');
    host.innerHTML = '';
    runTest(host, items, { min: 70, pasoTxt: 'Bien: dominas la derivación' }, function (pct, pass, foot) {
      rec('cam', pass, 'práctica de derivadas'); S.ses++; save();
      var b2 = el('<button class="btn sec small">Otra tanda</button>');
      b2.onclick = function () { practicar(soloIngEd); };
      foot.appendChild(b2);
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  var q = document.getElementById('dq');
  q.oninput = function () { pinta(q.value); };
  pinta('');

  function pinta(f) {
    f = norm(f || '').replace(/-/g, '');
    var total = 0;
    var out = DRV.familias.map(function (G) {
      var filas = G.v.map(function (l) { return l.split('|'); })
        .filter(function (p) { return !f || norm(p[0] + ' ' + p[1] + ' ' + p[2]).indexOf(f) >= 0; });
      total += filas.length;
      if (!filas.length) return '';
      return '<div class="card"><h2 style="margin-top:0">' + esc(G.t) + '</h2>' +
        (f ? '' : '<p class="dim small">' + G.nota + '</p>') +
        '<div class="tablewrap"><table><tr><th>Raíz</th><th>Palabra derivada</th><th>Qué es</th><th>Ejemplo</th></tr>' +
        filas.map(function (p) {
          // La raíz también se puede oír: era la única palabra inglesa de la
          // tabla que no sonaba al pulsarla.
          return '<tr><td><b class="en vb pal mono" data-say="' + esc(p[0]) + '" title="Pulsa para oír la raíz">' +
            esc(p[0]) + '</b>' + trEs(traduccion(p[0])) + '</td>' +
            '<td>' + palabraES(p[1]) + '</td>' +
            '<td class="dim small">' + esc(p[2]) + '</td>' +
            '<td><span class="en vb" data-say="' + esc(p[3]) + '" title="Escuchar la frase">' + esc(p[3]) + '</span> ' + trad(p[3]) + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');
    document.getElementById('dlist').innerHTML = out || '<div class="card"><p>Nada coincide con esa búsqueda.</p></div>';
    document.getElementById('dn').textContent = total + (total === 1 ? ' palabra' : ' palabras') + ' · pulsa cualquier palabra para oírla';
    app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
    cablearPalabras(app);
  }
}

// ---------- vista: frases de negocios y arquitectura (UK / US) ----------
// Tres capas: frases por situación, pares británico/americano y coloquiales.
// Todo se puede escuchar y todo se puede buscar con una sola caja.
function marca(m) {
  if (m === 'UK') return ' <span class="pill uk">UK</span>';
  if (m === 'US') return ' <span class="pill us">US</span>';
  return '';
}
function frase(t) { return '<span class="en vb" data-say="' + esc(t) + '" title="Pulsa para escucharla">' + esc(t) + '</span>'; }

function vFrases(arg) {
  var h = '<h1>Frases de trabajo · negocios y arquitectura</h1>' +
    '<p class="dim">' + FRS.intro + '</p>' +
    '<div class="note small">' + FRS.aviso + '</div>' +
    '<div class="card"><div class="row between"><div><h3 style="margin:0">Practicar</h3>' +
    '<p class="small dim" style="margin:4px 0 0">Doce huecos con las trampas reales entre inglés británico y americano, o parejas contrarreloj con las expresiones coloquiales.</p></div>' +
    '<div class="row"><button class="btn" id="fhue">Huecos UK / US</button>' +
    '<button class="btn sec" id="fpar">Parejas de expresiones</button></div></div><div id="fprac"></div></div>' +
    interruptorTraduccion('Aquí el «cuándo se dice» de cada frase está siempre a la vista; el interruptor afecta a las palabras sueltas del resto del curso.') +
    '<div class="card flat"><label class="small"><b>Buscar</b> ' +
    '<input id="fq" type="text" placeholder="una situación o una palabra: obra, fee, floor, plazo…" style="min-width:280px"></label>' +
    '<span class="dim small" id="fn" style="margin-left:10px"></span></div><div id="flist"></div>';
  app.innerHTML = h;
  cablearInterruptor();
  document.getElementById('fhue').onclick = function () {
    var host = document.getElementById('fprac'); host.innerHTML = '';
    runTest(host, pick(huecosDe('frases'), 12), { min: 75, pasoTxt: 'Bien: ya distingues el registro de cada país' }, function (pct, pass, foot) {
      S.ses++; save();
      var b = el('<button class="btn sec small">Otra tanda</button>');
      b.onclick = function () { document.getElementById('fhue').click(); };
      foot.appendChild(b);
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  document.getElementById('fpar').onclick = function () {
    document.getElementById('fprac').innerHTML = '<div id="gpar"></div>';
    juegoParejas('frases');
    document.getElementById('fprac').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  var q = document.getElementById('fq');
  q.oninput = function () { pinta(q.value); };
  if (arg) q.value = decodeURIComponent(arg);
  pinta(q.value);

  function pinta(f) {
    f = norm(f || '');
    var total = 0;
    function cabe(txt) { return !f || norm(txt).indexOf(f) >= 0; }

    var sit = (FRS.bloques || []).map(function (G) {
      var filas = G.v.map(function (l) { return l.split('|'); })
        .filter(function (p) { return cabe(G.t + ' ' + p[0] + ' ' + p[1]); });
      total += filas.length;
      if (!filas.length) return '';
      return '<div class="card"><h2 style="margin-top:0">' + esc(G.t) + '</h2>' +
        (f ? '' : '<p class="dim small">' + G.nota + '</p>') +
        '<div class="tablewrap"><table><tr><th>Se dice</th><th>Cuándo</th></tr>' +
        filas.map(function (p) {
          return '<tr><td>' + frase(p[0]) + marca(p[2]) + '</td><td class="dim small">' + p[1] + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');

    var pares = (FRS.ukus || []).map(function (G) {
      var filas = G.v.map(function (l) { return l.split('|'); })
        .filter(function (p) { return cabe(G.t + ' ' + p[0] + ' ' + p[1] + ' ' + p[2]); });
      total += filas.length;
      if (!filas.length) return '';
      return '<div class="card"><h2 style="margin-top:0">' + esc(G.t) + '</h2>' +
        '<div class="tablewrap"><table><tr><th>Reino Unido</th><th>Estados Unidos</th><th>Qué es</th></tr>' +
        filas.map(function (p) {
          return '<tr><td>' + frase(p[0]) + '</td><td>' + frase(p[1]) + '</td>' +
            '<td class="dim small">' + esc(p[2]) + (p[3] ? '<br><span class="ojo">⚠ ' + p[3] + '</span>' : '') + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');

    var col = (FRS.modismos || []).map(function (G) {
      var filas = G.v.map(function (l) { return l.split('|'); })
        .filter(function (p) { return cabe(G.t + ' ' + p[0] + ' ' + p[1] + ' ' + p[3]); });
      total += filas.length;
      if (!filas.length) return '';
      return '<div class="card"><h2 style="margin-top:0">' + esc(G.t) + '</h2>' +
        (f || !G.nota ? '' : '<p class="dim small">' + G.nota + '</p>') +
        '<div class="tablewrap"><table><tr><th>Expresión</th><th>Qué significa de verdad</th><th>En contexto</th></tr>' +
        filas.map(function (p) {
          return '<tr><td>' + frase(p[0]) + (p[2] === '—' ? '' : marca(p[2])) + '</td>' +
            '<td class="dim small">' + esc(p[1]) + '</td><td>' + frase(p[3]) + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');

    var out = (sit ? '<h2 class="sec">Por situación</h2>' + sit : '') +
              (pares ? '<h2 class="sec">Reino Unido frente a Estados Unidos</h2>' + pares : '') +
              (col ? '<h2 class="sec">Coloquial y autóctono</h2>' + col : '');
    document.getElementById('flist').innerHTML = out || '<div class="card"><p>Nada coincide con esa búsqueda.</p></div>';
    document.getElementById('fn').textContent = total + (total === 1 ? ' entrada' : ' entradas') + ' · pulsa cualquier frase para oírla';
    app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
  }
}

// ---------- vista: familias de palabras ----------
// Las palabras más usadas del inglés, cada una con su familia completa,
// sus phrasal verbs y sus combinaciones fijas. Cuatro ejercicios que obligan
// a producir la forma, no solo a reconocerla.
var FAM = window.FAMILIAS || { grupos: [] };

function todasLasFamilias() {
  var v = [];
  FAM.grupos.forEach(function (G) { G.v.forEach(function (x) { v.push(x); }); });
  return v;
}

function vFamilias(arg) {
  var h = '<h1>Familias de palabras</h1>' +
    '<p class="dim">' + FAM.intro + '</p>' +
    profe({
      porque: '<p>' + FAM.teoria.map(function (x) { return x; }).join('</p><p>') + '</p>',
      como: '<p>Cinco pasos, y el quinto es el que de verdad fija:</p><ol class="proto-l">' +
        FAM.metodo.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
        '<p>No intentes abarcar las cincuenta y una familias. <b>Dos por sesión, bien exprimidas</b>, y vuelta a ellas al día siguiente.</p>',
      fallo: '<p>Aquí fallar significa casi siempre una de estas tres cosas, y cada una se corrige distinto:</p>' +
        '<ol class="proto-l">' +
        '<li><b>Has puesto el verbo donde iba el sustantivo</b> (<i>we need a decide</i>). Es el fallo más común y el más fácil: mira qué hay delante del hueco. Si hay <i>a</i>, <i>the</i>, <i>this</i> o un adjetivo, va un <b>sustantivo</b>; si hay un sujeto, va un <b>verbo</b>.</li>' +
        '<li><b>Has acertado la categoría pero no el sufijo</b> (<i>decidement</i> en vez de <i>decision</i>). Eso no se razona, se memoriza: vuelve a la tabla de esa familia y léela en voz alta tres veces.</li>' +
        '<li><b>Has confundido la cosa con la persona</b> (<i>the build</i> por <i>the builder</i>, <i>the manage</i> por <i>the manager</i>). Regla práctica: <b>-er</b> y <b>-or</b> son casi siempre <b>quien lo hace</b>; <b>-ion</b>, <b>-ment</b> y <b>-ance</b> son <b>la cosa o el proceso</b>.</li></ol>' +
        '<p>Y en las combinaciones fijas no hay nada que razonar: <i>make a decision</i> es correcto y <i>take a decision</i> no, aunque en español digamos «tomar». Cuando falles una, escríbela entera —verbo y sustantivo juntos— como si fuera una sola palabra.</p>',
      error: '<p>Estudiar la lista de las mil palabras más frecuentes. Es el consejo más repetido y el menos útil: reconocerás las mil, pero no podrás <b>producir</b> ninguna, porque una palabra suelta no se usa nunca sola. Cincuenta familias exprimidas valen más que mil palabras vistas.</p>'
    }) +
    interruptorTraduccion('Debajo de cada palabra inglesa. Es el mismo interruptor de todo el curso.') +
    '<div class="card"><h3 style="margin-top:0">Practicar</h3>' +
    '<p class="small dim">Cuatro ejercicios, de menos a más difícil. Los dos primeros trabajan la derivación; los dos últimos, las combinaciones, que es donde se nota el nivel.</p>' +
    '<div class="row"><button class="btn" data-ej="forma">Completa la familia</button>' +
    '<button class="btn" data-ej="falta">¿Qué falta?</button>' +
    '<button class="btn sec" data-ej="phrasal">Phrasal verbs</button>' +
    '<button class="btn sec" data-ej="colo">Combinaciones fijas</button></div><div id="fmprac"></div></div>' +
    '<div class="card flat"><label class="small"><b>Buscar</b> ' +
    '<input id="fmq" type="text" placeholder="una palabra o su familia: decide, decision, gestionar…" style="min-width:280px"></label>' +
    '<span class="dim small" id="fmn" style="margin-left:10px"></span></div><div id="fmlist"></div>';
  app.innerHTML = h;
  cablearInterruptor();
  app.querySelectorAll('[data-ej]').forEach(function (b) {
    b.onclick = function () { ejercicio(b.dataset.ej); };
  });
  var q = document.getElementById('fmq');
  q.oninput = function () { pinta(q.value); };
  if (arg) q.value = decodeURIComponent(arg);
  pinta(q.value);

  // ---- las tablas ----
  function pinta(f) {
    f = norm(f || '');
    var total = 0;
    var out = FAM.grupos.map(function (G) {
      var fams = G.v.filter(function (x) {
        if (!f) return true;
        var t = x.w + ' ' + x.es + ' ' + x.f.join(' ') + ' ' + (x.ph || []).join(' ') + ' ' + (x.col || []).join(' ');
        return norm(t).indexOf(f) >= 0;
      });
      total += fams.length;
      if (!fams.length) return '';
      return '<h2 class="sec">' + esc(G.t) + '</h2>' +
        (f ? '' : '<p class="dim small">' + G.nota + '</p>') +
        fams.map(ficha).join('');
    }).join('');
    document.getElementById('fmlist').innerHTML = out || '<div class="card"><p>Nada coincide con esa búsqueda.</p></div>';
    document.getElementById('fmn').textContent = total + (total === 1 ? ' familia' : ' familias') + ' · pulsa cualquier palabra para oírla';
    app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
    cablearPalabras(app);
  }

  function ficha(x) {
    var h2 = '<div class="card fam" id="fam-' + esc(x.w) + '">' +
      '<div class="row between"><h3 style="margin:0"><span class="en vb" data-say="' + esc(x.w) + '">' + esc(x.w) + '</span>' +
      ' <span class="dim">·</span> <span class="dim">' + esc(x.es) + '</span></h3>' +
      (x.tipo ? '<span class="tagp">' + esc(x.tipo) + '</span>' : '') + '</div>' +
      '<div class="tablewrap"><table><tr><th>La familia</th><th>Qué es</th><th>En una frase</th></tr>' +
      x.f.map(function (l) {
        var p = l.split('|');
        return '<tr><td>' + palabraES(p[0]) + '</td>' +
          '<td class="dim small">' + esc(p[1]) + '</td>' +
          '<td><span class="en vb" data-say="' + esc(p[3]) + '" title="Escuchar la frase">' + esc(p[3]) + '</span> ' + trad(p[3]) + '</td></tr>';
      }).join('') + '</table></div>';
    if (x.ph && x.ph.length) {
      h2 += '<h4 class="sub">Phrasal verbs</h4><ul class="errs">' + x.ph.map(function (l) {
        var p = l.split('|');
        return '<li><b class="en vb" data-say="' + esc(p[0]) + '">' + esc(p[0]) + '</b>' + trEs(p[1]) +
          '<br><span class="en vb small" data-say="' + esc(p[2]) + '">' + esc(p[2]) + '</span></li>';
      }).join('') + '</ul>';
    }
    if (x.col && x.col.length) {
      h2 += '<h4 class="sub">Combinaciones fijas</h4><div class="pmin">' + x.col.map(function (l) {
        var p = l.split('|');
        return '<span class="par"><b class="en vb" data-say="' + esc(p[0]) + '">' + esc(p[0]) + '</b>' + trEs(p[1]) + '</span>';
      }).join('') + '</div>';
    }
    return h2 + '</div>';
  }

  // ---- los cuatro ejercicios ----
  function ejercicio(id) {
    var host = document.getElementById('fmprac');
    var items = id === 'forma' ? itemsForma() : id === 'falta' ? itemsFalta()
              : id === 'phrasal' ? itemsPhrasal() : itemsColo();
    if (!items.length) { host.innerHTML = '<div class="note small">No hay material suficiente para este ejercicio.</div>'; return; }
    host.innerHTML = '';
    var opts = id === 'forma'
      ? { min: 70, pasoTxt: 'Bien: ya produces la forma, no solo la reconoces',
          protocolo: '<ol class="proto-l"><li>Mira <b>qué hay delante del hueco</b>: si hay <i>a</i>, <i>the</i> o un adjetivo, iba un sustantivo; si hay un sujeto, iba un verbo.</li>' +
            '<li>Sube a la familia de esa raíz y <b>léela entera en voz alta</b>, con sus frases.</li>' +
            '<li>Vuelve a este ejercicio antes de irte: la misma raíz suele repetir.</li></ol>' }
      : { min: 70, pasoTxt: 'Bien: las combinaciones ya te salen solas',
          protocolo: '<ol class="proto-l"><li><b>No la razones.</b> Estas combinaciones no siguen ninguna regla y no se traducen desde el español.</li>' +
            '<li><b>Escríbela entera</b>, verbo y sustantivo juntos, como si fuera una sola palabra larga.</li>' +
            '<li>Dila en voz alta tres veces dentro de una frase tuya, no suelta.</li></ol>' };
    runTest(host, items, opts, function (pct, pass, foot) {
      rec('cam', pass, 'familias · ' + id); S.ses++; save();
      var b = el('<button class="btn sec small">Otra tanda</button>');
      b.onclick = function () { ejercicio(id); };
      foot.appendChild(b);
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 1 · completa la familia: se tapa el miembro dentro de su propia frase
  function itemsForma() {
    var pool = [];
    todasLasFamilias().forEach(function (x) {
      x.f.forEach(function (l) {
        var p = l.split('|');
        var re = new RegExp('\\b' + p[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (!re.test(p[3])) return;
        if (norm(p[0]) === norm(x.w)) return;          // la raíz sin cambiar no enseña nada
        pool.push({ t: 'wf', root: x.w.toUpperCase(), a: p[0], q: p[3].replace(re, '___'),
                    cat: 'cam', part: 'Familia de ' + x.w + ' · ' + p[1] });
      });
    });
    return pick(pool, Math.min(15, pool.length));
  }

  // 2 · qué falta: se da la definición y tres candidatos de la MISMA familia
  function itemsFalta() {
    var pool = [];
    todasLasFamilias().forEach(function (x) {
      if (x.f.length < 3) return;
      x.f.forEach(function (l) {
        var p = l.split('|');
        var otras = x.f.filter(function (o) { return o !== l; }).map(function (o) { return o.split('|')[0]; });
        otras = otras.filter(function (w, i) { return otras.indexOf(w) === i && w !== p[0]; });
        if (otras.length < 2) return;
        var ops = shuffle([p[0]].concat(pick(otras, 2)));
        var q = qMC('En la familia de <b class="en">' + esc(x.w) + '</b>, ¿cuál es <b>' + esc(p[1]) + '</b> que significa «' + esc(p[2]) + '»?',
          ops, ops.indexOf(p[0]),
          'Se ve en la frase: ' + p[3], 'cam');
        q.part = 'Familia de ' + x.w;
        q.say = p[3];
        pool.push(q);
      });
    });
    return pick(pool, Math.min(15, pool.length));
  }

  // 3 · phrasal verbs: se tapa la partícula dentro de la frase
  function itemsPhrasal() {
    var todos = [];
    todasLasFamilias().forEach(function (x) {
      (x.ph || []).forEach(function (l) { var p = l.split('|'); todos.push({ v: x.w, ph: p[0], es: p[1], ej: p[2] }); });
    });
    var pool = [];
    todos.forEach(function (o) {
      var re = new RegExp(o.ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\w*\\s+'), 'i');
      if (!re.test(o.ej)) return;
      var malas = pick(todos.filter(function (z) { return z.ph !== o.ph; }), 2).map(function (z) { return z.ph; });
      var ops = shuffle([o.ph].concat(malas));
      var q = qMC('¿Qué phrasal verb encaja aquí? Se da en infinitivo; en la frase iría conjugado.<br>' + gapHtml(o.ej.replace(re, '___')),
        ops, ops.indexOf(o.ph),
        '«' + o.ph + '» significa ' + o.es + '. Un phrasal verb no se deduce del verbo: la partícula cambia el significado entero.', 'lex');
      q.part = 'Phrasal verbs · ' + o.v;
      q.say = o.ej;
      pool.push(q);
    });
    return pick(pool, Math.min(12, pool.length));
  }

  // 4 · combinaciones fijas: el verbo que acompaña al sustantivo
  function itemsColo() {
    var VERB = ['make', 'do', 'take', 'have', 'give', 'get'];
    var pool = [];
    todasLasFamilias().forEach(function (x) {
      (x.col || []).forEach(function (l) {
        var p = l.split('|');
        if (p[1].charAt(0) === '(') return;                 // avisos, no combinaciones
        var trozos = p[0].split(' ');
        if (VERB.indexOf(trozos[0].toLowerCase()) < 0) return;
        var bueno = trozos[0].toLowerCase(), resto = trozos.slice(1).join(' ');
        var ops = shuffle([bueno].concat(pick(VERB.filter(function (v) { return v !== bueno; }), 2)));
        var q = qMC('¿Qué verbo acompaña a esta expresión?<br><b class="gap">_______</b> <b class="en">' + esc(resto) + '</b>' +
          '<br><span class="dim small">' + esc(p[1]) + '</span>',
          ops, ops.indexOf(bueno),
          'Se dice «' + p[0] + '». No hay regla y no se traduce desde el español: se aprende el bloque entero de memoria.', 'lex');
        q.part = 'Combinaciones fijas';
        q.say = p[0];
        pool.push(q);
      });
    });
    return pick(pool, Math.min(12, pool.length));
  }
}

// ---------- vista: verbos ----------
function vVerbos(filtroInicial) {
  var h = '<h1>Verbos y sus equivalentes</h1>' +
    '<p class="dim">Ciento nueve verbos con su pasado, su participio y una frase de trabajo real. ' +
    'Los irregulares van <b>agrupados por patrón</b>, no en orden alfabético: se memorizan mucho mejor en familias ' +
    '(<i>buy-bought-bought</i>, <i>speak-spoke-spoken</i>) que en una lista de cien palabras sueltas.</p>' +
    '<div class="note small"><b>Cómo se usan las tres formas.</b> La <b>base</b> es el presente y lo que va detrás de <i>to</i>, ' +
    '<i>do/does</i> y <i>did</i>: <i>I work · to work · Did you work?</i> · El <b>pasado</b> va solo, sin auxiliar: ' +
    '<i>I worked yesterday</i> · El <b>participio</b> nunca va solo: acompaña a <i>have/has/had</i> (<i>I have worked here for years</i>) ' +
    'o a <i>be</i> en la pasiva (<i>The house was built in 1920</i>). Por eso hay que saberse las tres.</div>' +
    '<div class="card flat"><label class="small"><b>Buscar</b> ' +
    '<input id="vq" type="text" placeholder="build, deliver, pay…" style="min-width:260px"></label>' +
    '<label class="small" style="margin-left:16px"><input type="checkbox" id="ves"> Mostrar también el español</label>' +
    '<span class="dim small" id="vn" style="margin-left:10px"></span></div>' +
    '<div id="vlist"></div>';
  app.innerHTML = h;
  var q = document.getElementById('vq'), ces = document.getElementById('ves');
  q.oninput = function () { pinta(q.value); };
  ces.onchange = function () { pinta(q.value); };
  if (filtroInicial) { q.value = decodeURIComponent(filtroInicial); }
  pinta(q.value);

  function pinta(f) {
    f = norm(f || '');
    var verEs = ces.checked;
    var total = 0;
    var out = VRB.grupos.map(function (G) {
      var filas = G.v.map(function (l) { return l.split('|'); })
        .filter(function (p) { return !f || norm(p[0] + ' ' + p[1] + ' ' + p[2] + ' ' + p[3]).indexOf(f) >= 0; });
      total += filas.length;
      if (!filas.length) return '';
      return '<div class="card"><h2 style="margin-top:0">' + esc(G.t) + '</h2>' +
        (f ? '' : '<p class="dim small">' + G.nota + '</p>') +
        '<div class="tablewrap"><table><tr><th>Base</th><th>Pasado</th><th>Participio</th><th>Ejemplo</th></tr>' +
        filas.map(function (p) {
          return '<tr>' +
            '<td><b class="en vb" data-say="' + esc(p[0] + ', ' + p[2] + ', ' + p[3]) + '" title="Escuchar las tres formas">' + esc(p[0]) + '</b> ' + trad(p[0]) +
            (verEs ? '<br><span class="dim small">' + esc(p[1]) + '</span>' : '') + '</td>' +
            // El pasado y el participio también suenan: eran las otras dos
            // palabras inglesas del curso que no se podían escuchar sueltas.
            '<td><b class="en vb pal" data-say="' + esc(p[2]) + '" title="Escuchar el pasado">' + esc(p[2]) + '</b></td>' +
            '<td><b class="en vb pal" data-say="' + esc(p[3]) + '" title="Escuchar el participio">' + esc(p[3]) + '</b></td>' +
            '<td><span class="en vb" data-say="' + esc(p[4]) + '" title="Escuchar la frase">' + esc(p[4]) + '</span> ' + trad(p[4]) +
            (verEs ? '<br><span class="dim small">' + esc(p[5]) + '</span>' : '') + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');
    document.getElementById('vlist').innerHTML = out || '<div class="card"><p>Ningún verbo coincide con esa búsqueda.</p></div>';
    document.getElementById('vn').textContent = total + (total === 1 ? ' verbo' : ' verbos') + ' · pulsa el inglés para oírlo, «translate» para traducirlo';
    app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
  }
}

// ---------- vista: prueba oral ----------
function vOral(arg) {
  // El día lo manda la ruta (#oral/N). Sin argumento se toma el día en curso,
  // no el último completado: si no, estando en el día 4 salía la tarea del 3.
  var n = parseInt(arg, 10);
  if (!(n >= 1 && n <= TOTAL) || !unlocked(n)) { var u = maxDone(); n = siguiente(u > 0 ? u : 1); }
  var D = dayData(n), L = lvlOf(n);
  var SR = MIC.hay();
  var h = '<h1>Prueba de expresión oral</h1>' +
    '<p class="dim">Dos minutos hablando sin parar. Se mide tu <b>fluidez</b> (palabras por minuto), tu <b>densidad léxica</b> (cuántas palabras distintas usas) y cuántas <b>estructuras objetivo del ' + etiquetaDia(n).toLowerCase() + '</b> te salen sin pensarlas.</p>';
  h += selectorDia(n);
  if (!SR) {
    app.innerHTML = h + '<div class="card"><p class="bad-t"><b>Tu navegador no permite reconocimiento de voz.</b></p><p>Necesitas Chrome o Edge de escritorio. Mientras tanto puedes hacer la prueba igual: habla dos minutos con el cronómetro y luego escribe de memoria lo que dijiste en el bloque de escritura.</p></div><div id="micPanel"></div>';
    cablearSelector();
    panelMicro(document.getElementById('micPanel'));
    return;
  }
  h += '<div id="micPanel"></div>';
  h += '<div class="card"><h3>Tu tarea</h3><p><b>' + esc(D.prod.habla) + '</b></p>' +
    '<p class="small dim">Estructuras que deberías intentar colocar:</p><ul class="errs">' +
    D.chunks.slice(0, 4).map(function (c) { return '<li class="en">' + esc(c) + '</li>'; }).join('') + '</ul>' +
    '<div class="row" style="margin-top:14px"><button class="btn" id="rec">● Empezar a grabar</button><span class="timer" id="ot">2:00</span><span class="dim small" id="ost"></span></div>' +
    '<div id="live" class="live en hidden"></div><div id="ores"></div></div>';
  app.innerHTML = h;
  cablearSelector();
  panelMicro(document.getElementById('micPanel'));
  var yaHecho = (S.dias[n] || {}).oral;
  if (yaHecho) document.getElementById('ores').innerHTML =
    '<div class="note small">Ya hiciste la prueba oral de este día el <b>' + esc(yaHecho.f.split('-').reverse().join('/')) +
    '</b> con <b>' + yaHecho.score + '</b> puntos (banda ' + esc(yaHecho.band) + '). Puedes repetirla: se guarda la mejor marca.</div>';

  function cablearSelector() {
    var sel = document.getElementById('oralDia');
    if (sel) sel.onchange = function () { go('oral', sel.value); };
  }

  var texto = '', t0 = 0, iv = null, secs = 120;
  var live = document.getElementById('live'), btn = document.getElementById('rec'), tm = document.getElementById('ot'), st = document.getElementById('ost');

  botonGrabar(btn, '■ Terminar', '● Empezar a grabar', {
    onInicio: function () {
      texto = ''; live.textContent = ''; live.classList.remove('hidden');
      document.getElementById('ores').innerHTML = '';
      t0 = Date.now(); secs = 120; st.textContent = 'Grabando… habla sin parar.';
      iv = setInterval(function () {
        secs--; tm.textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
        if (secs <= 0) MIC.stop();
      }, 1000);
    },
    onCancel: function () { clearInterval(iv); st.textContent = ''; },
    onParcial: function (t, suelto) {
      texto = t;
      live.innerHTML = esc(t) + '<span class="dim">' + esc(suelto) + '</span>';
      live.scrollTop = live.scrollHeight;
    },
    onError: function (m) { st.textContent = ''; document.getElementById('ores').innerHTML = '<div class="note small">' + esc(m) + '</div>'; },
    onFin: function (t, hubeError) {
      clearInterval(iv); st.textContent = '';
      texto = t;
      if (hubeError && !norm(t)) return;
      finish(Math.max(20, Math.round((Date.now() - t0) / 1000)));
    }
  });

  function finish(dur) {
    var toks = norm(texto).split(' ').filter(Boolean);
    if (toks.length < 10) { document.getElementById('ores').innerHTML = '<div class="note">No se ha captado suficiente audio. Comprueba el permiso del micrófono y vuelve a intentarlo.</div>'; return; }
    var uniq = {}; toks.forEach(function (w) { uniq[w] = 1; });
    var distinct = Math.round(Object.keys(uniq).length / toks.length * 100);
    var wpm = Math.round(toks.length / (dur / 60));
    var lt = ' ' + norm(texto) + ' ';
    var hit = D.chunks.filter(function (c) { var core = norm(c).split(' ').slice(0, 4).join(' '); return core.length > 6 && lt.indexOf(core) >= 0; });
    var voc = D.vocab.map(vparts).filter(function (v) { return lt.indexOf(' ' + norm(v.w) + ' ') >= 0 || lt.indexOf(norm(v.w)) >= 0; });
    var cov = Math.round((hit.length / Math.max(1, D.chunks.length)) * 100);
    var fill = (norm(texto).match(/\b(er|erm|em|eh|mmm|like like)\b/g) || []).length;
    var score = 0;
    score += Math.min(35, Math.round(Math.min(wpm, 140) / 140 * 35));
    score += Math.min(20, Math.round(distinct / 55 * 20));
    score += Math.min(20, Math.round(toks.length / 220 * 20));
    score += Math.min(15, hit.length * 5);
    score += Math.min(10, voc.length * 2);
    score -= Math.min(12, fill * 2);
    score = Math.max(0, Math.min(100, score));
    var band = wpm >= 120 && distinct >= 45 && score >= 78 ? 'C1' : wpm >= 100 && score >= 62 ? 'B2' : wpm >= 80 && score >= 45 ? 'B1' : 'A2';
    var rw = { f: hoy(), dia: n, wpm: wpm, words: toks.length, distinct: distinct, cov: cov, score: score, band: band };
    S.oral.push(rw);
    // Queda registrada en el día concreto (antes solo se apilaba en el historial,
    // así que el día no mostraba nunca la prueba como hecha).
    var stD = S.dias[n] = S.dias[n] || { fin: false, pct: 0, blk: {} };
    if (!stD.blk) stD.blk = {};
    if (!stD.oral || score > stD.oral.score) stD.oral = { f: hoy(), score: score, band: band, wpm: wpm };
    rec('prod', score >= 60, 'prueba oral ' + etiquetaDia(n).toLowerCase()); save();
    document.getElementById('ores').innerHTML =
      '<h3>Resultado</h3><div class="metrics">' + metric(score, 'puntuación') + metric(wpm, 'palabras/minuto') + metric(toks.length, 'palabras') +
      metric(distinct + '%', 'léxico distinto') + metric(hit.length + '/' + D.chunks.length, 'estructuras usadas') + metric(band, 'banda estimada') + '</div>' +
      '<div class="bar"><i style="width:' + score + '%"></i></div>' +
      '<p class="small dim">' + (wpm < 90 ? 'Vas entrecortada: el objetivo no es hablar rápido, sino no detenerte. Repite la misma tarea tres veces seguidas y verás subir las palabras por minuto sin esfuerzo.' :
        wpm > 170 ? 'Vas demasiado rápido para que el ritmo acentual del inglés se sostenga; baja el ritmo y marca más las sílabas tónicas.' :
        'Fluidez dentro del rango natural. Ahora el margen de mejora está en la precisión, no en la velocidad.') + '</p>' +
      (hit.length ? '<p class="small ok-t">Usaste: ' + hit.map(esc).join(' · ') + '</p>' : '<p class="small bad-t">No has usado ninguna de las estructuras objetivo. Vuelve al bloque 4 del ' + etiquetaDia(n).toLowerCase() + ' y haz shadowing antes de repetir la prueba.</p>') +
      '<h3>Transcripción</h3><div class="live en">' + esc(texto) + '</div>' +
      '<p class="small dim">Léela buscando tus errores fosilizados: lo que ves escrito es exactamente lo que oye tu interlocutor.</p>';
  }
}

// ---------- comprobador de micrófono ----------
// Cuando el micrófono no va, la causa casi nunca está en el curso: es el
// permiso, el navegador, la falta de conexión o que otra aplicación lo tiene
// cogido. Esto lo dice claro en vez de dejar un botón que no hace nada.
function panelMicro(host) {
  var SR = MIC.hay();
  var seguro = !!window.isSecureContext;
  var proto = location.protocol;
  var chrome = /Chrome|Chromium|Edg/.test(navigator.userAgent) && !/OPR|Firefox/.test(navigator.userAgent);
  var movil = /Android|iPhone|iPad/i.test(navigator.userAgent);
  function fila(ok, t, d) {
    return '<li class="chk ' + (ok === true ? 'si' : ok === false ? 'no' : 'quiza') + '"><b>' +
      (ok === true ? '✔' : ok === false ? '✖' : '•') + '</b> <span>' + t +
      (d ? '<br><span class="dim small">' + d + '</span>' : '') + '</span></li>';
  }
  var h = '<div class="card"><div class="row between"><h3 style="margin:0">🎤 Comprobar el micrófono</h3>' +
    '<button class="btn small" id="micTest">Probar 6 segundos</button></div>' +
    '<ul class="chks">' +
    fila(SR, SR ? 'Tu navegador reconoce la voz.' : 'Tu navegador no reconoce la voz.',
      SR ? '' : 'Necesitas <b>Chrome</b> o <b>Edge</b> de escritorio. En Firefox y en Safari esta función no existe, y el resto del curso sigue funcionando igual.') +
    fila(seguro, seguro ? 'La página se sirve de forma segura (' + proto + ').' : 'La página no es un contexto seguro (' + proto + ').',
      seguro ? '' : 'El navegador solo da micrófono en <b>https://</b> o abriendo el archivo directamente desde tu disco. Si estás en http:// no lo dará nunca.') +
    fila(chrome ? true : null, chrome ? 'Estás en Chrome o Edge, que es lo recomendado.' : 'No se detecta Chrome ni Edge.',
      chrome ? '' : 'Puede funcionar, pero si falla prueba primero a abrirlo en Chrome antes de tocar nada más.') +
    fila(navigator.onLine, navigator.onLine ? 'Hay conexión a internet.' : 'No se detecta conexión a internet.',
      'Esto importa: Chrome <b>no reconoce la voz en tu ordenador</b>, envía el audio a un servidor. Sin conexión el micrófono se abre pero no transcribe nada.') +
    (movil ? fila(null, 'Estás en un móvil o tableta.', 'El reconocimiento funciona, pero se corta cada pocos segundos por diseño del sistema. Para los ejercicios largos es mejor un ordenador.') : '') +
    '<li class="chk quiza" id="micPerm"><b>•</b> <span>Permiso del micrófono: comprobando…</span></li>' +
    '</ul><div id="micRes"></div>' +
    '<p class="small dim">Si algo falla, el orden en que se arregla es este: <b>1)</b> el candado 🔒 de la barra de direcciones → Micrófono → Permitir, y recargar; ' +
    '<b>2)</b> cerrar cualquier videollamada o programa que esté usando el micrófono, porque solo puede usarlo uno a la vez; ' +
    '<b>3)</b> los ajustes de privacidad del sistema operativo; <b>4)</b> comprobar que el micrófono elegido en el sistema es el que de verdad tienes puesto.</p></div>';
  host.insertAdjacentHTML('beforeend', h);

  var li = document.getElementById('micPerm');
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'microphone' }).then(function (st) {
      var m = st.state === 'granted' ? ['si', '✔', 'Permiso concedido.', '']
        : st.state === 'denied' ? ['no', '✖', 'Permiso <b>denegado</b> para esta página.', 'Pulsa el candado 🔒 de la barra de direcciones, pon el micrófono en «Permitir» y recarga.']
        : ['quiza', '•', 'El permiso se pedirá al empezar a grabar.', 'Cuando salga el aviso del navegador, pulsa «Permitir».'];
      li.className = 'chk ' + m[0];
      li.innerHTML = '<b>' + m[1] + '</b> <span>' + m[2] + (m[3] ? '<br><span class="dim small">' + m[3] + '</span>' : '') + '</span>';
    })['catch'](function () {
      li.innerHTML = '<b>•</b> <span>El permiso se pedirá al empezar a grabar.</span>';
    });
  } else {
    li.innerHTML = '<b>•</b> <span>El permiso se pedirá al empezar a grabar.</span>';
  }

  var btn = document.getElementById('micTest'), res = document.getElementById('micRes');
  // Con su propio estado: antes preguntaba si el micrófono estaba grabando en
  // general, así que estando en marcha la prueba oral el botón cortaba esa
  // grabación en vez de iniciar la comprobación.
  var t0 = 0, fallo = false, tope = null, live = null;
  botonGrabar(btn, '■ Parar', 'Probar 6 segundos', {
    onInicio: function () {
      fallo = false; t0 = Date.now();
      res.innerHTML = '<div class="card flat"><p class="small dim">Habla ahora, en inglés y en voz alta. Por ejemplo: <b class="en">This is a test of my microphone.</b></p>' +
        '<div class="live en" id="micLive">…</div></div>';
      live = document.getElementById('micLive');
      tope = setTimeout(function () { MIC.stop(); }, 6000);
    },
    onCancel: function () { clearTimeout(tope); },
    onParcial: function (t, suelto) { if (live) live.innerHTML = esc(t) + '<span class="dim">' + esc(suelto) + '</span>'; },
    onError: function (m) {
      fallo = true;
      res.innerHTML = '<div class="note small"><b>No ha funcionado.</b> ' + esc(m) + '</div>';
    },
    onFin: function (t) {
        clearTimeout(tope);
        if (fallo) return;
        var pal = toks(norm(t)).length;
        res.innerHTML = pal >= 2
          ? '<div class="note small ok-t"><b>El micrófono funciona.</b> Se han entendido ' + pal + ' palabras en ' +
            Math.round((Date.now() - t0) / 1000) + ' segundos: «' + esc(t.trim()) + '». Si en un ejercicio concreto falla, ' +
            'lo que ocurre es que no se te entiende, no que el micrófono esté mal: baja el ritmo y vocaliza.</div>'
          : '<div class="note small"><b>El micrófono se abre, pero no ha entendido nada.</b> Las tres causas por orden de frecuencia: ' +
            'hablaste demasiado bajo o demasiado lejos; el micrófono que usa el sistema no es el que crees; o hablaste en español, ' +
            'y el reconocedor está puesto en inglés. Vuelve a probar diciendo claramente <b class="en">this is a test</b>.</div>';
    }
  });
}

// ---------- los 44 fonemas del inglés ----------
// El inglés tiene 44 sonidos y el español 24. Esta sección los pone todos
// sobre la mesa, marcados por la dificultad real que tienen para quien habla
// español, y los entrena con dos ejercicios.
var FON = window.FONEMAS || { grupos: [], pares: [] };

function todosFonemas() {
  var v = [];
  FON.grupos.forEach(function (G) { G.v.forEach(function (x) { v.push(x); }); });
  return v;
}
function pillDif(d) {
  var t = d === 'alta' ? 'hay que entrenarla' : d === 'media' ? 'se confunde' : 'fácil';
  return '<span class="pill dif-' + d + '">' + t + '</span>';
}

function seccionFonemas() {
  return '<h2 class="sec">0 · El mapa de los 44 sonidos</h2>' +
    '<div class="card"><p class="dim small">' + FON.intro + '</p>' +
    profe({
      porque: '<ol class="proto-l">' + FON.teoria.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>',
      como: '<p>No estudies los 44. Pulsa <b>«Solo los difíciles»</b> y trabaja esos doce, que son los que el español no tiene. ' +
        'De cada uno: lee qué hace la boca, pulsa el símbolo para oír sus tres palabras seguidas y repítelas en voz alta ' +
        '<b>inmediatamente después</b> de oírlas. Dos sonidos por sesión, no más.</p>' +
        '<p>Después, los dos ejercicios: <b>«¿Cuál lleva este sonido?»</b> entrena reconocer la vocal dentro de la palabra, y ' +
        '<b>«Pares mínimos»</b> entrena distinguirlo de su vecino, que es donde está el malentendido real.</p>',
      fallo: '<p>Si fallas un sonido una y otra vez, no es falta de práctica: es que <b>todavía no lo oyes</b>. Y lo que no se oye no se puede producir.</p>' +
        '<ol class="proto-l">' +
        '<li><b>Vuelve a los pares mínimos de ese sonido</b> y escúchalos sin intentar decirlos, muchas veces seguidas. Solo oído.</li>' +
        '<li><b>Cuando aciertes ocho de diez a ciegas</b>, y solo entonces, empieza a producirlo.</li>' +
        '<li><b>Al producirlo, exagera.</b> Un sonido nuevo sale siempre a medias; si apuntas al centro te quedas corta.</li>' +
        '<li><b>Déjalo reposar.</b> La boca automatiza un movimiento nuevo durmiendo, como en cualquier deporte. Insistir el mismo día no añade nada.</li></ol>',
      error: '<p>Estudiar los 44 de golpe, o ninguno. Los dos extremos fallan por lo mismo: no distinguen lo que cuesta de lo que no. ' +
        'Dieciocho de los 44 son prácticamente iguales que en español y no necesitan ni un minuto.</p>'
    }) +
    '<div class="row"><button class="btn" id="fonDif">Solo los difíciles (12)</button>' +
    '<button class="btn sec" id="fonTodo">Ver los 44</button>' +
    '<button class="btn" data-fon="cual">¿Cuál lleva este sonido?</button>' +
    '<button class="btn" data-fon="pares">Pares mínimos</button></div>' +
    '<div id="fonprac"></div><div id="fonlist"></div></div>';
}

function cablearFonemas() {
  var soloDif = true;
  document.getElementById('fonDif').onclick = function () { soloDif = true; pinta(); };
  document.getElementById('fonTodo').onclick = function () { soloDif = false; pinta(); };
  app.querySelectorAll('[data-fon]').forEach(function (b) {
    b.onclick = function () { b.dataset.fon === 'cual' ? juegoCual() : juegoParesFon(); };
  });
  pinta();

  function pinta() {
    var out = FON.grupos.map(function (G) {
      var v = G.v.filter(function (x) { return !soloDif || x.dif === 'alta'; });
      if (!v.length) return '';
      return '<h4 class="sub">' + esc(G.t) + '</h4>' +
        (soloDif ? '' : '<p class="dim small" style="margin:0 0 8px">' + G.nota + '</p>') +
        '<div class="tablewrap"><table><tr><th>Sonido</th><th>Ejemplos</th><th>Qué hace la boca · error típico</th></tr>' +
        v.map(function (x) {
          return '<tr><td><button class="btn sec small fon" data-say="' + esc(x.ej.join(', ')) + '" title="Oír las palabras">' +
            esc(x.s) + '</button><br><span class="dim small">' + esc(x.n) + '</span><br>' + pillDif(x.dif) + '</td>' +
            '<td>' + x.ej.map(function (w) {
              return '<span class="en vb pal2" data-say="' + esc(w) + '">' + esc(w) + '</span>';
            }).join(' · ') + '</td>' +
            '<td class="small">' + x.boca + '<br><span class="dim"><b>Error típico:</b> ' + x.error + '</span></td></tr>';
        }).join('') + '</table></div>';
    }).join('');
    var host = document.getElementById('fonlist');
    host.innerHTML = '<p class="dim small" style="margin-top:12px">' +
      (soloDif ? 'Los <b>doce sonidos que el español no tiene</b>. Son los que hay que entrenar; los otros treinta y dos no lo necesitan.'
               : 'Los <b>44 sonidos</b>, con su dificultad real marcada. Pulsa el símbolo para oír sus palabras seguidas.') + '</p>' + out;
    host.querySelectorAll('.fon').forEach(function (b) {
      b.onclick = function () { speakSeq(b.dataset.say.split(', '), 0.85); };
    });
    host.querySelectorAll('.pal2').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
  }

  // --- ¿cuál lleva este sonido? ---
  // Se pregunta al revés que antes, y solo con vocales. Preguntar «qué sonido
  // lleva cat» no tiene una sola respuesta —lleva /k/, /æ/ y /t/—, así que la
  // pregunta era ambigua. Se pregunta por la vocal, que sí es única en una
  // palabra de una sílaba, y los señuelos salen de otras vocales.
  var SINDRILL = { about: 1, teacher: 1, architect: 1, computer: 1, father: 1, idea: 1 };
  function vocalesDrill() {
    var v = [];
    FON.grupos.slice(0, 3).forEach(function (G) {
      G.v.forEach(function (x) {
        if (x.s === '/ə/') return;                       // la schwa está en todas las palabras largas
        var pal = x.ej.filter(function (w) { return !SINDRILL[w]; });
        if (pal.length >= 2) v.push({ s: x.s, n: x.n, boca: x.boca, ej: pal });
      });
    });
    return v;
  }
  function juegoCual() {
    var voc = vocalesDrill(), pool = [];
    voc.forEach(function (x) {
      x.ej.forEach(function (w) {
        var otros = pick(voc.filter(function (z) { return z.s !== x.s; }), 2);
        var malas = otros.map(function (z) { return z.ej[Math.floor(Math.random() * z.ej.length)]; });
        if (malas.indexOf(w) >= 0) return;
        var ops = shuffle([w].concat(malas));
        var ancla = x.ej.filter(function (o) { return o !== w; }).slice(0, 2)
          .map(function (o) { return '<b class="en">' + esc(o) + '</b>'; }).join(' y ');
        var q = qMC('¿Cuál de estas palabras lleva la vocal <b>' + esc(x.s) + '</b>, la de ' + ancla + '?',
          ops, ops.indexOf(w),
          'Es <b class="en">' + esc(w) + '</b>. ' + x.boca, 'list');
        q.part = 'Fonemas · ' + x.s;
        q.say = w;
        pool.push(q);
      });
    });
    var host = document.getElementById('fonprac');
    host.innerHTML = '';
    runTest(host, pick(pool, 12), {
      min: 70, pasoTxt: 'Bien: ya reconoces la vocal dentro de la palabra',
      protocolo: '<ol class="proto-l"><li><b>Escucha la buena y la que elegiste, una detrás de otra.</b> La diferencia está solo en la vocal; todo lo demás sobra.</li>' +
        '<li><b>Sube a la ficha de ese sonido</b> y oye sus palabras seguidas: el parecido entre ellas es lo que hay que fijar.</li>' +
        '<li><b>Dilo en voz alta exagerando.</b> Un sonido nuevo sale siempre a medias; si apuntas al centro te quedas corta.</li></ol>'
    }, function (pct, pass, foot) {
      rec('list', pass, 'fonemas · identificar vocal'); S.ses++; save();
      var b = el('<button class="btn sec small">Otra tanda</button>');
      b.onclick = juegoCual;
      foot.appendChild(b);
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- pares mínimos de todo el inventario ---
  function juegoParesFon() {
    var host = document.getElementById('fonprac');
    var lote = pick(FON.pares, 10), k = 0, ac = 0;
    paint();
    function paint() {
      if (k >= lote.length) {
        var pct = Math.round(ac / lote.length * 100);
        rec('list', pct >= 70, 'fonemas · pares mínimos'); S.ses++; save();
        host.innerHTML = '<div class="card flat"><div class="metrics">' + metric(pct + '%', 'aciertos de oído') +
          metric(ac + '/' + lote.length, 'pares') + '</div><p class="small ' + (pct >= 70 ? 'dim' : 'bad-t') + '">' +
          (pct >= 85 ? 'Tu oído separa los sonidos. Ese es el requisito para poder producirlos: ahora ya tiene sentido trabajar la boca.'
            : pct >= 60 ? 'A medias. Repite esta prueba dos días seguidos <b>sin intentar pronunciar nada</b>: primero el oído, después la boca.'
            : 'Todavía no los separas al oírlos, y lo que no se oye no se puede decir. Pulsa arriba las palabras de los sonidos difíciles, muchas veces, y vuelve mañana.') +
          '</p></div>';
        var b = el('<button class="btn sec small">Otra tanda</button>');
        b.onclick = juegoParesFon;
        host.appendChild(b); return;
      }
      var p = lote[k].split('|'), cual = Math.random() < 0.5 ? 0 : 1;
      host.innerHTML = '<div class="card flat"><p class="small dim">Par ' + (k + 1) + ' de ' + lote.length + ' · ' +
        esc(p[2]) + ' frente a ' + esc(p[3]) + ' · escucha y di cuál es</p>' +
        '<div class="row"><button class="btn small" id="fo">🔊 Escuchar otra vez</button></div>' +
        '<div class="opts" id="foo"></div><div id="fofb"></div></div>';
      speak(p[cual]);
      host.querySelector('#fo').onclick = function () { speak(p[cual]); };
      var row = host.querySelector('#foo');
      [0, 1].forEach(function (j) {
        var b = el('<button class="opt en">' + esc(p[j]) + '<span class="trad-es">' + esc(traduccion(p[j]) || '') + '</span></button>');
        b.onclick = function () {
          row.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var bien = j === cual;
          b.classList.add(bien ? 'ok' : 'bad');
          if (!bien) row.querySelectorAll('.opt')[cual].classList.add('ok');
          if (bien) ac++;
          rec('list', bien, 'par mínimo ' + p[0] + '/' + p[1]);
          host.querySelector('#fofb').innerHTML = '<div class="fb ' + (bien ? 'ok' : 'bad') + '">' +
            (bien ? '✔ Era <b class="en">' + esc(p[cual]) + '</b>, con ' + esc(p[cual === 0 ? 2 : 3]) + '.'
                  : '✖ Era <b class="en">' + esc(p[cual]) + '</b> (' + esc(p[cual === 0 ? 2 : 3]) + '), no <b class="en">' +
                    esc(p[1 - cual]) + '</b> (' + esc(p[cual === 0 ? 3 : 2]) + '). Vuelve a oírlas seguidas y fíjate solo en ese sonido.') + '</div>';
          k++;
          if (bien) { setTimeout(paint, 800); return; }
          var c = el('<button class="btn small" style="margin-top:8px">Continuar →</button>');
          c.onclick = paint; host.querySelector('#fofb').appendChild(c);
        };
        row.appendChild(b);
      });
    }
  }
}

// ---------- vista: taller de expresión oral ----------
// La pestaña «Oral» evalúa; esta enseña. Sonidos uno a uno, repetición con
// corrección palabra a palabra, ritmo de la frase, lectura cronometrada y
// monólogo guiado. Todo con el micrófono como espejo: lo que transcribe el
// reconocedor es, aproximadamente, lo que oye tu interlocutor.
var HBL = window.HABLA || {};
function haySR() { return MIC.hay(); }

// Un botón de grabar que se encarga de todo: cambia de estado, corta si ya
// estaba grabando y garantiza que al terminar —por parada, por error o
// porque el navegador cierra el micrófono— se vuelve al estado de reposo.
// Antes esto estaba repetido en cinco sitios y en ninguno se recuperaba de
// un error: el botón se quedaba en «Parar» para siempre.
function botonGrabar(btn, txtOn, txtOff, o) {
  var grabando = false, hubeError = false;
  function reposo() { grabando = false; btn.textContent = txtOff; btn.classList.remove('rec'); }
  btn.onclick = function () {
    if (grabando) { MIC.stop(); return; }
    hubeError = false; grabando = true;
    btn.textContent = txtOn; btn.classList.add('rec');
    o.onInicio && o.onInicio();
    MIC.start({
      onCancel: function () { reposo(); o.onCancel && o.onCancel(); },
      onParcial: o.onParcial,
      onError: function (m, fatal) { hubeError = true; o.onError && o.onError(m, fatal); },
      onFin: function (t) { reposo(); o.onFin && o.onFin(t, hubeError); }
    });
  };
}

// Cuánto de la frase modelo ha reconocido el ordenador, y qué palabras no.
function parecido(mio, bueno) {
  var A = toks(norm(mio)), B = toks(norm(bueno));
  var d = diffPalabras(A, B);
  var ok = d.filter(function (x) { return x.op === '='; }).length;
  var faltan = d.filter(function (x) { return x.op === '+'; }).map(function (x) { return x.w; });
  return { pct: B.length ? Math.round(ok / B.length * 100) : 0, faltan: faltan, ok: ok, total: B.length };
}

// Marca en negrita lo que lleva el golpe: "*I* *need* the plans" → I need
function ritmoHtml(t) { return esc(t).replace(/\*([^*]+)\*/g, '<b class="golpe">$1</b>'); }
function ritmoPlano(t) { return String(t).replace(/\*/g, ''); }

// Parte inglesa y parte española de una entrada "English|español".
function enEs(l) { var p = String(l).split('|'); return { en: p[0], es: p[1] || '' }; }
// La traducción, que se puede ocultar con el interruptor de arriba.
function trEs(t) { return t ? '<span class="trad-es">' + esc(t) + '</span>' : ''; }

function vHabla(arg) {
  var h = '<h1>Taller de expresión oral</h1>' +
    '<p class="dim">' + HBL.intro + '</p>' +
    profe({
      porque: '<p>La pestaña <b>Oral</b> te mide; esta te enseña. Son cosas distintas y hacen falta las dos: una prueba te dice ' +
        'que hablas a 90 palabras por minuto, pero no te dice <b>qué</b> tienes que cambiar mañana por la mañana.</p>' +
        '<p>Y lo que hay que cambiar es sorprendentemente poco. Un hispanohablante adulto no falla en «todo el inglés»: falla en ' +
        '<b>nueve sonidos concretos</b> que su boca nunca ha tenido que hacer, y en una manera distinta de repartir el peso dentro ' +
        'de la frase. Arreglado eso, el acento sigue notándose —y no pasa nada, el acento no es un defecto— pero <b>te entienden ' +
        'a la primera</b>, que es de lo que se trata.</p>',
      como: '<p>El método tiene cinco pasos y están en este orden por una razón:</p><ol class="proto-l">' +
        HBL.metodo.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
        '<p>Baja por la página en orden: primero los sonidos, luego repetir, luego ritmo, luego leer y por último hablar solo. ' +
        'Cada apartado prepara el siguiente.</p>' +
        '<p><b>Sobre la traducción.</b> Todo lo que hay en inglés lleva debajo su equivalente en español, para que nunca repitas ' +
        'algo sin saber qué estás diciendo. Pero úsala como red, no como muleta: <b>lee primero el inglés y solo después baja la ' +
        'vista</b>. Cuando una frase ya la entiendas sola, apaga las traducciones con el interruptor de arriba.</p>',
      fallo: '<p>Aquí «fallar» significa que el ordenador ha entendido otra palabra distinta de la que querías decir. ' +
        'No lo tomes como una nota: <b>tómalo como un dato de laboratorio</b>. Si el reconocedor oye <i>sheep</i> cuando dices ' +
        '<i>ship</i>, un cliente inglés también puede oírlo.</p>' +
        '<ol class="proto-l">' +
        '<li><b>Mira qué palabra no se ha entendido</b>, que aparece subrayada. Casi siempre repite el mismo sonido: es tu sonido flojo.</li>' +
        '<li><b>Sube a ese sonido</b> en el apartado de arriba, léete la posición de la boca y haz sus pares mínimos.</li>' +
        '<li><b>Vuelve a la frase y repítela tres veces seguidas</b>, despacio la primera y a velocidad normal las otras dos.</li>' +
        '<li><b>Si a la tercera sigue sin entenderse</b>, no insistas hoy: déjala y vuelve mañana. La boca necesita dormir para ' +
        'automatizar un movimiento nuevo, igual que un deporte.</li></ol>',
      error: '<p>Querer «quitarse el acento». No es un objetivo, no es alcanzable de adulto y no hace falta: nadie le pide a un ' +
        'arquitecto que suene a Oxford. El objetivo es <b>no ser ambigua</b>: que <i>bad</i> no se oiga <i>bed</i> y que ' +
        '<i>ship</i> no se oiga <i>sheep</i>. Eso sí es alcanzable, y en seis semanas.</p>'
    });

  h += interruptorTraduccion('Debajo de cada palabra y cada frase, aquí y en el resto del curso. Apágala cuando ya no la necesites: ese es justo el momento en que empieza a estorbar.');

  if (!haySR()) h += '<div class="note small"><b>Tu navegador no permite usar el micrófono.</b> Los ejercicios de escuchar, ' +
    'los sonidos, los pares mínimos y el ritmo funcionan igual. Para los de grabarte necesitas Chrome o Edge de escritorio.</div>';
  h += '<div id="micPanel"></div>';

  h += seccionFonemas();

  // 1 · sonidos
  h += '<h2 class="sec">1 · Los sonidos que te delatan</h2>' +
    '<p class="dim small">Diez fichas. En cada una: por qué falla en español, qué hace exactamente la boca, un truco y pares ' +
    'para entrenar el oído antes que la lengua. Pulsa cualquier palabra inglesa para oírla.</p>';
  h += HBL.sonidos.map(function (S2, i) {
    var esMin = S2.tipo === 'min';
    var titulo = esMin ? 'Pares mínimos' : S2.tipo === 'mal' ? 'Bien dicho · mal dicho' : 'La inglesa y la española';
    var nota = S2.notaPares ? '<p class="dim small" style="margin:4px 0 0">' + S2.notaPares + '</p>'
      : S2.tipo === 'mal' ? '<p class="dim small" style="margin:4px 0 0">A la izquierda como se dice; a la derecha, el error que hay que evitar. Solo suena la buena.</p>'
      : '';
    return '<div class="card son" id="son-' + S2.id + '"><h3 style="margin-top:0">' + S2.t + '</h3>' +
      '<p class="small"><b>Por qué falla en español:</b> ' + S2.problema + '</p>' +
      '<p class="small"><b>Qué hace la boca:</b> ' + S2.boca + '</p>' +
      '<p class="small truco"><b>Truco:</b> ' + S2.truco + '</p>' +
      '<div class="row between" style="margin-top:8px"><b class="small">' + titulo + '</b>' +
      (esMin ? '<button class="btn sec small" data-oido="' + i + '">Prueba de oído</button>' : '') + '</div>' + nota +
      '<div class="pmin">' + S2.pares.map(function (l) {
        var p2 = l.split('|');
        if (esMin) {
          return '<span class="par"><b class="en vb" data-say="' + esc(p2[0]) + '">' + esc(p2[0]) + '</b>' +
            '<span class="dim"> · </span><b class="en vb" data-say="' + esc(p2[1]) + '">' + esc(p2[1]) + '</b>' +
            trEs(p2[2] + ' · ' + p2[3]) + '</span>';
        }
        if (S2.tipo === 'mal') {
          return '<span class="par"><b class="en vb" data-say="' + esc(p2[0]) + '">' + esc(p2[0]) + '</b>' +
            '<span class="dim"> · </span><s class="mal-dicho">' + esc(p2[1]) + '</s>' + trEs(p2[2]) + '</span>';
        }
        return '<span class="par"><b class="en vb" data-say="' + esc(p2[0]) + '">' + esc(p2[0]) + '</b>' +
          trEs(p2[1]) + '</span>';
      }).join('') + '</div>' +
      '<div id="oido-' + i + '"></div>' +
      '<div class="row" style="margin-top:10px"><b class="small">Frases</b></div>' +
      '<ul class="errs">' + S2.frases.map(function (l) {
        var f = enEs(l);
        return '<li><span class="en vb" data-say="' + esc(f.en) + '">' + esc(f.en) + '</span>' +
          (haySR() ? ' <button class="btn sec small" data-rep="' + esc(f.en) + '">Repetir y comparar</button>' : '') +
          trEs(f.es) + '</li>';
      }).join('') + '</ul><div class="repz"></div></div>';
  }).join('');

  // 2 · repetir
  h += '<h2 class="sec">2 · Repite y compara</h2>' +
    '<div class="card"><p class="dim small">Se oye el modelo, lo repites y el ordenador te enseña <b>palabra por palabra</b> qué ha ' +
    'entendido. Empieza por el nivel 1 aunque te parezca fácil: lo que se entrena es la limpieza, no la dificultad.</p>' +
    '<div class="row">' + HBL.repetir.map(function (G, i) {
      return '<button class="btn' + (i ? ' sec' : '') + ' small" data-niv="' + i + '">' + esc(G.t.split('·')[0].trim()) + '</button>';
    }).join('') + '</div><div id="repet"></div></div>';

  // 3 · ritmo
  h += '<h2 class="sec">3 · El ritmo de la frase</h2>' +
    '<div class="card"><p class="small">' + HBL.ritmo.intro + '</p>' +
    '<p class="small dim"><b>Cómo se practica:</b> ' + HBL.ritmo.regla + '</p>' +
    '<ul class="errs ritmo">' + HBL.ritmo.v.map(function (l) {
      var f = enEs(l), plano = ritmoPlano(f.en);
      return '<li><span class="en vb" data-say="' + esc(plano) + '">' + ritmoHtml(f.en) + '</span>' +
        (haySR() ? ' <button class="btn sec small" data-rep="' + esc(plano) + '">Repetir y comparar</button>' : '') +
        trEs(f.es) + '</li>';
    }).join('') + '</ul><div class="repz"></div></div>';

  // 4 · lectura
  h += '<h2 class="sec">4 · Lectura en voz alta</h2>' +
    '<div class="card"><p class="dim small">Leer en voz alta es el puente entre entender y hablar: el contenido ya está resuelto, ' +
    'así que toda tu atención va a la boca. Se cronometra y se compara con el texto.</p>' +
    '<div class="row">' + HBL.lectura.map(function (L2, i) {
      return '<button class="btn' + (i ? ' sec' : '') + ' small" data-lec="' + i + '">' + esc(L2.t) + '</button>';
    }).join('') + '</div><div id="lect"></div></div>';

  // 5 · monólogo
  h += '<h2 class="sec">5 · Monólogo guiado</h2>' +
    '<div class="card"><p class="dim small">Noventa segundos hablando sola sobre un tema de trabajo, con tres cosas que hay que ' +
    'incluir. Es el ejercicio más parecido a la vida real y el último de la sesión, cuando la boca ya está caliente.</p>' +
    '<div id="mono"></div></div>';

  app.innerHTML = h;
  panelMicro(document.getElementById('micPanel'));
  cablearInterruptor();
  cablearFonemas();
  app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
  app.querySelectorAll('[data-oido]').forEach(function (b) { b.onclick = function () { pruebaOido(b.dataset.oido | 0); }; });
  app.querySelectorAll('[data-rep]').forEach(function (b) {
    b.onclick = function () {
      var z = b.closest('.card').querySelector('.repz');
      repiteUna(z, b.dataset.rep);
    };
  });
  app.querySelectorAll('[data-niv]').forEach(function (b) { b.onclick = function () { serieRepetir(b.dataset.niv | 0); }; });
  app.querySelectorAll('[data-lec]').forEach(function (b) { b.onclick = function () { lecturaVoz(b.dataset.lec | 0); }; });
  monologoUI();
  if (arg) { var d0 = document.getElementById('son-' + arg); if (d0) d0.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  // --- prueba de oído: solo con pares mínimos de verdad ---
  function pruebaOido(i) {
    var S2 = HBL.sonidos[i], host = document.getElementById('oido-' + i);
    var lote = pick(S2.pares, Math.min(6, S2.pares.length)), k = 0, ac = 0;
    paint();
    function paint() {
      if (k >= lote.length) {
        var pct = Math.round(ac / lote.length * 100);
        rec('list', pct >= 70, 'pares mínimos · ' + S2.id); S.ses++; save();
        host.innerHTML = '<div class="card flat"><div class="metrics">' + metric(pct + '%', 'aciertos de oído') +
          metric(ac + '/' + lote.length, 'pares') + '</div><p class="small ' + (pct >= 70 ? 'dim' : 'bad-t') + '">' +
          (pct >= 85 ? 'Distingues el sonido con el oído. Ahora ya tiene sentido entrenarlo con la boca: baja a las frases y grábate.'
           : pct >= 60 ? 'Lo distingues a medias. Repite esta prueba dos días seguidos antes de intentar producirlo: primero el oído.'
           : 'Todavía no separas los dos sonidos al oírlos, y mientras no los oigas no podrás producirlos. Pulsa las parejas de arriba ' +
             'una por una, muchas veces, y vuelve a esta prueba mañana.') + '</p></div>';
        var b = el('<button class="btn sec small">Otra vez</button>');
        b.onclick = function () { pruebaOido(i); };
        host.appendChild(b); return;
      }
      var par = lote[k].split('|'), cual = Math.random() < 0.5 ? 0 : 1;
      host.innerHTML = '<div class="card flat"><p class="small dim">Par ' + (k + 1) + ' de ' + lote.length + ' · escucha y di cuál es</p>' +
        '<div class="row"><button class="btn small" id="oye">🔊 Escuchar otra vez</button></div><div class="opts" id="oo"></div><div id="ofb2"></div></div>';
      speak(par[cual]);
      host.querySelector('#oye').onclick = function () { speak(par[cual]); };
      var row = host.querySelector('#oo');
      [0, 1].forEach(function (j) {
        var b = el('<button class="opt en">' + esc(par[j]) + '<span class="trad-es">' + esc(par[j + 2] || '') + '</span></button>');
        b.onclick = function () {
          row.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var bien = j === cual;
          b.classList.add(bien ? 'ok' : 'bad');
          if (!bien) row.querySelectorAll('.opt')[cual].classList.add('ok');
          if (bien) ac++;
          host.querySelector('#ofb2').innerHTML = '<div class="fb ' + (bien ? 'ok' : 'bad') + '">' +
            (bien ? '✔ Era <b class="en">' + esc(par[cual]) + '</b> · ' + esc(par[cual + 2] || '') + '.' :
             '✖ Era <b class="en">' + esc(par[cual]) + '</b> (' + esc(par[cual + 2] || '') + '), no <b class="en">' +
             esc(par[1 - cual]) + '</b> (' + esc(par[3 - cual] || '') + '). ' +
             'Vuelve a escucharlas seguidas y fíjate solo en la vocal.') + '</div>';
          rec('list', bien, 'par mínimo ' + par[0] + '/' + par[1]);
          k++;
          var seguir = function () { paint(); };
          if (bien) { setTimeout(seguir, 800); return; }
          var c = el('<button class="btn small" style="margin-top:8px">Continuar →</button>');
          c.onclick = seguir; host.querySelector('#ofb2').appendChild(c);
        };
        row.appendChild(b);
      });
    }
  }

  // --- repetir una frase suelta ---
  function repiteUna(host, frase) {
    if (!haySR()) return;
    host.innerHTML = '<div class="card flat"><div class="row"><button class="btn small" id="rp0">🔊 Oír el modelo</button>' +
      '<button class="btn" id="rp1">● Grabar mi intento</button><span class="dim small" id="rps"></span></div>' +
      '<p class="en" style="margin:8px 0 0">' + esc(frase) + '</p><div id="rpr"></div></div>';
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    var st = host.querySelector('#rps'), out = host.querySelector('#rpr'), btn = host.querySelector('#rp1');
    host.querySelector('#rp0').onclick = function () { speak(frase); };
    speak(frase);
    botonGrabar(btn, '■ Parar', '● Grabar mi intento', {
      onInicio: function () { st.textContent = 'Escuchando…'; out.innerHTML = ''; },
      onParcial: function (t, i) { st.textContent = (t + i).slice(-60); },
      onError: function (m) { st.textContent = ''; out.innerHTML = '<div class="note small">' + esc(m) + '</div>'; },
      onFin: function (t, hubeError) { if (!hubeError || norm(t)) juzga(out, t, frase, st); else st.textContent = ''; }
    });
  }

  function juzga(out, dicho, frase, st) {
    st.textContent = '';
    if (!norm(dicho)) { out.innerHTML = '<div class="note small">No se ha captado nada. Comprueba el permiso del micrófono y acércate más.</div>'; return; }
    var r = parecido(dicho, frase);
    rec('prod', r.pct >= 80, 'repetición: ' + frase);
    S.ses++; save();
    out.innerHTML = '<div class="metrics">' + metric(r.pct + '%', 'palabras entendidas') + metric(r.ok + '/' + r.total, 'de la frase') + '</div>' +
      correccion(dicho, frase) +
      '<p class="small ' + (r.pct >= 90 ? 'ok-t' : r.pct >= 70 ? 'dim' : 'bad-t') + '">' +
      (r.pct >= 90 ? 'Frase limpia: se ha entendido entera. Repítela una vez más a velocidad de conversación y pasa a la siguiente.'
       : r.pct >= 70 ? 'Casi. Fíjate en las palabras subrayadas: son las que tu boca todavía no separa. Dilas sueltas tres veces y repite la frase completa.'
       : 'Se ha perdido bastante. Baja el ritmo a la mitad, di la frase por trozos de tres palabras y solo después júntala. La prisa aquí no ayuda.') +
      '</p><p class="small dim">Lo que ves arriba es lo que ha entendido el ordenador, que no es un examinador: es un espejo. ' +
      'Un nombre propio o una palabra rara puede fallar sin que tú lo hagas mal. Lo que sí es señal fiable es <b>fallar siempre en el mismo sonido</b>.</p>';
  }

  // --- serie de repetición por niveles ---
  function serieRepetir(i) {
    var G = HBL.repetir[i], host = document.getElementById('repet');
    var lote = pick(G.v, Math.min(6, G.v.length)), k = 0, suma = 0;
    host.innerHTML = '<div class="card flat" style="margin-top:12px"><b>' + esc(G.t) + '</b><p class="small dim">' + G.nota + '</p></div><div id="rzona"></div>';
    paso();
    function paso() {
      var z = document.getElementById('rzona');
      if (k >= lote.length) {
        var media = Math.round(suma / lote.length);
        z.innerHTML = '<div class="card flat"><div class="metrics">' + metric(media + '%', 'media de la serie') + metric(lote.length, 'frases') + '</div>' +
          '<p class="small ' + (media >= 85 ? 'ok-t' : media >= 65 ? 'dim' : 'bad-t') + '">' +
          (media >= 85 ? 'Nivel superado. Sube al siguiente: si te sale fácil, ya no entrena.'
           : media >= 65 ? 'Vas bien. Repite esta misma serie mañana antes de subir de nivel; la mejora aparece entre sesiones, no dentro de una.'
           : 'Quédate en este nivel unos días. Bajar de nivel no es retroceder: es donde de verdad se corrige la boca.') + '</p></div>';
        var b = el('<button class="btn sec small">Otra serie</button>');
        b.onclick = function () { serieRepetir(i); };
        z.appendChild(b); return;
      }
      var f = enEs(lote[k]), frase = f.en;
      z.innerHTML = '<div class="card flat"><p class="small dim">Frase ' + (k + 1) + ' de ' + lote.length + '</p>' +
        '<p class="en big">' + esc(frase) + '</p>' + trEs(f.es) +
        '<div class="row" style="margin-top:8px"><button class="btn sec small" id="s0">🔊 Oír</button>' +
        (haySR() ? '<button class="btn" id="s1">● Grabar</button>' : '') +
        '<button class="btn sec small" id="s2">Saltar →</button><span class="dim small" id="ss"></span></div><div id="sr"></div></div>';
      speak(frase);
      z.querySelector('#s0').onclick = function () { speak(frase); };
      z.querySelector('#s2').onclick = function () { k++; paso(); };
      var btn = z.querySelector('#s1'); if (!btn) return;
      var st = z.querySelector('#ss'), out = z.querySelector('#sr');
      botonGrabar(btn, '■ Parar', '● Grabar', {
        onInicio: function () { st.textContent = 'Escuchando…'; out.innerHTML = ''; },
        onParcial: function (t, ii) { st.textContent = (t + ii).slice(-50); },
        onError: function (m) { st.textContent = ''; out.innerHTML = '<div class="note small">' + esc(m) + '</div>'; },
        onFin: function (dicho, hubeError) {
          if (hubeError && !norm(dicho)) { st.textContent = ''; return; }
          juzga(out, dicho, frase, st);
          suma += parecido(dicho, frase).pct;
          var c = el('<button class="btn small" style="margin-top:10px">Siguiente frase →</button>');
          c.onclick = function () { k++; paso(); };
          out.appendChild(c);
        }
      });
    }
  }

  // --- lectura en voz alta cronometrada ---
  function lecturaVoz(i) {
    var L2 = HBL.lectura[i], host = document.getElementById('lect');
    var pal = toks(L2.txt).length;
    host.innerHTML = '<div class="card flat" style="margin-top:12px"><b>' + esc(L2.t) + '</b>' +
      '<p class="small dim">' + esc(L2.nota) + ' · ' + pal + ' palabras</p>' +
      '<p class="en lectura">' + esc(L2.txt) + '</p>' +
      '<div class="trad-es lectura-es"><b>En español:</b> ' + esc(L2.es) + '</div>' +
      '<div class="row"><button class="btn sec small" id="l0">🔊 Oír el modelo</button>' +
      (haySR() ? '<button class="btn" id="l1">● Leer en voz alta</button>' : '') +
      '<span class="timer" id="lt">0:00</span><span class="dim small" id="ls"></span></div><div id="lr"></div></div>';
    host.querySelector('#l0').onclick = function () { speak(L2.txt); };
    var btn = host.querySelector('#l1'); if (!btn) return;
    var st = host.querySelector('#ls'), out = host.querySelector('#lr'), tm = host.querySelector('#lt');
    var t0 = 0, iv = null;
    botonGrabar(btn, '■ He terminado', '● Leer en voz alta', {
      onInicio: function () {
        out.innerHTML = ''; t0 = Date.now();
        iv = setInterval(function () {
          var sg = Math.round((Date.now() - t0) / 1000);
          tm.textContent = Math.floor(sg / 60) + ':' + String(sg % 60).padStart(2, '0');
        }, 500);
      },
      onCancel: function () { clearInterval(iv); },
      onParcial: function (t, ii) { st.textContent = (t + ii).slice(-50); },
      onError: function (m) { st.textContent = ''; out.innerHTML = '<div class="note small">' + esc(m) + '</div>'; },
      onFin: function (dicho, hubeError) {
        clearInterval(iv);
        var dur = Math.max(5, Math.round((Date.now() - t0) / 1000));
        (function () {
          st.textContent = '';
          if (!norm(dicho)) { if (!hubeError) out.innerHTML = '<div class="note small">No se ha captado audio. Comprueba el permiso del micrófono y vuelve a intentarlo.</div>'; return; }
          var r = parecido(dicho, L2.txt);
          var wpm = Math.round(toks(norm(dicho)).length / (dur / 60));
          rec('prod', r.pct >= 80, 'lectura en voz alta · ' + L2.t); S.ses++; save();
          out.innerHTML = '<div class="metrics">' + metric(r.pct + '%', 'texto entendido') + metric(wpm, 'palabras/minuto') +
            metric(Math.floor(dur / 60) + ':' + String(dur % 60).padStart(2, '0'), 'tiempo') + '</div>' +
            '<p class="small ' + (r.pct >= 88 ? 'ok-t' : r.pct >= 70 ? 'dim' : 'bad-t') + '"><b>Lectura:</b> ' +
            (r.pct >= 88 ? 'muy clara, se ha entendido casi todo.' : r.pct >= 70 ? 'se entiende, con tropiezos localizados.' :
             'se pierde demasiado. Vuelve a leerla por frases sueltas antes de leerla entera.') + ' <b>Ritmo:</b> ' +
            (wpm < 90 ? 'por debajo de 90 palabras por minuto se percibe entrecortado; no leas más rápido, lee sin pararte.' :
             wpm > 160 ? 'demasiado rápido: a esa velocidad el ritmo acentual del inglés se pierde y todo suena plano.' :
             'dentro del rango natural de un hablante competente (110-150).') + '</p>' +
            (r.faltan.length ? '<p class="small"><b>No se han entendido:</b> ' + r.faltan.slice(0, 14).map(function (w) {
              return '<span class="en vb pal2" data-say="' + esc(w) + '">' + esc(w) + '</span>';
            }).join(' · ') + '</p><p class="small dim">Pulsa cada una para oírla bien. Si se repite el mismo sonido en varias, ' +
              'ese es tu punto flojo: súbelo en el apartado 1.</p>' : '');
          out.querySelectorAll('.pal2').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
        })();
      }
    });
  }

  // --- monólogo guiado ---
  function monologoUI() {
    var host = document.getElementById('mono');
    var m = HBL.monologo[Math.floor(Math.random() * HBL.monologo.length)].split('|');
    host.innerHTML = '<div class="card flat"><b class="small">Tu tema</b><p style="margin:4px 0 8px">' + esc(m[0]) + '</p>' +
      '<b class="small">Tienes que incluir</b><ul class="errs">' + m[1].split('·').map(function (x) {
        return '<li>' + esc(x.trim()) + '</li>'; }).join('') + '</ul>' +
      '<div class="row"><button class="btn sec small" id="m0">Otro tema</button>' +
      (haySR() ? '<button class="btn" id="m1">● Empezar · 90 s</button>' : '') +
      '<span class="timer" id="mt">1:30</span></div><div id="mlive" class="live en hidden"></div><div id="mr"></div></div>';
    host.querySelector('#m0').onclick = monologoUI;
    var btn = host.querySelector('#m1'); if (!btn) return;
    var live = host.querySelector('#mlive'), tm = host.querySelector('#mt'), out = host.querySelector('#mr');
    var iv = null, sg = 90, t0 = 0;
    botonGrabar(btn, '■ Terminar', '● Empezar · 90 s', {
      onInicio: function () {
        sg = 90; t0 = Date.now(); out.innerHTML = '';
        live.classList.remove('hidden'); live.textContent = '';
        iv = setInterval(function () {
          sg--; tm.textContent = Math.floor(sg / 60) + ':' + String(Math.max(0, sg) % 60).padStart(2, '0');
          if (sg <= 0) MIC.stop();
        }, 1000);
      },
      onCancel: function () { clearInterval(iv); },
      onParcial: function (t, i) { live.innerHTML = esc(t) + '<span class="dim">' + esc(i) + '</span>'; live.scrollTop = live.scrollHeight; },
      onError: function (m) { out.innerHTML = '<div class="note small">' + esc(m) + '</div>'; },
      onFin: function (t, hubeError) {
        clearInterval(iv);
        (function () {
          var tk = toks(norm(t));
          if (tk.length < 10) { if (!hubeError) out.innerHTML = '<div class="note small">No se ha captado suficiente audio. Habla al menos diez palabras seguidas.</div>'; return; }
          var dur = Math.max(15, Math.round((Date.now() - t0) / 1000));
          var uniq = {}; tk.forEach(function (w) { uniq[w] = 1; });
          var dist = Math.round(Object.keys(uniq).length / tk.length * 100);
          var wpm = Math.round(tk.length / (dur / 60));
          var pausas = (t.match(/\b(er|erm|em|eh|mmm)\b/gi) || []).length;
          rec('prod', wpm >= 80, 'monólogo guiado'); S.ses++; save();
          out.innerHTML = '<div class="metrics">' + metric(wpm, 'palabras/minuto') + metric(tk.length, 'palabras') +
            metric(dist + '%', 'léxico distinto') + '</div>' +
            '<p class="small ' + (wpm >= 100 ? 'ok-t' : wpm >= 75 ? 'dim' : 'bad-t') + '">' +
            (wpm >= 100 ? 'Fluidez de conversación real. A partir de aquí lo que sube la nota ya no es la velocidad, es la precisión.'
             : wpm >= 75 ? 'Ritmo aceptable con alguna parada. Vuelve a hacer el mismo tema ahora mismo: la segunda vez sube siempre, y esa subida es la que se queda.'
             : 'Vas parándote a buscar palabras. El remedio no es estudiar más vocabulario, es <b>rebajar lo que quieres decir</b>: frases cortas y acabadas antes que frases ambiciosas a medias.') +
            (pausas ? ' Se han contado ' + pausas + ' muletillas: cuando no encuentres la palabra, calla un segundo en vez de rellenar. Un silencio corto suena profesional; un «errr» largo, no.' : '') + '</p>' +
            '<h3>Lo que se ha entendido</h3><div class="live en">' + esc(t) + '</div>' +
            '<p class="small dim">Léelo buscando tres cosas: frases sin verbo, sujetos que te has comido y verbos sin la -s de tercera persona. ' +
            'Esos tres son los errores que más se fosilizan, y verlos escritos es la única forma de cazarlos.</p>';
        })();
      }
    });
  }
}

// ---------- vista: exámenes ----------
function vExamenes() {
  var h = '<h1>Exámenes y simulacros</h1>' +
    '<p class="dim">Dos cosas distintas. El <b>examen de nivel</b> son 40 ítems de Use of English para cerrar el mes (apto con 75 %). El <b>simulacro completo</b> reproduce el examen oficial de cada nivel con sus secciones de comprensión lectora larga, listening, writing y speaking.</p>' +
    '<div class="note small"><b>Aviso importante:</b> el examen oficial de cada nivel es distinto. A2 Key y B1 Preliminary no tienen word formation ni key word transformation; ese trabajo se hace aquí como <b>preparación hacia el B2 First</b>, que sí los incluye. Los simulacros, en cambio, siguen el formato real de cada examen: A2 Key, B1 Preliminary, B2 First y C1 Advanced.</div>' +
    '<div class="card"><h3 style="margin-top:0">A qué examen corresponde cada etapa</h3>' +
    '<div class="tablewrap"><table><tr><th>Etapa del curso</th><th>Nivel MCER</th><th>Examen oficial de Cambridge</th><th>En el curso</th></tr>' +
    '<tr><td><span class="pill a1">A1</span> Módulo 0 · 30 días</td><td>A1 → umbral de A2</td><td class="dim">Ninguno: Cambridge no examina adultos por debajo del A2</td><td>Examen de módulo, sin simulacro</td></tr>' +
    '<tr><td><span class="pill a2">A2</span> Mes 1 · días 1-30</td><td>A2</td><td><b>A2 Key</b> (KET)</td><td>Examen de nivel + simulacro completo</td></tr>' +
    '<tr><td><span class="pill b1">B1</span> Mes 2 · días 31-60</td><td>B1</td><td><b>B1 Preliminary</b> (PET)</td><td>Examen de nivel + simulacro completo</td></tr>' +
    '<tr><td><span class="pill b2">B2</span> Mes 3 · días 61-90</td><td>B2</td><td><b>B2 First</b> (FCE)</td><td>Examen de nivel + simulacro completo</td></tr>' +
    '<tr><td><span class="pill c1">C1</span> Mes 4 · días 91-120</td><td>C1</td><td><b>C1 Advanced</b> (CAE)</td><td>Examen de nivel + simulacro completo</td></tr>' +
    '</table></div>' +
    '<p class="small dim">Además, el <b>texto que escribes cada día</b> se corrige con la rejilla real del <i>Writing</i> de Cambridge —Contenido, Logro comunicativo, Organización y Lenguaje, cada uno sobre 5— y devuelve una estimación de banda; y la <b>prueba oral</b> la estima a partir de fluidez, densidad léxica y estructuras usadas. Así hay una referencia de nivel en las cuatro destrezas, no solo en el examen de fin de mes.</p></div>';
  ORDEN.forEach(function (li) {
    var L = LEVELS[li];
    var dn = doneDays().filter(function (n) { return n > li * 30 && n <= li * 30 + 30; }).length;
    var ex = S.ex['exam' + L.id];
    h += '<div class="card"><div class="row between"><h2 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> ' + (L.mes ? 'Examen del mes ' + L.mes : 'Examen del Módulo 0') + '</h2>' +
      '<div class="row">' + (SIM[L.id] ? '<button class="btn sec small" data-sim="' + L.id + '">Simulacro completo</button>' : '') +
      '<button class="btn small" data-ex="' + L.id + '"' + (dn < 30 ? ' disabled' : '') + '>' + (ex ? 'Repetir examen' : 'Examen de nivel') + '</button></div></div>' +
      '<div class="tablewrap"><table><tr><th>Parte</th><th>Ítems</th><th>Qué mide</th></tr>' +
      '<tr><td>Part 1 · Multiple-choice cloze</td><td>8</td><td class="dim">Léxico y gramática en contexto</td></tr>' +
      '<tr><td>Part 2 · Open cloze</td><td>8</td><td class="dim">Palabras gramaticales: una sola palabra por hueco</td></tr>' +
      '<tr><td>Part 3 · Word formation</td><td>8</td><td class="dim">Derivación a partir de una raíz</td></tr>' +
      (SIM[L.id] ? '<tr><td>Part 4 · Key word transformation</td><td>6</td><td class="dim">Reescritura con palabra clave (' + (L.id === 'C1' ? '3-6' : '2-5') + ' palabras)</td></tr>'
                 : '<tr><td>Part 4 · Vocabulario del módulo</td><td>6</td><td class="dim">Léxico básico: la key word transformation no existe en este nivel</td></tr>') +
      '<tr><td>Listening · Dictation</td><td>6</td><td class="dim">Comprensión oral y ortografía</td></tr>' +
      '<tr><td>Writing · Transformation</td><td>4</td><td class="dim">Producción escrita controlada</td></tr></table></div>' +
      (SIM[L.id] ? '<p class="small"><b>Simulacro ' + esc(SIM[L.id].nom) + '</b> · ' + SIM[L.id].orden.map(function (k) { return esc(SIM[L.id][k].t); }).join(' · ') +
        (S.sim[L.id] ? ' <span class="ok-t">· último intento ' + S.sim[L.id].pct + '%</span>' : '') + '</p>' : '') +
      '<p class="dim small">' + (dn < 30 ? 'El examen se desbloquea al completar los 30 días (' + dn + '/30).' + (SIM[L.id] ? ' El simulacro está siempre disponible.' : '')
        : (ex ? 'Última nota del examen: <b class="' + (ex.pass ? 'ok-t' : 'bad-t') + '">' + ex.pct + '%</b> · ' + ex.fecha : 'Disponible.')) + '</p></div>';
  });
  app.innerHTML = h;
  app.querySelectorAll('[data-ex]').forEach(function (b) { b.onclick = function () { go('examen', b.dataset.ex); }; });
  app.querySelectorAll('[data-sim]').forEach(function (b) { b.onclick = function () { go('simulacro', b.dataset.sim); }; });
}

function vExamen(id) {
  var L = LEVELS[lvlIndex(id)];
  if (!L || L.id !== id) return go('home');
  var items = buildExam(L);
  app.innerHTML = '<h1><span class="pill ' + id.toLowerCase() + '">' + id + '</span> Examen de nivel</h1>' +
    '<p class="dim">' + items.length + ' ítems · formato Cambridge · sin límite de tiempo · apto con 75 %.</p><div id="host"></div>';
  runTest(document.getElementById('host'), items, { min: 75, pasoTxt: 'APTO · nivel ' + id + ' superado' }, function (pct, pass, foot) {
    S.ex['exam' + id] = { pct: pct, pass: pass, fecha: hoy() }; S.ses++; save();
    var b = el('<button class="btn">Volver al panel</button>');
    b.onclick = function () { go('home'); };
    foot.appendChild(b);
  });
}


// ---------- vista: simulacro completo Cambridge ----------
function vSimulacro(id) {
  var L = LEVELS[lvlIndex(id)];
  var X = SIM[id];
  if (!X) { app.innerHTML = '<h1>Simulacro</h1><div class="card"><p>El Módulo 0 no tiene simulacro oficial: Cambridge no examina por debajo del A2. Termina sus 30 días, haz el examen del módulo y pasa al simulacro de <b>A2 Key</b>.</p></div>'; return; }
  if (!L || L.id !== id || !X) return go('examenes');
  var prev = S.sim[id];
  var h = '<h1><span class="pill ' + id.toLowerCase() + '">' + id + '</span> Simulacro completo · ' + esc(X.nom) + '</h1>' +
    '<p class="dim">Las secciones que el examen de nivel no cubre: comprensión lectora larga, listening de formato oficial, writing con extensión medida y speaking en cuatro partes. Duración del examen real: ' + esc(X.dur) + '. Aquí puedes hacerlo por partes y repetirlo.</p>' +
    (prev ? '<div class="note small">Último intento: <b>' + prev.fecha + '</b> · ' + prev.pct + '% en las secciones corregibles automáticamente.</div>' : '') +
    '<div id="secs"></div>' +
    '<div class="card" id="simres"><p class="dim small">Al terminar las secciones de opción múltiple verás aquí tu resultado global.</p></div>';
  app.innerHTML = h;
  var host = document.getElementById('secs');
  var marc = {};

  X.orden.forEach(function (key, si) {
    var S1 = X[key];
    if (!S1) return;
    var d = el('<details class="blk"' + (si === 0 ? ' open' : '') + '>' +
      '<summary><span class="num">' + (si + 1) + '</span> ' + esc(S1.t) + '<span class="min" id="m-' + key + '"></span></summary>' +
      '<div class="body"><p class="dim small">' + S1.instr + '</p><div class="secbody"></div></div></details>');
    host.appendChild(d);
    var body = d.querySelector('.secbody');
    var tipo = S1.audio ? 'list' : S1.partes ? 'sp' : S1.tarea ? 'wr' : S1.ops ? 'gap' : S1.textos ? 'match' : 'mc';
    ({ mc: secMC, gap: secGap, match: secMatch, list: secList, wr: secWr, sp: secSp })[tipo](body, S1, key, d);
  });

  function marca(key, ok, tot, d) {
    marc[key] = { ok: ok, tot: tot };
    var m = document.getElementById('m-' + key);
    if (m) m.textContent = ok + '/' + tot;
    d.classList.add('ok');
    d.querySelector('.num').textContent = '✔';
    var to = 0, oks = 0;
    Object.keys(marc).forEach(function (k) { to += marc[k].tot; oks += marc[k].ok; });
    var pct = to ? Math.round(oks / to * 100) : 0;
    S.sim[id] = { fecha: hoy(), pct: pct, det: marc }; save();
    document.getElementById('simres').innerHTML =
      '<div style="text-align:center"><span class="score ' + (pct >= 60 ? 'ok-t' : 'bad-t') + '">' + pct + '%</span>' +
      '<p>' + oks + ' de ' + to + ' en las secciones corregidas automáticamente.</p>' +
      '<p class="small dim">Cambridge aprueba en 60 % (grado C). Writing y Speaking se evalúan aparte, con sus propios criterios.</p></div>';
  }

  function textoHtml(t) {
    return (Array.isArray(t) ? t : String(t).split('\n')).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + p.replace(/\[(\d+)\]/g, '<b class="ghole">［$1］</b>') + '</p>'; }).join('');
  }

  function preguntasMC(body, lista, key, d, cat) {
    var qh = el('<div></div>'); body.appendChild(qh);
    var ok = 0, hechas = 0;
    lista.forEach(function (q, qi) {
      var c = el('<div class="q"><div class="qt">' + (qi + 1) + '. ' + esc(q.q) + '</div></div>');
      q.o.forEach(function (o, oi) {
        var b = el('<button class="opt">' + esc(o) + '</button>');
        b.onclick = function () {
          c.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var bien = oi === q.k;
          b.classList.add(bien ? 'ok' : 'bad');
          if (!bien) c.querySelectorAll('.opt')[q.k].classList.add('ok');
          if (bien) ok++;
          rec(cat, bien, q.q); save();
          if (++hechas >= lista.length) marca(key, ok, lista.length, d);
        };
        c.appendChild(b);
      });
      qh.appendChild(c);
    });
  }

  function secMC(body, S1, key, d) {
    body.appendChild(el('<div class="reading en">' + textoHtml(S1.texto) + '</div>'));
    var rb = el('<button class="btn sec small">▶ Escuchar el texto</button>');
    rb.onclick = function () { speakSeq(String(S1.texto).split('\n').filter(Boolean)); };
    body.appendChild(rb);
    preguntasMC(body, S1.q, key, d, 'read');
  }

  function secMatch(body, S1, key, d) {
    var w = el('<div class="grid gmatch"></div>');
    S1.textos.forEach(function (t) {
      w.appendChild(el('<div class="card flat mtext"><b>' + esc(t.id) + ' · ' + esc(t.t) + '</b><div class="en">' + esc(t.texto) + '</div></div>'));
    });
    body.appendChild(w);
    preguntasMC(body, S1.q, key, d, 'read');
  }

  function secGap(body, S1, key, d) {
    body.appendChild(el('<div class="reading en">' + textoHtml(S1.texto) + '</div>'));
    body.appendChild(el('<h3>Frases para colocar</h3>'));
    var lista = el('<div class="opslist en"></div>');
    S1.ops.forEach(function (o, i) { lista.appendChild(el('<div class="opitem"><b>' + String.fromCharCode(65 + i) + '</b> ' + esc(o) + '</div>')); });
    body.appendChild(lista);
    var qh = el('<div></div>'); body.appendChild(qh);
    var sels = [];
    S1.k.forEach(function (kk, i) {
      var c = el('<div class="q"><div class="qt">Hueco ［' + (i + 1) + '］</div></div>');
      var sel = el('<select><option value="-1">— elige —</option>' + S1.ops.map(function (o, j) {
        return '<option value="' + j + '">' + String.fromCharCode(65 + j) + ' · ' + esc(o.slice(0, 60)) + '…</option>';
      }).join('') + '</select>');
      c.appendChild(sel); qh.appendChild(c); sels.push({ sel: sel, k: kk, c: c });
    });
    var b = el('<button class="btn small" style="margin-top:12px">Comprobar sección</button>');
    b.onclick = function () {
      var ok = 0;
      sels.forEach(function (x) {
        var bien = parseInt(x.sel.value, 10) === x.k;
        if (bien) ok++;
        x.sel.disabled = true;
        x.c.appendChild(el('<div class="fb ' + (bien ? 'ok' : 'bad') + '">' + (bien ? '✔ Correcto' : '✖ Era ' + String.fromCharCode(65 + x.k) + ': ' + esc(S1.ops[x.k])) + '</div>'));
        rec('read', bien, 'gapped text');
      });
      b.disabled = true; save();
      marca(key, ok, sels.length, d);
    };
    body.appendChild(b);
  }

  function secList(body, S1, key, d) {
    var row = el('<div class="row" style="margin-bottom:12px"></div>');
    var p1 = el('<button class="btn">▶ Escuchar</button>');
    p1.onclick = function () { speak(S1.audio); };
    var p2 = el('<button class="btn sec">🐢 Más despacio</button>');
    p2.onclick = function () { speak(S1.audio, { rate: 0.7 }); };
    var p3 = el('<button class="btn sec">■ Parar</button>');
    p3.onclick = stopAudio;
    row.appendChild(p1); row.appendChild(p2); row.appendChild(p3);
    body.appendChild(row);
    var qh = el('<div></div>'); body.appendChild(qh);
    var ins = [];
    S1.q.forEach(function (q, i) {
      var c = el('<div class="q"><div class="qt">' + (i + 1) + '. ' + gapHtml(q.q) + '</div></div>');
      var inp = el('<input type="text" autocomplete="off" spellcheck="false" placeholder="una, dos o tres palabras">');
      c.appendChild(inp); qh.appendChild(c); ins.push({ inp: inp, a: q.a, c: c });
    });
    var b = el('<button class="btn small" style="margin-top:12px">Comprobar sección</button>');
    b.onclick = function () {
      var ok = 0;
      ins.forEach(function (x) {
        var bien = norm(x.inp.value) === norm(x.a);
        if (bien) ok++;
        x.inp.disabled = true;
        x.c.appendChild(el('<div class="fb ' + (bien ? 'ok' : 'bad') + '">' + (bien ? '✔ Correcto' : '✖ Era: <b>' + esc(x.a) + '</b>') + '</div>'));
        rec('list', bien, 'listening gap fill');
      });
      b.disabled = true; save();
      var tr = el('<details class="blk" style="margin-top:12px"><summary><span class="num">T</span> Ver la transcripción</summary><div class="body en">' + esc(S1.audio) + '</div></details>');
      body.appendChild(tr);
      marca(key, ok, ins.length, d);
    };
    body.appendChild(b);
  }

  function secWr(body, S1, key, d) {
    body.appendChild(el('<div class="anx">' + S1.tarea + '</div>'));
    body.appendChild(el('<h3>Criterios de evaluación</h3>'));
    body.appendChild(el('<ul class="errs">' + S1.criterios.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>'));
    var ta = el('<textarea style="min-height:200px" placeholder="Escribe aquí tu texto…"></textarea>');
    var st2 = S.sim['txt' + id + key] || '';
    ta.value = st2;
    var cnt = el('<div class="row between small dim" style="margin-top:6px"><span id="wc">0 palabras</span><span>objetivo: ' + S1.min + '-' + S1.max + '</span></div>');
    function cuenta() {
      var w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      var e = cnt.querySelector('#wc');
      e.textContent = w + ' palabras';
      e.className = w >= S1.min && w <= S1.max ? 'ok-t' : w > S1.max ? 'bad-t' : '';
    }
    ta.oninput = function () { S.sim['txt' + id + key] = ta.value; save(); cuenta(); };
    body.appendChild(ta); body.appendChild(cnt); cuenta();
    var row = el('<div class="row" style="margin-top:12px"></div>');
    var ev = el('<button class="btn small">Evaluar según los criterios</button>');
    var res = el('<div></div>');
    ev.onclick = function () {
      var t = ta.value.trim();
      var w = t ? t.split(/\s+/).length : 0;
      if (w < 10) { res.innerHTML = '<div class="note">Escribe el texto antes de evaluar.</div>'; return; }
      var r = evalEscrito(t, null);
      var paras = t.split(/\n\s*\n/).filter(function (x) { return x.trim(); }).length;
      var links = (t.match(/\b(however|although|therefore|moreover|whereas|nevertheless|consequently|in addition|furthermore|on the other hand|because|so that|even though|in conclusion|firstly|secondly|as far as)\b/gi) || []);
      var uniqLinks = {}; links.forEach(function (x) { uniqLinks[x.toLowerCase()] = 1; });
      var nlinks = Object.keys(uniqLinks).length;
      var contr = /\b(don't|can't|won't|it's|I'm|didn't|isn't|we're|they're)\b/i.test(t);
      var checks = [
        { ok: w >= S1.min && w <= S1.max, t: 'Extensión dentro del rango (' + w + ' de ' + S1.min + '-' + S1.max + ')' },
        { ok: paras >= (S1.min >= 140 ? 4 : 2), t: 'Estructura en párrafos (' + paras + ', mínimo ' + (S1.min >= 140 ? 4 : 2) + ')' },
        { ok: nlinks >= (S1.min >= 140 ? 4 : 2), t: 'Conectores de discurso distintos (' + nlinks + ', mínimo ' + (S1.min >= 140 ? 4 : 2) + ')' },
        { ok: S1.min >= 140 ? !contr : true, t: S1.min >= 140 ? 'Registro formal: sin contracciones' : 'Registro informal permitido en esta tarea' },
        { ok: r.errs.length === 0, t: 'Sin errores fosilizados detectados (' + r.errs.length + ')' }
      ];
      var okN = checks.filter(function (c) { return c.ok; }).length;
      var nota = Math.round(okN / checks.length * 100);
      res.innerHTML = '<div class="card flat"><div class="row between"><b>Evaluación Cambridge</b><span class="score sm ' + (nota >= 60 ? 'ok-t' : 'bad-t') + '">' + nota + '%</span></div>' +
        '<ul class="errs">' + checks.map(function (c) { return '<li>' + (c.ok ? '✔ ' : '✖ ') + esc(c.t) + '</li>'; }).join('') + '</ul>' +
        (r.errs.length ? '<h3>Errores</h3><ul class="errs">' + r.errs.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>' : '') +
        '<h3>Respuesta modelo</h3><div class="reading en">' + textoHtml(S1.modelo) + '</div>' +
        '<p class="small dim">Compárala con la tuya buscando <b>estructura</b> y <b>conectores</b>, no vocabulario suelto.</p></div>';
      S.escr.push({ f: hoy(), dia: 0, words: w, ttr: r.ttr, avg: r.avg, errs: r.errs.length, score: nota, lista: r.errs });
      rec('prod', nota >= 60, 'writing ' + id); save();
    };
    row.appendChild(ev); body.appendChild(row); body.appendChild(res);
  }

  function secSp(body, S1, key, d) {
    S1.partes.forEach(function (pt) {
      var c = el('<div class="card flat"><b>' + esc(pt.t) + '</b><p class="dim small">' + esc(pt.prompt) + '</p></div>');
      pt.items.forEach(function (i) {
        var r = el('<div class="chunk"><div class="t en">' + esc(i) + '</div></div>');
        var pb = el('<button class="btn sec small">▶</button>');
        pb.onclick = function () { speak(i); };
        r.appendChild(pb); c.appendChild(r);
      });
      body.appendChild(c);
    });
    var row = el('<div class="row"></div>');
    var ob = el('<button class="btn">Grabar y evaluar mi respuesta</button>');
    ob.onclick = function () { go('oral'); };
    var okb = el('<button class="btn sec">Sección practicada</button>');
    okb.onclick = function () { d.classList.add('ok'); d.querySelector('.num').textContent = '✔'; okb.disabled = true; };
    row.appendChild(ob); row.appendChild(okb);
    body.appendChild(row);
  }
}

// ---------- vista: día ----------
function vDia(nStr) {
  var n = parseInt(nStr, 10);
  if (!n || n < 1 || n > TOTAL || !unlocked(n)) return go('home');
  var L = lvlOf(n), D = dayData(n), k = ((n - 1) % 30) + 1;
  var st = S.dias[n] = S.dias[n] || { fin: false, pct: 0, blk: {} };
  if (!st.blk) st.blk = {};  // tolera estados restaurados desde otra dirección
  var semanal = k % 7 === 0;
  var ANEXO = anexoDe(L.id, k);

  app.innerHTML = '<div class="row between"><h1 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> ' + etiquetaDia(n) +
    ' <span class="dim">· ' + esc(D.tema) + '</span></h1><div class="row"><button class="btn sec small" id="foco">Modo enfoque</button><div class="timer" id="clock">60:00</div></div></div>' +
    '<p class="dim">🎯 ' + esc(D.objetivo) + (semanal ? ' <b>· Hoy es día de repaso semanal.</b>' : '') + '</p>' +
    (ANEXO ? '<div class="note small"><b>Anexo profesional:</b> ' + esc(ANEXO.tema) + '. Doce términos de arquitectura y negocios que entran en el test del día y en el examen del mes.</div>' : '') +
    (S.doble ? '<div class="note small"><b>Doble sesión.</b> ' + (n % 2 ? 'Esta es la sesión de <b>mañana</b>: material nuevo, con la cabeza descansada.' : 'Esta es la sesión de <b>tarde o noche</b>: consolidación. Duerme después: el sueño es parte del método, no el final del día.') + '</div>' : '') +
    '<div id="blocks"></div><div class="card" id="finish"></div>';
  startClock();
  document.getElementById('foco').onclick = function () {
    document.body.classList.toggle('foco');
    this.textContent = document.body.classList.contains('foco') ? '✓ Enfoque' : 'Modo enfoque';
  };

  var B = document.getElementById('blocks');
  var blocks = ANEXO ? [
    { t: 'Calentamiento y repaso', m: 8, f: b1 },
    { t: 'Input: escucha a ciegas', m: 8, f: b2 },
    { t: 'Texto y vocabulario', m: 10, f: b3 },
    { t: 'Shadowing y pronunciación', m: 8, f: b4 },
    { t: 'Gramática inductiva', m: 6, f: b5 },
    { t: 'Producción: hablar y escribir', m: 8, f: b6 },
    { t: 'Anexo profesional · ' + ANEXO.tema, m: 6, f: bAnexo },
    { t: 'Test del día', m: 6, f: b7 }
  ] : [
    { t: 'Calentamiento y repaso', m: 6, f: b1 },
    { t: 'Input: escucha a ciegas', m: 8, f: b2 },
    { t: 'Texto y vocabulario', m: 10, f: b3 },
    { t: 'Shadowing y pronunciación', m: 10, f: b4 },
    { t: 'Gramática inductiva', m: 8, f: b5 },
    { t: 'Producción: hablar y escribir', m: 10, f: b6 },
    { t: 'Test del día', m: 8, f: b7 }
  ];
  blocks.forEach(function (b, i) {
    var d = el('<details class="blk' + (st.blk[i] ? ' ok' : '') + '"' + (i === 0 ? ' open' : '') + '>' +
      '<summary><span class="num">' + (st.blk[i] ? '✔' : i + 1) + '</span> ' + b.t + '<span class="min">' + b.m + ' min</span></summary>' +
      '<div class="body"></div></details>');
    B.appendChild(d);
    b.f(d.querySelector('.body'), D, n, function () { st.blk[i] = true; d.classList.add('ok'); d.querySelector('.num').textContent = '✔'; save(); });
  });

  function b1(host, D, n, done) {
    var due = srsDue();
    host.innerHTML = '<p class="dim small">Antes de meter nada nuevo, recupera lo viejo. La recuperación activa —no la relectura— es lo que fija la memoria.</p>';
    var gy = gymDe(n);
    if (gy) {
      var nota = el('<div class="note small">🏋 <b>Gimnasio de hoy: ' + esc(gy.t) + '.</b> ' + esc(gy.txt) + ' </div>');
      var gb = el('<button class="btn sec small" style="margin-top:8px">Abrir el gimnasio</button>');
      gb.onclick = function () { go('gimnasio', gy.id); };
      nota.appendChild(gb); host.appendChild(nota);
    }
    var row = el('<div class="row"></div>');
    if (due.length) {
      host.appendChild(el('<p><b>' + due.length + '</b> tarjetas pendientes' + (semanal ? ' · <b>repaso semanal ampliado</b>' : '') + '.</p>'));
      var goB = el('<button class="btn">Repasar ahora</button>');
      goB.onclick = function () { go('repaso'); };
      row.appendChild(goB);
    } else {
      host.appendChild(el('<p class="ok-t">Sin tarjetas pendientes hoy. Calienta el oído con las frases de ayer.</p>'));
    }
    if (n > 1) {
      var prev = dayData(n - 1);
      var pb = el('<button class="btn sec">▶ Frases de ayer</button>');
      pb.onclick = function () { speakSeq(prev.chunks.slice(0, 5)); };
      row.appendChild(pb);
    }
    var ok0 = el('<button class="btn sec">Calentamiento hecho</button>');
    ok0.onclick = function () { S.ses++; save(); done(); ok0.disabled = true; };
    row.appendChild(ok0);
    host.appendChild(row);
  }

  function b2(host, D, n, done) {
    host.innerHTML = '<p class="dim small">Escucha el diálogo <b>sin leer</b>, dos veces. No pasa nada si no lo entiendes todo: tu oído está construyendo el mapa de sonidos.</p>';
    var lines = D.dial.l.map(function (l) { return l.split('|')[1]; });
    var row = el('<div class="row" style="margin:10px 0"></div>');
    var p1 = el('<button class="btn">▶ Escuchar</button>');
    p1.onclick = function () { speakSeq(lines); };
    var p2 = el('<button class="btn sec">🐢 Más despacio</button>');
    p2.onclick = function () { speakSeq(lines, 0.7); };
    row.appendChild(p1); row.appendChild(p2); host.appendChild(row);
    host.appendChild(el('<h3>Comprensión</h3>'));
    var qh = el('<div></div>'); host.appendChild(qh);
    var cnt = 0;
    D.esc.forEach(function (q) {
      var c = el('<div class="q"><div class="qt">' + esc(q.q) + '</div></div>');
      q.o.forEach(function (o, oi) {
        var b = el('<button class="opt">' + esc(o) + '</button>');
        b.onclick = function () {
          c.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var ok = oi === q.k;
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) c.querySelectorAll('.opt')[q.k].classList.add('ok');
          rec('list', ok, q.q); save();
          if (++cnt >= D.esc.length) done();
        };
        c.appendChild(b);
      });
      qh.appendChild(c);
    });
    if (S.auto) setTimeout(function () { speakSeq(lines); }, 300);
  }

  function b3(host, D, n, done) {
    host.innerHTML = '<p class="dim small">Ahora sí: lee mientras escuchas. Pulsa una línea para ver la traducción — <b>úsala solo si la necesitas</b>.</p>';
    var dial = el('<div class="card flat"><div class="row between"><b class="en" style="cursor:default">' + esc(D.dial.t) + '</b></div><div id="lines"></div></div>');
    host.appendChild(dial);
    dial.querySelector('.row').appendChild(spkBtn(D.dial.l.map(function (l) { return l.split('|')[1]; }).join(' ')));
    var lb = dial.querySelector('#lines');
    D.dial.l.forEach(function (l) {
      var p = l.split('|');
      var d = el('<div class="line"><span class="who">' + esc(p[0]) + '</span><div style="flex:1"><div class="en">' + esc(p[1]) + '</div><div class="es">' + esc(p[2] || '') + '</div></div></div>');
      d.querySelector('.en').onclick = function () { d.classList.toggle('show'); speak(p[1]); };
      d.appendChild(spkBtn(p[1]));
      lb.appendChild(d);
    });
    host.appendChild(el('<h3>Vocabulario del día (' + D.vocab.length + ')</h3>'));
    var vb = el('<div class="card flat"></div>');
    D.vocab.forEach(function (v) {
      var o = vparts(v);
      srsAdd(L.id + '-' + n + '-' + o.w, o.w, o.es, o.ex, o.g);
      var r = el('<div class="vw"><div><div class="w">' + esc(o.w) + ' <span class="dim">— ' + esc(o.es) + '</span></div>' +
        (o.ex ? '<div class="ex">' + esc(o.ex) + '</div>' : '') +
        (o.g ? '<div class="gk">🧠 ' + esc(o.g) + '</div>' : '') + '</div></div>');
      r.appendChild(spkBtn(o.ex || o.w));
      vb.appendChild(r);
    });
    host.appendChild(vb); save();
    var b = el('<button class="btn small">He leído y escuchado todo</button>');
    b.onclick = function () { done(); b.disabled = true; };
    host.appendChild(b);
  }

  function b4(host, D, n, done) {
    host.innerHTML = '<p class="dim small">Shadowing: reproduce la frase y <b>habla a la vez que la voz</b>, imitando ritmo y entonación. Tres pasadas: despacio, normal y sin mirar.</p>';
    var count = 0;
    D.chunks.forEach(function (c) {
      var row = el('<div class="chunk"><div class="t">' + esc(c) + '</div></div>');
      var slow = el('<button class="btn sec small" title="Despacio">🐢</button>');
      slow.onclick = function () { speak(c, { rate: 0.62 }); };
      var nb = el('<button class="btn small" title="Normal">▶</button>');
      nb.onclick = function () { speak(c); if (++count >= D.chunks.length) done(); };
      var mic = el('<button class="btn sec small" title="Compara tu pronunciación">🎤</button>');
      mic.onclick = function () { listen(c, row, mic); };
      row.appendChild(slow); row.appendChild(nb); row.appendChild(mic);
      host.appendChild(row);
    });
    var all = el('<button class="btn sec small" style="margin-top:10px">▶ Todas seguidas</button>');
    all.onclick = function () { speakSeq(D.chunks); };
    host.appendChild(all);
    var okb = el('<button class="btn small" style="margin:10px 0 0 8px">Bloque hecho</button>');
    okb.onclick = function () { done(); okb.disabled = true; };
    host.appendChild(okb);
  }

  function b5(host, D, n, done) {
    var G = D.gram;
    host.innerHTML = '<p class="dim small">Primero los ejemplos, después la regla. Así aprendiste tu lengua materna: el patrón antes que la explicación.</p>';
    var ex = el('<div class="card flat"><b>Observa</b></div>');
    G.ej.forEach(function (e) {
      var r = el('<div class="line"><div class="en" style="flex:1">' + esc(e) + '</div></div>');
      r.appendChild(spkBtn(e)); ex.appendChild(r);
    });
    host.appendChild(ex);
    var rev = el('<button class="btn sec small">¿Qué patrón ves? Mostrar la regla</button>');
    host.appendChild(rev);
    var rule = el('<div class="note hidden"><b>' + esc(G.t) + '</b><br>' + G.idea + (G.nota ? '<br><span class="dim small">⚠ ' + G.nota + '</span>' : '') + '</div>');
    host.appendChild(rule);
    rev.onclick = function () { rule.classList.remove('hidden'); rev.disabled = true; };
    host.appendChild(el('<h3>Práctica</h3>'));
    var okc = 0;
    G.drill.forEach(function (d) {
      var c = el('<div class="q"><div class="qt">' + gapHtml(d[0]) + '</div></div>');
      var i = el('<input type="text" placeholder="completa" autocomplete="off" spellcheck="false">');
      var b = el('<button class="btn small" style="margin-top:8px">Comprobar</button>');
      b.onclick = function () {
        var ok = norm(i.value) === norm(d[1]);
        i.disabled = true; b.disabled = true;
        c.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ ' : '✖ Solución: ') + esc(d[1]) + '</div>'));
        rec('gram', ok, d[0]); save();
        speak(String(d[0]).replace('___', d[1]));
        if (++okc >= G.drill.length) done();
      };
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') b.click(); });
      c.appendChild(i); c.appendChild(b); host.appendChild(c);
    });
  }

  function b6(host, D, n, done) {
    var P = D.prod;
    host.innerHTML = '<p class="dim small">Sin salida no hay fluidez. Habla dos minutos en voz alta y luego escribe. Compara con el modelo <b>después</b>, nunca antes.</p>';
    var sp = el('<div class="card flat"><b>🗣 Habla (2 min)</b><p>' + esc(P.habla) + '</p></div>');
    var t = el('<button class="btn small">Cronómetro 2:00</button>');
    var tv = el('<span class="timer" style="margin-left:10px">2:00</span>');
    t.onclick = function () {
      var s = 120; t.disabled = true;
      var iv = setInterval(function () {
        s--; tv.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        if (s <= 0) { clearInterval(iv); t.disabled = false; tv.textContent = '¡Tiempo!'; }
      }, 1000);
    };
    var oralHecha = (S.dias[n] || {}).oral;
    var ov = el('<button class="btn sec small" style="margin-left:8px">' +
      (oralHecha ? '✔ Prueba oral · ' + oralHecha.score + ' pts · repetir' : 'Prueba oral evaluada') + '</button>');
    ov.onclick = function () { go('oral', n); };  // el día concreto, no el último completado
    sp.appendChild(t); sp.appendChild(tv); sp.appendChild(ov); host.appendChild(sp);

    host.appendChild(el('<h3>✍ Escribe</h3>'));
    host.appendChild(el('<p>' + esc(P.escribe) + '</p>'));
    var ta = el('<textarea placeholder="Escribe aquí tu texto…"></textarea>');
    ta.value = (st.txt || '');
    ta.oninput = function () { st.txt = ta.value; save(); };
    host.appendChild(ta);
    var row = el('<div class="row" style="margin-top:10px"></div>');
    var evb = el('<button class="btn small">Evaluar mi texto</button>');
    var res = el('<div id="wres"></div>');
    evb.onclick = function () {
      var r = evalEscrito(ta.value, D, pideEnunciado(P.escribe));
      if (r.words < 12) { res.innerHTML = '<div class="note">Escribe al menos doce palabras antes de evaluar.</div>'; return; }
      res.innerHTML = '<div class="card flat">' + escritoHtml(r) + '</div>';
      S.escr.push({ f: hoy(), dia: n, words: r.words, ttr: r.ttr, avg: r.avg, errs: r.errs.length, score: r.score,
                    banda: r.banda, lista: r.errs.map(function (e) { return e.exp; }) });
      rec('prod', r.score >= 60, 'texto escrito día ' + n); save();
    };
    var mb = el('<button class="btn sec small">Ver respuesta modelo</button>');
    var mo = el('<div class="note hidden"><b>Modelo</b><br><span class="modelo-en">' + esc(P.modelo) + '</span></div>');
    mb.onclick = function () {
      if (norm(ta.value).split(' ').filter(Boolean).length < 12) { alert('Escribe al menos 12 palabras antes de mirar el modelo. La dificultad deseable es parte del método.'); return; }
      mo.classList.remove('hidden'); speak(P.modelo); done();
    };
    row.appendChild(evb); row.appendChild(mb);
    host.appendChild(row); host.appendChild(res); host.appendChild(mo);
  }

  function bAnexo(host, D, n, done) {
    var A = ANEXO;
    host.innerHTML = '<div class="anx"><b class="en">' + esc(A.t) + '</b><p class="dim small" style="margin:.4em 0 0">' + A.intro + '</p></div>';
    host.appendChild(el('<h3>Terminología (' + A.vocab.length + ')</h3>'));
    var vb = el('<div class="card flat"></div>');
    A.vocab.forEach(function (v) {
      var o = vparts(v);
      srsAdd('ANX-' + L.id + '-' + k + '-' + o.w, o.w, o.es, o.ex, o.g);
      var r = el('<div class="vw"><div><div class="w">' + esc(o.w) + ' <span class="dim">— ' + esc(o.es) + '</span></div>' +
        (o.ex ? '<div class="ex">' + esc(o.ex) + '</div>' : '') +
        (o.g ? '<div class="gk">🧠 ' + esc(o.g) + '</div>' : '') + '</div></div>');
      r.appendChild(spkBtn(o.ex || o.w));
      vb.appendChild(r);
    });
    host.appendChild(vb); save();
    host.appendChild(el('<h3>Frases para usar tal cual</h3>'));
    A.frases.forEach(function (c) {
      var row = el('<div class="chunk"><div class="t">' + esc(c) + '</div></div>');
      var slow = el('<button class="btn sec small" title="Despacio">🐢</button>');
      slow.onclick = function () { speak(c, { rate: 0.62 }); };
      var nb = el('<button class="btn small" title="Normal">▶</button>');
      nb.onclick = function () { speak(c); };
      var mic = el('<button class="btn sec small" title="Compara tu pronunciación">🎤</button>');
      mic.onclick = function () { listen(c, row, mic); };
      row.appendChild(slow); row.appendChild(nb); row.appendChild(mic);
      host.appendChild(row);
    });
    var all = el('<button class="btn sec small" style="margin:10px 8px 0 0">▶ Todas seguidas</button>');
    all.onclick = function () { speakSeq(A.frases); };
    host.appendChild(all);
    host.appendChild(el('<div class="note"><b>Uso profesional</b><br>' + A.nota + '</div>'));
    var okb = el('<button class="btn small">Anexo hecho</button>');
    okb.onclick = function () { done(); okb.disabled = true; };
    host.appendChild(okb);
  }

  function b7(host, D, n, done) {
    // En B1 y por encima, las preguntas con apoyo en español se sustituyen por
    // ítems en inglés hechos con las frases del propio día. En C1 no queda ninguna.
    var aj = ajustaNivel(D.test || [], D, L);
    var base = aj.items.map(function (t) { return t.t ? t : qMC(t.q, t.o, t.k, t.exp); });
    var extra = [qDic(pick(D.chunks, 1)[0])];
    if (D.prod && D.prod.tr) extra.push(qTr(D.prod.tr[0], D.prod.tr[1]));
    var cam = camItems(L.id, 'oc', 1).concat(camItems(L.id, 'wf', 1));
    if (semanal) cam = cam.concat(camItems(L.id, 'kwt', 1));
    var anx = ANEXO ? ANEXO.test.map(function (t) { var q = qMC(t.q, t.o, t.k, t.exp, 'lex'); q.part = 'Anexo · Arquitectura y negocios'; return q; }) : [];
    var items = base.concat(extra, cam, anx);
    if (semanal) {
      var prevDays = [];
      for (var x = Math.max(1, n - 6); x < n; x++) prevDays.push(dayData(x));
      items = items.concat(vocabQuestions(prevDays, 4)).concat(gramQuestions(prevDays, 3));
    }
    var wrap = el('<div></div>');
    var start = el('<button class="btn">Empezar test · ' + items.length + ' ítems (incluye formato Cambridge) · necesitas 70 %</button>');
    var soloIngles = CUPO_ES[L.id] === 0;
    host.appendChild(el('<p class="small dim">Formato de examen del nivel <b>' + L.id + '</b>: ' +
      (soloIngles ? '<b>todo en inglés</b>, como en el C1 Advanced real. Aquí ya no hay preguntas con apoyo en español.'
       : CUPO_ES[L.id] < 1 ? 'mayoría de preguntas <b>en inglés</b>. De las que traían apoyo en español solo se conserva ' +
           (CUPO_ES[L.id] >= 0.6 ? 'dos de cada tres' : 'una de cada cuatro') + '; el resto se sustituye por ítems en inglés.'
       : 'con apoyo en español, que a este nivel ayuda más de lo que estorba.') +
      (aj.cambiados ? ' Hoy se han generado <b>' + aj.cambiados + '</b> ítems en inglés con las frases de este día.' : '') + '</p>'));
    host.appendChild(start); host.appendChild(wrap);
    start.onclick = function () {
      start.remove();
      runTest(wrap, shuffle(items), { min: 70, pasoTxt: 'Día completado' }, function (pct, pass, foot) {
        st.pct = Math.max(st.pct || 0, pct);
        S.hist.push({ f: hoy(), dia: n, pct: pct });
        if (pass && !st.fin) { st.fin = true; S.fechas[hoy()] = (S.fechas[hoy()] || 0) + 1; done(); S.ses++; }
        else if (pass) { done(); }
        save(); renderFinish();
        if (pass && n < tramo(n)[1]) {
          var nx = el('<button class="btn">Siguiente día →</button>');
          nx.onclick = function () { go('dia', n + 1); };
          foot.appendChild(nx);
        }
      });
    };
  }

  renderFinish();
  function renderFinish() {
    var f = document.getElementById('finish');
    if (!f) return;
    if (st.fin) {
      f.innerHTML = '<div class="row between"><b class="ok-t">✔ ' + etiquetaDia(n) + ' completado · ' + st.pct + '%</b><div class="row" id="fr"></div></div>';
      var r = f.querySelector('#fr');
      var b1x = el('<button class="btn sec small">Panel</button>'); b1x.onclick = function () { go('home'); }; r.appendChild(b1x);
      var b0 = el('<button class="btn sec small">Ver mi progreso</button>'); b0.onclick = function () { go('progreso'); }; r.appendChild(b0);
      if (n < tramo(n)[1]) { var b2x = el('<button class="btn small">' + etiquetaDia(n + 1) + ' →</button>'); b2x.onclick = function () { go('dia', n + 1); }; r.appendChild(b2x); }
      if (k === 30) { var b3x = el('<button class="btn small">Examen ' + L.id + ' →</button>'); b3x.onclick = function () { go('examen', L.id); }; r.appendChild(b3x); }
      if (n === TOTAL) { var b4x = el('<button class="btn small">Empezar el itinerario A2 →</button>'); b4x.onclick = function () { go('dia', siguiente(1)); }; r.appendChild(b4x); }
    } else {
      f.innerHTML = '<p class="dim small">Termina los siete bloques y aprueba el test del día (≥ 70 %) para desbloquear el día siguiente.</p>';
    }
  }
}

// Botón 🎤 del shadowing: si ya está grabando, corta; si no, escucha una vez.
function listen(target, row, btn) {
  if (!MIC.hay()) { if (!row.querySelector('.nosr')) row.appendChild(el('<span class="small dim nosr">Reconocimiento de voz no disponible (usa Chrome o Edge).</span>')); return; }
  if (MIC.grabando()) { MIC.stop(); return; }
  var viejo = row.querySelector('.fb'); if (viejo) viejo.remove();
  btn.textContent = '■'; btn.title = 'Pulsa cuando termines';
  MIC.start({
    onError: function (m) {
      var v = row.querySelector('.fb'); if (v) v.remove();
      row.appendChild(el('<div class="fb bad" style="width:100%">' + esc(m) + '</div>'));
    },
    onFin: function (said) {
      btn.textContent = '🎤'; btn.title = 'Grabar y comparar';
      if (!norm(said)) return;
      var a = norm(said).split(' '), b = norm(target).split(' ');
      var hit = b.filter(function (w) { return a.indexOf(w) >= 0; }).length;
      var pct = Math.round(hit / b.length * 100);
      var v = row.querySelector('.fb'); if (v) v.remove();
      row.appendChild(el('<div class="fb ' + (pct >= 75 ? 'ok' : 'bad') + '" style="width:100%">Te he oído: “' + esc(said.trim()) + '” · ' + pct + '% de coincidencia</div>'));
    }
  });
}

var clockIv = null;
function startClock() {
  clearInterval(clockIv);
  var s = 3600;
  clockIv = setInterval(function () {
    var c = document.getElementById('clock');
    if (!c) { clearInterval(clockIv); return; }
    s--;
    c.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    if (s <= 0) { clearInterval(clockIv); c.textContent = '¡Hora completada!'; }
  }, 1000);
}

// ---------- chrome ----------
document.querySelectorAll('.tab[data-go]').forEach(function (b) { b.onclick = function () { go(b.dataset.go); }; });
document.getElementById('cfgBtn').onclick = function () { document.getElementById('cfg').classList.toggle('hidden'); };
document.getElementById('voiceSel').onchange = function (e) { voice = voices[e.target.value]; S.voz = voice ? voice.name : ''; save(); };
document.getElementById('rate').oninput = function (e) { S.rate = parseFloat(e.target.value); document.getElementById('rateV').textContent = S.rate.toFixed(2); save(); };
document.getElementById('autoplay').onchange = function (e) { S.auto = e.target.checked; save(); };
document.getElementById('testVoice').onclick = function () { speak('This is your English voice. Listen, repeat, and speak along with me.'); };
document.getElementById('rate').value = S.rate;
document.getElementById('rateV').textContent = Number(S.rate).toFixed(2);
document.getElementById('autoplay').checked = !!S.auto;
document.getElementById('exportBtn').onclick = function () { vTransferir(); };

// ---------- traslado de progreso entre direcciones ----------
function vTransferir() {
  stopAudio();
  var done = doneDays().length;
  app.innerHTML = '<h1>Trasladar tu progreso</h1>' +
    '<p class="dim">El progreso se guarda en el navegador y va asociado a la dirección web. Si abres el curso en otra dirección —por ejemplo para poder usar el micrófono— empieza vacío. Con este código lo llevas de una a otra sin perder nada.</p>' +
    '<div class="card"><h3>1 · Copia el código de esta dirección</h3>' +
    '<p class="small dim">Contiene tus ' + done + ' días completados, ' + Object.keys(S.srs).length + ' tarjetas de vocabulario, notas, textos y resultados.</p>' +
    '<textarea id="tOut" readonly style="min-height:120px;font-family:var(--mono);font-size:12px"></textarea>' +
    '<div class="row" style="margin-top:10px"><button class="btn" id="tCopy">Copiar código</button>' +
    '<button class="btn sec" id="tFile">Descargar como archivo</button><span class="small dim" id="tMsg"></span></div></div>' +
    '<div class="card"><h3>2 · Pégalo en la otra dirección</h3>' +
    '<p class="small dim">Abre el curso en la dirección nueva, entra aquí otra vez y pega el código en este recuadro. <b>Sustituye</b> el progreso de esa dirección por el que traes.</p>' +
    '<textarea id="tIn" placeholder="Pega aquí el código copiado…" style="min-height:120px;font-family:var(--mono);font-size:12px"></textarea>' +
    '<div class="row" style="margin-top:10px"><button class="btn" id="tPaste">Restaurar progreso</button>' +
    '<button class="btn sec" id="tImp">Cargar desde archivo</button><span class="small dim" id="tMsg2"></span></div></div>' +
    '<div class="card"><h3>Micrófono</h3><p class="small dim">El reconocimiento de voz —la prueba oral y el botón 🎤 del shadowing— necesita permiso de micrófono, y eso solo lo concede un navegador con la página abierta en su propia pestaña, con Chrome o Edge. Dentro de un visor incrustado no funciona nunca, por seguridad del navegador. Todo lo demás del curso sí funciona en cualquier sitio.</p></div>' +
    '<div class="row"><button class="btn sec" id="tBack">Volver al panel</button></div>';
  var out = document.getElementById('tOut');
  out.value = JSON.stringify(S);
  document.getElementById('tCopy').onclick = function () {
    var m = document.getElementById('tMsg');
    out.select(); out.setSelectionRange(0, 999999);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out.value).then(function () { m.textContent = '✔ Copiado'; m.className = 'small ok-t'; })
        ['catch'](function () { m.textContent = ok ? '✔ Copiado' : 'Selecciona el texto y copia con Ctrl+C'; m.className = 'small ' + (ok ? 'ok-t' : 'dim'); });
    } else { m.textContent = ok ? '✔ Copiado' : 'Selecciona el texto y copia con Ctrl+C'; m.className = 'small ' + (ok ? 'ok-t' : 'dim'); }
  };
  document.getElementById('tFile').onclick = function () {
    var json = JSON.stringify(S);
    function fallback() {
      var a = document.createElement('a');
      a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
      a.download = 'progreso-ingles.json'; a.click();
    }
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then(function (d) {
        if (!d) { fallback(); return; }
        d.save({ filename: 'progreso-ingles.json', data: json })['catch'](function (e) {
          if (e && e.code === 'declined') return;
          document.getElementById('tMsg').textContent = 'Usa el botón de copiar en su lugar.';
        });
      })['catch'](fallback);
    } else { fallback(); }
  };
  document.getElementById('tPaste').onclick = function () {
    var m = document.getElementById('tMsg2');
    var txt = document.getElementById('tIn').value.trim();
    if (!txt) { m.textContent = 'Pega primero el código.'; m.className = 'small bad-t'; return; }
    var o;
    try { o = JSON.parse(txt); } catch (e) { m.textContent = 'El código no es válido: cópialo entero, de principio a fin.'; m.className = 'small bad-t'; return; }
    if (!o || typeof o !== 'object' || !o.dias) { m.textContent = 'Ese código no es un progreso del curso.'; m.className = 'small bad-t'; return; }
    var n = Object.keys(o.dias).filter(function (k) { return o.dias[k].fin; }).length;
    if (!confirm('Vas a sustituir el progreso de esta dirección por uno con ' + n + ' días completados. ¿Continuar?')) return;
    S = o; save();
    m.textContent = '✔ Progreso restaurado: ' + n + ' días.'; m.className = 'small ok-t';
    setTimeout(function () { go('home'); route(); }, 900);
  };
  document.getElementById('tImp').onclick = function () { document.getElementById('importBtn').click(); };
  document.getElementById('tBack').onclick = function () { go('home'); };
}
document.getElementById('importBtn').onclick = function () {
  var i = document.createElement('input'); i.type = 'file'; i.accept = '.json';
  i.onchange = function () {
    var f = i.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () { try { S = JSON.parse(rd.result); save(); route(); } catch (e) { alert('Archivo no válido'); } };
    rd.readAsText(f);
  };
  i.click();
};
document.getElementById('resetBtn').onclick = function () {
  if (confirm('¿Borrar todo el progreso? No se puede deshacer.')) { localStorage.removeItem(KEY); S = load(); go('home'); route(); }
};

if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
route();
})();
