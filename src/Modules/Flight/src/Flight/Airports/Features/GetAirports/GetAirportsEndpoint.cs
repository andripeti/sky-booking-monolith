using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Flight.Airports.Features.GetAirports;

[Route(BaseApiPath + "/airports")]
public class GetAirportsEndpoint : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Get all airports", Description = "Get all airports")]
    public async Task<ActionResult> GetAirports(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetAirportsQuery(), cancellationToken);
        return Ok(result);
    }
} 