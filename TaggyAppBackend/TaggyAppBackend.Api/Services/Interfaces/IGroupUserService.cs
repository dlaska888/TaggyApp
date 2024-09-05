using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.GroupUser;
using TaggyAppBackend.Api.Models.Enums;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IGroupUserService
{
    Task<GetGroupUserDto> GetById(string groupId, string userId);
    Task<PagedResults<GetGroupUserDto>> GetAll(string groupId, SieveModel query);
    Task<GetGroupUserDto> Create(string groupId, CreateGroupUserDto dto);
    Task<GetGroupUserDto> Update(string groupId, string userId, UpdateGroupUserDto dto);
    Task<bool> Delete(string groupId, string userId);
    
    Task VerifyGroupAccess(string groupId, GroupRole role = GroupRole.Normal);
}
