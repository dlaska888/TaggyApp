using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Interfaces;

namespace TaggyAppBackend.Api.Helpers.Interfaces;

public interface IPagingHelper
{
    public Task<PagedResults<TGetDto>> ToPagedResults<TEntity, TGetDto>(
        IQueryable<TEntity> records,
        SieveModel query,
        Func<TEntity, Task<TGetDto>>? customMapping = null)
        where TGetDto : IGetDto;
}