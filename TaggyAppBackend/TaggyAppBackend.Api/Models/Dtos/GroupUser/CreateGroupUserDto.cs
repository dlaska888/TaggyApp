using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.GroupUser;

public class CreateGroupUserDto
{
    public string UserName { get; set; } = null!;
    public GroupRole Role { get; set; }
}