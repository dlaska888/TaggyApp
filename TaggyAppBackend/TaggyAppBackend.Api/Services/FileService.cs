using AutoMapper;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Providers;
using TaggyAppBackend.Api.Repos.Interfaces;
using TaggyAppBackend.Api.Services.Interfaces;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Services;

public class FileService(
    AppDbContext dbContext,
    IBlobRepo blobRepo,
    IGroupUserService groupUserService,
    IAuthContextProvider authContext,
    IPagingHelper pagingHelper,
    IMapper mapper) : IFileService
{
    public async Task<PagedResults<GetFileDto>> GetAll(SieveModel query)
    {
        var userId = authContext.GetUserId();

        var files = dbContext.Files
            .Include(x => x.Group)
            .Include(x => x.Tags)
            .Where(x => x.Group.GroupUsers.Any(u => u.UserId == userId))
            .AsNoTracking();

        return await pagingHelper.ToPagedResults<File, GetFileDto>(files, query);
    }

    public async Task<PagedResults<GetFileDto>> GetAllByGroupId(string groupId, SieveModel query)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var files = dbContext.Files
            .Include(x => x.Group)
            .Include(x => x.Tags)
            .Where(x => x.GroupId == groupId)
            .AsNoTracking();

        return await pagingHelper.ToPagedResults<File, GetFileDto>(files, query);
    }

    public async Task<GetFileDto> GetById(string groupId, string fileId)
    {
        return mapper.Map<GetFileDto>(await FindFile(groupId, fileId));
    }

    public async Task<GetFileDto> Create(string groupId, CreateFileDto dto, Stream stream)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var file = mapper.Map<File>(dto);
        file.CreatorId = authContext.GetUserId();
        file.GroupId = groupId;
        
        var fileName = $"{file.Id}{Path.GetExtension(dto.Name)}";
        file.Path = fileName;

        var totalBytes = await blobRepo.UploadBlob(fileName, groupId, stream);
        if (totalBytes == -1)
            throw new BadRequestException("Failed to upload file");
        file.Size = totalBytes;

        dbContext.Files.Add(file);
        var fileWithTags = await SaveFileWithTags(file, dto.Tags);

        return mapper.Map<GetFileDto>(fileWithTags);
    }

    public async Task<GetFileDto> Update(string groupId, string fileId, UpdateFileDto dto)
    {
        var file = await FindFile(groupId, fileId);

        if (file.CreatorId != authContext.GetUserId())
            await groupUserService.VerifyGroupAccess(file.GroupId, GroupRole.Admin);

        mapper.Map(dto, file);

        var result = await SaveFileWithTags(file, dto.Tags);

        return mapper.Map<GetFileDto>(result);
    }

    public async Task<bool> Delete(string groupId, string fileId)
    {
        var file = await FindFile(groupId, fileId);

        if (file.CreatorId != authContext.GetUserId())
            await groupUserService.VerifyGroupAccess(file.GroupId, GroupRole.Admin);

        dbContext.Files.Remove(file);
        return
            await dbContext.SaveChangesAsync() > 0 &&
            await blobRepo.DeleteBlob(fileId, groupId);
    }

    public async Task<Stream> Download(string groupId, string fileId)
    {
        await groupUserService.VerifyGroupAccess(groupId);
        return await blobRepo.DownloadBlob(fileId, groupId);
    }

    #region Private Methods

    private async Task<File> SaveFileWithTags(File file, IEnumerable<CreateTagDto> tags)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            var group = await FindGroup(file.GroupId);

            // Create new tags from dto
            file.Tags = new List<Tag>();
            foreach (var tagDto in tags)
            {
                var found = group.Tags.FirstOrDefault(t => t.Name == tagDto.Name);
                var tag = found ?? new Tag { Name = tagDto.Name };

                file.Tags.Add(tag);

                if (found is null)
                    group.Tags.Add(tag);
            }

            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return file;
    }

    private async Task<File> FindFile(string groupId, string fileId)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var file = await dbContext.Files
            .Include(f => f.Group)
            .Include(f => f.Tags)
            .FirstOrDefaultAsync(x => x.GroupId == groupId && x.Id == fileId);

        if (file is null)
            throw new NotFoundException("File not found");

        return file;
    }

    private async Task<Group> FindGroup(string groupId)
    {
        var group = await dbContext.Groups
            .Include(x => x.GroupUsers)
            .Include(x => x.Tags)
            .ThenInclude(x => x.Files)
            .FirstOrDefaultAsync(x => x.Id == groupId);

        if (group is null)
            throw new NotFoundException("Group not found");

        return group;
    }

    #endregion
}