using Microsoft.AspNetCore.Http;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineUKR
{
    public class OnlineApi : IModuleOnline
    {
        public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
        {
            var online = new List<ModuleOnlineItem>();
            bool isanime = args.isanime;

            void send(BaseSettings init)
            {
                online.Add(new(init, arg_title: " (Украинский)"));
            }

            if (KinoukrInvoke.KinoukrDb != null)
            {
                send(ModInit.conf.Ashdi);

                if (!isanime)
                    send(ModInit.conf.Kinoukr);
            }

            send(ModInit.conf.Eneyida);

            return online;
        }
    }
}
