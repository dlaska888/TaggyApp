using TaggyAppBackend.Api.Models.Dtos.Interfaces;

namespace TaggyAppBackend.Api.Models;

public class PagedResults<T>
where T : IGetDto
{
    public IList<T> Items { get; set; }
    public int TotalPages { get; set; }
    public int ItemsFrom { get; set; }
    public int ItemsTo { get; set; }
    public int TotalItemsCount { get; set; }

    public PagedResults(IList<T> items, int totalCount, int pageSize, int pageNum)
    {
        Items = items;
        TotalItemsCount = totalCount;
        ItemsFrom = pageSize * (pageNum - 1) + 1;
        ItemsTo = ItemsFrom + pageSize - 1;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}