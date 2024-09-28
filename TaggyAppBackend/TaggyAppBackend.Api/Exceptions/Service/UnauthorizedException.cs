namespace TaggyAppBackend.Api.Exceptions.Service;

public class UnauthorizedException(string message) : Exception(message);