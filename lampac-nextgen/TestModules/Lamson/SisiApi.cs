using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lamson
{
    public class SisiApi : IModuleSisi, IModuleSisiAsync
    {
        public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
        {
            return new List<SisiModuleItem>()
            {
                new SisiModuleItem("PornGram", new BaseSettings() { enable = true }, "porngram", 1)
            };
        }


        public Task<List<SisiModuleItem>> InvokeAsync(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
        {
            return Task.FromResult(default(List<SisiModuleItem>));
        }
    }
}
