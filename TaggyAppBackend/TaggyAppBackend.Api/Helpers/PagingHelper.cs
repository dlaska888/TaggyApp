using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Sieve.Models;
using Sieve.Services;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Interfaces;

namespace TaggyAppBackend.Api.Helpers;

public class PagingHelper(ISieveProcessor sieveProcessor, IMapper mapper, IOptions<SieveOptions> options)
    : IPagingHelper
{
    private readonly SieveOptions _options = options.Value;

    public async Task<PagedResults<TGetDto>> ToPagedResults<TEntity, TGetDto>(
        IQueryable<TEntity> records,
        SieveModel query)
        where TGetDto : IGetDto
    {
        var filtered = sieveProcessor.Apply(query, records, applyPagination: false, applySorting: false);
        var paged = sieveProcessor.Apply(query, filtered, applyFiltering: false);
        var mapped = await paged.Select(x => mapper.Map<TGetDto>(x)).ToListAsync();

        return new PagedResults<TGetDto>(
            mapped,
            query.Page.GetValueOrDefault(),
            query.PageSize.GetValueOrDefault(),
            await filtered.CountAsync()
        );
    }
}