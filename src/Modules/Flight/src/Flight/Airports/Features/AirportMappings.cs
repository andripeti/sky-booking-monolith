using Flight.Airports.Dtos;
using Mapster;

namespace Flight.Airports.Features;

public class AirportMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Models.Airport, AirportResponseDto>();
    }
} 