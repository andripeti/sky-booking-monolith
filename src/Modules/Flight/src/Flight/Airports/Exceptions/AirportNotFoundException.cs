using BuildingBlocks.Exception;

namespace Flight.Airports.Exceptions;

public class AirportNotFoundException : NotFoundException
{
    public AirportNotFoundException(string message = "Airport not found") : base(message)
    {
    }
} 