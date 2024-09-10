namespace TaggyAppBackend.Api.Models.Options;

public class AzureBlobOptions
{
    public string StorageAccount { get; set; } = null!;
    public string Key { get; set; } = null!;
    public string Container { get; set; } = null!;
}