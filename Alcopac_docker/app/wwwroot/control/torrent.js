"use strict";

// Torrent management page for admin panel.
// Loaded after app.js — patches navigate() to handle 'torrent' page.

(function () {
    var _origNavigate = window.navigate;
    window.navigate = function (page) {
        if (page === 'torrent') {
            renderTorrentPage('content');
        } else {
            _origNavigate(page);
        }
    };
})();

var _torrsTimer = null;
var _torrsMode = '';

function renderTorrentPage(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = '\
<div class="row mb-3">\
    <div class="col">\
        <h4 class="mb-0">Торрент-сервер</h4>\
    </div>\
</div>\
<div id="torrs-status" class="mb-3"></div>\
<div id="torrs-list"></div>';

    loadTorrsData();

    // Auto-refresh every 3 seconds.
    if (_torrsTimer) clearInterval(_torrsTimer);
    _torrsTimer = setInterval(loadTorrsData, 3000);
}

function loadTorrsData() {
    fetch('/admin/api/torrs/list')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            renderTorrsStatus(data);
            renderTorrsList(data.torrents || []);
        })
        .catch(function (err) {
            var el = document.getElementById('torrs-status');
            if (el) el.innerHTML = '<div class="alert alert-danger">Ошибка загрузки: ' + err.message + '</div>';
        });
}

function renderTorrsStatus(data) {
    var el = document.getElementById('torrs-status');
    if (!el) return;

    _torrsMode = data.mode;
    var count = (data.torrents || []).length;

    if (data.mode === 'inprocess') {
        var settings = data.settings || {};
        var cacheMB = Math.round((settings.CacheSize || 0) / 1048576);
        var preloadMB = Math.round((settings.PreloadSize || 0) / 1048576);

        el.innerHTML = '\
<div class="card border-success">\
    <div class="card-body py-2">\
        <div class="d-flex align-items-center gap-3 flex-wrap">\
            <span class="badge bg-success fs-6">In-Process</span>\
            <span class="text-muted">Встроенный торрент-сервер</span>\
            <span class="badge bg-secondary">' + count + ' торрент' + torrsPlural(count) + '</span>\
            <span class="badge bg-info text-dark">Кеш: ' + cacheMB + ' МБ</span>\
            <span class="badge bg-info text-dark">Preload: ' + preloadMB + ' МБ</span>\
        </div>\
    </div>\
</div>';
    } else {
        el.innerHTML = '\
<div class="card border-warning">\
    <div class="card-body py-2">\
        <div class="d-flex align-items-center gap-3">\
            <span class="badge bg-warning text-dark fs-6">Proxy</span>\
            <span class="text-muted">Подключение к внешнему TorrServer (MatriX)</span>\
            ' + (data.embedded ? '<span class="badge bg-info text-dark">torrs доступен при пересборке</span>' : '') + '\
        </div>\
    </div>\
</div>';
    }
}

function renderTorrsList(torrents) {
    var el = document.getElementById('torrs-list');
    if (!el) return;

    if (_torrsMode !== 'inprocess') {
        el.innerHTML = '<div class="alert alert-secondary mt-3">\
            Управление торрентами доступно только в режиме in-process (сборка с <code>-tags torrs</code>).\
            <br>В proxy-режиме используйте веб-интерфейс TorrServer MatriX.\
        </div>';
        return;
    }

    if (!torrents.length) {
        el.innerHTML = '<div class="alert alert-light border mt-3">\
            <div class="d-flex align-items-center gap-2">\
                <span style="font-size:1.5em">&#128193;</span>\
                <span>Нет активных торрентов. Торренты появятся при использовании pidtor или Lampa.</span>\
            </div>\
        </div>';
        return;
    }

    var html = '<div class="table-responsive"><table class="table table-hover align-middle mb-0">';
    html += '<thead class="table-light"><tr>\
        <th style="width:40%">Торрент</th>\
        <th>Файлы</th>\
        <th>Пиры</th>\
        <th>Скорость</th>\
        <th>Загружено</th>\
        <th style="width:100px">Действия</th>\
    </tr></thead><tbody>';

    for (var i = 0; i < torrents.length; i++) {
        var t = torrents[i];
        var cache = t.cache && t.cache.Torrent ? t.cache.Torrent : null;
        var files = t.file_stats || [];
        var title = t.title || t.hash.substring(0, 12) + '...';

        // Clean [LAMPA] prefix from title.
        title = title.replace(/^\[LAMPA\]\s*/, '');

        var peers = cache ? cache.active_peers : 0;
        var seeders = cache ? cache.connected_seeders : 0;
        var speed = cache ? cache.download_speed : 0;
        var speedStr = formatSpeed(speed);
        var downloaded = cache ? cache.preloaded_bytes : 0;
        var preloadTotal = cache ? cache.preload_size : 0;
        var progress = preloadTotal > 0 ? Math.min(100, Math.round(downloaded / preloadTotal * 100)) : 0;

        var peerBadge = peers > 0
            ? '<span class="badge bg-success">' + peers + ' / ' + seeders + 's</span>'
            : '<span class="badge bg-secondary">0</span>';

        var speedBadge = speed > 0
            ? '<span class="badge bg-primary">' + speedStr + '</span>'
            : '<span class="badge bg-secondary">0</span>';

        var posterImg = t.poster
            ? '<img src="' + t.poster + '" style="width:40px;height:56px;object-fit:cover;border-radius:4px" class="me-2" onerror="this.style.display=\'none\'">'
            : '';

        html += '<tr>';
        html += '<td>' +
            '<div class="d-flex align-items-center">' +
            posterImg +
            '<div>' +
            '<div class="fw-semibold text-truncate" style="max-width:350px" title="' + escHtml(title) + '">' + escHtml(title) + '</div>' +
            '<small class="text-muted font-monospace">' + t.hash.substring(0, 16) + '...</small>' +
            '</div></div></td>';
        html += '<td><span class="badge bg-light text-dark border">' + files.length + '</span></td>';
        html += '<td>' + peerBadge + '</td>';
        html += '<td>' + speedBadge + '</td>';
        html += '<td>';
        if (preloadTotal > 0) {
            html += '<div class="progress" style="height:18px;min-width:80px"><div class="progress-bar ' +
                (progress >= 100 ? 'bg-success' : 'bg-primary') +
                '" style="width:' + progress + '%">' + progress + '%</div></div>';
        } else {
            html += '<span class="text-muted">-</span>';
        }
        html += '</td>';
        html += '<td>' +
            '<div class="btn-group btn-group-sm">' +
            '<button class="btn btn-outline-warning" title="Drop (остановить)" onclick="torrsAction(\'drop\',\'' + t.hash + '\')">&#9724;</button>' +
            '<button class="btn btn-outline-danger" title="Удалить" onclick="torrsAction(\'remove\',\'' + t.hash + '\')">&#128465;</button>' +
            '</div></td>';
        html += '</tr>';
    }

    html += '</tbody></table></div>';
    el.innerHTML = html;
}

function torrsAction(action, hash) {
    fetch('/admin/api/torrs/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action, hash: hash })
    })
        .then(function (r) { return r.json(); })
        .then(function () { loadTorrsData(); })
        .catch(function (err) { alert('Ошибка: ' + err.message); });
}

function formatSpeed(bytesPerSec) {
    if (bytesPerSec <= 0) return '0';
    if (bytesPerSec < 1024) return bytesPerSec + ' Б/с';
    if (bytesPerSec < 1048576) return (bytesPerSec / 1024).toFixed(1) + ' КБ/с';
    return (bytesPerSec / 1048576).toFixed(1) + ' МБ/с';
}

function torrsPlural(n) {
    if (n === 0) return 'ов';
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return '';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'а';
    return 'ов';
}

function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}
