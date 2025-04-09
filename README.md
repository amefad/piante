# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

We want to serve the front-end resources and the api from the same deployment server. In order to do that we wrapped all the code inside an Astro project; the `api/` folder will not be processed by Astro during building but it will still be present in the `dist/` folder (the one that is deployed on the deployment server). The `database` folder is an exception: it doesn't need to adhere to the Astro project structure.

more on [Astro project structure](https://docs.astro.build/en/basics/project-structure/)

## Database

`database` folder contains the scripts for creating the MySQL database but _is not part of the Astro project_

Username and password to access the database have to be defined in a `api/config.php` file.\
You can rename the example file `api/config.php.sample`.

## API

`api` folder contains the PHP code to get data from MySQL database and return it as JSON.

These are the allowed methods to access the API:
| Method | Endpoint | Description |
|-|-|-|
| POST | `/api/users` | Creates new user |
| GET | `/api/users/{id}` | Gets one user |
| DELETE | `/api/users/{id}` | Deletes one user |
| POST | `/api/session` | Login |
| DELETE | `/api/session` | Logout |
| GET | `/api/plants` | Gets all plants |
| POST | `/api/plants` | Creates new plant |
| GET | `/api/plants/{id}` | Gets one plant |
| PUT | `/api/plants/{id}` | Updates one plant |
| DELETE | `/api/plants/{id}` | Deletes one plant |
| GET | `/api/images` | Gets all images |
| POST | `/api/images` | Uploads new image |
| GET | `/api/images/{id}` | Gets one image |
| DELETE | `/api/images/{id}` | Deletes one image |

## Frontend

`frontend` folder contains a basic interface to interact with the API.

### Setting up the dev environment

#### System setup

For Astro to run on your system, you will also need to have **Node.js** installed; only **lts** version are supported so v18.17.1 or v20.3.0, v22.0.0 or higher. ( v19 and v21 are not supported.). Along with Node a version of **npm** (better > 10) is required.

#### Editor setup

If you use vscode add the official Astro VS Code Extension, see [Astro docs](https://docs.astro.build/en/editor-setup/).

#### Install dependencies

run `npm install`

Configs for Astro and other tools are already there.

#### Building with Astro

run `npm run build`

to generate the `dist/` folder containing all the front-end resources along with the `api/` folder.

`dist/` can be copied on the deployment server.

see [how to build your site](https://docs.astro.build/en/develop-and-build/#build-and-preview-your-site)

<!-- **warning: following commands are NOT intended to be used with the current repository structure** -->

#### Development Servers

```text
"dev": "astro dev"
"dev:php": "php -S localhost:8000 -t public"
"start": "astro dev"
```

use `npm run dev` to start Astro dev server, in order to use api start also the php dev server with `npm run dev:php`, serving the `public/` folder.

##### Building and Preview

```text
"build": "astro build"
"preview": "astro preview"
"preview:php": "php -S localhost:8000 -t dist"
```

`npm run preview:php`: run a php server to view the built version of your site locally. Note that it serves the `dist/` folder (not `public/`)
