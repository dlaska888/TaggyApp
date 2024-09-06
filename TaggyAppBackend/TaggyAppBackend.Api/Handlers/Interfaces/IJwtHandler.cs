using Google.Apis.Auth;
using TaggyAppBackend.Api.Models.Dtos.Auth;
using TaggyAppBackend.Api.Models.Entities.Master;

namespace TaggyAppBackend.Api.Handlers.Interfaces;

public interface IJwtHandler
{
    string GenerateJwtToken(TaggyUser user);
    string GenerateRefreshToken();
    Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalAuthDto dto);
}