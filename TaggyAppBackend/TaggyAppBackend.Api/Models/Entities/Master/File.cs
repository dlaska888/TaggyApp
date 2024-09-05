using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Sieve.Attributes;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class File : Entity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [MaxLength(255)] public string Name { get; set; } = null!;
    
    [Sieve(CanFilter = true)]
    [MaxLength(255)] public string? Description { get; set; }

    [MaxLength(1024)] public string Path { get; set; } = null!;

    [MaxLength(36)]
    public string CreatorId { get; set; } = null!;
    public virtual TaggyUser Creator { get; set; } = null!;
    
    [MaxLength(36)]
    public string GroupId { get; set; } = null!;
    public virtual Group Group { get; set; } = null!;

    public virtual ICollection<Tag> Tags { get; set; } = [];
}