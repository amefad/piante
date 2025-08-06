# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

The project was scaffolded with Vite React template.

We want to publish the front-end resources and the back-end api on a specific server folder (`piante`).
To do so we choose to put api into `public` folder.

The front-end code is primarily stored in the `src/` directory. However, some
files still belong in the `public/` directory.

`public` folder stores files that Vite does not process during building, they are copied untouched
over to the generated output `piante/`.

APIs code is located in `public/api`

The `public/test` directory is used for interacting with the API using a basic interface.

Placing the `api/` and `test/` inside the `public/` may be a little unusual. The reason behind that
is that we want to publish the front-end resources and the back-end APIs on the same domain subpath
just placing them into a folder called (`piante`) on a server we already have up and running.

We configured Vite to serve from a `base` path and proxy APIs calls to ensure we can reach api
during development while maintaining the correct behavior when deployed on our server.

## Requisites

In order to successfully start the app and run it either in dev and in preview mode you need:

- A reachable instance of a MySQL or MariaDB database.
- PHP with PDO extension.
- Node **LTS** >= 20 and npm

### Database (MySQL or MariaDB)

APIs must have access to a running instance of either MySQL or MariaDB.

The `database/` folder includes scripts designed to help you create a MySQL (or MariaDB) database
with the correct schema.

Define your database access parameters in the `public/config.php` file. (configure a proper
authentication method). You may use the example file `public/config.php.sample` by renaming it
accordingly.

<details>

<summary> Note: MariaDB on Debian (and Ubuntu) commonly comes pre-configured to
use Unix socket authentication for the root user rather than a password. </summary>

Socket (or Unix socket) authentication works by matching the system (OS) username
with the database username. In a typical default MariaDB installation on Debian,
the root database account is configured to login with the authentication plugin
(often called auth_socket or unix_socket) that validates the Linux/Unix username
against the MariaDB account.

Socket authentication checks your operating system user, if you want to login
as `root@localhost` (the MariaDB root user), you must either be the system’s root
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

### PHP with PDO extension

You need something that can run PHP, can be PHP CLI or a Visual Studio Code extension.

The [PDO extension](https://www.php.net/manual/en/book.pdo.php) of the PHP ecosystem is required for
database interactions, you may need to install or activate it.

### Node LTS and npm

The only supported versions are the **LTS** v20 and v22. Use the latest version of **npm** compatible
with the Node version you are using.

## Get Started

After cloning the repo and fulfill the above requirements you can run `npm install` to install dependencies.

Run `npm run build` to build the current backend. Keep in mind that APIs are always served by the
PHP server even in development, so you need to do this at least one time before running`npm start`.

Run `npm start` to launch the Vite development server and the PHP server for APIs at the same time.

Run `npm build` to generate a build in the `piante/` folder (will be automatically created or overwritten)

Run `npm run preview:php` if want to locally preview the production build at `localhost:8000/piante`.

Useful readings:

- Vite [Modes](https://vite.dev/guide/env-and-mode.html#modes).
- Vite [CLI](https://vite.dev/guide/cli.html).
- PHP [CLI](https://www.php.net/manual/en/features.commandline.php)

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

## Contributing

### Tools

Use prettier to format code but we are just using the Vscode extension (we only set a custom `"printWidth": 100`)

### Visual Studio Code

If you are using Vscode you may want to add the extensions we are using:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bmewburn.vscode-intelephense-client",
    "dbaeumer.vscode-eslint"
  ]
}
```
