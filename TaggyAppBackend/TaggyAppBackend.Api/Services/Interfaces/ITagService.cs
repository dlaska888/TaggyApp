using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface ITagService
{
    Task<GetTagDto> GetById(string groupId, string tagId);
    Task<PagedResults<GetTagDto>> GetAllByGroupId(string groupId, SieveModel query);
    Task<GetTagDto> Create(string groupId, CreateTagDto dto);
     Task<GetTagDto> Update(string groupId, string tagId, UpdateTagDto dto);
    Task<bool> Delete(string groupId, string tagId);
}