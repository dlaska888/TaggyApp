using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class Group : Entity
{
    [MaxLength(255)] public string Name { get; set; } = null!;
    [MaxLength(255)] public string? Description { get; set; }

    public List<TaggyUser> Users { get; } = [];
    public List<Tag> Tags { get; } = [];
    public List<File> Files { get; } = [];
}