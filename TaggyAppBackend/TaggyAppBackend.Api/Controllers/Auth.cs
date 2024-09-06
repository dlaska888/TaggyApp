using Microsoft.AspNetCore.Mvc;
using TaggyAppBackend.Api.Models.Dtos.Auth;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class Auth(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        return Ok(await authService.SignUp(dto));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        return Ok(await authService.SignIn(dto));
    }
    
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] ExternalAuthDto dto)
    {
        return Ok(await authService.GoogleSignIn(dto));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        return Ok(await authService.Refresh(refreshToken));
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        return Ok(await authService.ConfirmEmail(userId, token));
    }
}