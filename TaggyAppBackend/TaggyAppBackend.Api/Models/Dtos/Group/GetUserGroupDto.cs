using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class GetUserGroupDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public GroupRole Role { get; set; }
}