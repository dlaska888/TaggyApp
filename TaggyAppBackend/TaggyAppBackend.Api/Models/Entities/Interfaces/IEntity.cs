namespace TaggyAppBackend.Api.Models.Entities.Interfaces;

public interface IEntity
{
    string Id { get; set; }
    DateTime CreatedAt { get; set; }
}