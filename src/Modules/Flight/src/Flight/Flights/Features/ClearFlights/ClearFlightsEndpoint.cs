using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Flight.Flights.Features.ClearFlights;

[Route(BaseApiPath + "/flight/clear")]
public class ClearFlightsEndpoint : BaseController
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [SwaggerOperation(Summary = "Clear all flights", Description = "Soft deletes all flights and their associated seats")]
    public async Task<ActionResult<int>> ClearFlights(CancellationToken cancellationToken)
    {
        var deletedCount = await Mediator.Send(new ClearFlightsCommand(), cancellationToken);
        return Ok(new { message = $"Successfully cleared {deletedCount} flights and their associated seats" });
    }
} 