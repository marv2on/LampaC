using Shared.Models.Online.Settings;

namespace OnlineRUS
{
    public class ModuleConf
    {
        public KinobaseSettings Kinobase { get; set; } = new KinobaseSettings("Kinobase", "https://kinobase.org", true, hdr: true)
        {
            displayindex = 505,
            httpversion = 2,
            stream_access = "apk,cors,web",
            geostreamproxy = ["ALL"]
        };

        public AllohaSettings Mirage { get; set; } = new AllohaSettings("Mirage", "https://api.apbugall.org", "https://quadrillion-as.allarknow.online", "6892d506bbdd5790e0ca047ff39462", "", true, true)
        {
            enable = false,
            displayindex = 510,
            streamproxy = true,
            httpversion = 2,
            headers = Http.defaultFullHeaders
        };

        public OnlinesSettings VideoDB { get; set; } = new OnlinesSettings("VideoDB", "https://kinogo.media", "https://30bf3790.obrut.show", streamproxy: true)
        {
            displayindex = 515,
            httpversion = 2,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            priorityBrowser = "http",
            imitationHuman = true,
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("sec-fetch-storage-access", "active"),
                ("upgrade-insecure-requests", "1")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("accept", "*/*"),
                ("origin", "https://kinogo.media"),
                ("referer", "https://kinogo.media/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary()
        };

        public OnlinesSettings FanCDN { get; set; } = new OnlinesSettings("FanCDN", "https://fanserial.me", streamproxy: true)
        {
            displayindex = 520,
            rch_access = "apk",
            rhub_safety = false,
            httpversion = 2,
            imitationHuman = true,
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("sec-fetch-storage-access", "active"),
                ("upgrade-insecure-requests", "1")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("origin", "https://fanserial.me"),
                ("referer", "https://fanserial.me/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary()
        };

        public OnlinesSettings FlixCDN { get; set; } = new OnlinesSettings("FlixCDN", "https://player0.flixcdn.space", "https://api0.flixcdn.biz/api", streamproxy: true)
        {
            enable = false,
            displayindex = 525,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            httpversion = 1,
            headers_stream = HeadersModel.Init(
                ("origin", "https://player0.flixcdn.space"),
                ("referer", "https://player0.flixcdn.space/"),
                ("sec-fetch-dest", "video"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };

        public OnlinesSettings Kinogo { get; set; } = new OnlinesSettings("Kinogo", "https://kinogo.luxury")
        {
            displayindex = 530,
            rch_access = "apk",
            stream_access = "apk,cors",
            rchstreamproxy = "web"
        };

        public OnlinesSettings CDNvideohub { get; set; } = new OnlinesSettings("CDNvideohub", "https://plapi.cdnvideohub.com", streamproxy: true)
        {
            displayindex = 540,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            httpversion = 2,
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("referer", "https://hdkino.pub/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };

        public OnlinesSettings LeProduction { get; set; } = new OnlinesSettings("LeProduction", "https://www.le-production.tv")
        {
            displayindex = 545,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web"
        };

        public OnlinesSettings VeoVeo { get; set; } = new OnlinesSettings("VeoVeo", "https://api.rstprgapipt.com")
        {
            displayindex = 550,
            httpversion = 2,
            stream_access = "apk,cors,web"
        };

        public CollapsSettings Collaps { get; set; } = new CollapsSettings("Collaps", "https://api.luxembd.ws", streamproxy: true, two: false)
        {
            displayindex = 555,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            apihost = "https://api.bhcesh.me",
            token = "eedefb541aeba871dcfc756e6b31c02e",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("Origin", "https://kinokrad.my")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("Origin", "https://kinokrad.my"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site"),
                ("accept", "*/*")
            ).ToDictionary()
        };

        public OnlinesSettings HDVB { get; set; } = new OnlinesSettings("HDVB", "https://vid1733431681.entouaedon.com", "https://apivb.com", token: "5e2fe4c70bafd9a7414c4f170ee1b192")
        {
            displayindex = 560,
            streamproxy = true,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("referer", "encrypt:kwwsv=22prylhode1rqh2")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("origin", "https://vid1733431681.entouaedon.com"),
                ("referer", "https://vid1733431681.entouaedon.com/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary()
        };

        public OnlinesSettings RutubeMovie { get; set; } = new OnlinesSettings("RutubeMovie", "https://rutube.ru")
        {
            displayindex = 565,
            streamproxy = true,
            rch_access = "apk,cors"
        };

        public OnlinesSettings VkMovie { get; set; } = new OnlinesSettings("VkMovie", "https://api.vkvideo.ru")
        {
            displayindex = 570,
            streamproxy = true,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("origin", "https://vkvideo.ru"),
                ("referer", "https://vkvideo.ru/")
            ).ToDictionary()
        };

        public OnlinesSettings Videoseed { get; set; } = new OnlinesSettings("Videoseed", "https://videoseed.tv", streamproxy: true, enable: false)
        {
            displayindex = 580,
            stream_access = "apk,cors,web",
            headers = Http.defaultFullHeaders,
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };

        public OnlinesSettings Vibix { get; set; } = new OnlinesSettings("Vibix", "https://vibix.org", enable: false)
        {
            displayindex = 585,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            httpversion = 2,
            headers = Http.defaultFullHeaders
        };

        public OnlinesSettings Kinotochka { get; set; } = new OnlinesSettings("Kinotochka", "https://kinovibe.vip")
        {
            displayindex = 590,
            httpversion = 2,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web"
        };
    }
}
