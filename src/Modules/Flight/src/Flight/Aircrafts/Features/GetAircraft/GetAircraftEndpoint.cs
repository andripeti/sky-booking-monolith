using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Flight.Aircrafts.Features.GetAircraft;

[Route(BaseApiPath + "/aircraft")]
public class GetAircraftEndpoint : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Get all aircraft", Description = "Get all aircraft")]
    public async Task<ActionResult> GetAircraft(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetAircraftQuery(), cancellationToken);
        return Ok(result);
    }
} 