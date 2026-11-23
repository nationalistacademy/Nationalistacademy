/*! Nationalist Academy - categoryPost(): label-wise posts with thumbnails + Load more */
(function (w, d) {
  'use strict';
  var uid = 0, MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function thumb(url, size) {
    if (!url) return '';
    return url.replace(/^http:/, 'https:').replace(/\/s\d+(-c)?\//, '/s' + size + '/').replace(/=s\d+(-c)?$/, '=s' + size);
  }

  w.categoryPost = function (o) {
    var el = d.getElementById(o.id);
    if (!el) return;
    var home = (o.home || '/').replace(/\/?$/, '/'),
        num = o.pstNm || 6, size = o.thmbSize || 600, snip = o.snptLnth || 120,
        start = 1, wrap = null, more = null;

    function load() {
      var cb = '__naCat' + (++uid);
      var s = d.createElement('script');
      w[cb] = function (data) {
        try { done(data); } finally { delete w[cb]; s.parentNode && s.parentNode.removeChild(s); }
      };
      s.onerror = function () { el.innerHTML = '<div class="note">Posts load nahi ho sakin.</div>'; };
      s.src = home + 'feeds/posts/summary/-/' + encodeURIComponent(o.label) +
        '?alt=json-in-script&start-index=' + start + '&max-results=' + num + '&callback=' + cb;
      d.head.appendChild(s);
    }

    function done(data) {
      var f = data.feed, entries = f.entry || [], total = +f.openSearch$totalResults.$t || 0, h = '';
      if (!wrap) {
        el.innerHTML = '';
        wrap = d.createElement('div');
        wrap.className = 'blogPts';
        el.appendChild(wrap);
      }
      if (!entries.length && start === 1) { el.innerHTML = '<div class="note">Is category mein abhi koi post nahi.</div>'; return; }

      entries.forEach(function (e) {
        var link = '#', i;
        for (i = 0; i < e.link.length; i++) if (e.link[i].rel === 'alternate') link = e.link[i].href;
        var title = e.title.$t || '', date = new Date(e.published.$t),
            ds = MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear(),
            img = e.media$thumbnail ? thumb(e.media$thumbnail.url, size) : '',
            text = (e.summary ? e.summary.$t : '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length > snip) text = text.substring(0, snip).replace(/\s\S*$/, '') + '…';
        var id = (e.id.$t.match(/post-(\d+)/) || [])[1] || link;
        var lbl = e.category && e.category[0] ? e.category[0].term : '';

        h += '<article class="ntry"><div class="pThmb' + (img ? '' : ' nul') + '">' +
          '<a class="thmb" href="' + esc(link) + '" aria-label="' + esc(title) + '">' +
          (img ? '<img class="imgThm" loading="lazy" alt="' + esc(title) + '" src="' + esc(img) + '">' : '<span class="imgThm" data-text="No image"></span>') +
          '</a><div class="iFxd"><div class="hartomy-bookmark-btn" data-quantity="1" data-borkimage="' + esc(img) +
          '" data-id="' + esc(id) + '" data-link="' + esc(link) + '" data-title="' + esc(title) + '">' +
          '<svg class="line" viewBox="0 0 24 24"><g transform="translate(4.5,2.5)"><path d="M7.47 0C1.08 0 0 .93 0 8.43 0 16.82-.15 19 1.44 19c1.6 0 4.2-3.68 6.03-3.68S11.9 19 13.5 19c1.6 0 1.44-2.18 1.44-10.57C14.94.93 13.86 0 7.47 0z"/></g></svg></div></div></div>' +
          '<div class="pCntn"><div class="pHdr pSml">' + (lbl ? '<div class="pLbls"><span data-text="' + esc(lbl) + '"></span></div>' : '') + '</div>' +
          '<h2 class="pTtl aTtl"><a href="' + esc(link) + '" rel="bookmark">' + esc(title) + '</a></h2>' +
          '<div class="pSnpt">' + esc(text) + '</div>' +
          '<div class="pInf pSml"><time class="aTtmp pTtmp pbl" data-text="' + ds + '"></time>' +
          '<a class="pJmp" href="' + esc(link) + '" data-text="Keep reading"></a></div></div></article>';
      });
      wrap.insertAdjacentHTML('beforeend', h);
      el.classList.add('loaded');
      start += num;

      if (more) more.parentNode.removeChild(more);
      more = null;
      if (o.pgn && start <= total) {
        more = d.createElement('div');
        more.className = 'blogPg';
        more.innerHTML = '<a class="jsLd" href="javascript:;" data-text="Load more"></a>';
        more.firstChild.onclick = function () { more.firstChild.setAttribute('data-text', 'Loading…'); load(); };
        el.appendChild(more);
      }
    }
    load();
  };
})(window, document);
