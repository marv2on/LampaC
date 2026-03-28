using Newtonsoft.Json;
using OnlineUKR.Models.KinoUkr;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Threading;

namespace OnlineUKR
{
    public class ModInit : IModuleLoaded
    {
        public static ModuleConf conf;
        static Timer kinoukrTimer;

        public void Loaded(InitspaceModel baseconf)
        {
            updateConf();
            EventListener.UpdateInitFile += updateConf;
            EventListener.OnlineApiQuality += onlineApiQuality;

            KinoukrInvoke.KinoukrDb = JsonConvert.DeserializeObject<ConcurrentDictionary<string, Model>>(File.ReadAllText("data/kinoukr.json"));
            kinoukrTimer = new Timer(KurwaCron.Kinoukr, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(20));
        }

        public void Dispose()
        {
            EventListener.UpdateInitFile -= updateConf;
            EventListener.OnlineApiQuality -= onlineApiQuality;
            kinoukrTimer?.Dispose();
        }

        void updateConf()
        {
            conf = ModuleInvoke.DeserializeInit(new ModuleConf());
        }

        string onlineApiQuality(EventOnlineApiQuality e)
        {
            switch (e.balanser)
            {
                case "eneyida":
                case "kinoukr":
                case "ashdi":
                    return " ~ 1080p";
                default:
                    return null;
            }
        }
    }
}
