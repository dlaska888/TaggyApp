using System.ComponentModel.DataAnnotations;
using TaggyAppBackend.Api.Models.Entities.Interfaces;

namespace TaggyAppBackend.Api.Models.Entities;

public class Entity : IEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; }
}