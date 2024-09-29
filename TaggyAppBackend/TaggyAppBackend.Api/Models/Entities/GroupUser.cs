using Microsoft.EntityFrameworkCore;
using Sieve.Attributes;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Entities;

[PrimaryKey(nameof(UserId), nameof(GroupId))]
public class GroupUser
{
    public GroupRole Role { get; set; }

    public string UserId { get; set; }
    public virtual TaggyUser User { get; set; } = null!;

    public string GroupId { get; set; }
    public virtual Group Group { get; set; } = null!;
    
    [Sieve(CanFilter = true, CanSort = true)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}