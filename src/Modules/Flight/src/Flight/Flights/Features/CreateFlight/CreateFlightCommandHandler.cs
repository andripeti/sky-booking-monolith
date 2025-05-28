using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Flight.Aircrafts.Exceptions;
using Flight.Airports.Exceptions;
using Flight.Data;
using Flight.Flights.Dtos;
using Flight.Flights.Exceptions;
using Flight.Flights.Models;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Flight.Flights.Features.CreateFlight;

public class CreateFlightCommandHandler : IRequestHandler<CreateFlightCommand, FlightResponseDto>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateFlightCommandHandler> _logger;

    public CreateFlightCommandHandler(
        IMapper mapper, 
        FlightDbContext flightDbContext,
        ILogger<CreateFlightCommandHandler> logger)
    {
        _mapper = mapper;
        _flightDbContext = flightDbContext;
        _logger = logger;
    }

    public async Task<FlightResponseDto> Handle(CreateFlightCommand command, CancellationToken cancellationToken)
    {
        Guard.Against.Null(command, nameof(command));

        // Check if flight number already exists
        var existingFlight = await _flightDbContext.Flights
            .SingleOrDefaultAsync(x => x.FlightNumber == command.FlightNumber && !x.IsDeleted,
                cancellationToken);

        if (existingFlight is not null)
        {
            _logger.LogWarning("Flight with number {FlightNumber} already exists", command.FlightNumber);
            throw new FlightAlreadyExistException();
        }

        // Validate aircraft exists
        var aircraft = await _flightDbContext.Aircraft
            .SingleOrDefaultAsync(x => x.Id == command.AircraftId && !x.IsDeleted, 
                cancellationToken);

        if (aircraft is null)
        {
            _logger.LogWarning("Aircraft with ID {AircraftId} not found", command.AircraftId);
            throw new AircraftNotFoundException();
        }

        // Validate departure airport exists
        var departureAirport = await _flightDbContext.Airports
            .SingleOrDefaultAsync(x => x.Id == command.DepartureAirportId && !x.IsDeleted,
                cancellationToken);

        if (departureAirport is null)
        {
            _logger.LogWarning("Departure airport with ID {AirportId} not found", command.DepartureAirportId);
            throw new AirportNotFoundException("Departure airport not found");
        }

        // Validate arrival airport exists
        var arrivalAirport = await _flightDbContext.Airports
            .SingleOrDefaultAsync(x => x.Id == command.ArriveAirportId && !x.IsDeleted,
                cancellationToken);

        if (arrivalAirport is null)
        {
            _logger.LogWarning("Arrival airport with ID {AirportId} not found", command.ArriveAirportId);
            throw new AirportNotFoundException("Arrival airport not found");
        }

        var flightEntity = Models.Flight.Create(
            command.Id,
            command.FlightNumber,
            command.AircraftId,
            command.DepartureAirportId,
            command.DepartureDate,
            command.ArriveDate,
            command.ArriveAirportId,
            command.DurationMinutes,
            command.FlightDate,
            command.Status,
            command.Price);

        var newFlight = await _flightDbContext.Flights.AddAsync(flightEntity, cancellationToken);
        await _flightDbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created new flight. ID: {FlightId}, Number: {FlightNumber}, Aircraft: {AircraftId}, From: {DepartureAirport} To: {ArrivalAirport}",
            newFlight.Entity.Id,
            newFlight.Entity.FlightNumber,
            newFlight.Entity.AircraftId,
            newFlight.Entity.DepartureAirportId,
            newFlight.Entity.ArriveAirportId);

        return _mapper.Map<FlightResponseDto>(newFlight.Entity);
    }
}
