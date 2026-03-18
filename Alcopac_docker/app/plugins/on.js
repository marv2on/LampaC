(function () {
    'use strict';

    // Prevent conflict if both lampac and alcopac on.js are loaded
    if (window.alcopac_onjs) return;
    window.alcopac_onjs = true;
    window.alcopac = true;

    // Disable LGBT content filter (Lampa beta feature) — prevents lgbt.forEach crash
    if (!window.lampa_settings) window.lampa_settings = {};
    if (!window.lampa_settings.disable_features) window.lampa_settings.disable_features = {};
    window.lampa_settings.disable_features.lgbt = true;

    var timer = setInterval(function(){
        if(typeof Lampa !== 'undefined'){
            clearInterval(timer);

            var unic_id = Lampa.Storage.get('lampac_unic_id', '');
            if (!unic_id) {
              unic_id = Lampa.Utils.uid(8).toLowerCase();
              Lampa.Storage.set('lampac_unic_id', unic_id);
            }

            Lampa.Utils.putScriptAsync([{plugins}], function() {});
        }
    },200);
})();