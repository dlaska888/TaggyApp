namespace TaggyAppBackend.Api.Models.Dtos.Account;

public class GetAccountDto : GetDto
{
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool EmailConfirmed { get; set; }
    public string PrivateGroupId { get; set; } = null!;
}