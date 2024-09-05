using System.ComponentModel.DataAnnotations;
using Sieve.Attributes;
using TaggyAppBackend.Api.Models.Entities.Interfaces;

namespace TaggyAppBackend.Api.Models.Entities;

public class Entity : IEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Sieve(CanFilter = true, CanSort = true)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}