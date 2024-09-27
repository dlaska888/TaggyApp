using AutoMapper;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Sieve.Models;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Providers;
using TaggyAppBackend.Api.Repos.Interfaces;
using TaggyAppBackend.Api.Services.Interfaces;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Services;

public class FileService(
    AppDbContext dbContext,
    IBlobRepo blobRepo,
    IOptions<AzureBlobOptions> blobOptions,
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

        return await GetPagedFiles(files, query);
    }

    public async Task<PagedResults<GetFileDto>> GetAllByGroupId(string groupId, SieveModel query)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var files = dbContext.Files
            .Include(x => x.Group)
            .Include(x => x.Tags)
            .Where(x => x.GroupId == groupId)
            .AsNoTracking();

        return await GetPagedFiles(files, query);
    }

    public async Task<GetFileDto> GetById(string groupId, string fileId)
    {
        var file = await FindFile(groupId, fileId);
        return await MapFileToDto(file);
    }

    public async Task<GetFileDto> Create(string groupId, CreateFileDto dto, Stream stream)
    {
        await groupUserService.VerifyGroupAccess(groupId);

        var file = mapper.Map<File>(dto);
        file.CreatorId = authContext.GetUserId();
        file.GroupId = groupId;

        var fileName = $"{file.Id}{Path.GetExtension(dto.UntrustedName)}";
        file.TrustedName = fileName;

        try
        {
            var blobInfo = await blobRepo.UploadBlob(fileName, groupId, stream);
            file.ContentType = blobInfo.ContentType;
            file.Size = blobInfo.Size;
        }
        catch (BlobSizeExceededException e)
        {
            throw new BadRequestException($"File size exceeds the {blobOptions.Value.MaxBlobSize}B limit");
        }

        dbContext.Files.Add(file);
        var fileWithTags = await SaveFileWithTags(file, dto.Tags);

        return await MapFileToDto(fileWithTags);
    }

    public async Task<GetFileDto> Update(string groupId, string fileId, UpdateFileDto dto)
    {
        var file = await FindFile(groupId, fileId);

        if (file.CreatorId != authContext.GetUserId())
            await groupUserService.VerifyGroupAccess(file.GroupId, GroupRole.Admin);

        mapper.Map(dto, file);

        var result = await SaveFileWithTags(file, dto.Tags);

        return await MapFileToDto(result);
    }

    public async Task<bool> Delete(string groupId, string fileId)
    {
        var file = await FindFile(groupId, fileId);

        if (file.CreatorId != authContext.GetUserId())
            await groupUserService.VerifyGroupAccess(file.GroupId, GroupRole.Admin);

        return await DeleteFileWithTags(file) && await blobRepo.DeleteBlob(fileId, groupId);
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

    private async Task<bool> DeleteFileWithTags(File file)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            var fileTags = dbContext.Tags
                .Include(t => t.Files)
                .Where(t => t.Files.Any(f => f.Id == file.Id)); 
            
            foreach (var tag in fileTags)
            {
                if (tag.Files.Count == 1)
                    dbContext.Tags.Remove(tag);
            }
            
            dbContext.Files.Remove(file);
            
            var result = await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return result > 0;
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw;
        }
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

    private async Task<PagedResults<GetFileDto>> GetPagedFiles(IQueryable<File> files, SieveModel query)
    {
        return await pagingHelper.ToPagedResults<File, GetFileDto>(files, query, async x => await MapFileToDto(x));
    }

    private async Task<GetFileDto> MapFileToDto(File file)
    {
        var mapped = mapper.Map<GetFileDto>(file);
        mapped.Url = await blobRepo.GetBlobDownloadPath(file.TrustedName, file.GroupId);
        mapped.Tags = file.Tags.OrderBy(t => t.Name).Select(mapper.Map<GetTagDto>).ToList();
        return mapped;
    }

    #endregion
}