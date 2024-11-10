using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using TaggyAppBackend.Api.Models.Entities.Interfaces;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class TaggyUser : IdentityUser, IEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<RefreshToken> RefreshTokens { get; } = [];    
    public virtual ICollection<GroupUser> GroupUsers { get; } = [];
    public virtual ICollection<File> Files { get; } = [];
}