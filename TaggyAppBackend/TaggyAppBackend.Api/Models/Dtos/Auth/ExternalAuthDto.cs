﻿namespace TaggyAppBackend.Api.Models.Dtos.Auth;

public class ExternalAuthDto
{
    public string Provider { get; set; } = null!;
    public string IdToken { get; set; } = null!; 
}