using BuildingBlocks.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Passenger.Passengers.Features.GetPassengerById;

[Route(BaseApiPath + "/passenger")]
public class GetPassengerByIdEndpoint : BaseController
{
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Get passenger by id", Description = "Get passenger by id")]
    public async Task<ActionResult> GetById([FromRoute] GetPassengerQueryById query, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [SwaggerOperation(Summary = "Get all passengers", Description = "Get all passengers")]
    public async Task<ActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetAllPassengersQuery(), cancellationToken);
        return Ok(result);
    }
}
