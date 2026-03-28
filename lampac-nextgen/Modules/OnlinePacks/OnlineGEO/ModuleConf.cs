using Shared.Models.Online.Settings;

namespace OnlineGEO
{
    public class ModuleConf
    {
        public OnlinesSettings Kinoflix { get; set; } = new OnlinesSettings("Kinoflix", "https://kinoflix.tv", streamproxy: true)
        {
            displayindex = 900,
            rch_access = "apk",
            stream_access = "apk",
            rchstreamproxy = "web,cors",
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("referer", "https://kinoflix.tv"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        };

        public OnlinesSettings Geosaitebi { get; set; } = new OnlinesSettings("Geosaitebi", "https://geosaitebi.tv", streamproxy: true)
        {
            displayindex = 905,
            rch_access = "apk,cors",
            stream_access = "apk",
            rchstreamproxy = "web,cors",
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("Origin", "https://geosaitebi.tv"),
                ("referer", "https://geosaitebi.tv/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site"),
                ("accept", "*/*")
            ).ToDictionary()
        };

        public OnlinesSettings AsiaGe { get; set; } = new OnlinesSettings("AsiaGe", "https://asia.com.ge")
        {
            displayindex = 910,
            rch_access = "apk,cors",
            stream_access = "apk,web,cors"
        };
    }
}
