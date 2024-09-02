using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;
using TaggyAppBackend.Api.Models.Entities.Interfaces;

namespace TaggyAppBackend.Api.Models.Entities.Master;

public class TaggyUser : IdentityUser, IEntity
{
    [MaxLength(255)] public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExp { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<Group> Groups { get; } = [];
    public List<Tag> Tags { get; } = [];
    public List<File> Files { get; } = [];
}