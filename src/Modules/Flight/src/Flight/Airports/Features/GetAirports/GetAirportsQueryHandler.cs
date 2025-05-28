using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Flight.Airports.Dtos;
using Flight.Data;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Flight.Airports.Features.GetAirports;

public class GetAirportsQueryHandler : IRequestHandler<GetAirportsQuery, IEnumerable<AirportResponseDto>>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly IMapper _mapper;

    public GetAirportsQueryHandler(IMapper mapper, FlightDbContext flightDbContext)
    {
        _mapper = mapper;
        _flightDbContext = flightDbContext;
    }

    public async Task<IEnumerable<AirportResponseDto>> Handle(GetAirportsQuery query, CancellationToken cancellationToken)
    {
        Guard.Against.Null(query, nameof(query));

        var airports = await _flightDbContext.Airports
            .Where(x => !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<AirportResponseDto>>(airports);
    }
} 