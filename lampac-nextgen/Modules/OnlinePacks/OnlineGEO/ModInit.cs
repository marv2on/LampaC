using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineGEO
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
                case "kinoflix":
                case "asiage":
                    return " ~ 1080p";
                case "geosaitebi":
                    return " ~ 720p";
                default:
                    return null;
            }
        }
    }
}
