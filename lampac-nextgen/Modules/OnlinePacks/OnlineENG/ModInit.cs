using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineENG
{
    public class ModInit : IModuleLoaded
    {
        public static ModuleConf conf;

        public void Loaded(InitspaceModel baseconf)
        {
            updateConf();
            EventListener.UpdateInitFile += updateConf;
            EventListener.OnlineApiQuality += onlineApiQuality;
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
                case "playembed":
                case "rgshows":
                case "twoembed":
                case "vidsrc":
                case "smashystream":
                case "hydraflix":
                case "movpi":
                case "videasy":
                case "vidlink":
                case "autoembed":
                    return " ~ 1080p";
                default:
                    return null;
            }
        }
    }
}
