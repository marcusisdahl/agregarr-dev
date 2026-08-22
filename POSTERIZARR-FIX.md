# Posterizarr base-poster test build

Source: `bitr8/agregarr-dev`, branch `develop`, commit
`06567c37d96419f7f67c1dada2916132186114d5` (2026-08-22).

The bulk Plex base-poster download now queries
`/library/metadata/{ratingKey}/posters` for every item. Selection order is:

1. selected `upload://posters/...` poster;
2. any other selected poster;
3. the library item's current `thumb` as the fallback when Plex omits all
   `selected` markers.

This makes a selected Posterizarr upload win over a TMDB entry regardless of
the array order returned by Plex. It deliberately does not guess between stale
manual, Posterizarr, and Agregarr uploads when multiple unselected uploads are
present.

Content-addressed `upload://` and `metadata://` posters are downloaded through
Plex's `/file?url=...` endpoint. This pins the download to the chosen poster's
exact bytes instead of the mutable `/thumb/...` endpoint.

## Isolated local test

The included Compose file uses port `7172` and local `test-data` directories,
so it does not touch an existing Agregarr configuration:

```sh
docker compose -f docker-compose.posterizarr-fix.yml build
docker compose -f docker-compose.posterizarr-fix.yml up -d
```

Open `http://localhost:7172`, connect it to Plex, set the overlay base-poster
source to Plex, and run the base-poster download. For a known Posterizarr item,
verify that the cached image in `test-data/config/plex-base-posters` matches the
selected uploaded Plex poster.

## Server test with the existing configuration

Build the image on the server, then change only the existing Compose service's
image line to:

```yaml
image: agregarr:posterizarr-fix
```

Keep the existing `/opt/agregarr/config`, movie, and TV mounts unchanged. Build
the image from this directory with:

```sh
docker build \
  --build-arg COMMIT_TAG=06567c37d96419f7f67c1dada2916132186114d5-posterizarr-fix \
  -t agregarr:posterizarr-fix .
```
