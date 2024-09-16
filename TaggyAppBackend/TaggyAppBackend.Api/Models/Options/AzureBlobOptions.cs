namespace TaggyAppBackend.Api.Models.Options;

public class AzureBlobOptions
{
    public string StorageAccount { get; set; } = null!;
    public string Key { get; set; } = null!;

    public long MaxBlobSize { get; set; } = 10737418240;
    public int BlockSize { get; set; } = 4194304;
    
    public int MaxParallelism { get; set; } = 8;
}