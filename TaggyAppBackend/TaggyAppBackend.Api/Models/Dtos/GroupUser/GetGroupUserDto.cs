using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.GroupUser;

public class GetGroupUserDto : GetDto
{
    public string UserId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public GroupRole Role { get; set; }
}