﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers.Interfaces;
using TaggyAppBackend.Api.Models.Dtos.Auth;
using TaggyAppBackend.Api.Models.Entities.Master;
using TaggyAppBackend.Api.Models.Options;

namespace TaggyAppBackend.Api.Helpers;

public class AuthHelper(
    UserManager<TaggyUser> userManager,
    SignInManager<TaggyUser> signInManager,
    IOptions<JwtOptions> jwtSettings)
    : IAuthHelper
{
    private readonly JwtOptions _jwtOptions = jwtSettings.Value;

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

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExp = DateTime.Now.AddDays(Convert.ToDouble(_jwtOptions.RefreshExpirationTime));
        await userManager.UpdateAsync(user);

        return new TokenDto { AccessToken = token, RefreshToken = refreshToken };
    }

    public async Task<bool> SignUp(RegisterDto dto)
    {
        var user = new TaggyUser { UserName = dto.Username, Email = dto.Email, CreatedAt = DateTime.Now};
        var result = await userManager.CreateAsync(user, dto.Password);

        if (result.Errors.Any())
            throw new BadRequestException(result.Errors.First().Description);

        if (!result.Succeeded)
        {
            throw new BadRequestException("Failed to create user account.");
        }

        // await SendConfirmationEmail(user.Email, user);

        return result.Succeeded;
    }

    public async Task<TokenDto> Refresh(string refreshToken)
    {
        var user = userManager.Users.SingleOrDefault(u =>
            u.RefreshToken == refreshToken && u.RefreshTokenExp > DateTime.Now);

        if (user == null)
        {
            throw new UnauthorizedException("Invalid refresh token");
        }

        if (user.RefreshTokenExp < DateTime.Now)
        {
            throw new UnauthorizedException("Refresh token expired");
        }

        var token = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await userManager.UpdateAsync(user);

        return new TokenDto { AccessToken = token, RefreshToken = newRefreshToken };
    }

    private string GenerateJwtToken(TaggyUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(_jwtOptions.ExpirationTime);

        var token = new JwtSecurityToken(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.UserName!),
            },
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
    }

    // //TODO refactor to use server name parameter and email template
    // private async Task SendConfirmationEmail(string email, TaggyUser user)
    // {
    //     var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
    //     var confirmationLink = $"http://localhost/confirm-email?UserId={user.Id}&Token={token}";
    //     await emailSender.SendEmailAsync(email, "Confirm Your Email",
    //         $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>;.");
    // }

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
}