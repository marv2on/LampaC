namespace Shared.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class AuthorizeAnonymousAttribute : Attribute
    {
    }
}
