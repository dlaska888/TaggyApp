using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Dtos.Auth;

public class RegisterDto
{
    [DefaultValue("username")]
    public string Username { get; set; } = null!;
    [DefaultValue("email@email.com")]
    public string Email { get; set; } = null!;
    [DefaultValue("!QAZ3wsx1234")]
    public string Password { get; set; } = null!;

    [Compare("Password", ErrorMessage = "The new password and confirmation password do not match.")]
    [DefaultValue("!QAZ3wsx1234")]
    public string ConfirmPassword { get; set; } = null!;
}