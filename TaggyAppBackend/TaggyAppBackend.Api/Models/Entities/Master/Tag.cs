using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Sieve.Attributes;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class Tag : Entity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [MaxLength(50)]
    public string Name { get; set; } = null!;
    
    [MaxLength(36)]
    public string GroupId { get; set; } = null!;
    public virtual Group Group { get; set; } = null!;
    
    [DeleteBehavior(DeleteBehavior.NoAction)]
    public virtual ICollection<File> Files { get; } = [];
}