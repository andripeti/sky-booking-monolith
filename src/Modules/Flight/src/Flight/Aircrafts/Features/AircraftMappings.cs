using Flight.Aircrafts.Dtos;
using Mapster;

namespace Flight.Aircrafts.Features;

public class AircraftMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Models.Aircraft, AircraftResponseDto>();
    }
} 