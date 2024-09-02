using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Models.Dtos.UserGroup;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IGroupService : IService<GetGroupDto, CreateGroupDto, UpdateGroupDto>
{
    // add user to group
    // any role
    public Task<bool> AddUserGroup(string groupId, string userId);

    // update user in group
    // change permissions according to role
    // admin -> can set everyone
    // moderator -> can set moderators
    // normal -> none
    public Task<bool> CreateUserGroup(string groupId, string userId, UpdateUserGroupDto dto);

    // remove user from group
    // admin +
    public Task<bool> RemoveUserGroup(string groupId, string userId, UpdateUserGroupDto dto);   


}