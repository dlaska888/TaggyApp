using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.GroupUser;

public class UpdateGroupUserDto
{
    public GroupRole Role { get; set; }
}