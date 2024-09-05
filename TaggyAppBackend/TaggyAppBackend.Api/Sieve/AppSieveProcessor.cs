using Microsoft.Extensions.Options;
using Sieve.Models;
using Sieve.Services;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Sieve;

public class AppSieveProcessor(IOptions<SieveOptions> options, ISieveCustomFilterMethods customFilterMethods)
    : SieveProcessor(options, customFilterMethods)
{
    protected override SievePropertyMapper MapProperties(SievePropertyMapper mapper)
    {
        mapper.Property<File>(p => p.Tags)
            .CanFilter()
            .CanSort();

        return mapper;
    }
}