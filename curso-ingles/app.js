/* English Immersion A2 -> B2 · motor del curso
   - 90 días (3 niveles × 30), 60 min/día, 7 bloques
   - Audio con SpeechSynthesis (sin dependencias externas)
   - SRS Leitner + tests diarios, repasos semanales y examen de nivel
*/
(function () {
'use strict';

// ---------- datos ----------
var C = window.CURSO;
var LEVELS = [
  { id: 'A2', nom: 'A2 → A2+ · Consolidación', mes: 1, dias: window.DIAS_A2, meta: C.metas.A2 },
  { id: 'B1', nom: 'B1 · Autonomía', mes: 2, dias: window.DIAS_B1, meta: C.metas.B1 },
  { id: 'B2', nom: 'B2 · Fluidez', mes: 3, dias: window.DIAS_B2, meta: C.metas.B2 }
];
function lvlOf(n) { return LEVELS[Math.floor((n - 1) / 30)]; }          // n = 1..90
function dayData(n) { var L = lvlOf(n); return L.dias[(n - 1) % 30]; }

// ---------- estado ----------
var KEY = 'cursoEN.v1';
var S = load();
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) { var o = JSON.parse(raw); o.dias = o.dias || {}; o.srs = o.srs || {}; o.ex = o.ex || {}; return o; }
  } catch (e) {}
  return { dias: {}, srs: {}, ex: {}, ses: 0, voz: '', rate: 0.95, auto: true, inicio: hoy() };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function hoy() { return new Date().toISOString().slice(0, 10); }
function doneDays() { return Object.keys(S.dias).filter(function (k) { return S.dias[k].fin; }).map(Number); }
function maxDone() { var d = doneDays(); return d.length ? Math.max.apply(null, d) : 0; }
function unlocked(n) { return n <= maxDone() + 1; }

// ---------- audio ----------
var voices = [], voice = null;
function loadVoices() {
  voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(function (v) { return /^en/i.test(v.lang); });
  var sel = document.getElementById('voiceSel');
  sel.innerHTML = '';
  if (!voices.length) { sel.innerHTML = '<option>— sin voces inglesas —</option>'; return; }
  voices.forEach(function (v, i) {
    var o = document.createElement('option');
    o.value = i; o.textContent = v.name + ' (' + v.lang + ')';
    sel.appendChild(o);
  });
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
function speakSeq(list, rate) {
  var i = 0;
  (function next() {
    if (i >= list.length) return;
    speak(list[i++], { rate: rate, onend: next });
  })();
}
function stopAudio() { if (window.speechSynthesis) speechSynthesis.cancel(); }

// ---------- SRS (Leitner) ----------
var GAPS = [0, 1, 2, 4, 8, 16, 30];
function srsAdd(id, front, back, ex) {
  if (S.srs[id]) return;
  S.srs[id] = { f: front, b: back, e: ex || '', box: 1, due: S.ses + 1 };
}
function srsDue() {
  var out = [];
  for (var k in S.srs) if (S.srs[k].due <= S.ses) out.push(Object.assign({ id: k }, S.srs[k]));
  return out.sort(function (a, b) { return a.due - b.due; });
}
function srsGrade(id, ok) {
  var it = S.srs[id]; if (!it) return;
  it.box = ok ? Math.min(6, it.box + 1) : 1;
  it.due = S.ses + GAPS[it.box];
  save();
}

// ---------- utilidades ----------
function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function pick(a, n) { return shuffle(a).slice(0, n); }
function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9' ]/g, '').replace(/\s+/g, ' ').trim(); }
function vparts(v) { var p = v.split('|'); return { w: p[0], es: p[1], ex: p[2] || '' }; }
function spkBtn(text, rate) {
  var b = el('<button class="spk" title="Escuchar">▶</button>');
  b.onclick = function (e) { e.stopPropagation(); speak(text, { rate: rate }); };
  return b;
}

// ---------- router ----------
var app = document.getElementById('app');
function go(v, arg) {
  stopAudio();
  location.hash = arg != null ? v + '/' + arg : v;
}
window.addEventListener('hashchange', route);
function route() {
  var h = location.hash.replace('#', '') || 'home';
  var p = h.split('/');
  document.querySelectorAll('.tab[data-go]').forEach(function (b) { b.classList.toggle('on', b.dataset.go === p[0]); });
  app.scrollTop = 0; window.scrollTo(0, 0);
  ({ home: vHome, plan: vPlan, repaso: vRepaso, examenes: vExamenes, dia: vDia, examen: vExamen }[p[0]] || vHome)(p[1]);
}

// ---------- vista: panel ----------
function vHome() {
  var done = doneDays().length, next = Math.min(90, maxDone() + 1);
  var h = '<h1>Tu plan de 90 días</h1>' +
    '<p class="dim">Una hora al día. Del A2 al B2 en tres meses, un nivel por mes, con el orden natural de adquisición: <b>escuchar → imitar → entender → producir</b>.</p>' +
    '<div class="card"><div class="row between"><div><b>' + done + ' / 90</b> días completados <span class="dim small">· racha de vocabulario: ' + Object.keys(S.srs).length + ' palabras</span></div>' +
    '<button class="btn" id="cont">' + (done ? 'Continuar · Día ' + next : 'Empezar Día 1') + '</button></div>' +
    '<div class="bar" style="margin-top:12px"><i style="width:' + (done / 90 * 100).toFixed(1) + '%"></i></div></div>';

  LEVELS.forEach(function (L, li) {
    var d0 = li * 30, dn = doneDays().filter(function (n) { return n > d0 && n <= d0 + 30; }).length;
    var exk = 'exam' + L.id, ex = S.ex[exk];
    h += '<div class="card"><div class="row between"><h2 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> Mes ' + L.mes + ' · ' + L.nom + '</h2>' +
      '<span class="dim small">' + dn + '/30</span></div>' +
      '<p class="dim small">' + L.meta + '</p><div class="grid g5" id="g' + li + '"></div>' +
      '<div class="row" style="margin-top:12px">' +
      '<button class="btn sec small" data-ex="' + L.id + '"' + (dn < 30 ? ' disabled' : '') + '>Examen de nivel ' + L.id + '</button>' +
      (ex ? '<span class="small ' + (ex.pass ? 'ok-t' : 'bad-t') + '">' + (ex.pass ? '✔ APTO' : '✖ no superado') + ' · ' + ex.pct + '%</span>'
          : '<span class="small dim">' + (dn < 30 ? 'se desbloquea al terminar los 30 días' : 'listo para examinarte') + '</span>') +
      '</div></div>';
  });
  app.innerHTML = h;

  LEVELS.forEach(function (L, li) {
    var g = document.getElementById('g' + li);
    for (var i = 1; i <= 30; i++) {
      var n = li * 30 + i, st = S.dias[n];
      var cls = 'day' + (st && st.fin ? ' done' : '') + (n === next ? ' now' : '') + (unlocked(n) ? '' : ' lock');
      var b = el('<div class="' + cls + '"><b>' + i + '</b><span class="sc">' + (st && st.fin ? st.pct + '%' : (i % 7 === 0 ? 'repaso' : '')) + '</span></div>');
      if (unlocked(n)) b.onclick = (function (x) { return function () { go('dia', x); }; })(n);
      g.appendChild(b);
    }
  });
  document.getElementById('cont').onclick = function () { go('dia', next); };
  app.querySelectorAll('[data-ex]').forEach(function (b) { b.onclick = function () { go('examen', b.dataset.ex); }; });
}

// ---------- vista: método ----------
function vPlan() {
  var h = '<h1>El método</h1><p class="dim">' + C.metodo.intro + '</p>';
  h += '<div class="card"><h3>La hora, minuto a minuto</h3><div class="tablewrap"><table><tr><th>Bloque</th><th>Min</th><th>Qué hace tu cerebro</th></tr>';
  C.bloques.forEach(function (b, i) {
    h += '<tr><td><b>' + (i + 1) + '. ' + b.t + '</b></td><td>' + b.m + '</td><td class="dim">' + b.por + '</td></tr>';
  });
  h += '</table></div></div>';
  h += '<div class="card"><h3>Principios de adquisición</h3><ul>' +
    C.metodo.principios.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="card"><h3>Evaluación</h3><ul>' +
    '<li><b>Test diario</b> (10 ítems): necesitas ≥ 70 % para marcar el día como completado.</li>' +
    '<li><b>Repaso semanal</b>: los días 7, 14, 21 y 28 el bloque 1 se amplía con todo el vocabulario pendiente en el SRS.</li>' +
    '<li><b>Examen de nivel</b> (40 ítems: gramática, léxico, listening y traducción) al terminar cada mes. <b>≥ 75 % = APTO</b>.</li>' +
    '<li><b>SRS Leitner</b> de 6 cajas (1, 2, 4, 8, 16 y 30 sesiones) para que nada se olvide.</li></ul></div>';
  h += '<div class="card"><h3>Reglas de oro</h3><ul>' + C.metodo.reglas.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  app.innerHTML = h;
}

// ---------- vista: repaso SRS ----------
function vRepaso() {
  var due = srsDue();
  if (!due.length) {
    app.innerHTML = '<h1>Repaso</h1><div class="card"><p>No hay tarjetas pendientes ahora mismo. 🎉</p>' +
      '<p class="dim small">Tienes ' + Object.keys(S.srs).length + ' tarjetas en el sistema. Volverán a aparecer según su caja de repaso.</p></div>';
    return;
  }
  app.innerHTML = '<h1>Repaso · <span class="dim">' + due.length + ' tarjetas</span></h1><div id="fc"></div>';
  var i = 0;
  (function card() {
    var box = document.getElementById('fc');
    if (i >= due.length) { S.ses++; save(); box.innerHTML = '<div class="card"><p class="ok-t"><b>Repaso terminado.</b></p></div>'; return; }
    var it = due[i];
    box.innerHTML = '';
    var c = el('<div class="card"><div class="dim small">' + (i + 1) + ' / ' + due.length + ' · caja ' + it.box + '</div>' +
      '<h2 style="margin:.3em 0">' + esc(it.f) + '</h2><div id="rev" class="hidden"><p><b>' + esc(it.b) + '</b></p>' +
      (it.e ? '<p class="dim small"><i>' + esc(it.e) + '</i></p>' : '') + '</div>' +
      '<div class="row" style="margin-top:14px" id="acts"></div></div>');
    box.appendChild(c);
    c.insertBefore(spkBtn(it.f), c.querySelector('h2').nextSibling);
    var acts = c.querySelector('#acts');
    var showB = el('<button class="btn">Mostrar</button>');
    showB.onclick = function () {
      c.querySelector('#rev').classList.remove('hidden');
      acts.innerHTML = '';
      var bad = el('<button class="btn sec">No lo sabía</button>'), ok = el('<button class="btn">Lo sabía</button>');
      bad.onclick = function () { srsGrade(it.id, false); i++; card(); };
      ok.onclick = function () { srsGrade(it.id, true); i++; card(); };
      acts.appendChild(bad); acts.appendChild(ok);
      if (it.e) speak(it.e); else speak(it.f);
    };
    acts.appendChild(showB);
    if (S.auto) speak(it.f);
  })();
}

// ---------- vista: exámenes ----------
function vExamenes() {
  var h = '<h1>Exámenes de nivel</h1><p class="dim">Cuarenta ítems por examen: gramática, léxico, comprensión oral y traducción inversa. Necesitas <b>75 %</b> para dar el nivel por superado.</p>';
  LEVELS.forEach(function (L, li) {
    var dn = doneDays().filter(function (n) { return n > li * 30 && n <= li * 30 + 30; }).length;
    var ex = S.ex['exam' + L.id];
    h += '<div class="card"><div class="row between"><h2 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> Examen final del mes ' + L.mes + '</h2>' +
      '<button class="btn small" data-ex="' + L.id + '"' + (dn < 30 ? ' disabled' : '') + '>' + (ex ? 'Repetir' : 'Empezar') + '</button></div>' +
      '<p class="dim small">' + (dn < 30 ? 'Completa los 30 días del mes para desbloquearlo (' + dn + '/30).'
        : (ex ? 'Última nota: <b class="' + (ex.pass ? 'ok-t' : 'bad-t') + '">' + ex.pct + '%</b> · ' + ex.fecha : 'Disponible.')) + '</p></div>';
  });
  app.innerHTML = h;
  app.querySelectorAll('[data-ex]').forEach(function (b) { b.onclick = function () { go('examen', b.dataset.ex); }; });
}

// ---------- generador de preguntas ----------
function qMC(q, ops, k, exp) { return { t: 'mc', q: q, o: ops, k: k, exp: exp || '' }; }
function qDic(s) { return { t: 'dic', s: s }; }
function qTr(es, en) { return { t: 'tr', es: es, en: en }; }

function vocabQuestions(days, n) {
  // léxico: elige la traducción correcta, con distractores del mismo nivel
  var all = [];
  days.forEach(function (d) { d.vocab.forEach(function (v) { all.push(vparts(v)); }); });
  return pick(all, n).map(function (v) {
    var wrong = pick(all.filter(function (x) { return x.es !== v.es; }), 3).map(function (x) { return x.es; });
    var ops = shuffle([v.es].concat(wrong));
    return qMC('<b>' + esc(v.w) + '</b> significa…', ops, ops.indexOf(v.es), v.ex);
  });
}
function gramQuestions(days, n) {
  var all = [];
  days.forEach(function (d) { (d.test || []).forEach(function (t) { if (t.o) all.push(t); }); });
  return pick(all, n).map(function (t) { return qMC(t.q, t.o, t.k, t.exp); });
}
function dicQuestions(days, n) {
  var all = [];
  days.forEach(function (d) { d.chunks.forEach(function (c) { all.push(c); }); });
  return pick(all, n).map(qDic);
}
function trQuestions(days, n) {
  var all = [];
  days.forEach(function (d) { if (d.prod && d.prod.tr) all.push(d.prod.tr); });
  return pick(all, n).map(function (p) { return qTr(p[0], p[1]); });
}

// ---------- motor de test ----------
function runTest(host, items, opts, done) {
  opts = opts || {};
  var i = 0, aciertos = 0, fallos = [];
  host.innerHTML = '<div id="tq"></div>';
  var box = host.querySelector('#tq');
  paint();

  function head() { return '<div class="dim small">Pregunta ' + (i + 1) + ' de ' + items.length + '</div>'; }
  function next(ok, item) {
    if (ok) aciertos++; else fallos.push(item);
    i++;
    setTimeout(function () { i < items.length ? paint() : end(); }, ok ? 550 : 1500);
  }
  function end() {
    stopAudio();
    var pct = Math.round(aciertos / items.length * 100);
    var pass = pct >= (opts.min || 70);
    box.innerHTML = '<div class="card" style="text-align:center"><div class="score ' + (pass ? 'ok-t' : 'bad-t') + '">' + pct + '%</div>' +
      '<p>' + aciertos + ' de ' + items.length + ' correctas · ' + (pass ? '<b class="ok-t">' + (opts.pasoTxt || 'Superado') + '</b>' : '<b class="bad-t">Repite el bloque y vuelve a intentarlo</b>') + '</p>' +
      (fallos.length ? '<div style="text-align:left"><h3>Para repasar</h3>' + fallos.map(function (f) {
        return '<div class="small dim">• ' + esc(f.t === 'dic' ? f.s : f.t === 'tr' ? f.en : (f.q + ' → ' + f.o[f.k]).replace(/<[^>]+>/g, '')) + '</div>';
      }).join('') + '</div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:14px" id="tend"></div></div>';
    var again = el('<button class="btn sec">Repetir test</button>');
    again.onclick = function () { runTest(host, shuffle(items), opts, done); };
    box.querySelector('#tend').appendChild(again);
    done && done(pct, pass, box.querySelector('#tend'));
  }

  function paint() {
    var it = items[i];
    box.innerHTML = '';
    var c = el('<div class="card">' + head() + '<div id="qq"></div></div>');
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
    } else if (it.t === 'dic') {
      q.appendChild(el('<div class="qt">Escucha y escribe la frase exacta (dictado)</div>'));
      var rowd = el('<div class="row" style="margin:8px 0"></div>');
      rowd.appendChild(spkBtn(it.s));
      var slow = el('<button class="btn sec small">Más despacio</button>');
      slow.onclick = function () { speak(it.s, { rate: 0.65 }); };
      rowd.appendChild(slow);
      q.appendChild(rowd);
      var inp = el('<input type="text" placeholder="Escribe lo que oyes…" autocomplete="off" spellcheck="false">');
      q.appendChild(inp);
      var send = el('<button class="btn small" style="margin-top:10px">Comprobar</button>');
      send.onclick = function () {
        var ok = norm(inp.value) === norm(it.s);
        inp.disabled = true; send.disabled = true;
        q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ Exacto.' : '✖ Era: <b>' + esc(it.s) + '</b>') + '</div>'));
        next(ok, it);
      };
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') send.click(); });
      q.appendChild(send);
      speak(it.s);
      setTimeout(function () { inp.focus(); }, 60);
    } else if (it.t === 'tr') {
      q.appendChild(el('<div class="qt">Traduce al inglés: <i>' + esc(it.es) + '</i></div>'));
      var inp2 = el('<input type="text" placeholder="En inglés…" autocomplete="off" spellcheck="false">');
      q.appendChild(inp2);
      var s2 = el('<button class="btn small" style="margin-top:10px">Comprobar</button>');
      s2.onclick = function () {
        var ok = norm(inp2.value) === norm(it.en);
        inp2.disabled = true; s2.disabled = true;
        q.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ Perfecto.' : '✖ Modelo: <b>' + esc(it.en) + '</b>') + '</div>'));
        speak(it.en);
        next(ok, it);
      };
      inp2.addEventListener('keydown', function (e) { if (e.key === 'Enter') s2.click(); });
      q.appendChild(s2);
      setTimeout(function () { inp2.focus(); }, 60);
    }
  }
}

// ---------- vista: examen de nivel ----------
function vExamen(id) {
  var L = LEVELS.filter(function (x) { return x.id === id; })[0];
  if (!L) return go('home');
  var items = shuffle([]
    .concat(gramQuestions(L.dias, 16))
    .concat(vocabQuestions(L.dias, 12))
    .concat(dicQuestions(L.dias, 6))
    .concat(trQuestions(L.dias, 6)));
  app.innerHTML = '<h1><span class="pill ' + id.toLowerCase() + '">' + id + '</span> Examen de nivel</h1>' +
    '<p class="dim">40 ítems · sin límite de tiempo · apto con 75 %.</p><div id="host"></div>';
  runTest(document.getElementById('host'), items, { min: 75, pasoTxt: 'APTO · nivel ' + id + ' superado' }, function (pct, pass, foot) {
    S.ex['exam' + id] = { pct: pct, pass: pass, fecha: hoy() }; S.ses++; save();
    var b = el('<button class="btn">Volver al panel</button>');
    b.onclick = function () { go('home'); };
    foot.appendChild(b);
  });
}

// ---------- vista: día ----------
function vDia(nStr) {
  var n = parseInt(nStr, 10);
  if (!n || n < 1 || n > 90 || !unlocked(n)) return go('home');
  var L = lvlOf(n), D = dayData(n), k = ((n - 1) % 30) + 1;
  var st = S.dias[n] = S.dias[n] || { fin: false, pct: 0, blk: {} };
  var semanal = k % 7 === 0;

  app.innerHTML = '<div class="row between"><h1 style="margin:0"><span class="pill ' + L.id.toLowerCase() + '">' + L.id + '</span> Día ' + n +
    ' <span class="dim">· ' + esc(D.tema) + '</span></h1><div class="timer" id="clock">60:00</div></div>' +
    '<p class="dim">🎯 ' + esc(D.objetivo) + (semanal ? ' <b>· Hoy es día de repaso semanal.</b>' : '') + '</p>' +
    '<div id="blocks"></div>' +
    '<div class="card" id="finish"></div>';
  startClock();

  var B = document.getElementById('blocks');
  var blocks = [
    { t: 'Calentamiento y repaso', m: semanal ? 12 : 6, f: b1 },
    { t: 'Input: escucha a ciegas', m: 8, f: b2 },
    { t: 'Texto y vocabulario', m: 10, f: b3 },
    { t: 'Shadowing y pronunciación', m: 10, f: b4 },
    { t: 'Gramática inductiva', m: semanal ? 6 : 8, f: b5 },
    { t: 'Producción: hablar y escribir', m: 10, f: b6 },
    { t: 'Test del día', m: 8, f: b7 }
  ];
  blocks.forEach(function (b, i) {
    var d = el('<details class="blk' + (st.blk[i] ? ' ok' : '') + '"' + (i === 0 ? ' open' : '') + '>' +
      '<summary><span class="num">' + (st.blk[i] ? '✔' : i + 1) + '</span> ' + b.t + '<span class="min">' + b.m + ' min</span></summary>' +
      '<div class="body"></div></details>');
    B.appendChild(d);
    b.f(d.querySelector('.body'), D, n, function () { markBlk(d, i); });
  });

  function markBlk(d, i) { st.blk[i] = true; d.classList.add('ok'); d.querySelector('.num').textContent = '✔'; save(); }

  // --- bloque 1: repaso
  function b1(host, D, n, done) {
    var due = srsDue();
    host.innerHTML = '<p class="dim small">Antes de meter nada nuevo, recupera lo viejo. La recuperación activa —no la relectura— es lo que fija la memoria.</p>';
    var row = el('<div class="row"></div>');
    if (due.length) {
      host.appendChild(el('<p><b>' + due.length + '</b> tarjetas pendientes' + (semanal ? ' · <b>repaso semanal ampliado</b>' : '') + '.</p>'));
      var goB = el('<button class="btn">Repasar ahora</button>');
      goB.onclick = function () { go('repaso'); };
      row.appendChild(goB);
    } else {
      host.appendChild(el('<p class="ok-t">Sin tarjetas pendientes. Calienta el oído con las frases de ayer.</p>'));
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

  // --- bloque 2: escucha a ciegas
  function b2(host, D, n, done) {
    host.innerHTML = '<p class="dim small">Escucha el diálogo <b>sin leer</b>, dos veces. No pasa nada si no lo entiendes todo: tu oído está construyendo el mapa de sonidos. Luego responde.</p>';
    var lines = D.dial.l.map(function (l) { return l.split('|')[1]; });
    var row = el('<div class="row" style="margin:10px 0"></div>');
    var p1 = el('<button class="btn">▶ Escuchar (normal)</button>');
    p1.onclick = function () { speakSeq(lines); };
    var p2 = el('<button class="btn sec">🐢 Escuchar despacio</button>');
    p2.onclick = function () { speakSeq(lines, 0.7); };
    row.appendChild(p1); row.appendChild(p2);
    host.appendChild(row);
    host.appendChild(el('<h3>Comprensión</h3>'));
    var qh = el('<div></div>'); host.appendChild(qh);
    var ok = 0, tot = D.esc.length;
    D.esc.forEach(function (q) {
      var c = el('<div class="q"><div class="qt">' + esc(q.q) + '</div></div>');
      q.o.forEach(function (o, oi) {
        var b = el('<button class="opt">' + esc(o) + '</button>');
        b.onclick = function () {
          c.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          b.classList.add(oi === q.k ? 'ok' : 'bad');
          if (oi !== q.k) c.querySelectorAll('.opt')[q.k].classList.add('ok');
          if (++ok >= tot) done();
        };
        c.appendChild(b);
      });
      qh.appendChild(c);
    });
    if (S.auto) setTimeout(function () { speakSeq(lines); }, 300);
  }

  // --- bloque 3: texto + vocabulario
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
      srsAdd(L.id + '-' + n + '-' + o.w, o.w, o.es, o.ex);
      var r = el('<div class="vw"><div><div class="w">' + esc(o.w) + ' <span class="dim">— ' + esc(o.es) + '</span></div>' +
        (o.ex ? '<div class="ex">' + esc(o.ex) + '</div>' : '') + '</div></div>');
      r.appendChild(spkBtn(o.ex || o.w));
      vb.appendChild(r);
    });
    host.appendChild(vb); save();
    var b = el('<button class="btn small">He leído y escuchado todo</button>');
    b.onclick = function () { done(); b.disabled = true; };
    host.appendChild(b);
  }

  // --- bloque 4: shadowing
  function b4(host, D, n, done) {
    host.innerHTML = '<p class="dim small">Shadowing: reproduce la frase y <b>habla a la vez que la voz</b>, imitando ritmo y entonación. Tres pasadas por frase: despacio, normal, sin mirar.</p>';
    var count = 0;
    D.chunks.forEach(function (c) {
      var row = el('<div class="chunk"><div class="t">' + esc(c) + '</div></div>');
      var slow = el('<button class="btn sec small">🐢</button>');
      slow.onclick = function () { speak(c, { rate: 0.65 }); };
      var norm2 = el('<button class="btn small">▶</button>');
      norm2.onclick = function () { speak(c); mark(); };
      var mic = el('<button class="btn sec small">🎤</button>');
      mic.title = 'Compara tu pronunciación';
      mic.onclick = function () { listen(c, row, mic); };
      row.appendChild(slow); row.appendChild(norm2); row.appendChild(mic);
      host.appendChild(row);
      function mark() { if (++count >= D.chunks.length) done(); }
    });
    var all = el('<button class="btn sec small" style="margin-top:10px">▶ Todas seguidas</button>');
    all.onclick = function () { speakSeq(D.chunks); };
    host.appendChild(all);
    var okb = el('<button class="btn small" style="margin:10px 0 0 8px">Bloque hecho</button>');
    okb.onclick = function () { done(); okb.disabled = true; };
    host.appendChild(okb);
  }

  function listen(target, row, btn) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { row.appendChild(el('<span class="small dim">Tu navegador no permite reconocimiento de voz (usa Chrome).</span>')); return; }
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

  // --- bloque 5: gramática inductiva
  function b5(host, D, n, done) {
    var G = D.gram;
    host.innerHTML = '<p class="dim small">Primero los ejemplos, después la regla. Así es como aprendiste tu lengua materna: el patrón antes que la explicación.</p>';
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
      var c = el('<div class="q"><div class="qt">' + esc(d[0]).replace(/___/g, '<b>___</b>') + '</div></div>');
      var i = el('<input type="text" placeholder="completa" autocomplete="off" spellcheck="false">');
      var b = el('<button class="btn small" style="margin-top:8px">Comprobar</button>');
      b.onclick = function () {
        var ok = norm(i.value) === norm(d[1]);
        i.disabled = true; b.disabled = true;
        c.appendChild(el('<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✔ ' : '✖ Solución: ') + esc(d[1]) + '</div>'));
        speak(String(d[0]).replace('___', d[1]));
        if (++okc >= G.drill.length) done();
      };
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') b.click(); });
      c.appendChild(i); c.appendChild(b); host.appendChild(c);
    });
  }

  // --- bloque 6: producción
  function b6(host, D, n, done) {
    var P = D.prod;
    host.innerHTML = '<p class="dim small">Producción obligatoria: sin salida no hay fluidez. Habla en voz alta 2 minutos y luego escribe. Compara con el modelo <b>después</b>, nunca antes.</p>';
    var sp = el('<div class="card flat"><b>🗣 Habla (2 min)</b><p>' + esc(P.habla) + '</p></div>');
    var t = el('<button class="btn small">Cronómetro 2:00</button>');
    var tv = el('<span class="timer" style="margin-left:10px">2:00</span>');
    t.onclick = function () {
      var s = 120; t.disabled = true;
      var iv = setInterval(function () {
        s--; tv.textContent = String(Math.floor(s / 60)) + ':' + String(s % 60).padStart(2, '0');
        if (s <= 0) { clearInterval(iv); t.disabled = false; tv.textContent = '¡Tiempo!'; }
      }, 1000);
    };
    sp.appendChild(t); sp.appendChild(tv); host.appendChild(sp);
    host.appendChild(el('<h3>✍ Escribe</h3>'));
    host.appendChild(el('<p>' + esc(P.escribe) + '</p>'));
    var ta = el('<textarea placeholder="Escribe aquí tus 4-6 frases…"></textarea>');
    ta.value = (st.txt || '');
    ta.oninput = function () { st.txt = ta.value; save(); };
    host.appendChild(ta);
    var mb = el('<button class="btn small" style="margin-top:10px">Ver respuesta modelo</button>');
    var mo = el('<div class="note hidden"><b>Modelo</b><br><span class="modelo-en">' + esc(P.modelo) + '</span></div>');
    mb.onclick = function () {
      if (norm(ta.value).split(' ').length < 12) { alert('Escribe al menos 12 palabras antes de mirar el modelo. La dificultad deseable es parte del método.'); return; }
      mo.classList.remove('hidden'); speak(P.modelo); done();
    };
    host.appendChild(mb); host.appendChild(mo);
  }

  // --- bloque 7: test
  function b7(host, D, n, done) {
    var base = (D.test || []).map(function (t) { return qMC(t.q, t.o, t.k, t.exp); });
    var extra = [qDic(pick(D.chunks, 1)[0])];
    if (D.prod && D.prod.tr) extra.push(qTr(D.prod.tr[0], D.prod.tr[1]));
    var items = base.concat(extra);
    if (semanal) {
      var prevDays = [];
      for (var x = Math.max(1, n - 6); x < n; x++) prevDays.push(dayData(x));
      items = items.concat(vocabQuestions(prevDays, 4)).concat(gramQuestions(prevDays, 3));
    }
    var wrap = el('<div></div>'); host.appendChild(wrap);
    var start = el('<button class="btn">Empezar test (' + items.length + ' ítems · necesitas 70 %)</button>');
    host.insertBefore(start, wrap);
    start.onclick = function () {
      start.remove();
      runTest(wrap, shuffle(items), { min: 70, pasoTxt: 'Día completado' }, function (pct, pass, foot) {
        st.pct = Math.max(st.pct || 0, pct);
        if (pass) { st.fin = true; done(); S.ses++; }
        save(); renderFinish();
        if (pass && n < 90) {
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
      f.innerHTML = '<div class="row between"><b class="ok-t">✔ Día ' + n + ' completado · ' + st.pct + '%</b><div class="row"></div></div>';
      var r = f.querySelector('.row .row') || f.querySelectorAll('.row')[1];
      var b1x = el('<button class="btn sec small">Panel</button>'); b1x.onclick = function () { go('home'); };
      r.appendChild(b1x);
      if (n < 90) { var b2x = el('<button class="btn small">Día ' + (n + 1) + ' →</button>'); b2x.onclick = function () { go('dia', n + 1); }; r.appendChild(b2x); }
      if (k === 30) { var b3x = el('<button class="btn small">Examen ' + L.id + ' →</button>'); b3x.onclick = function () { go('examen', L.id); }; r.appendChild(b3x); }
    } else {
      f.innerHTML = '<p class="dim small">Termina los 7 bloques y aprueba el test del día (≥ 70 %) para desbloquear el día siguiente.</p>';
    }
  }
}

// ---------- reloj de sesión ----------
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
document.getElementById('exportBtn').onclick = function () {
  var json = JSON.stringify(S);
  function fallback() {
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    a.download = 'progreso-ingles.json'; a.click();
  }
  // En claude.ai el guardado pasa por la capacidad "downloads"; fuera de ahí, enlace normal.
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('downloads').then(function (d) {
      if (!d) { fallback(); return; }
      d.save({ filename: 'progreso-ingles.json', data: json })['catch'](function (e) {
        if (e && e.code === 'declined') return;
        alert('No se pudo guardar el archivo. Copia el progreso desde la consola si lo necesitas.');
      });
    })['catch'](fallback);
  } else { fallback(); }
};
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

if (window.speechSynthesis) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}
route();
})();
