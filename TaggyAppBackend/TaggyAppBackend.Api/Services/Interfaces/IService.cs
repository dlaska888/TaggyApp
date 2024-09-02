using Sieve.Models;
using TaggyAppBackend.Api.Models;
using TaggyAppBackend.Api.Models.Dtos.Interfaces;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IService<TGetDto, TCreateDto, TUpdateDto>
where TGetDto : IGetDto
{
    Task<TGetDto> GetById(string id);
    Task<PagedResults<TGetDto>> GetAll(SieveModel query);
    Task<TGetDto> Create(TCreateDto dto);
    Task<TGetDto> Update(string id, TUpdateDto dto);
    Task<bool> Delete(string id);
}