using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using TaggyAppBackend.Api.Models.Entities.Interfaces;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class TaggyUser : IdentityUser, IEntity
{
    [MaxLength(255)] public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExp { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<GroupUser> GroupUsers { get; } = [];
    public virtual ICollection<File> Files { get; } = [];
}