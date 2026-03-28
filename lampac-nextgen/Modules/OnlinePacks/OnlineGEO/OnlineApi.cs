using Microsoft.AspNetCore.Http;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineGEO
{
    public class OnlineApi : IModuleOnline
    {
        public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
        {
            var online = new List<ModuleOnlineItem>();
            bool iscn = args.original_language is "ja" or "ko" or "zh" or "cn";

            void send(BaseSettings init, string plugin = null, string name = null)
            {
                online.Add(new(init, plugin, name, arg_title: " (Грузинский)"));
            }

            if (args.kinopoisk_id > 0 && !iscn)
                send(ModInit.conf.Kinoflix);

            if (args.serial == -1 || args.serial == 0)
                send(ModInit.conf.Geosaitebi);

            if (args.serial == 1)
            {
                if (args.original_language != null && args.original_language.Split("|")[0] is "ko" or "cn")
                    send(ModInit.conf.AsiaGe);
            }

            return online;
        }
    }
}
