using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class File : Entity
{
    [MaxLength(255)] public string Name { get; set; } = null!;
    
    [MaxLength(255)] public string? Description { get; set; }

    [MaxLength(1024)] public string Path { get; set; } = null!;

    public string CreatorId { get; set; }
    public virtual TaggyUser Creator { get; set; } = null!;
    
    public string GroupId { get; set; }
    public virtual Group Group { get; set; } = null!;

    public List<Tag> Tags { get; } = [];
}