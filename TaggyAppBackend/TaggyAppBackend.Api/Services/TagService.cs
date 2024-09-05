using System.Collections;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Providers;
using TaggyAppBackend.Api.Services.Interfaces;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Services;

public class TagService(
    AppDbContext dbContext,
    IGroupUserService groupUserService,
    IPagingHelper pagingHelper,
    IMapper mapper)
    : ITagService
{
    public async Task<GetTagDto> GetById(string groupId, string tagId)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var tag = await dbContext.Tags.FirstOrDefaultAsync(x => x.Id == tagId);
        if (tag == null)
            throw new NotFoundException("Tag not found");

        return mapper.Map<GetTagDto>(tag);
    }

    public async Task<PagedResults<GetTagDto>> GetAllByGroupId(string groupId, SieveModel query)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var tags = dbContext.Tags
            .Include(x => x.Files)
            .Where(x => x.Files.Any(f => f.GroupId == groupId))
            .AsNoTracking();

        return await pagingHelper.ToPagedResults<Tag, GetTagDto>(tags, query);
    }

    public async Task<GetTagDto> Create(string groupId, CreateTagDto dto)
    {
        var group = await FindGroupAndVerifyAccess(groupId, GroupRole.Admin);

        var tag = new Tag
        {
            Name = dto.Name,
        };

        dbContext.Tags.Add(tag);
        group.Tags.Add(tag);

        await dbContext.SaveChangesAsync();
        return mapper.Map<GetTagDto>(tag);
    }

    public async Task<GetTagDto> Update(string groupId, string tagId, UpdateTagDto dto)
    {
        await groupUserService.VerifyGroupAccess(groupId, GroupRole.Admin);

        var tag = await dbContext.Tags
            .Include(x => x.Files)
            .FirstOrDefaultAsync(x => x.Id == tagId);

        if (tag == null)
            throw new NotFoundException("Tag not found");

        mapper.Map(dto, tag);
        await dbContext.SaveChangesAsync();

        return mapper.Map<GetTagDto>(tag);
    }

    public async Task<bool> Delete(string groupId, string tagId)
    {
        await groupUserService.VerifyGroupAccess(groupId, GroupRole.Admin);

        var tag = await dbContext.Tags
            .Include(x => x.Files)
            .FirstOrDefaultAsync(x => x.Id == tagId);

        if (tag == null)
            throw new NotFoundException("Tag not found");

        dbContext.Tags.Remove(tag);
        await dbContext.SaveChangesAsync();

        return true;
    }

    #region Private Methods

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

    #endregion
}