# jskos-web

> Web interface to view JSKOS data

Under construction.

## Table of Contents <!-- omit in toc -->
- [Install](#install)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [Configuration](#configuration)
- [API](#api)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

You will need Node.js version 14.18 or later. Currently, using v16 is recommended.

~~~bash
git clone https://github.com/gbv/jskos-web.git
cd jskos-web
npm install
~~~

## Usage

### Development
```bash
npm run dev
```

This opens a dev server on http://localhost:3453.

### Production
```bash
# Bundle Vue files
npm run build
# Run server in production
# Alternatively, you can statically host the built files in dist/
npm run serve
```

## Configuration

You can adjust a few configuration options in `.env`. Here are the available options:

```bash
# A list of supported login-server instances
LOGIN_SERVER=http://localhost:3004/,https://coli-conc.gbv.de/login/
# A list of supported jskos-server instances
JSKOS_SERVER=http://localhost:3000/,https://coli-conc.gbv.de/api/
```

## API
TODO

## Maintainers
- [@stefandesu](https://github.com/stefandesu)
- [@nichtich](https://github.com/nichtich)

<!-- ## Publish
Please work on the `dev` branch or separate feature branch during development.

When a new release is ready (i.e. the features are finished, merged into `dev`, and all tests succeed), run the included release script (replace "patch" with "minor" or "major" if necessary):

```bash
npm run release:patch
```

This will:
- Run tests and build to make sure everything works
- Switch to `dev`
- Make sure `dev` is up-to-date
- Run `npm version patch` (or "minor"/"major")
- Push changes to `dev`
- Switch to `main`
- Merge changes from `dev`
- Push `main` with tags
- Switch back to `dev`

After running this, GitHub Actions will automatically create a new GitHub Release draft. Please edit and publish the release manually. -->

## Contribute
PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License
MIT Copyright (c) 2022 Verbundzentrale des GBV (VZG)
