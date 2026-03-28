using Microsoft.AspNetCore.Http;
using Shared;
using Shared.Models.Base;
using System;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Lamson
{
    /// <summary>
    /// ModInit.cs
    /// EventListener.Middleware
    /// </summary>
    public static class Middlewares
    {
        public static bool Invoke(bool first, HttpContext httpContext)
        {
            var requestInfo = httpContext.Features.Get<RequestModel>();
            if (first || requestInfo.IsLocalRequest || requestInfo.IsAnonymousRequest)
                return true;

            if (Regex.IsMatch(httpContext.Request.Path.Value, "^/(kinogram|porngram|lamson)"))
                httpContext.Response.Headers["X-Lamson"] = "Middleware was here";

            return true;
        }

        async public static Task<bool> InvokeAsync(bool first, HttpContext httpContext)
        {
            if (!first)
                return true;

            if (httpContext.Request.Path.Value.StartsWith("/lamson"))
            {
                string token = Regex.Match(httpContext.Request.QueryString.Value, "(\\?|&)token=([^&]+)").Groups[2].Value;
                if (string.IsNullOrWhiteSpace(token))
                {
                    using (var ctsHttp = CancellationTokenSource.CreateLinkedTokenSource(httpContext.RequestAborted))
                    {
                        ctsHttp.CancelAfter(TimeSpan.FromSeconds(CoreInit.conf.listen.ResponseCancelAfter));

                        httpContext.Response.ContentType = "application/json; charset=utf-8";
                        await httpContext.Response.WriteAsync("[{\"error\":\"token == null\"}]", ctsHttp.Token);
                        return false;
                    }
                }
            }

            //bool isvip = (await Http.Get($"http://myapi.com/vip?token={token}")) == "OK";
            bool isvip = true;
            if (isvip)
                return true;

            return false;
        }
    }
}
