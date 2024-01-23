# jskos-web Docker

Create a `docker-compose.yml` file:

```yml
version: "3"
services:
  jskos-web:
    image: ghcr.io/gbv/jskos-web
    volumes:
      # Store the built site in a volume (optional, but prevents having to rebuild the site if the container is recreated)
      - ./data:/usr/src/app/dist
    environment:
      # A list of supported login-server instances
      - LOGIN_SERVER=http://localhost:3004/,https://coli-conc.gbv.de/login/
      # A list of supported jskos-server instances
      - JSKOS_SERVER=http://localhost:3000/,https://coli-conc.gbv.de/api/
      # Base for URL (e.g. when not running under root of domain)
      - BASE=/
    # Internal port can be changed via environment variable PORT
    ports:
      - 80:80
    restart: unless-stopped
```

Start the container:

```sh
docker compose up -d
```

The app needs to be built after each update, as it is dependent on the specified environment variables (`LOGIN_SERVER`, `JSKOS_SERVER`, `BASE`). This update and build will be run in the background (if needed) each time the container is started.

To run the update manually without restarting the container (should be zero downtime):

```sh
docker compose exec -it jskos-web bash build.sh
```

Note that the container will clone the `main` branch of the site on first launch, then update the site via Git each time `build.sh` is run or the container is restarted.

The app will be served on port 80.

## Publishing the Docker Image

For maintainers: As the site within the container uses Git to keep itself updated, updates to the published image won't be necessary unless there are changes to the image itself (`Dockerfile` or any of the Docker-related scripts). To trigger an updated Docker image, go to https://github.com/gbv/jskos-web/actions/workflows/docker.yml and run the workflow on branch `main`.
