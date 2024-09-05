using TaggyAppBackend.Api.Models.Dtos.Interfaces;

namespace TaggyAppBackend.Api.Models.Dtos;

public class PagedResults<T> where T : IGetDto
{
    public IList<T> Items { get; }
    public int PageNum { get; }
    public int PageSize { get; }
    public int TotalPages { get; }
    public int TotalItems { get; }

    public PagedResults(IList<T> items, int pageNum, int pageSize, int totalItems)
    {
        Items = items;
        PageNum = pageNum == 0 ? 1 : pageNum;
        PageSize = pageSize == 0 ? 10 : pageSize;
        var totalPages = (int)Math.Ceiling((double)totalItems / PageSize);
        TotalPages = totalPages == 0 ? 1 : totalPages;
        TotalItems = totalItems;
    }
}