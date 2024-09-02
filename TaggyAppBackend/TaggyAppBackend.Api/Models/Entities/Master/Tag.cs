using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class Tag : Entity
{
    [MaxLength(50)] public string Name { get; set; } = null!;

    public List<TaggyUser> Users { get; } = [];
    public List<Group> Groups { get; } = [];
    public List<File> Files { get; } = [];
}