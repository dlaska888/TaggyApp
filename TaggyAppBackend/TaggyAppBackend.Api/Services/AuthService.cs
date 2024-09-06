using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Handlers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos.Auth;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Services;

public class AuthService(
    UserManager<TaggyUser> userManager,
    SignInManager<TaggyUser> signInManager,
    AppDbContext dbContext,
    IJwtHandler jwtHandler,
    IOptions<JwtOptions> jwtSettings)
    : IAuthService
{
    private readonly JwtOptions _jwtOptions = jwtSettings.Value;

    public async Task<bool> SignUp(RegisterDto dto)
    {
        await RegisterUser(dto);
        return true;
    }

    public async Task<TokenDto> SignIn(LoginDto dto)
    {
        var user = await userManager.FindByNameAsync(dto.UserName) ??
                   await userManager.FindByEmailAsync(dto.UserName);

        if (user is null)
            throw new UnauthorizedException("Invalid credentials");

        var signInResult = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

        if (signInResult.IsLockedOut) throw new UnauthorizedException("Account is locked out");
        if (signInResult.RequiresTwoFactor) throw new UnauthorizedException("Multi factor authentication is required");
        if (signInResult.IsNotAllowed) throw new UnauthorizedException("Not allowed");
        if (!signInResult.Succeeded) throw new UnauthorizedException("Invalid credentials");

        var token = jwtHandler.GenerateJwtToken(user);
        var refreshToken = jwtHandler.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExp = DateTime.UtcNow.AddDays(Convert.ToDouble(_jwtOptions.RefreshExpirationTime));
        await userManager.UpdateAsync(user);

        return new TokenDto { AccessToken = token, RefreshToken = refreshToken };
    }

    public async Task<TokenDto> GoogleSignIn(ExternalAuthDto dto)
    {
        var payload = await jwtHandler.VerifyGoogleToken(dto);

        var info = new UserLoginInfo(dto.Provider, payload.Subject, dto.Provider);
        var user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        
        if (user == null)
        {
            user = await userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = await RegisterUser(new RegisterDto
                {
                    UserName = payload.Email,
                    Email = payload.Email
                }, true);
                await userManager.AddLoginAsync(user, info);
            }
            else
            {
                await userManager.AddLoginAsync(user, info);
            }
        }

        var token = jwtHandler.GenerateJwtToken(user);
        var refreshToken = jwtHandler.GenerateRefreshToken();
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExp = DateTime.UtcNow.AddDays(Convert.ToDouble(_jwtOptions.RefreshExpirationTime));
        await userManager.UpdateAsync(user);

        return new TokenDto { AccessToken = token, RefreshToken = refreshToken };
    }

    public async Task<TokenDto> Refresh(string refreshToken)
    {
        var user = userManager.Users.SingleOrDefault(u =>
            u.RefreshToken == refreshToken && u.RefreshTokenExp > DateTime.UtcNow);

        if (user == null)
        {
            throw new UnauthorizedException("Invalid refresh token");
        }

        if (user.RefreshTokenExp < DateTime.UtcNow)
        {
            throw new UnauthorizedException("Refresh token expired");
        }

        var token = jwtHandler.GenerateJwtToken(user);
        var newRefreshToken = jwtHandler.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await userManager.UpdateAsync(user);

        return new TokenDto { AccessToken = token, RefreshToken = newRefreshToken };
    }

    public async Task<bool> ConfirmEmail(string userId, string token)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new BadRequestException("User not found");
        }

        var result = await userManager.ConfirmEmailAsync(user, token);

        if (result.Errors.Any())
            throw new BadRequestException(result.Errors.First().Description);

        if (!result.Succeeded)
        {
            throw new BadRequestException("Failed to create user account.");
        }

        return result.Succeeded;
    }

    #region Private Methods

    // //TODO refactor to use server name parameter and email template
    // private async Task SendConfirmationEmail(string email, TaggyUser user)
    // {
    //     var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
    //     var confirmationLink = $"http://localhost/confirm-email?UserId={user.Id}&Token={token}";
    //     await emailSender.SendEmailAsync(email, "Confirm Your Email",
    //         $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>;.");
    // }

    private async Task<TaggyUser> RegisterUser(RegisterDto dto, bool isExternal = false)
    {
        var user = new TaggyUser { UserName = dto.UserName, Email = dto.Email };
        var result = isExternal
            ? await userManager.CreateAsync(user)
            : await userManager.CreateAsync(user, dto.Password);

        if (result.Errors.Any())
            throw new BadRequestException(result.Errors.First().Description);

        if (!result.Succeeded)
        {
            throw new BadRequestException("Failed to create user account.");
        }

        var group = new Group { Name = "Default" };

        group.GroupUsers.Add(new GroupUser { UserId = user.Id, GroupId = group.Id, Role = GroupRole.Owner });
        dbContext.Groups.Add(group);
        await dbContext.SaveChangesAsync();

        // await SendConfirmationEmail(user.Email, user);

        return user;
    }

    #endregion
}