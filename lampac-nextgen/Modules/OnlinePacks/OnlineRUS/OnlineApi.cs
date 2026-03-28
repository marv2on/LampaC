using Microsoft.AspNetCore.Http;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.PlaywrightCore;

namespace OnlineRUS
{
    public class OnlineApi : IModuleOnline, IModuleOnlineSpider
    {
        public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
        {
            var online = new List<ModuleOnlineItem>();

            void send(BaseSettings init, string plugin = null, string name = null)
            {
                online.Add(new ModuleOnlineItem(init, plugin: plugin, name: name));
            }

            send(ModInit.conf.Vibix);
            send(ModInit.conf.VeoVeo);
            send(ModInit.conf.HDVB);
            send(ModInit.conf.Kinotochka);
            send(ModInit.conf.Collaps);

            if (!args.isanime)
                send(ModInit.conf.FlixCDN);

            if (PlaywrightBrowser.Status != PlaywrightStatus.disabled)
            {
                send(ModInit.conf.Mirage);
                send(ModInit.conf.Kinobase);
                send(ModInit.conf.Kinogo);
                send(ModInit.conf.Videoseed);
            }

            if (args.kinopoisk_id > 0)
            {
                send(ModInit.conf.CDNvideohub, "cdnvideohub", "VideoHUB");

                if (ModInit.conf.VideoDB.rhub || ModInit.conf.VideoDB.priorityBrowser == "http" || PlaywrightBrowser.Status != PlaywrightStatus.disabled)
                    send(ModInit.conf.VideoDB);

                if (args.serial == -1 || args.serial == 0)
                    send(ModInit.conf.FanCDN);
            }

            if (args.serial == -1 || args.serial == 0)
            {
                if (!args.isanime)
                    send(ModInit.conf.LeProduction);

                send(ModInit.conf.RutubeMovie, "rutubemovie", "Rutube");
                send(ModInit.conf.VkMovie, "vkmovie", "VK Видео");
            }

            return online;
        }

        public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
        {
            return new List<ModuleOnlineSpiderItem>
            {
                new(ModInit.conf.Kinogo),
                new(ModInit.conf.Kinobase),
                new(ModInit.conf.VeoVeo, "veoveo-spider"),
                new(ModInit.conf.HDVB, "hdvb-search"),
                new(ModInit.conf.Collaps, "collaps-search")
            };
        }
    }
}
