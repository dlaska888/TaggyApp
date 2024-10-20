namespace TaggyAppBackend.Api.Models.Options;

public class AzureBlobOptions
{
    public string StorageAccount { get; set; } = null!;
    public string Key { get; set; } = null!;
    public long MaxBlobSize { get; set; } = 10737418240;
    public int BlockSize { get; set; } = 4194304;
    public int MaxParallelism { get; set; } = 8;
    public int SasTokenExpirationTime { get; set; } = 30;
    public string Container { get; set; } = "taggy-app-files";
    public string ThumbnailContainer { get; set; } = "taggy-app-thumbs";
}