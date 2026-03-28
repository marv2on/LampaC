using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineAnime
{
    public class ModInit : IModuleLoaded
    {
        public static ModuleConf conf;

        public void Loaded(InitspaceModel baseconf)
        {
            updateConf();
            EventListener.UpdateInitFile += updateConf;
            EventListener.OnlineApiQuality += onlineApiQuality;

            //Kodik.database = JsonHelper.ListReader<Models.Kodik.Result>("data/kodik.json", 100_000);
        }

        public void Dispose()
        {
            EventListener.UpdateInitFile -= updateConf;
            EventListener.OnlineApiQuality -= onlineApiQuality;
        }

        void updateConf()
        {
            conf = ModuleInvoke.DeserializeInit(new ModuleConf());
        }

        string onlineApiQuality(EventOnlineApiQuality e)
        {
            switch (e.balanser)
            {
                case "animelib":
                    return " ~ 2160p";
                case "anilibria":
                case "aniliberty":
                case "animego":
                case "moonanime":
                case "dreamerscast":
                    return " ~ 1080p";
                case "animedia":
                case "animevost":
                case "animebesst":
                case "kodik":
                    return " ~ 720p";
                default:
                    return null;
            }
        }
    }
}
