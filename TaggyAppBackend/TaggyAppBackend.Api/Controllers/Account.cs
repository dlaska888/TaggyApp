using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaggyAppBackend.Api.Models.Dtos.Account;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Providers;

namespace TaggyAppBackend.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class Account(UserManager<TaggyUser> userManager, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<GetAccountDto> Get()
    {
        var user = await userManager.Users
            .Include(u => u.GroupUsers)
            .FirstOrDefaultAsync(u => u.Id == User.FindFirstValue(ClaimTypes.NameIdentifier));
        
        return mapper.Map<GetAccountDto>(user!);
    }
}