using Microsoft.AspNetCore.Mvc;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos.Auth;

namespace TaggyAppBackend.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class Auth(IAuthHelper authHelper) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        return Ok(await authHelper.SignUp(model));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        return Ok(await authHelper.SignIn(model));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        return Ok(await authHelper.Refresh(refreshToken));
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        return Ok(await authHelper.ConfirmEmail(userId, token));
    }
}