using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Entities;

public class UserGroup : Entity
{
    public GroupRole Role { get; set; }

    public Guid UserId { get; set; }
    public virtual TaggyUser User { get; set; } = null!;
    
    public Guid GroupId { get; set; }
    public virtual Group Group { get; set; } = null!;
}