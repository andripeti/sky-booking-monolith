using System;
using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Flight.Flights.Features.GetAvailableFlights;

[Route(BaseApiPath + "/flights/available")]
public class GetAvailableFlightsEndpoint : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [SwaggerOperation(
        Summary = "Get available flights",
        Description = "Get available flights filtered by departure airport, arrival airport, and dates")]
    public async Task<ActionResult> GetAvailableFlights(
        [FromQuery(Name = "departureAirportId")] long? departureAirportId = null,
        [FromQuery(Name = "arrivalAirportId")] long? arrivalAirportId = null,
        [FromQuery(Name = "departureDate")] DateTime? departureDate = null,
        [FromQuery(Name = "arrivalDate")] DateTime? arrivalDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAvailableFlightsQuery
        {
            DepartureAirportId = departureAirportId,
            ArrivalAirportId = arrivalAirportId,
            DepartureDate = departureDate,
            ArrivalDate = arrivalDate
        };

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
