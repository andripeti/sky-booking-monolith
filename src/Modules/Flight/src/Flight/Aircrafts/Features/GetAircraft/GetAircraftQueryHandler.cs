using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Flight.Aircrafts.Dtos;
using Flight.Data;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Flight.Aircrafts.Features.GetAircraft;

public class GetAircraftQueryHandler : IRequestHandler<GetAircraftQuery, IEnumerable<AircraftResponseDto>>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly IMapper _mapper;

    public GetAircraftQueryHandler(IMapper mapper, FlightDbContext flightDbContext)
    {
        _mapper = mapper;
        _flightDbContext = flightDbContext;
    }

    public async Task<IEnumerable<AircraftResponseDto>> Handle(GetAircraftQuery query, CancellationToken cancellationToken)
    {
        Guard.Against.Null(query, nameof(query));

        var aircraft = await _flightDbContext.Aircraft
            .Where(x => !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<AircraftResponseDto>>(aircraft);
    }
} 