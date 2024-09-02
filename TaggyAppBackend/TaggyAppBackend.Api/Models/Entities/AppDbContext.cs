using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaggyAppBackend.Api.Models.Entities.Master;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Models.Entities;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<TaggyUser, IdentityRole, string>(options)
{
    public DbSet<TaggyUser> TaggyUsers { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<File> Files { get; set; }
}