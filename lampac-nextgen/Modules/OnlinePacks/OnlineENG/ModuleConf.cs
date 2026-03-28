using Shared.Models.Online.Settings;

namespace OnlineENG
{
    public class ModuleConf
    {
        /// <summary>
        /// https://www.hydraflix.vip
        /// </summary>
        public OnlinesSettings Hydraflix { get; set; } = new OnlinesSettings("Hydraflix", "https://vidfast.pro")
        {
            displayindex = 1000,
            streamproxy = true,
            priorityBrowser = "firefox"
        };

        /// <summary>
        /// https://vidsrc.xyz
        /// https://vidsrc.pro
        /// https://vidsrc.to
        /// </summary>
        public OnlinesSettings Vidsrc { get; set; } = new OnlinesSettings("Vidsrc", "https://vidsrc.cc")
        {
            displayindex = 1005,
            streamproxy = true
        };

        /// <summary>
        /// https://day2soap.xyz
        /// </summary>
        public OnlinesSettings VidLink { get; set; } = new OnlinesSettings("VidLink", "https://vidlink.pro")
        {
            displayindex = 1015,
            streamproxy = true
        };

        public OnlinesSettings Videasy { get; set; } = new OnlinesSettings("Videasy", "https://player.videasy.net")
        {
            displayindex = 1020,
            streamproxy = true
        };

        public OnlinesSettings MovPI { get; set; } = new OnlinesSettings("MovPI", "https://moviesapi.club")
        {
            displayindex = 1025,
            streamproxy = true
        };


        /// <summary>
        /// https://smashystream.xyz
        /// </summary>
        public OnlinesSettings Smashystream { get; set; } = new OnlinesSettings("Smashystream", "https://player.smashystream.com")
        {
            displayindex = 1030,
            streamproxy = true
        };

        public OnlinesSettings Autoembed { get; set; } = new OnlinesSettings("Autoembed", "https://player.autoembed.cc")
        {
            enable = false,
            displayindex = 1035,
            streamproxy = true
        };

        /// <summary>
        /// Omega
        /// </summary>
        public OnlinesSettings Playembed { get; set; } = new OnlinesSettings("Playembed", "https://vidora.su")
        {
            enable = false,
            displayindex = 1040,
            streamproxy = true
        };

        /// <summary>
        /// EmbedSu
        /// </summary>
        public OnlinesSettings Twoembed { get; set; } = new OnlinesSettings("Twoembed", "https://embed.su")
        {
            enable = false,
            displayindex = 1045,
            streamproxy = true,
            headers_stream = HeadersModel.Init(
                ("accept", "*/*"),
                ("accept-language", "en-US,en;q=0.5"),
                ("referer", "https://embed.su/"),
                ("origin", "https://embed.su"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };

        public OnlinesSettings Rgshows { get; set; } = new OnlinesSettings("Rgshows", "https://api.rgshows.me")
        {
            enable = false,
            displayindex = 1050,
            streamproxy = true,
            headers = HeadersModel.Init(
                ("accept", "*/*"),
                ("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"),
                ("accept-language", "en-US,en;q=0.5"),
                ("referer", "https://www.rgshows.me/"),
                ("origin", "https://www.rgshows.me"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(
                ("accept", "*/*"),
                ("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"),
                ("accept-language", "en-US,en;q=0.5"),
                ("referer", "https://www.rgshows.me/"),
                ("origin", "https://www.rgshows.me"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };
    }
}
