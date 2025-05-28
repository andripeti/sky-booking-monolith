

## How to Run

### Config Certificate

Run the following commands for [Config SSL](https://docs.microsoft.com/en-us/aspnet/core/security/docker-compose-https?view=aspnetcore-6.0) in your system

```bash
dotnet dev-certs https -ep %USERPROFILE%\.aspnet\https\aspnetapp.pfx -p {password here}
dotnet dev-certs https --trust
```

> Note: for running this command in `powershell` use `$env:USERPROFILE` instead of `%USERPROFILE%`

### Docker Compose

We have a separate Docker file for setting up and running the [infrastracture.yaml](./deployments/docker-compose/infrastracture.yaml) independently.

```bash
docker-compose -f ./deployments/docker-compose/infrastracture.yaml up -d
```

TODO 👷‍♂️
Deployment App in Docker-Compose

> ### Build
To `build` all microservices, run this command in the `root` of the project:
```bash
dotnet build
```

> ### Run
To `run` each microservice, run this command in the root of the `Api` folder of each microservice where the `csproj` file is located:
```bash
dotnet run
```

> ### Test

To `test` all microservices, run this command in the `root` of the project:
```bash
dotnet test
```

> ### Documentation Apis

Each microservice provides `API documentation` and navigate to `/swagger` for `Swagger OpenAPI` or `/scalar/v1` for `Scalar OpenAPI` to visit list of endpoints.

As part of API testing, I created the [booking.rest](./booking.rest) file which can be run with the [REST Client](https://github.com/Huachao/vscode-restclient) `VSCode plugin`.
