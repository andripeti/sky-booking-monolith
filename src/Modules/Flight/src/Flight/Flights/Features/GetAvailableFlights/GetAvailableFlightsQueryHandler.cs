using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Flight.Data;
using Flight.Flights.Dtos;
using Flight.Flights.Exceptions;
using Flight.Airports.Exceptions;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Flight.Flights.Features.GetAvailableFlights;

public class GetAvailableFlightsQueryHandler : IRequestHandler<GetAvailableFlightsQuery, IEnumerable<FlightResponseDto>>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly IMapper _mapper;
    private readonly ILogger<GetAvailableFlightsQueryHandler> _logger;

    public GetAvailableFlightsQueryHandler(
        IMapper mapper, 
        FlightDbContext flightDbContext,
        ILogger<GetAvailableFlightsQueryHandler> logger)
    {
        _mapper = mapper;
        _flightDbContext = flightDbContext;
        _logger = logger;
    }

    public async Task<IEnumerable<FlightResponseDto>> Handle(GetAvailableFlightsQuery query,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(query, nameof(query));

        // Validate airports if specified
        if (query.DepartureAirportId.HasValue)
        {
            var departureAirport = await _flightDbContext.Airports
                .SingleOrDefaultAsync(x => x.Id == query.DepartureAirportId && !x.IsDeleted, cancellationToken);
            if (departureAirport == null)
            {
                _logger.LogWarning("Departure airport with ID {AirportId} not found", query.DepartureAirportId);
                throw new AirportNotFoundException($"Departure airport with ID {query.DepartureAirportId} not found");
            }
        }

        if (query.ArrivalAirportId.HasValue)
        {
            var arrivalAirport = await _flightDbContext.Airports
                .SingleOrDefaultAsync(x => x.Id == query.ArrivalAirportId && !x.IsDeleted, cancellationToken);
            if (arrivalAirport == null)
            {
                _logger.LogWarning("Arrival airport with ID {AirportId} not found", query.ArrivalAirportId);
                throw new AirportNotFoundException($"Arrival airport with ID {query.ArrivalAirportId} not found");
            }
        }

        // Build query
        var flightsQuery = _flightDbContext.Flights
            .Where(x => !x.IsDeleted);

        if (query.DepartureAirportId.HasValue)
            flightsQuery = flightsQuery.Where(x => x.DepartureAirportId == query.DepartureAirportId);

        if (query.ArrivalAirportId.HasValue)
            flightsQuery = flightsQuery.Where(x => x.ArriveAirportId == query.ArrivalAirportId);

        if (query.DepartureDate.HasValue)
            flightsQuery = flightsQuery.Where(x => x.DepartureDate.Date == query.DepartureDate.Value.Date);

        if (query.ArrivalDate.HasValue)
            flightsQuery = flightsQuery.Where(x => x.ArriveDate.Date == query.ArrivalDate.Value.Date);

        var flights = await flightsQuery.ToListAsync(cancellationToken);

        if (!flights.Any())
        {
            _logger.LogInformation("No flights found matching the criteria: DepartureAirport={DepartureAirport}, ArrivalAirport={ArrivalAirport}, DepartureDate={DepartureDate}, ArrivalDate={ArrivalDate}",
                query.DepartureAirportId, query.ArrivalAirportId, query.DepartureDate, query.ArrivalDate);
            throw new FlightNotFountException();
        }

        return _mapper.Map<List<FlightResponseDto>>(flights);
    }
}
