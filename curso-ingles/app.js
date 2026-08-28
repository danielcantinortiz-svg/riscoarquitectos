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
function speak(text, opt) {
  if (!window.speechSynthesis) return;
  opt = opt || {};
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, ' blank '));
  if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-GB'; }
  u.rate = opt.rate || S.rate; u.pitch = 1;
  if (opt.onend) u.onend = opt.onend;
  speechSynthesis.speak(u);
}
function speakSeq(list, rate) { var i = 0; (function nx() { if (i >= list.length) return; speak(list[i++], { rate: rate, onend: nx }); })(); }
function stopAudio() { if (window.speechSynthesis) speechSynthesis.cancel(); }

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
  var h = location.hash.replace('#', '') || 'home';
  var p = h.split('/');
  document.querySelectorAll('.tab[data-go]').forEach(function (b) { b.classList.toggle('on', b.dataset.go === p[0]); });
  window.scrollTo(0, 0);
  ({ home: vHome, plan: vPlan, repaso: vRepaso, progreso: vProgreso, oral: vOral, verbos: vVerbos, derivadas: vDerivadas, gimnasio: vGimnasio, examenes: vExamenes, dia: vDia, examen: vExamen, simulacro: vSimulacro }[p[0]] || vHome)(p[1]);
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
      q.appendChild(el('<div class="qt">' + it.q + '</div>'));
      it.o.forEach(function (o, oi) {
        var b = el('<button class="opt">' + esc(o) + '</button>');
        b.onclick = function () {
          q.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var ok = oi === it.k;
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) q.querySelectorAll('.opt')[it.k].classList.add('ok');
          q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ Correcto.' : '✖ La respuesta es: ' + esc(it.o[it.k])) + (it.exp ? ' <span class="dim">' + esc(it.exp) + '</span>' : '') + '</div>'));
          if (it.exp) speak(it.exp);
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
      var msg = ok ? '✔ Correcto.' : '✖ Solución: <b>' + esc(it.t === 'dic' ? it.s : it.t === 'tr' ? it.en : it.a) + '</b>' + (lenBad ? ' <span class="dim">(tu respuesta tenía ' + words + ' palabras)</span>' : '');
      q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + msg + '</div>'));
      if (it.t === 'dic' || it.t === 'tr') speak(it.t === 'dic' ? it.s : it.en);
      next(ok, it);
    };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') send.click(); });
    q.appendChild(send);
    if (audio) speak(audio);
    setTimeout(function () { inp.focus(); }, 60);
  }
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
var ERRORES = [
  [/\bi am agree\b/i, 'I am agree → <b>I agree</b>'],
  [/\bi (have|had) \d+ years\b/i, 'I have X years → <b>I am X (years old)</b>'],
  [/\b(the )?people (is|was|has)\b/i, 'people is → <b>people are</b>'],
  [/\b(explain|say|suggest)\s+(me|him|her|us|them)\b/i, 'explain me → <b>explain it to me</b> (say/suggest tampoco llevan persona directa)'],
  [/\b(informations|advices|furnitures|knowledges|equipments|softwares)\b/i, 'sustantivo incontable en plural → <b>information, advice, furniture…</b>'],
  [/\bdepend(s|ed)? (of|in)\b/i, 'depend of → <b>depend on</b>'],
  [/\bsince (\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few) (years|months|days|weeks|hours)\b/i, 'since + duración → <b>for</b> + duración (since se usa con un punto de partida: since 2019, since Monday)'],
  [/\b(childs|mans|womans|peoples|feets|toothes|persons and)\b/i, 'plural irregular mal formado → <b>children, men, women, people, feet, teeth</b>'],
  [/\b(a|an|the) (advice|information|news|furniture|homework)\b/i, 'incontable con artículo indefinido → <b>a piece of advice / some information</b>'],
  [/\bhave (seen|been|done|gone|made|had|finished|worked|visited|eaten) [^.]*\b(yesterday|last (week|year|month|night)|ago|in \d{4})\b/i, 'present perfect con marcador de pasado cerrado → usa <b>past simple</b>'],
  [/\bassist(ed)? to\b/i, 'assist to → <b>attend</b>'],
  [/\bdespite of\b/i, 'despite of → <b>despite</b> / <b>in spite of</b>'],
  [/\b(more|most) (easy|big|good|bad|cheap|fast|happy|simple|early)\b/i, 'more easy → <b>easier</b> (adjetivo corto: -er / -est)'],
  [/\bmore better\b/i, 'more better → <b>better</b>'],
  [/\b(am|is|are|was|were) used to \w+(?<!ing)\b(?! \w+ing)/i, 'be used to + <b>-ing</b> (I am used to work<b>ing</b>)'],
  [/(^|\. )(Is|Are|Was|Were) (very|a |the |not )/i, 'falta el sujeto: <b>It is…</b> (el inglés nunca omite el sujeto)'],
  [/\bin the actuality\b|\bactually,? (i|we) (live|work|study)\b/i, '"actually" no es "actualmente" → <b>currently / at the moment</b>'],
  [/\bfor to \w+/i, 'for to do → <b>to do</b>'],
  [/\bi\s+(think|believe|hope)\s+that\s+yes\b/i, 'I think that yes → <b>I think so</b>'],
  [/\bdo(n't| not) know nothing\b|\bdo(n't| not) have nothing\b/i, 'doble negación → <b>do not know anything</b> / <b>know nothing</b>'],
  [/\bhe\s+(have|do|go|work|live|want|need|make|take|say|think|like|know)\b|\bshe\s+(have|do|go|work|live|want|need|make|take|say|think|like|know)\b/i, 'tercera persona sin -s → <b>he has, she goes, it works…</b>'],
  [/\bthe next week\b|\bthe last year\b/i, 'the next week → <b>next week</b> (sin artículo)']
];
function evalEscrito(text, D) {
  var t = String(text || '').trim();
  var words = t ? t.split(/\s+/).length : 0;
  var sents = t.split(/[.!?]+/).filter(function (s) { return s.trim().length > 2; });
  var avg = sents.length ? Math.round(words / sents.length) : 0;
  var toks = norm(t).split(' ').filter(Boolean);
  var uniq = {}; toks.forEach(function (w) { uniq[w] = 1; });
  var ttr = toks.length ? Math.round(Object.keys(uniq).length / toks.length * 100) : 0;
  var errs = [];
  ERRORES.forEach(function (r) { try { if (r[0].test(t)) errs.push(r[1]); } catch (e) {} });
  var lt = t.toLowerCase();
  var chunksUsed = (D && D.chunks || []).filter(function (c) {
    var core = norm(c).split(' ').slice(0, 4).join(' ');
    return core.length > 6 && lt.indexOf(core) >= 0;
  });
  var vocabUsed = (D && D.vocab || []).map(vparts).filter(function (v) { return lt.indexOf(v.w.toLowerCase()) >= 0; });
  var score = 0;
  score += Math.min(30, Math.round(words / 90 * 30));          // extensión
  score += Math.min(20, Math.round(ttr / 60 * 20));            // riqueza léxica
  score += avg >= 12 && avg <= 24 ? 15 : avg >= 8 ? 9 : 4;     // madurez sintáctica
  score += Math.min(12, vocabUsed.length * 3);                 // vocabulario del día
  score += Math.min(8, chunksUsed.length * 4);                 // chunks del día
  score += errs.length ? -7 * errs.length : 15;                // corrección
  score = Math.max(0, Math.min(100, score));
  return { words: words, sents: sents.length, avg: avg, ttr: ttr, errs: errs, chunks: chunksUsed, vocab: vocabUsed, score: score };
}
function escritoHtml(r) {
  var h = '<div class="metrics">' +
    metric(r.words, 'palabras') + metric(r.sents, 'frases') + metric(r.avg, 'palabras/frase') +
    metric(r.ttr + '%', 'riqueza léxica') + metric(r.vocab.length, 'del vocabulario') + metric(r.chunks.length, 'chunks del día') +
    '</div>';
  h += '<div class="row between" style="margin-top:12px"><b>Puntuación de escritura</b><span class="score sm ' + (r.score >= 70 ? 'ok-t' : r.score >= 50 ? '' : 'bad-t') + '">' + r.score + '</span></div>';
  h += '<div class="bar"><i style="width:' + r.score + '%"></i></div>';
  if (r.errs.length) {
    h += '<h3>Errores detectados (' + r.errs.length + ')</h3><ul class="errs">' + r.errs.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>';
  } else if (r.words > 20) {
    h += '<p class="ok-t small" style="margin-top:10px">✔ Ningún error típico de hispanohablante detectado.</p>';
  }
  if (r.vocab.length) h += '<p class="small dim">Vocabulario del día usado: ' + r.vocab.map(function (v) { return esc(v.w); }).join(', ') + '</p>';
  h += '<p class="small dim">El detector cubre los veinte errores fosilizados más frecuentes; no sustituye a una corrección humana.</p>';
  return h;
}
function metric(v, l) { return '<div class="met"><b>' + v + '</b><span>' + l + '</span></div>'; }

// ---------- gráficos (una sola serie · sin color categórico) ----------
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
    '<p class="small dim">La destreza más baja es la que decide tu nivel real. Si «Comprensión oral» va por debajo del resto, alarga el bloque 2 y baja la velocidad del audio antes que estudiar más gramática.</p></div>';

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
  return null;
}

function vGimnasio(arg) {
  var h = '<h1>Gimnasio</h1>' +
    '<p class="dim">Series cortas y con corrección inmediata para lo que no se aprende leyendo: conectores, ' +
    'adjetivos, preposiciones, derivadas y orden de palabras. Cada partida dura entre uno y tres minutos, ' +
    'que es justo lo que aguanta la atención con este tipo de material.</p>' + panelFlojo() +
    '<div class="card"><h2 style="margin-top:0">⏱ Parejas contrarreloj</h2>' +
    '<p class="dim small">Doce parejas. Pincha una de la izquierda y su pareja de la derecha. El reloj corre y cada fallo suma cinco segundos. Es el ejercicio que más rápido crea la asociación.</p>' +
    '<p class="dim small">Cada palabra inglesa <b>se pronuncia al pulsarla</b>, así que oyes las doce mientras juegas, y el enlace <b>es</b> de al lado la traduce por si hace falta. Al terminar tienes las doce parejas juntas para repasarlas.</p>' +
    '<div class="row"><button class="btn" data-par="derivadas">Derivadas</button>' +
    '<button class="btn" data-par="conectores">Conectores</button>' +
    '<button class="btn" data-par="adjetivos">Adjetivos y contrarios</button></div><div id="gpar"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">🧩 Ordena la frase</h2>' +
    '<p class="dim small">Las palabras salen desordenadas y hay que colocarlas. Entrena las cinco reglas de orden que el español coloca al revés.</p>' +
    '<div class="row">' + (GYM.orden.grupos || []).map(function (G, i) {
      return '<button class="btn sec small" data-ord="' + i + '">' + esc(G.t.split('·')[0].trim()) + '</button>';
    }).join('') + '<button class="btn small" data-ord="adj">Varios adjetivos seguidos</button></div><div id="gord"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">🎯 ¿Cuál encaja?</h2>' +
    '<p class="dim small">Un hueco y tres candidatos. Al responder te dice <b>por qué</b> es ese y no el otro, que es lo que hace que la próxima vez lo aciertes.</p>' +
    '<div class="row"><button class="btn" data-hue="conectores">Conectores</button>' +
    '<button class="btn" data-hue="prepos">Preposiciones</button>' +
    '<button class="btn" data-hue="cantidad">much / many</button>' +
    '<button class="btn sec" data-hue="todo">Mezcla de todo</button></div><div id="ghue"></div></div>' +
    '<div class="card"><h2 style="margin-top:0">⚡ Velocidad · 60 segundos</h2>' +
    '<p class="dim small">Sesenta segundos, las que puedas. Sin explicaciones y sin pensar: aquí se entrena el automatismo, no el análisis.</p>' +
    '<div class="row"><button class="btn" data-vel="1">Empezar</button></div><div id="gvel"></div></div>';
  app.innerHTML = h;
  app.querySelectorAll('[data-par]').forEach(function (b) { b.onclick = function () { juegoParejas(b.dataset.par); }; });
  app.querySelectorAll('[data-ord]').forEach(function (b) { b.onclick = function () { juegoOrden(b.dataset.ord); }; });
  app.querySelectorAll('[data-hue]').forEach(function (b) { b.onclick = function () { juegoHuecos(b.dataset.hue); }; });
  app.querySelectorAll('[data-vel]').forEach(function (b) { b.onclick = function () { juegoVelocidad(); }; });
  if (arg) {
    var pa = String(arg).split('-'), resto = pa.slice(1).join('-');
    if (pa[0] === 'par') juegoParejas(resto);
    else if (pa[0] === 'hue') juegoHuecos(resto);
    else if (pa[0] === 'ord') juegoOrden(resto);
    else if (pa[0] === 'vel') juegoVelocidad();
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
    if (ingles) f.appendChild(el(trad(txt).replace('>translate<', '>es<')));
    return f;
  }
  function ficha(txt, clave, esIzq, ingles) {
    var b = el('<button class="ficha' + (ingles ? ' en' : '') + '"' +
      (ingles ? ' title="Pulsa para oírla"' : '') + '>' + esc(txt) + '</button>');
    b.dataset.k = clave;
    b.onclick = function () {
      if (b.classList.contains('hecha')) return;
      if (ingles) speak(txt);   // se pronuncia siempre que la palabra esté en inglés
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
      '<p class="small dim">Pulsa cualquier palabra en inglés para oírla otra vez, o «es» para traducirla.</p></div>';
    f.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
    var r = el('<div class="row"></div>');
    var b1 = el('<button class="btn small">Otra ronda</button>'); b1.onclick = function () { juegoParejas(id); };
    r.appendChild(b1); f.appendChild(r);
  }
  function celda(txt, ingles) {
    return ingles ? '<span class="en vb" data-say="' + esc(txt) + '" title="Escuchar">' + esc(txt) + '</span> ' + trad(txt).replace('>translate<', '>es<')
                  : esc(txt);
  }
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
        (ok ? '✔ Correcto.' : '✖ Era: <b class="en">' + esc(frase) + '</b>') + '</div>';
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
  var src = id === 'todo' ? [].concat(GYM.conectores.huecos, GYM.prepos.huecos, GYM.cantidad.huecos)
                          : (GYM[id] || {}).huecos || [];
  return src.map(function (l) {
    var p = l.split('|');
    var ops = shuffle([p[1], p[2], p[3]]);
    var q = qMC('Completa el hueco:<br>' + gapHtml(p[0]), ops, ops.indexOf(p[1]), p[4], 'gram');
    q.part = id === 'prepos' ? 'Preposiciones' : id === 'cantidad' ? 'much / many' : 'Conectores';
    return q;
  });
}
function juegoHuecos(id) {
  var items = pick(huecosDe(id), 12);
  var host = document.getElementById('ghue');
  host.innerHTML = '';
  runTest(host, items, { min: 75, pasoTxt: 'Bien: ya los eliges por la relación, no por la traducción' }, function (pct, pass, foot) {
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

// ---------- vista: palabras derivadas (word formation) ----------
function vDerivadas() {
  var h = '<h1>Palabras derivadas · word formation</h1>' +
    '<p class="dim">' + DRV.intro + '</p>' +
    '<div class="card"><h3>Cómo se resuelve el ejercicio</h3><ol>' +
    DRV.pasos.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol></div>' +
    '<div class="card"><div class="row between"><div><h3 style="margin:0">Practicar</h3>' +
    '<p class="small dim" style="margin:4px 0 0">Veinte huecos con el mismo formato del examen. Se corrigen al momento y te dice por qué.</p></div>' +
    '<div class="row"><button class="btn sec small" data-prac="familia">Solo -ing / -ed</button>' +
    '<button class="btn" data-prac="todo">Empezar práctica</button></div></div><div id="prac"></div></div>' +
    '<div class="card flat"><label class="small"><b>Buscar</b> ' +
    '<input id="dq" type="text" placeholder="una raíz o una terminación: RELAX, -ness, im-…" style="min-width:260px"></label>' +
    '<span class="dim small" id="dn" style="margin-left:10px"></span></div><div id="dlist"></div>';
  app.innerHTML = h;
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
          return '<tr><td><span class="mono">' + esc(p[0]) + '</span></td>' +
            '<td><b class="en vb" data-say="' + esc(p[1]) + '" title="Escuchar">' + esc(p[1]) + '</b> ' + trad(p[1]) + '</td>' +
            '<td class="dim small">' + esc(p[2]) + '</td>' +
            '<td><span class="en vb" data-say="' + esc(p[3]) + '" title="Escuchar la frase">' + esc(p[3]) + '</span> ' + trad(p[3]) + '</td></tr>';
        }).join('') + '</table></div></div>';
    }).join('');
    document.getElementById('dlist').innerHTML = out || '<div class="card"><p>Nada coincide con esa búsqueda.</p></div>';
    document.getElementById('dn').textContent = total + (total === 1 ? ' palabra' : ' palabras') + ' · pulsa el inglés para oírlo, «translate» para traducirlo';
    app.querySelectorAll('.vb').forEach(function (x) { x.onclick = function () { speak(x.dataset.say); }; });
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
            '<td class="en">' + esc(p[2]) + '</td><td class="en">' + esc(p[3]) + '</td>' +
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
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var h = '<h1>Prueba de expresión oral</h1>' +
    '<p class="dim">Dos minutos hablando sin parar. Se mide tu <b>fluidez</b> (palabras por minuto), tu <b>densidad léxica</b> (cuántas palabras distintas usas) y cuántas <b>estructuras objetivo del ' + etiquetaDia(n).toLowerCase() + '</b> te salen sin pensarlas.</p>';
  h += selectorDia(n);
  if (!SR) {
    app.innerHTML = h + '<div class="card"><p class="bad-t"><b>Tu navegador no permite reconocimiento de voz.</b></p><p>Necesitas Chrome o Edge de escritorio. Mientras tanto puedes hacer la prueba igual: habla dos minutos con el cronómetro y luego escribe de memoria lo que dijiste en el bloque de escritura.</p></div>';
    cablearSelector();
    return;
  }
  h += '<div class="card"><h3>Tu tarea</h3><p><b>' + esc(D.prod.habla) + '</b></p>' +
    '<p class="small dim">Estructuras que deberías intentar colocar:</p><ul class="errs">' +
    D.chunks.slice(0, 4).map(function (c) { return '<li class="en">' + esc(c) + '</li>'; }).join('') + '</ul>' +
    '<div class="row" style="margin-top:14px"><button class="btn" id="rec">● Empezar a grabar</button><span class="timer" id="ot">2:00</span><span class="dim small" id="ost"></span></div>' +
    '<div id="live" class="live en hidden"></div><div id="ores"></div></div>';
  app.innerHTML = h;
  cablearSelector();
  var yaHecho = (S.dias[n] || {}).oral;
  if (yaHecho) document.getElementById('ores').innerHTML =
    '<div class="note small">Ya hiciste la prueba oral de este día el <b>' + esc(yaHecho.f.split('-').reverse().join('/')) +
    '</b> con <b>' + yaHecho.score + '</b> puntos (banda ' + esc(yaHecho.band) + '). Puedes repetirla: se guarda la mejor marca.</div>';

  function cablearSelector() {
    var sel = document.getElementById('oralDia');
    if (sel) sel.onchange = function () { go('oral', sel.value); };
  }

  var r = new SR();
  r.lang = (voice && voice.lang) || 'en-GB';
  r.continuous = true; r.interimResults = true;
  var texto = '', running = false, t0 = 0, iv = null, secs = 120;
  var live = document.getElementById('live'), btn = document.getElementById('rec'), tm = document.getElementById('ot'), st = document.getElementById('ost');

  r.onresult = function (e) {
    var interim = '';
    for (var i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) texto += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    live.innerHTML = esc(texto) + '<span class="dim">' + esc(interim) + '</span>';
    live.scrollTop = live.scrollHeight;
  };
  r.onerror = function (e) { st.textContent = 'Error de micrófono: ' + e.error; };
  r.onend = function () { if (running) { try { r.start(); } catch (x) {} } };

  btn.onclick = function () {
    if (!running) {
      texto = ''; live.textContent = ''; live.classList.remove('hidden');
      document.getElementById('ores').innerHTML = '';
      running = true; t0 = Date.now(); secs = 120;
      btn.textContent = '■ Terminar'; btn.classList.add('rec'); st.textContent = 'Grabando… habla sin parar.';
      try { r.start(); } catch (x) {}
      iv = setInterval(function () {
        secs--; tm.textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
        if (secs <= 0) btn.click();
      }, 1000);
    } else {
      running = false; clearInterval(iv); try { r.stop(); } catch (x) {}
      btn.textContent = '● Empezar a grabar'; btn.classList.remove('rec'); st.textContent = '';
      finish(Math.max(20, Math.round((Date.now() - t0) / 1000)));
    }
  };

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

// ---------- vista: exámenes ----------
function vExamenes() {
  var h = '<h1>Exámenes y simulacros</h1>' +
    '<p class="dim">Dos cosas distintas. El <b>examen de nivel</b> son 40 ítems de Use of English para cerrar el mes (apto con 75 %). El <b>simulacro completo</b> reproduce el examen oficial de cada nivel con sus secciones de comprensión lectora larga, listening, writing y speaking.</p>' +
    '<div class="note small"><b>Aviso importante:</b> el examen oficial de cada nivel es distinto. A2 Key y B1 Preliminary no tienen word formation ni key word transformation; ese trabajo se hace aquí como <b>preparación hacia el B2 First</b>, que sí los incluye. Los simulacros, en cambio, siguen el formato real de cada examen: A2 Key, B1 Preliminary, B2 First y C1 Advanced.</div>';
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
      var r = evalEscrito(ta.value, D);
      if (r.words < 12) { res.innerHTML = '<div class="note">Escribe al menos doce palabras antes de evaluar.</div>'; return; }
      res.innerHTML = '<div class="card flat">' + escritoHtml(r) + '</div>';
      S.escr.push({ f: hoy(), dia: n, words: r.words, ttr: r.ttr, avg: r.avg, errs: r.errs.length, score: r.score, lista: r.errs });
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
    var base = (D.test || []).map(function (t) { return qMC(t.q, t.o, t.k, t.exp); });
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

function listen(target, row, btn) {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { if (!row.querySelector('.nosr')) row.appendChild(el('<span class="small dim nosr">Reconocimiento de voz no disponible (usa Chrome o Edge).</span>')); return; }
  var r = new SR(); r.lang = (voice && voice.lang) || 'en-GB'; r.interimResults = false; r.maxAlternatives = 1;
  btn.textContent = '●'; btn.disabled = true;
  r.onresult = function (e) {
    var said = e.results[0][0].transcript;
    var a = norm(said).split(' '), b = norm(target).split(' ');
    var hit = b.filter(function (w) { return a.indexOf(w) >= 0; }).length;
    var pct = Math.round(hit / b.length * 100);
    var old = row.querySelector('.fb'); if (old) old.remove();
    row.appendChild(el('<div class="fb ' + (pct >= 75 ? 'ok' : 'bad') + '" style="width:100%">Te he oído: “' + esc(said) + '” · ' + pct + '% de coincidencia</div>'));
  };
  r.onerror = function () { btn.textContent = '🎤'; btn.disabled = false; };
  r.onend = function () { btn.textContent = '🎤'; btn.disabled = false; };
  r.start();
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
