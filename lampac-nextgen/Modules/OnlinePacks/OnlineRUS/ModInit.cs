using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace OnlineRUS
{
    public class ModInit : IModuleLoaded
    {
        public static ModuleConf conf;

        public void Loaded(InitspaceModel baseconf)
        {
            updateConf();
            EventListener.UpdateInitFile += updateConf;
            EventListener.OnlineApiQuality += onlineApiQuality;

            Controllers.VeoVeo.database = JsonHelper.ListReader<Models.VeoVeo.Movie>("data/veoveo.json", 130_000).Result;
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
                case "mirage":
                case "videodb":
                case "rutubemovie":
                case "vkmovie":
                case "cdnvideohub":
                    return " ~ 2160p";
                case "kinobase":
                case "kinogo":
                case "vibix":
                case "videoseed":
                case "hdvb":
                case "collaps-dash":
                case "fancdn":
                case "veoveo":
                case "flixcdn":
                case "leproduction":
                    return " ~ 1080p";
                case "voidboost":
                case "kinotochka":
                case "collaps":
                    return " ~ 720p";
                case "cdnmovies":
                    return " - 360p";
                default:
                    return null;
            }
        }
    }
}
