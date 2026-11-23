/*! Nationalist Academy Theme JS v1.0 - theme colours, dark mode, bookmarks, claps, reading time */
(function () {
  'use strict';
  var B = document.getElementById('mainCont');
  if (!B) return;
  var KB = 'na_bookmarks', KT = 'na_theme';

  function st(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function gt(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function toast(t) {
    var n = document.getElementById('toastNotif');
    if (!n) return;
    n.innerHTML = '';
    setTimeout(function () { n.innerHTML = '<span>' + t + '</span>'; }, 30);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
  }
  function safe(u) { return /^https?:\/\//i.test(u) ? u : '#'; }

  /* ---------- Colour themes + dark mode ---------- */
  function setTheme(n) {
    for (var i = 0; i <= 10; i++) B.classList.remove('theme' + i);
    B.classList.add('theme' + n);
    st(KT, n);
  }
  for (var i = 0; i <= 10; i++) (function (n) { window['theme' + n] = function () { setTheme(n); }; })(i);
  window.thmMo = window.modeL = function () { B.classList.remove('drK'); st('mode', 'lightmode'); };
  window.darkMode = function () { st('mode', B.classList.toggle('drK') ? 'darkmode' : 'lightmode'); };
  var saved = gt(KT);
  if (saved !== null && /^\d+$/.test(saved) && +saved <= 10) setTheme(saved);
  if (gt('mode') === 'darkmode') B.classList.add('drK');

  /* ---------- Bookmarks ---------- */
  function get() { try { return JSON.parse(gt(KB)) || []; } catch (e) { return []; } }
  function put(a) { st(KB, JSON.stringify(a)); }
  function count() {
    var n = get().length;
    [].forEach.call(document.querySelectorAll('.show-bookmark'), function (e) { e.textContent = n || ''; });
  }
  var pop = document.createElement('div');
  pop.className = 'pop-area';
  pop.innerHTML = '<div class="pop-html"><div class="head-pop"><b>Bookmarks</b><span class="close-btn" role="button" aria-label="Close">&#10005;</span></div><div class="body-content"></div></div>';
  document.body.appendChild(pop);

  function render() {
    var a = get(), h = '';
    if (!a.length) h = '<div class="text-center"><p>No bookmarks yet.</p></div>';
    a.forEach(function (p) {
      h += '<div class="table"><div style="display:flex;align-items:center;gap:10px">' +
        (p.img ? '<img class="img-left" src="' + esc(p.img) + '" alt="">' : '') +
        '<div class="item-left" style="flex:1"><a href="' + esc(safe(p.link)) + '">' + esc(p.title) + '</a></div>' +
        '<span class="btn-remove" data-rm="' + esc(p.id) + '" role="button" aria-label="Remove">&#10005;</span></div></div>';
    });
    pop.querySelector('.body-content').innerHTML = h;
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var rm = t.closest('.btn-remove');
    if (rm) {
      var rid = rm.getAttribute('data-rm');
      put(get().filter(function (p) { return p.id !== rid; }));
      render(); count(); return;
    }
    var b = t.closest('.hartomy-bookmark-btn');
    if (b) {
      e.preventDefault();
      var id = b.getAttribute('data-id'), a = get(), ix = -1;
      a.forEach(function (p, i) { if (p.id === id) ix = i; });
      if (ix > -1) { a.splice(ix, 1); toast('Bookmark removed'); }
      else {
        a.push({ id: id, title: b.getAttribute('data-title'), link: b.getAttribute('data-link'), img: b.getAttribute('data-borkimage') });
        toast('Added to bookmarks');
      }
      put(a); count(); return;
    }
    if (t.closest('.buka-tutup')) { render(); pop.classList.add('open'); return; }
    if (t.closest('.close-btn') || t === pop) pop.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.classList.remove('open'); });
  count();

  /* ---------- Claps (per post) ---------- */
  var cb = document.querySelector('.claps_button'), cl = document.querySelector('.claps');
  if (cb && cl) {
    var ck = 'claps_' + location.pathname, c = Number(gt(ck)) || 0;
    cl.innerText = '+' + c;
    cb.addEventListener('click', function () {
      c++; st(ck, c); cl.innerText = '+' + c;
      cb.classList.add('is_clicked');
      setTimeout(function () { cb.classList.remove('is_clicked'); }, 1000);
    });
  }

  /* ---------- Reading time ---------- */
  var pb = document.getElementById('postBody'), rt = document.getElementById('rdTime');
  if (pb && rt) {
    var words = (pb.textContent || '').trim().split(/\s+/).length;
    rt.textContent = Math.max(1, Math.round(words / 200)) + ' min read';
  }
})();
