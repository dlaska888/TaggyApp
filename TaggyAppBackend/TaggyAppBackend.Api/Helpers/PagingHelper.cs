using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Interfaces;

public class PagingHelper(ISieveProcessor sieveProcessor, IMapper mapper)
    : IPagingHelper
{
    public async Task<PagedResults<TGetDto>> ToPagedResults<TEntity, TGetDto>(
        IQueryable<TEntity> records,
        SieveModel query,
        Func<TEntity, TGetDto>? customMapping = null) // Optional custom mapping function
        where TGetDto : IGetDto
    {
        // Apply filtering and pagination
        var filtered = sieveProcessor.Apply(query, records, applyPagination: false, applySorting: false);
        var paged = sieveProcessor.Apply(query, filtered, applyFiltering: false);

        // Map entities to DTOs using either the default mapper or custom mapping function
        var mapped = await paged.Select(x =>
                customMapping != null
                    ? customMapping(x) // Use custom mapping if provided
                    : mapper.Map<TGetDto>(x) // Fallback to default mapping if no custom function provided
        ).ToListAsync();

        // Return paged results
        return new PagedResults<TGetDto>(
            mapped,
            query.Page.GetValueOrDefault(),
            query.PageSize.GetValueOrDefault(),
            await filtered.CountAsync()
        );
    }
}