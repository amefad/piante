# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

We want to serve the front-end resources and the api from the same deployment server.
To achieve this, we wrapped all the code within an Astro project which leverages
an opinionated folder layout (see more on [Astro project structure](https://docs.astro.build/en/basics/project-structure/)).

## Database

The `database/` folder includes scripts designed to help you create a MySQL
(or MariaDB) database with the correct schema.

Define your database access parameters in the `public/config.php` file.  
You may use the example file `public/config.php.sample` by renaming it accordingly.

<details>

<summary> Note: MariaDB on Debian (and Ubuntu) commonly comes preconfigured to
use Unix socket authentication for the root user rather than a password. </summary>

Socket (or Unix socket) authentication works by matching the system (OS) username
with the database username. In a typical default MariaDB installation on Debian,
the root database account is configured to login with the authentication plugin
(often called auth_socket or unix_socket) that validates the Linux/Unix username
against the MariaDB account.

Socket authentication checks your operating system user, if you want to login
as _root@locahost_ (the MariaDB root user), you must either be the system’s root
user or use sudo. For example:

```bash
sudo mysql
```

If you want to set up additional MariaDB user accounts to use socket
authentication, you can do so with a command like:

```sql
CREATE USER 'alice'@'localhost' IDENTIFIED VIA unix_socket;
```

For alice to use this authentication, you should ensure that her Unix username
is also alice. Then she can connect by simply typing:
_(If not logged in as the expected user, you may have to use sudo or switch to that user.)_

```bash
mysql -u alice
```

See [MariaDB docs](https://mariadb.com/kb/en/authentication-plugin-unix-socket/)
for in depth instructions.

See how to **[switch to Password-based Authentication](https://mariadb.com/kb/en/authentication-plugin-unix-socket/#switching-to-password-based-authentication)**

</details>

## API

The `api/` folder contains the PHP code to get data from MySQL database and return it as JSON.

These are the allowed methods to access the API:

| Method | Endpoint                 | Description                   | Minimum role | Token    |
| ------ | ------------------------ | ----------------------------- | ------------ | -------- |
| GET    | `/users`                 | Gets all users                | admin        | required |
| GET    | `/users/{id}`            | Gets one user                 | viewer       | required |
| POST   | `/users`                 | Creates new user              | -            | -        |
| POST   | `/users/{id}`            | Confirms one user             | invalid      | required |
| PUT    | `/users/{id}`            | Updates one user              | viewer       | required |
| DELETE | `/users/{id}`            | Deletes one user              | viewer       | required |
| GET    | `/users?confirm={email}` | Sends confirmation email      | -            | -        |
| GET    | `/users?reset={email}`   | Sends email to reset password | -            | -        |
| POST   | `/session`               | Login                         | -            | -        |
| DELETE | `/session`               | Logout                        | -            | optional |
| GET    | `/plants`                | Gets all plants               | -            | -        |
| GET    | `/plants/{id}`           | Gets one plant                | -            | -        |
| POST   | `/plants`                | Creates new plant             | editor       | required |
| PUT    | `/plants/{id}`           | Updates one plant             | editor       | required |
| DELETE | `/plants/{id}`           | Deletes one plant             | editor       | required |
| GET    | `/images`                | Gets all images               | -            | -        |
| GET    | `/images/{id}`           | Gets one image                | -            | -        |
| POST   | `/images`                | Uploads new image             | editor       | required |
| DELETE | `/images/{id}`           | Deletes one image             | editor       | required |

## Frontend

This repository adheres to the Astro project convention.
(see more on [Astro project structure](https://docs.astro.build/en/basics/project-structure/))

The front-end code is primarily stored in the `src/` directory. However, some
files still belong in the `public/` directory.

## Test (wip)

The `test/` directory is used for testing and includes a basic interface for
interacting with the API.

## Setting up the dev environment

### Prerequisites

- Database (MySQL or MariaDB)
- PHP with PDO extension
- Node LTS and npm

#### Database (MySQL or MariaDB)

You must have access to a running instance of either MySQL or MariaDB.

See section [database](#database).

#### PHP with PDO extension

You can install PHP and PHP CLI on your system, or use a Visual Studio Code
extension.

The [PDO extension](https://www.php.net/manual/en/book.pdo.php) is required for
database interactions. Make sure to configure the proper authentication method
in config.php (see the [Database](#database) section for details).

#### Node LTS and npm

For Astro to run on your system, you must have **Node.js** installed. Only **LTS**
versions v20 and v22 are supported ( v19 and v21 are not supported).

Along with Node.js a version of **npm** (v10 or higher) is required.

### Editor setup

If you use vscode add the official Astro VS Code Extension to syntax highlight
and format Astro code. see [Astro docs](https://docs.astro.build/en/editor-setup/).

### Install dependencies

Run `npm install` to install dependencies.

Configs for Astro and other tools are already there.

### Development Servers

```text
"dev": "astro dev"
"dev:php": "php -S localhost:8000 -t public"
"start": "astro dev"
```

To begin development, start the Astro dev server by running `npm run dev`.
Additionally, ensure that the API is available: either launch the PHP dev server
using `npm run dev:php` (using PHP CLI) or use alternative methods such as VSCode
extensions to serve the `public/` folder.

Open the browser and visit `localhost:4321` (default Astro dev server port).

Astro will serve the front-end and proxy API calls to your PHP server based on
proxy configuration in `astro.config.mjs`.

### Building with Astro

During the build Astro performs the following steps:

- It processes and transforms the files in the `src` folder (e.g., astro components,
  pages, scripts, etc.), generating pre-rendered HTML files and bundling assets
  like JavaScript and CSS for interactivity.

- The `public` folder is kept unchanged. Its contents (such as static assets
  like images or other files) are simply copied over to the `dist` folder.

- Finally, Astro combines the transformed output from the `src` folder and the
  files from the `public` folder into the final production-ready build output,
  which by default is placed in the `dist` folder (_this output directory is configurable_).

Run `npm run build` to build the project.

see [how to build your site](https://docs.astro.build/en/develop-and-build/#build-and-preview-your-site) on Astro docs.

### Astro-relative-links integration

[see integration readme](https://github.com/ixkaito/astro-relative-links#readme)
Extensions will activate automatically on building.

example result in `dist/index.html`

```html
<link rel="stylesheet" href="./_astro/index.*.css" />
<script type="module" src="./_astro/hoisted.*.js"></script>
```

#### **deploy to a subpath**

(if you need you can still use this along with `astro-relative-links`)

If you want to serve the `dist` folder on a subpath (e.g., `www.example.com/piante/`),
set the `base` configuration in `astro.config.mjs`.
(see [base option](https://docs.astro.build/en/reference/configuration-reference/#base))

Note: Use this only for _deployment_ builds (ie you want to move the folder to
a deployment server), not when previewing with `npm run preview:php`, as the PHP
server isn't configured for subpath routing.

#### Previewing

```text
"build": "astro build"
"preview": "astro preview"
"preview:php": "php -S localhost:8000 -t dist"
```

After building the project with `npm run build`, preview the compiled code by
running `npm run preview:php` (you do not need to launch the other scripts anymore).

Visit `localhost:8000` with your browser to see the preview.

Note that this command serves the `dist/` folder (not `public/`), if you are using a vscode
extensions be sure the path is set accordingly.
