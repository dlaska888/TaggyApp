using System.ComponentModel;

namespace TaggyAppBackend.Api.Models.Dtos.Auth;

public class LoginDto
{
    [DefaultValue("username")] public string UserName { get; set; } = null!;
    [DefaultValue("!QAZ3wsx1234")] public string Password { get; set; } = null!;
}