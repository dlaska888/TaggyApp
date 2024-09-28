using System.ComponentModel.DataAnnotations;
using Sieve.Attributes;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class Group : Entity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [MaxLength(255)]
    public string Name { get; set; } = null!;

    [Sieve(CanFilter = true)]
    [MaxLength(255)]
    public string? Description { get; set; }

    public virtual ICollection<GroupUser> GroupUsers { get; } = [];
    public virtual ICollection<Tag> Tags { get; } = [];
    public virtual ICollection<File> Files { get; } = [];
}