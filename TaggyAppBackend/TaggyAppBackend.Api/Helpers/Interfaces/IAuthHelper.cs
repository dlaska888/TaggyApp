using TaggyAppBackend.Api.Models.Dtos.Auth;

namespace TaggyAppBackend.Api.Helpers.Interfaces;

public interface IAuthHelper
{
    Task<TokenDto> SignIn(LoginDto dto);
    Task<bool> SignUp(RegisterDto dto);
    Task<TokenDto> Refresh(string refreshToken);
    Task<bool> ConfirmEmail(string userId, string token);
}