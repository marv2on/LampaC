using Microsoft.AspNetCore.Http;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.PlaywrightCore;

namespace OnlineAnime
{
    public class OnlineApi : IModuleOnline, IModuleOnlineSpider
    {
        public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
        {
            var online = new List<ModuleOnlineItem>();
            var animeConf = ModInit.conf;
            bool isanime = args.isanime;

            void send(BaseSettings init, string plugin = null, string name = null)
            {
                online.Add(new(init, plugin, name));
            }

            if (args.original_language != null && args.original_language.Split("|")[0] is "ja" or "ko" or "zh" or "cn" or "th" or "vi" or "tl")
                send(animeConf.Kodik);

            if (args.serial == -1 || isanime)
            {
                send(animeConf.AniLiberty);
                send(animeConf.AnilibriaOnline, "anilibria", "Anilibria");
                send(animeConf.AnimeLib);
                send(animeConf.Animevost);
                send(animeConf.Animebesst);
                send(animeConf.Dreamerscast);
                send(animeConf.AnimeGo);
                send(animeConf.AniMedia);

                if (PlaywrightBrowser.Status != PlaywrightStatus.disabled)
                    send(animeConf.MoonAnime);
            }

            return online;
        }


        public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
        {
            if (!args.isanime)
                return null;

            var animeConf = ModInit.conf;
            var online = new List<ModuleOnlineSpiderItem>();

            void send(BaseSettings init, string plugin = null)
            {
                online.Add(new(init, plugin));
            }

            send(animeConf.Kodik);
            send(animeConf.AnimeLib);
            send(animeConf.AnilibriaOnline, "anilibria");
            send(animeConf.Animevost);
            send(animeConf.Animebesst);
            send(animeConf.MoonAnime);
            send(animeConf.AnimeGo);

            return online;
        }
    }
}
