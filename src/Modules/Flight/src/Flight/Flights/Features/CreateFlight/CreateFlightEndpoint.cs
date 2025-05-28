using System;
using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Flight.Flights.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;
using System.Linq;
using Flight.Flights.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Flight.Flights.Features.CreateFlight;

[Route(BaseApiPath + "/flight")]
public class CreateFlightEndpoint : BaseController
{
    private readonly ILogger<CreateFlightEndpoint> _logger;

    public CreateFlightEndpoint(ILogger<CreateFlightEndpoint> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Create new flight", Description = "Create new flight")]
    public async Task<ActionResult> Create([FromBody] CreateFlightRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Creating new flight. FlightNumber: {FlightNumber}, Aircraft: {AircraftId}, " +
                "From: {DepartureAirport} To: {ArrivalAirport}, " +
                "Departure: {DepartureDate}, Arrival: {ArrivalDate}",
                request.FlightNumber,
                request.AircraftId,
                request.DepartureAirportId,
                request.ArrivalAirportId,
                request.DepartureDate,
                request.ArrivalDate);

            if (!ModelState.IsValid)
            {
                var errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                );

                _logger.LogWarning("Invalid flight creation request. Errors: {@ValidationErrors}", errors);
                
                return BadRequest(new
                {
                    type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                    title = "One or more validation errors occurred.",
                    status = 400,
                    errors = errors
                });
            }

            // Additional validation
            if (request.DepartureAirportId == request.ArrivalAirportId)
            {
                ModelState.AddModelError("ArrivalAirportId", "Arrival airport must be different from departure airport");
                return BadRequest(ModelState);
            }

            if (request.DepartureDate >= request.ArrivalDate)
            {
                ModelState.AddModelError("ArrivalDate", "Arrival date must be after departure date");
                return BadRequest(ModelState);
            }

            if (request.DepartureDate <= DateTime.UtcNow)
            {
                ModelState.AddModelError("DepartureDate", "Departure date must be in the future");
                return BadRequest(ModelState);
            }

            var command = request.ToCommand();
            var result = await Mediator.Send(command, cancellationToken);

            _logger.LogInformation(
                "Successfully created flight. ID: {FlightId}, FlightNumber: {FlightNumber}",
                result.Id,
                result.FlightNumber);

            return Created($"/api/v1/flight/{result.Id}", result);
        }
        catch (FlightAlreadyExistException ex)
        {
            _logger.LogWarning(ex, "Attempted to create duplicate flight. FlightNumber: {FlightNumber}", request.FlightNumber);
            return Conflict(new { error = ex.Message });
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while creating flight. FlightNumber: {FlightNumber}", request.FlightNumber);
            return BadRequest(new { error = "A database error occurred. This may be due to invalid foreign keys or constraint violations." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while creating flight. FlightNumber: {FlightNumber}", request.FlightNumber);
            throw; // Let the global error handler deal with it
        }
    }
}
