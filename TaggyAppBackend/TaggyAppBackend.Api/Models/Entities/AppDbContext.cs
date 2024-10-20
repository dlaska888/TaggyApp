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
    public DbSet<GroupUser> GroupUsers { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<File> Files { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Tag>()
            .HasIndex(t => new { t.Name, t.GroupId })
            .IsUnique();
        builder.Entity<File>()
            .HasIndex(t => new { t.UntrustedName, t.GroupId })
            .IsUnique();
    }

}