using System.Threading;
using System.Threading.Tasks;
using BuildingBlocks.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Flight.Airports.Features.GetAirportById;

[Route(BaseApiPath + "/airports")]
public class GetAirportByIdEndpoint : BaseController
{
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [SwaggerOperation(Summary = "Get airport by ID", Description = "Get airport details by ID")]
    public async Task<ActionResult> GetById([FromRoute] GetAirportByIdQuery query, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }
} 