using BuildingBlocks.Exception;

namespace Flight.Aircrafts.Exceptions;

public class AircraftNotFoundException : NotFoundException
{
    public AircraftNotFoundException() : base("Aircraft not found")
    {
    }
} 