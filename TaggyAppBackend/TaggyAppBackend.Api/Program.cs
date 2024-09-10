using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sieve.Models;
using Sieve.Services;
using TaggyAppBackend.Api.AutoMapper;
using TaggyAppBackend.Api.Filters;
using TaggyAppBackend.Api.Handlers;
using TaggyAppBackend.Api.Handlers.Interfaces;
using TaggyAppBackend.Api.Helpers;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Middleware;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Providers;
using TaggyAppBackend.Api.Repos;
using TaggyAppBackend.Api.Repos.Interfaces;
using TaggyAppBackend.Api.Services;
using TaggyAppBackend.Api.Services.Interfaces;
using TaggyAppBackend.Api.Sieve;
using GoogleOptions = TaggyAppBackend.Api.Models.Options.SocialAuth.GoogleOptions;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.Configure<SieveOptions>(builder.Configuration.GetSection("Sieve"));
builder.Services.AddScoped<ISieveProcessor, AppSieveProcessor>();
builder.Services.AddScoped<ISieveCustomFilterMethods, SieveCustomFilterMethods>();
builder.Services.AddScoped<IPagingHelper, PagingHelper>();

builder.Services.AddScoped<IJwtHandler, JwtHandler>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthContextProvider, AuthContextProvider>();
builder.Services.AddScoped<ErrorHandlingMiddleWare>();

builder.Services.AddScoped<IBlobRepo, BlobRepo>();
builder.Services.AddScoped<IFileNameHelper, FileNameHelper>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IGroupService, GroupService>();
builder.Services.AddScoped<IGroupUserService, GroupUserService>();
builder.Services.AddScoped<ITagService, TagService>();

builder.Services.AddAutoMapper(cfg => { cfg.AddProfile<DtoMappingProfile>(); });

#endregion

#region Database

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

#endregion

#region Files

builder.Services.Configure<AzureBlobOptions>(builder.Configuration.GetSection("Azure:AzureBlobOptions"));
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = null;
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = long.MaxValue;
    options.BufferBody = false;
});

#endregion

#region Identity

builder.Services.AddIdentity<TaggyUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(o =>
{
    o.Password.RequireDigit = true;
    o.Password.RequireLowercase = true;
    o.Password.RequireNonAlphanumeric = true;
    o.Password.RequireUppercase = true;
    o.Password.RequiredLength = 6;
    o.Password.RequiredUniqueChars = 1;
    o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    o.Lockout.MaxFailedAccessAttempts = 5;
    o.Lockout.AllowedForNewUsers = true;
    o.User.RequireUniqueEmail = true;
});

#endregion

#region JWT Authentication and Authorization

var jwtOptionsSection = builder.Configuration.GetSection("JwtOptions");
var jwtOptions = jwtOptionsSection.Get<JwtOptions>();
builder.Services.Configure<JwtOptions>(jwtOptionsSection);

var googleOptionsSection = builder.Configuration.GetSection("SocialAuth:Google");
builder.Services.Configure<GoogleOptions>(googleOptionsSection);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwtOptions!.Issuer,
            ValidAudience = jwtOptions!.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions!.Key)),

            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorizationBuilder()
    .SetDefaultPolicy(new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser().Build());

#endregion

#region Config

builder.Services.AddHttpContextAccessor();

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddControllers(options => { options.SuppressAsyncSuffixInActionNames = false; });
builder.Services.AddSwaggerGen(option =>
    {
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        option.OperationFilter<AuthResponseOperationFilter>();
        option.OrderActionsBy(apiDesc => apiDesc.RelativePath);
    }
);

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy("AllowAll",
            policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    });

#endregion

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(option =>
    {
        option.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        option.EnablePersistAuthorization();
    });
    app.UseCors("AllowAll");

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.MapControllers();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleWare>();

app.Run();