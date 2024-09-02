using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.UserGroup;

public class UpdateUserGroupDto
{
    public GroupRole Role { get; set; }
}