using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Sieve;

public class SieveCustomFilterMethods : ISieveCustomFilterMethods
{
    public IQueryable<File> WithTags(IQueryable<File> source, string op, string[] values)
    {
        return op switch
        {
            "==" => AllTags(source, values),
            "!=" => ExceptTags(source, values),
            "@=" => AnyTags(source, values),
            _ => source
        };
    }

    private IQueryable<File> AllTags(IQueryable<File> source, string[] values)
    {
        var result = source
            .Include(f => f.Tags)
            .Where(f => f.Tags.All(t => values.Contains(t.Name)));

        return result;
    }

    private IQueryable<File> ExceptTags(IQueryable<File> source, string[] values)
    {
        var result = source
            .Include(f => f.Tags)
            .Where(f => f.Tags.All(t => !values.Contains(t.Name)));

        return result;
    }

    private IQueryable<File> AnyTags(IQueryable<File> source, string[] values)
    {
        var result = source
            .Include(f => f.Tags)
            .Where(f => f.Tags.Any(t => values.Contains(t.Name)));

        return result;
    }
}