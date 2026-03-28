using Shared.Models.Online.Settings;

namespace Online.Config
{
    public class SiteConf
    {
        /// <summary>
        /// api.vokino.org
        /// api.vokino.pro
        /// </summary>
        public VokinoSettings VoKino { get; set; } = new VokinoSettings("VoKino", "http://api.vokino.org")
        {
            displayindex = 300,
            streamproxy = false,
            rchstreamproxy = "web",
            rhub_safety = false
        };

        /// <summary>
        /// http://filmixapp.cyou
        /// http://filmixapp.vip
        /// http://fxapp.biz
        /// </summary>
        public FilmixSettings Filmix { get; set; } = new FilmixSettings("Filmix", "http://filmixapp.cyou")
        {
            displayindex = 305,
            rhub_safety = false,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            reserve = false,
            headers = HeadersModel.Init(
                ("Accept-Encoding", "gzip")
            ).ToDictionary()
        };

        public FilmixSettings FilmixTV { get; set; } = new FilmixSettings("FilmixTV", "https://api.filmix.tv")
        {
            enable = false,
            displayindex = 310,
            httpversion = 2,
            rhub_safety = false,
            pro = true,
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(
                ("user-agent", "Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) 76.0.3809.146/6.0 TV Safari/537.36")
            ).ToDictionary()
        };

        public FilmixSettings FilmixPartner { get; set; } = new FilmixSettings("FilmixPartner", "http://5.61.56.18/partner_api")
        {
            enable = false,
            displayindex = 315,
            stream_access = "apk,cors,web"
        };

        /// <summary>
        /// https://api.srvkp.com - стандартный
        /// https://cdn32.lol/api- apk
        /// https://cdn4t.store/api - apk
        /// https://kpapp.link/api - smart tv
        /// https://api.service-kp.com - старый
        /// </summary>
        public KinoPubSettings KinoPub { get; set; } = new KinoPubSettings("KinoPub", "https://api.srvkp.com")
        {
            displayindex = 320,
            httpversion = 2,
            rhub_safety = false,
            filetype = "hls", // hls | hls4 | mp4
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("sec-fetch-dest", "document"),
                ("sec-fetch-mode", "navigate"),
                ("sec-fetch-site", "none"),
                ("sec-fetch-user", "?1"),
                ("upgrade-insecure-requests", "1")
            ).ToDictionary()
        };

        public AllohaSettings Alloha { get; set; } = new AllohaSettings("Alloha", "https://apbugall.org/v2", "https://torso-as.stloadi.live", "", "", true, true)
        {
            displayindex = 325,
            httpversion = 2,
            rch_access = "apk,cors,web",
            stream_access = "apk,cors,web",
            reserve = true
        };

        public RezkaSettings Rezka { get; set; } = new RezkaSettings("Rezka", "https://hdrezka.me", true)
        {
            displayindex = 330,
            stream_access = "apk,cors,web",
            ajax = true,
            reserve = true,
            hls = true,
            scheme = "http",
            headers = Http.defaultUaHeaders
        };

        public RezkaSettings RezkaPrem { get; set; } = new RezkaSettings("RezkaPrem", null)
        {
            enable = false,
            rhub_safety = false,
            displayindex = 331,
            stream_access = "apk,cors,web",
            reserve = true,
            hls = true,
            scheme = "http"
        };

        public OnlinesSettings GetsTV { get; set; } = new OnlinesSettings("GetsTV", "https://getstv.com")
        {
            enable = false,
            displayindex = 335,
            stream_access = "apk,cors,web",
            rhub_safety = false,
            headers = HeadersModel.Init(
                ("user-agent", "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.34 Safari/537.36 WebAppManager")
            ).ToDictionary()
        };

        public OnlinesSettings iRemux { get; set; } = new OnlinesSettings("iRemux", "https://megaoblako.com")
        {
            enable = false,
            displayindex = 340,
            rchstreamproxy = "web",
            geostreamproxy = ["UA"]
        };

        /// <summary>
        /// https://iptv.online/ru/dealers/api
        /// </summary>
        public OnlinesSettings IptvOnline { get; set; } = new OnlinesSettings("IptvOnline", "https://iptv.online", enable: false)
        {
            displayindex = 345,
            rhub_safety = false
        };
    }
}
