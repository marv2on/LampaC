(function () {
  'use strict';

  if (window.plugin_iptv2_ready) return;

  // ---------------------------------------------------------------------------
  //  CSS
  // ---------------------------------------------------------------------------

  var css = [
    // ---- Layout ----
    '.iptv2-wrap { padding: 1.5em; }',

    // ---- Playlist screen ----
    '.iptv2-head { display: flex; align-items: center; margin-bottom: 1.5em; }',
    '.iptv2-head__title { font-size: 2.4em; font-weight: 300; flex: 1; }',
    '.iptv2-head__add { display: flex; align-items: center; gap: 0.5em; padding: 0.5em 1.2em; border-radius: 1em; background: rgba(255,255,255,0.08); font-size: 1.1em; cursor: pointer; }',
    '.iptv2-head__add.focus { background: #fff; color: #000; }',
    '.iptv2-head__add svg { width: 1.2em; height: 1.2em; }',

    '.iptv2-pl { display: flex; align-items: center; padding: 1.2em 1.4em; background: rgba(255,255,255,0.06); border-radius: 1.2em; margin-bottom: 0.8em; cursor: pointer; position: relative; }',
    '.iptv2-pl.focus { background: rgba(255,255,255,0.15); }',
    '.iptv2-pl.focus::after { content: ""; position: absolute; inset: -0.4em; border: 0.2em solid rgba(255,255,255,0.7); border-radius: 1.6em; pointer-events: none; }',
    '.iptv2-pl__ico { width: 3.6em; height: 3.6em; border-radius: 0.8em; display: flex; align-items: center; justify-content: center; margin-right: 1.2em; flex-shrink: 0; font-size: 1.5em; font-weight: 800; color: #fff; }',
    '.iptv2-pl__ico--0 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
    '.iptv2-pl__ico--1 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }',
    '.iptv2-pl__ico--2 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }',
    '.iptv2-pl__ico--3 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }',
    '.iptv2-pl__ico--4 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }',
    '.iptv2-pl__ico--5 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }',
    '.iptv2-pl__body { flex: 1; overflow: hidden; }',
    '.iptv2-pl__name { font-size: 1.4em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.iptv2-pl__meta { display: flex; gap: 1.2em; margin-top: 0.3em; font-size: 0.9em; opacity: 0.45; }',
    '.iptv2-pl__arrow { flex-shrink: 0; opacity: 0.3; font-size: 1.4em; margin-left: 0.5em; }',
    '.iptv2-pl.focus .iptv2-pl__arrow { opacity: 0.8; }',

    '.iptv2-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4em 2em; }',
    '.iptv2-empty__ico { width: 5em; height: 5em; margin-bottom: 1.5em; opacity: 0.15; }',
    '.iptv2-empty__ico svg { width: 100%; height: 100%; }',
    '.iptv2-empty__text { font-size: 1.3em; opacity: 0.35; text-align: center; line-height: 1.5; }',

    // ---- Channel screen header ----
    '.iptv2-chead { display: flex; align-items: center; margin-bottom: 1em; }',
    '.iptv2-chead__back { flex-shrink: 0; margin-right: 0.8em; padding: 0.4em; opacity: 0.5; cursor: pointer; }',
    '.iptv2-chead__back.focus { opacity: 1; background: rgba(255,255,255,0.15); border-radius: 0.5em; }',
    '.iptv2-chead__back svg { width: 1.4em; height: 1.4em; }',
    '.iptv2-chead__title { font-size: 2em; font-weight: 300; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.iptv2-chead__count { flex-shrink: 0; padding: 0.3em 0.8em; border-radius: 0.6em; background: rgba(255,255,255,0.08); font-size: 0.9em; opacity: 0.6; }',

    // ---- Groups ----
    '.iptv2-groups { display: flex; gap: 0.5em; margin-bottom: 1.5em; overflow-x: auto; padding-bottom: 0.3em; -webkit-overflow-scrolling: touch; }',
    '.iptv2-groups::-webkit-scrollbar { display: none; }',
    '.iptv2-group { padding: 0.4em 1em; border-radius: 2em; font-size: 1em; background: rgba(255,255,255,0.06); cursor: pointer; white-space: nowrap; flex-shrink: 0; }',
    '.iptv2-group--active { background: rgba(255,255,255,0.18); font-weight: 600; }',
    '.iptv2-group.focus { background: #fff; color: #000; }',

    // ---- Channel grid ----
    '.iptv2-grid { display: flex; flex-wrap: wrap; gap: 1em; }',
    '.iptv2-card { width: 12.75em; flex-shrink: 0; cursor: pointer; position: relative; }',
    '.iptv2-card.focus::after { content: ""; position: absolute; top: -0.5em; left: -0.5em; right: -0.5em; bottom: -0.5em; border: 0.3em solid #fff; border-radius: 1.4em; pointer-events: none; z-index: 1; opacity: 0.9; }',
    '.iptv2-card__img { width: 100%; padding-bottom: 72%; background: #464646; border-radius: 1em; position: relative; overflow: hidden; }',
    '.iptv2-card__img-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 0.8em; }',
    '.iptv2-card__logo { max-width: 80%; max-height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.2s; }',
    '.iptv2-card.focus .iptv2-card__logo.loaded { opacity: 1; }',
    '.iptv2-card__logo.loaded { opacity: 1; }',
    '.iptv2-card__letter { font-size: 4em; font-weight: 900; line-height: 0.7; opacity: 0.18; }',
    '.iptv2-card__num { position: absolute; bottom: 0.3em; left: 0.5em; font-size: 0.75em; font-weight: 600; opacity: 0.4; }',
    '.iptv2-card__title { margin-top: 0.5em; font-size: 1.05em; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; max-height: 2.6em; text-align: center; }',
    '.iptv2-card__epg { font-size: 0.75em; opacity: 0.4; text-align: center; margin-top: 0.15em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.iptv2-card__badge { position: absolute; bottom: 0.3em; right: 0.4em; padding: 0.15em 0.45em; border-radius: 0.3em; font-size: 0.65em; font-weight: 700; z-index: 1; }',
    '.iptv2-card__badge--4K { background: #e91e63; }',
    '.iptv2-card__badge--FHD { background: #2196f3; }',
    '.iptv2-card__badge--HD { background: #4caf50; }',

    // ---- Search ----
    '.iptv2-search { display: flex; align-items: center; gap: 0.6em; margin-bottom: 1.2em; }',
    '.iptv2-search__btn { flex-shrink: 0; padding: 0.5em; border-radius: 50%; cursor: pointer; }',
    '.iptv2-search__btn.focus { background: #fff; color: #000; }',
    '.iptv2-search__btn svg { width: 1.3em; height: 1.3em; }',
    '.iptv2-search__text { opacity: 0.5; font-size: 1em; }',

    // ---- Channel list (compact) ----
    '.iptv2-list {}',
    '.iptv2-li { display: flex; align-items: center; padding: 0.7em 1em; border-radius: 0.7em; cursor: pointer; margin-bottom: 0.2em; }',
    '.iptv2-li.focus { background: rgba(255,255,255,0.14); }',
    '.iptv2-li__num { width: 2.5em; flex-shrink: 0; font-size: 1.1em; font-weight: 600; opacity: 0.25; text-align: right; padding-right: 0.8em; }',
    '.iptv2-li__logo { width: 3.4em; height: 2.4em; object-fit: contain; flex-shrink: 0; border-radius: 0.4em; background: rgba(255,255,255,0.05); }',
    '.iptv2-li__nologo { width: 3.4em; height: 2.4em; flex-shrink: 0; border-radius: 0.4em; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2em; opacity: 0.15; }',
    '.iptv2-li__body { flex: 1; overflow: hidden; margin-left: 0.8em; }',
    '.iptv2-li__name { font-size: 1.15em; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.iptv2-li__epg { font-size: 0.8em; opacity: 0.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.1em; }',
    '.iptv2-li__badge { margin-left: 0.5em; padding: 0.15em 0.5em; border-radius: 0.3em; font-size: 0.65em; font-weight: 700; flex-shrink: 0; }',
    '.iptv2-li__badge--4K { background: #e91e63; }',
    '.iptv2-li__badge--FHD { background: #2196f3; }',
    '.iptv2-li__badge--HD { background: #4caf50; }'
  ].join('\n');

  // ---------------------------------------------------------------------------
  //  API
  // ---------------------------------------------------------------------------

  function apiUrl(path, params) {
    var host = (window.lampa_settings && window.lampa_settings.host) ? window.lampa_settings.host : '';
    var url = host + path;
    var q = [];
    if (params) for (var k in params) if (params[k] !== undefined && params[k] !== '') q.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    var t = Lampa.Storage.get('lampac_token', '');
    if (t) q.push('token=' + encodeURIComponent(t));
    if (q.length) url += '?' + q.join('&');
    return url;
  }

  function apiGet(path, params, ok, err) {
    var n = new Lampa.Reguest();
    n.timeout(15000);
    n.silent(apiUrl(path, params), ok || function(){}, err || function(){});
    return n;
  }

  function apiPost(path, body, ok, err) {
    $.ajax({ url: apiUrl(path), type: 'POST', contentType: 'application/json', data: JSON.stringify(body), timeout: 15000, success: ok, error: function(x,s,e){ if(err) err(e||s); } });
  }

  function apiDelete(path, ok, err) {
    $.ajax({ url: apiUrl(path), type: 'DELETE', timeout: 15000, success: ok, error: function(x,s,e){ if(err) err(e||s); } });
  }

  // ---------------------------------------------------------------------------
  //  Component
  // ---------------------------------------------------------------------------

  var GRID_MODE = true; // true = card grid, false = list

  function Component(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var html = $('<div></div>');
    var initialized = false;
    var view = 'playlists';
    var playlists = [];
    var selPlaylist = null;
    var channels = [];
    var groups = [];
    var curGroup = '';
    var searchQuery = '';
    var comp = this;

    this.create = function () { return this.render(); };

    this.start = function () {
      if (Lampa.Activity.active() && Lampa.Activity.active().activity !== this.activity) return;

      if (!initialized) {
        initialized = true;
        if (!$('#iptv2-css').length) $('head').append('<style id="iptv2-css">' + css + '</style>');
        html.append(scroll.render());
        scroll.minus();
        loadPlaylists();
      }

      Lampa.Background.immediately('');
      setupController();
    };

    function setupController() {
      Lampa.Controller.add('content', {
        invisible: true,
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(false, scroll.render());
        },
        left: function () { Lampa.Controller.toggle('menu'); },
        up: function () { Lampa.Controller.toggle('head'); },
        back: function () {
          if (view === 'channels') loadPlaylists();
          else Lampa.Activity.backward();
        }
      });
      Lampa.Controller.toggle('content');
    }

    // ===================== Playlists =====================

    function loadPlaylists() {
      view = 'playlists';
      comp.activity.loader(true);
      apiGet('/api/iptv/playlists', {}, function (data) {
        comp.activity.loader(false);
        playlists = data.playlists || [];
        renderPlaylists();
      }, function () {
        comp.activity.loader(false);
        playlists = [];
        renderPlaylists();
      });
    }

    function renderPlaylists() {
      scroll.clear();
      var w = $('<div class="iptv2-wrap"></div>');

      // Header with add button
      var head = $('<div class="iptv2-head"></div>');
      head.append('<div class="iptv2-head__title">IPTV</div>');

      var addBtn = $('<div class="iptv2-head__add selector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>' + Lampa.Lang.translate('iptv2_add') + '</span></div>');
      addBtn.on('hover:enter', promptAdd);
      head.append(addBtn);
      w.append(head);

      if (!playlists.length) {
        var empty = $('<div class="iptv2-empty"></div>');
        empty.append('<div class="iptv2-empty__ico"><svg viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="34" height="21" rx="3" stroke="currentColor" stroke-width="3"/><line x1="13.09" y1="2.35" x2="16.35" y2="6.91" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="1.5" y1="-1.5" x2="9.32" y2="-1.5" transform="matrix(-0.758 0.652 0.652 0.758 26.2 2)" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="9.5" y1="34.5" x2="29.5" y2="34.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div>');
        empty.append('<div class="iptv2-empty__text">' + Lampa.Lang.translate('iptv2_empty') + '</div>');
        w.append(empty);
      }

      playlists.forEach(function (pl, i) {
        var row = $('<div class="iptv2-pl selector"></div>');
        var letter = (pl.name || 'P').charAt(0).toUpperCase();
        row.append('<div class="iptv2-pl__ico iptv2-pl__ico--' + (i % 6) + '">' + letter + '</div>');

        var body = $('<div class="iptv2-pl__body"></div>');
        body.append($('<div class="iptv2-pl__name"></div>').text(pl.name || 'Playlist'));

        var meta = $('<div class="iptv2-pl__meta"></div>');
        meta.append('<span>' + (pl.channel_count || 0) + ' ' + Lampa.Lang.translate('iptv2_ch') + '</span>');
        if (pl.is_global) meta.append('<span>global</span>');
        if (pl.proxy_mode && pl.proxy_mode !== 'none') meta.append('<span>proxy</span>');
        body.append(meta);
        row.append(body);

        row.append('<div class="iptv2-pl__arrow">›</div>');

        row.on('hover:enter', function () {
          selPlaylist = pl;
          loadChannels();
        });

        row.on('hover:long', function () {
          if (pl.is_global) return;
          Lampa.Select.show({
            title: pl.name,
            items: [
              { title: Lampa.Lang.translate('iptv2_refresh'), value: 'refresh' },
              { title: Lampa.Lang.translate('iptv2_delete'), value: 'delete' }
            ],
            onSelect: function (a) {
              if (a.value === 'delete') apiDelete('/api/iptv/playlists/' + pl.id, function () { Lampa.Noty.show(Lampa.Lang.translate('iptv2_deleted')); loadPlaylists(); });
              else apiPost('/api/iptv/playlists/' + pl.id + '/refresh', {}, function () { Lampa.Noty.show(Lampa.Lang.translate('iptv2_refreshed')); loadPlaylists(); });
            },
            onBack: function () { Lampa.Controller.toggle('content'); }
          });
        });

        w.append(row);
      });

      scroll.append(w);
      scroll.reset();
      setupController();
    }

    function promptAdd() {
      Lampa.Input.edit({ title: Lampa.Lang.translate('iptv2_url_title'), value: '', free: true }, function (url) {
        if (!url || !url.trim()) return;
        Lampa.Input.edit({ title: Lampa.Lang.translate('iptv2_name_title'), value: 'My Playlist', free: true }, function (name) {
          comp.activity.loader(true);
          apiPost('/api/iptv/playlists', { name: name || 'My Playlist', url: url.trim() }, function () { loadPlaylists(); }, function () { comp.activity.loader(false); Lampa.Noty.show(Lampa.Lang.translate('iptv2_error')); });
        });
      });
    }

    // ===================== Channels =====================

    function loadChannels() {
      view = 'channels';
      curGroup = '';
      searchQuery = '';
      comp.activity.loader(true);
      apiGet('/api/iptv/groups', { playlist_id: selPlaylist.id }, function (data) {
        groups = data.groups || [];
        fetchChannels();
      }, function () {
        groups = [];
        fetchChannels();
      });
    }

    function fetchChannels() {
      apiGet('/api/iptv/channels', { playlist_id: selPlaylist.id, group: curGroup, search: searchQuery, limit: 500 }, function (data) {
        comp.activity.loader(false);
        channels = data.channels || [];
        renderChannels();
        fetchEPG();
      }, function () {
        comp.activity.loader(false);
        channels = [];
        renderChannels();
      });
    }

    function renderChannels() {
      scroll.clear();
      var w = $('<div class="iptv2-wrap"></div>');

      // Header
      var head = $('<div class="iptv2-chead"></div>');
      head.append($('<div class="iptv2-chead__title"></div>').text(selPlaylist.name));
      head.append('<div class="iptv2-chead__count">' + channels.length + ' ' + Lampa.Lang.translate('iptv2_ch') + '</div>');
      w.append(head);

      // Search
      var srch = $('<div class="iptv2-search"></div>');
      var srchBtn = $('<div class="iptv2-search__btn selector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg></div>');
      srchBtn.on('hover:enter', function () {
        Lampa.Input.edit({ title: Lampa.Lang.translate('iptv2_search_title'), value: searchQuery, free: true }, function (val) {
          searchQuery = (val || '').trim();
          comp.activity.loader(true);
          fetchChannels();
        });
      });
      srch.append(srchBtn);
      if (searchQuery) srch.append('<div class="iptv2-search__text">«' + searchQuery + '»</div>');
      w.append(srch);

      // Groups
      if (groups.length > 0 && !searchQuery) {
        var gw = $('<div class="iptv2-groups"></div>');

        var all = $('<div class="iptv2-group selector' + (!curGroup ? ' iptv2-group--active' : '') + '">' + Lampa.Lang.translate('iptv2_all') + '</div>');
        all.on('hover:enter', function () { curGroup = ''; comp.activity.loader(true); fetchChannels(); });
        gw.append(all);

        groups.forEach(function (g) {
          var gt = $('<div class="iptv2-group selector' + (curGroup === g.name ? ' iptv2-group--active' : '') + '"></div>');
          gt.text(g.name + ' (' + g.count + ')');
          gt.on('hover:enter', function () { curGroup = g.name; comp.activity.loader(true); fetchChannels(); });
          gw.append(gt);
        });

        w.append(gw);
      }

      // Channels
      if (!channels.length) {
        var empty = $('<div class="iptv2-empty"></div>');
        empty.append('<div class="iptv2-empty__text">' + Lampa.Lang.translate('iptv2_no_ch') + '</div>');
        w.append(empty);
      } else if (GRID_MODE) {
        w.append(renderGrid());
      } else {
        w.append(renderList());
      }

      scroll.append(w);
      scroll.reset();
      setupController();
    }

    // ---- Card Grid ----
    function renderGrid() {
      var grid = $('<div class="iptv2-grid"></div>');

      channels.forEach(function (ch, idx) {
        var card = $('<div class="iptv2-card selector"></div>');

        // Image area
        var imgWrap = $('<div class="iptv2-card__img"></div>');
        var inner = $('<div class="iptv2-card__img-inner"></div>');

        if (ch.logo) {
          var img = $('<img class="iptv2-card__logo">').attr('loading', 'lazy');
          img.on('load', function () { $(this).addClass('loaded'); });
          img.on('error', function () { $(this).replaceWith('<div class="iptv2-card__letter">' + (ch.name || 'TV').charAt(0).toUpperCase() + '</div>'); });
          img.attr('src', ch.logo);
          inner.append(img);
        } else {
          inner.append('<div class="iptv2-card__letter">' + (ch.name || 'TV').charAt(0).toUpperCase() + '</div>');
        }

        imgWrap.append(inner);

        // Quality badge
        if (ch.quality && ch.quality !== 'SD') {
          imgWrap.append('<div class="iptv2-card__badge iptv2-card__badge--' + ch.quality + '">' + ch.quality + '</div>');
        }

        // Channel number inside image area
        if (idx < 999) imgWrap.append('<div class="iptv2-card__num">' + (idx + 1) + '</div>');

        card.append(imgWrap);

        // Title
        card.append($('<div class="iptv2-card__title"></div>').text(ch.name));

        // EPG
        card.append('<div class="iptv2-card__epg" data-epg="' + (ch.tvg_id || ch.id) + '"></div>');

        card.on('hover:enter', function () { playChannel(ch, idx); });

        grid.append(card);
      });

      return grid;
    }

    // ---- List View ----
    function renderList() {
      var list = $('<div class="iptv2-list"></div>');

      channels.forEach(function (ch, idx) {
        var row = $('<div class="iptv2-li selector"></div>');

        row.append('<div class="iptv2-li__num">' + (idx + 1) + '</div>');

        if (ch.logo) {
          var img = $('<img class="iptv2-li__logo">').attr('src', ch.logo).attr('loading', 'lazy');
          img.on('error', function () { $(this).replaceWith('<div class="iptv2-li__nologo">' + (ch.name || 'TV').charAt(0) + '</div>'); });
          row.append(img);
        } else {
          row.append('<div class="iptv2-li__nologo">' + (ch.name || 'TV').charAt(0) + '</div>');
        }

        var body = $('<div class="iptv2-li__body"></div>');
        body.append($('<div class="iptv2-li__name"></div>').text(ch.name));
        body.append('<div class="iptv2-li__epg" data-epg="' + (ch.tvg_id || ch.id) + '"></div>');
        row.append(body);

        if (ch.quality && ch.quality !== 'SD') {
          row.append('<div class="iptv2-li__badge iptv2-li__badge--' + ch.quality + '">' + ch.quality + '</div>');
        }

        row.on('hover:enter', function () { playChannel(ch, idx); });

        list.append(row);
      });

      return list;
    }

    function fetchEPG() {
      if (!channels.length) return;
      var ids = [];
      channels.forEach(function (ch) { ids.push(ch.tvg_id || ch.id); });
      apiGet('/api/iptv/epg/now', { channel_ids: ids.slice(0, 50).join(',') }, function (data) {
        (data.epg || []).forEach(function (nn) {
          if (nn.now) $('[data-epg="' + nn.channel_id + '"]').text(nn.now.title);
        });
      });
    }

    function playChannel(ch, idx) {
      comp.activity.loader(true);
      apiGet('/api/iptv/play', { channel_id: ch.id }, function (data) {
        comp.activity.loader(false);
        if (!data || !data.url) { Lampa.Noty.show(Lampa.Lang.translate('iptv2_no_stream')); return; }
        Lampa.Player.runas(Lampa.Storage.field('player_iptv') || 'inner');
        Lampa.Player.play({ title: ch.name, url: data.url, tv: true });
        var pl = channels.map(function (c) { return { title: c.name, url: '', tv: true }; });
        pl[idx] = { title: ch.name, url: data.url, tv: true };
        Lampa.Player.playlist(pl);
      }, function () {
        comp.activity.loader(false);
        if (ch.url) {
          Lampa.Player.runas(Lampa.Storage.field('player_iptv') || 'inner');
          Lampa.Player.play({ title: ch.name, url: ch.url, tv: true });
        } else Lampa.Noty.show(Lampa.Lang.translate('iptv2_no_stream'));
      });
    }

    // ===================== Lifecycle =====================

    this.render = function () { return html; };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () { network.clear(); scroll.destroy(); html.remove(); };
  }

  // ---------------------------------------------------------------------------
  //  Translations
  // ---------------------------------------------------------------------------

  Lampa.Lang.add({
    iptv2_add: { ru: 'Добавить', en: 'Add', uk: 'Додати' },
    iptv2_empty: { ru: 'Нет плейлистов<br>Добавьте M3U ссылку', en: 'No playlists<br>Add an M3U URL', uk: 'Немає плейлистів<br>Додайте M3U посилання' },
    iptv2_url_title: { ru: 'URL плейлиста (M3U)', en: 'Playlist URL (M3U)', uk: 'URL плейлиста (M3U)' },
    iptv2_name_title: { ru: 'Название плейлиста', en: 'Playlist name', uk: 'Назва плейлиста' },
    iptv2_ch: { ru: 'каналов', en: 'channels', uk: 'каналів' },
    iptv2_all: { ru: 'Все', en: 'All', uk: 'Усі' },
    iptv2_no_ch: { ru: 'Нет каналов', en: 'No channels', uk: 'Немає каналів' },
    iptv2_no_stream: { ru: 'Не удалось получить поток', en: 'Failed to get stream', uk: 'Не вдалося отримати потік' },
    iptv2_refresh: { ru: 'Обновить', en: 'Refresh', uk: 'Оновити' },
    iptv2_delete: { ru: 'Удалить', en: 'Delete', uk: 'Видалити' },
    iptv2_deleted: { ru: 'Удалён', en: 'Deleted', uk: 'Видалено' },
    iptv2_refreshed: { ru: 'Обновлён', en: 'Refreshed', uk: 'Оновлено' },
    iptv2_error: { ru: 'Ошибка', en: 'Error', uk: 'Помилка' },
    iptv2_search_title: { ru: 'Поиск каналов', en: 'Search channels', uk: 'Пошук каналів' }
  });

  // ---------------------------------------------------------------------------
  //  Menu
  // ---------------------------------------------------------------------------

  function addToMenu() {
    var btn = $('<li class="menu__item selector"><div class="menu__ico"><svg height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="34" height="21" rx="3" stroke="currentColor" stroke-width="3"/><line x1="13.09" y1="2.35" x2="16.35" y2="6.91" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="1.5" y1="-1.5" x2="9.32" y2="-1.5" transform="matrix(-0.758 0.652 0.652 0.758 26.2 2)" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="9.5" y1="34.5" x2="29.5" y2="34.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div><div class="menu__text">IPTV</div></li>');
    btn.on('hover:enter', function () {
      Lampa.Activity.push({ url: '', title: 'IPTV', component: 'iptv2', page: 1 });
    });
    $('.menu .menu__list').eq(0).append(btn);
  }

  // ---------------------------------------------------------------------------
  //  Init
  // ---------------------------------------------------------------------------

  function startPlugin() {
    window.plugin_iptv2_ready = true;
    Lampa.Component.add('iptv2', Component);
    if (window.appready) addToMenu();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') addToMenu(); });
  }

  if (!window.plugin_iptv2_ready) startPlugin();
})();
