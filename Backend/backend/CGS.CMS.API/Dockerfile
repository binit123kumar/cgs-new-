FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CGS.CMS.API.csproj", "."]
RUN dotnet restore "CGS.CMS.API.csproj"
COPY . .
RUN dotnet publish "CGS.CMS.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
EXPOSE 8080
ENTRYPOINT ["dotnet", "CGS.CMS.API.dll"]