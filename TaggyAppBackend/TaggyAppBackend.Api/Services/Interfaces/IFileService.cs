using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IFileService
{
    public Task<PagedResults<GetFileDto>> GetAll(SieveModel query);
    public Task<PagedResults<GetFileDto>> GetAllByGroupId(string groupId, SieveModel query);
    public Task<GetFileDto> GetById(string groupId, string fileId);
    public Task<GetFileDto> Create(string groupId, CreateFileDto dto, Stream stream);
    public Task<GetFileDto> Update(string groupId, string fileId, UpdateFileDto dto);
    public Task<bool> Delete(string groupId, string fileId);
    public Task<Stream> Download(string groupId, string fileId);
}
