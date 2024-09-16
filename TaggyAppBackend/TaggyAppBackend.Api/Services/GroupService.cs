using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Providers;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Services;

public class GroupService(
    AppDbContext dbContext,
    IGroupUserService groupUserService,
    IAuthContextProvider authContext,
    IPagingHelper pagingHelper,
    IMapper mapper
) : IGroupService
{
    public async Task<GetGroupDto> GetById(string id)
    {
        return mapper.Map<GetGroupDto>(await FindGroupAndVerifyAccess(id));
    }

    public async Task<PagedResults<GetGroupDto>> GetAll(SieveModel query)
    {
        var userId = authContext.GetUserId();

        var groups = dbContext.Groups
            .Include(g => g.GroupUsers)
            .ThenInclude(ug => ug.User)
            .Where(x => x.GroupUsers.Any(u => u.UserId == userId))
            .AsNoTracking();

       return await pagingHelper.ToPagedResults<Group, GetGroupDto>(groups, query);
    }

    public async Task<GetGroupDto> Create(CreateGroupDto dto)
    {
        var userId = authContext.GetUserId();
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);

        var group = mapper.Map<Group>(dto);

        var userGroup = new GroupUser
        {
            UserId = userId,
            User = user!,
            GroupId = group.Id,
            Role = GroupRole.Owner
        };

        group.GroupUsers.Add(userGroup);
        dbContext.Groups.Add(group);
        await dbContext.SaveChangesAsync();

        return mapper.Map<GetGroupDto>(group);
    }

    public async Task<GetGroupDto> Update(string id, UpdateGroupDto dto)
    {
        var group = await FindGroupAndVerifyAccess(id, GroupRole.Admin);

        mapper.Map(dto, group);
        await dbContext.SaveChangesAsync();

        return mapper.Map<GetGroupDto>(group);
    }

    public async Task<bool> Delete(string id)
    {
        var group = await FindGroupAndVerifyAccess(id, GroupRole.Owner);

        dbContext.Groups.Remove(group);
        return await dbContext.SaveChangesAsync() > 0;
    }

    private async Task<Group> FindGroupAndVerifyAccess(string id, GroupRole role = GroupRole.Normal)
    {
        await groupUserService.VerifyGroupAccess(id, role);

        var group = await dbContext.Groups
            .Include(g => g.GroupUsers)
            .ThenInclude(ug => ug.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        // Verify already checks if group exists
        return group!;
    }
}