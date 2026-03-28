using Shared.Models.Online.Settings;

namespace OnlineAnime
{
    public class ModuleConf
    {
        public KodikSettings Kodik { get; set; } = new KodikSettings("Kodik", "41dd95f84c21719b09d6c71182237a25", true)
        {
            displayindex = 100,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            apihost = "https://kodik-api.com",
            playerhost = "https://kodikplayer.com",
            linkhost = "https://kodikres.com",
            auto_proxy = true,
            cdn_is_working = true,
            headers = HeadersModel.Init(("referer", "https://anilib.me/")).ToDictionary()
        };

        public OnlinesSettings AnilibriaOnline { get; set; } = new OnlinesSettings("AnilibriaOnline", "https://api.anilibria.tv")
        {
            enable = false,
            displayindex = 105
        };

        public OnlinesSettings AniLiberty { get; set; } = new OnlinesSettings("AniLiberty", "https://api.anilibria.app")
        {
            displayindex = 110,
            stream_access = "apk,cors,web",
            httpversion = 2
        };

        public OnlinesSettings AnimeLib { get; set; } = new OnlinesSettings("AnimeLib", "https://api.cdnlibs.org", streamproxy: true, stream_access: "apk")
        {
            enable = false,
            rhub_safety = false,
            displayindex = 115,
            httpversion = 2,
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("origin", "https://animelib.org"),
                ("referer", "https://animelib.org/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("accept-encoding", "identity;q=1, *;q=0"),
                ("origin", "https://animelib.org"),
                ("referer", "https://animelib.org/"),
                ("sec-fetch-dest", "video"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary()
        };

        public OnlinesSettings AniMedia { get; set; } = new OnlinesSettings("AniMedia", "https://amd.online")
        {
            displayindex = 120
        };

        public OnlinesSettings Animevost { get; set; } = new OnlinesSettings("Animevost", "https://animevost.org")
        {
            displayindex = 125,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web",
            httptimeout = 10
        };

        public OnlinesSettings Dreamerscast { get; set; } = new OnlinesSettings("Dreamerscast", "https://dreamerscast.com")
        {
            displayindex = 130,
            rch_access = "apk",
            stream_access = "apk,cors",
            rchstreamproxy = "web"
        };

        public OnlinesSettings Animebesst { get; set; } = new OnlinesSettings("Animebesst", "https://anime1.best")
        {
            displayindex = 135,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            httpversion = 2
        };

        public OnlinesSettings MoonAnime { get; set; } = new OnlinesSettings("MoonAnime", "https://api.moonanime.art", token: "865fEF-E2e1Bc-2ca431-e6A150-780DFD-737C6B")
        {
            displayindex = 140,
            stream_access = "apk",
            rchstreamproxy = "web,cors",
            geo_hide = ["RU", "BY"]
        };

        public OnlinesSettings AnimeGo { get; set; } = new OnlinesSettings("AnimeGo", "https://animego.me", streamproxy: true, enable: false)
        {
            displayindex = 150,
            httpversion = 2,
            headers_stream = HeadersModel.Init(
                ("origin", "https://aniboom.one"),
                ("referer", "https://aniboom.one/")
            ).ToDictionary()
        };
    }
}
