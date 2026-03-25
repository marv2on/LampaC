using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace WebLog
{
    public class ModInit : IModuleLoaded
    {
        public void Loaded(InitspaceModel initspace)
        {
            LogEvents.Start();
        }

        public void Dispose()
        {
            LogEvents.Stop();
        }
    }
}
