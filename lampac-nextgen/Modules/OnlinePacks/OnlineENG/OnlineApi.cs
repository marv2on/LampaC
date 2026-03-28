using Microsoft.AspNetCore.Http;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.PlaywrightCore;

namespace OnlineENG
{
    public class OnlineApi : IModuleOnline
    {
        public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
        {
            var online = new List<ModuleOnlineItem>();

            if ((args.original_language == null || args.original_language == "en") && CoreInit.conf.disableEng == false)
            {
                if (args.source != null && (args.source is "tmdb" or "cub") && long.TryParse(args.id, out long _id) && _id > 0)
                {
                    void send(BaseSettings init, string plugin, string name)
                    {
                        online.Add(new(init, plugin, name, " (ENG)"));
                    }

                    if (PlaywrightBrowser.Status != PlaywrightStatus.disabled)
                    {
                        send(ModInit.conf.Hydraflix, "hydraflix", "HydraFlix");
                        send(ModInit.conf.Vidsrc, "vidsrc", "VidSrc");
                        send(ModInit.conf.VidLink, "vidlink", "VidLink");
                        send(ModInit.conf.Videasy, "videasy", "Videasy");
                        send(ModInit.conf.MovPI, "movpi", "MovPI");
                        send(ModInit.conf.Smashystream, "smashystream", "SmashyStream");
                        send(ModInit.conf.Autoembed, "autoembed", "AutoEmbed");
                        send(ModInit.conf.Playembed, "playembed", "PlayEmbed");
                    }

                    if (Firefox.Status != PlaywrightStatus.disabled)
                        send(ModInit.conf.Twoembed, "twoembed", "2Embed");

                    send(ModInit.conf.Rgshows, "rgshows", "RgShows");
                }
            }

            return online;
        }
    }
}
