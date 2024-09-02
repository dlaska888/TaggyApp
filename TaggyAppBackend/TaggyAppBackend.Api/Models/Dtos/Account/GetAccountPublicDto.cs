namespace TaggyAppBackend.Api.Models.Dtos.Account;

public class GetAccountPublicDto : GetDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
}