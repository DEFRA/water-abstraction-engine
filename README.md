# Water Abstraction Engine

![Build Status](https://github.com/DEFRA/water-abstraction-engine/actions/workflows/ci.yml/badge.svg?branch=main)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-engine&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-engine)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-engine&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-engine)
[![shai-hulud-detect](https://github.com/DEFRA/water-abstraction-engine/actions/workflows/shai-hulud-detect.yml/badge.svg)](https://github.com/DEFRA/water-abstraction-engine/actions/workflows/shai-hulud-detect.yml)
[![Licence](https://img.shields.io/badge/Licence-OGLv3-blue.svg)](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

A shared Node.js package used by the [water-abstraction-external](https://github.com/DEFRA/water-abstraction-external) and [water-abstraction-system (internal)](https://github.com/DEFRA/water-abstraction-system).

It centralises shared infrastructure — a base server, models, data access layer (DAL) modules, services, plugins, views, and utilities — consumed by both internal and external water abstraction applications.

It will never be published to NPM. The apps reference the package directly from the GitHub repository.

## Prerequisites

Make sure you already have:

- [Node.js v24.\*](https://nodejs.org/en/)
- [PostgreSQL v15](https://www.postgresql.org/)

## Running locally

This is one of a number of projects that make up the Water Resource Licencing service. Because of the service's complex infrastructure there is a separate project available that will build a fully working WRLS environment, using [Docker](https://docs.docker.com/get-docker/). We recommend reaching out to the [Water Abstraction team](https://github.com/orgs/DEFRA/teams/water-abstraction) and requesting access to **wal-dev-environment** if you need to get this project up and running.

## Configuration

> This is automatically setup when running locally using **wal-dev-environment**

Any configuration is expected to be driven by environment variables set by the external and internal apps when the service is run in production as per [12 factor app](https://12factor.net/config).

However when running tests it makes use of the [Dotenv](https://github.com/motdotla/dotenv) package. This is a shim that will load values stored in a `.env` file into the environment which the service will then pick up as though they were there all along.

Check out [.env.example](/.env.example) for details of the required things you'll need in your `.env` file.

Refer to the [config files](/src/config) for details of all the configuration used.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
