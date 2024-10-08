using Sieve.Attributes;
using TaggyAppBackend.Api.Models.Dtos.GroupUser;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class GetGroupDto : GetDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public GroupRole CurrentUserRole { get; set; }
    public IEnumerable<GetGroupUserDto> Users { get; set; } = [];
    public IEnumerable<GetTagDto> Tags { get; set; } = [];
 }