namespace TaggyAppBackend.Api.Models.Repo;

public class BlobInfo
{
    public string Name { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long Size { get; set; }
}