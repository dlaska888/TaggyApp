namespace TaggyAppBackend.Api.Providers;

public interface IAuthContextProvider
{
    string GetUserId();
    string GetUserEmail();
    string GetUserName();
}