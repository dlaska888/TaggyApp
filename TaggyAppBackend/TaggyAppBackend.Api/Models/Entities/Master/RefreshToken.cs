using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class RefreshToken
{
    [Key] public string Token { get; set; } = Guid.NewGuid().ToString();
    public DateTime Expiration { get; set; }
    public string UserId { get; set; } = null!;
    public virtual TaggyUser User { get; set; } = null!;
}