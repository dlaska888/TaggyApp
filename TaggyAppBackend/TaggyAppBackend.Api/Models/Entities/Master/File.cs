using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Sieve.Attributes;
using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class File : Entity
{
    [Sieve(CanFilter = true, CanSort = true, Name = "name")]
    [MaxLength(255)]
    public string UntrustedName { get; set; } = null!;

    [MaxLength(1024)] public string TrustedName { get; set; } = null!;

    [Sieve(CanFilter = true)]
    [MaxLength(255)]
    public string? Description { get; set; }

    [Sieve(CanFilter = true)]
    [MaxLength(255)]
    public string ContentType { get; set; } = null!;

    [Sieve(CanFilter = true, CanSort = true)]
    public long Size { get; set; }

    [MaxLength(36)] public string CreatorId { get; set; } = null!;
    public virtual TaggyUser Creator { get; set; } = null!;

    [MaxLength(36)] public string GroupId { get; set; } = null!;
    public virtual Group Group { get; set; } = null!;

    [DeleteBehavior(DeleteBehavior.NoAction)]
    public virtual ICollection<Tag> Tags { get; set; } = [];
}