using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Flight.Airports.Dtos;
using Flight.Airports.Exceptions;
using Flight.Data;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Flight.Airports.Features.GetAirportById;

public class GetAirportByIdQueryHandler : IRequestHandler<GetAirportByIdQuery, AirportResponseDto>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly IMapper _mapper;

    public GetAirportByIdQueryHandler(IMapper mapper, FlightDbContext flightDbContext)
    {
        _mapper = mapper;
        _flightDbContext = flightDbContext;
    }

    public async Task<AirportResponseDto> Handle(GetAirportByIdQuery query, CancellationToken cancellationToken)
    {
        Guard.Against.Null(query, nameof(query));

        var airport = await _flightDbContext.Airports
            .SingleOrDefaultAsync(x => x.Id == query.Id && !x.IsDeleted, cancellationToken);

        if (airport is null)
            throw new AirportNotFoundException();

        return _mapper.Map<AirportResponseDto>(airport);
    }
} 