# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

The project was scaffolded using the Vite React template (see [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite))

- `src`: Primary React front-end source code.
- `public`: Files that Vite does not process during build; these are copied unchanged into the output folder `piante`.
  - `public/api`: PHP API endpoints
  - `public/test`: Basic API testing interface

Placing `api` and `test` inside `public` may seem unconventional but allows us to easily serve both frontend and backend under the same domain subpath (`/piante`) on our existing server, just by storing the build output on the specific server folder (also named `piante`). Vite is configured with a custom base path and a proxy for API calls to maintain consistent behavior across development and production environments.

## Prerequisites

In order to successfully start the app and run it either in dev and in preview mode you need:

- A _reachable_ instance of a MySQL or MariaDB database.
- PHP with PDO extension.
- Node **LTS** >= 20 and npm

### Database setup

The application requires a MySQL or MariaDB database instance. Use the scripts in the `database` folder to create the schema.

Rename `public/config.php.sample` into `public/config.php` and configure your database connection parameters.

> **Note on MariaDB Authentication (Debian/Ubuntu)**:
>
> On Debian-based systems, MariaDB typically uses Unix socket authentication for the root user instead of password authentication. This means:
>
> 1. Authentication matches the system username with the database username
> 2. To use `root@localhost`, you must either be the system root user or use sudo:
>
>    ```bash
>    sudo mysql
>    ```
>
> To create additional socket-authenticated users:
>
> ```sql
> CREATE USER 'username'@'localhost' IDENTIFIED VIA unix_socket;
> ```
>
> For socket authentication, ensure the Unix username matches the database username:
>
> ```bash
> mysql -u username
> ```
>
> Resources:
>
> - [MariaDB Unix Socket Authentication](https://mariadb.com/kb/en/authentication-plugin-unix-socket/)
> - [Password Authentication Setup](https://mariadb.com/kb/en/authentication-plugin-unix-socket/#switching-to-password-based-authentication)

### PHP Configuration

Ensure you have:

1. PHP (we use PHP-CLI, VS Code extension may work either)
2. [PDO extension](https://www.php.net/manual/en/book.pdo.php) for database connectivity, installed and enabled.

### Node.js Setup

Node.js LTS (v20 or v22) and npm. Use the latest npm version compatible with your Node.js LTS installation.

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the backend (required for development as the PHP server serves APIs even in development):

   ```bash
   npm run build
   ```

4. Start development servers (Vite and PHP):

   ```bash
   npm start
   ```

Additional commands:

- `npm run build`: Generate production build in `piante`
- `npm run preview:php`: Preview production build at `localhost:8000/piante`

Resources:

- [Vite Modes](https://vite.dev/guide/env-and-mode.html#modes)
- [Vite CLI](https://vite.dev/guide/cli.html)
- [PHP CLI](https://www.php.net/manual/en/features.commandline.php)

## API Reference

The `api/` directory contains PHP endpoints that interact with the MySQL database and return JSON responses.

Endpoint permissions:

| Method | Endpoint                 | Description               | Minimum Role | Token    |
| ------ | ------------------------ | ------------------------- | ------------ | -------- |
| GET    | `/users`                 | Get all users             | admin        | required |
| GET    | `/users/{id}`            | Get a single user         | viewer       | required |
| POST   | `/users`                 | Create user               | -            | -        |
| POST   | `/users/{id}`            | Confirm user              | invalid      | required |
| PUT    | `/users/{id}`            | Update user               | viewer       | required |
| DELETE | `/users/{id}`            | Delete user               | viewer       | required |
| GET    | `/users?confirm={email}` | Send confirmation email   | -            | -        |
| GET    | `/users?reset={email}`   | Send password reset email | -            | -        |
| POST   | `/session`               | Login                     | -            | -        |
| DELETE | `/session`               | Logout                    | -            | optional |
| GET    | `/plants`                | Get all plants            | -            | -        |
| GET    | `/plants/{id}`           | Get a single plant        | -            | -        |
| POST   | `/plants`                | Create plant              | editor       | required |
| PUT    | `/plants/{id}`           | Update plant              | editor       | required |
| DELETE | `/plants/{id}`           | Delete plant              | editor       | required |
| GET    | `/images`                | Get details of all images | -            | -        |
| GET    | `/images/{id}`           | Get details of an image   | -            | -        |
| POST   | `/images`                | Upload image              | editor       | required |
| DELETE | `/images/{id}`           | Delete image              | editor       | required |

where roles are _admin_, _editor_, _viewer_, _invalid_, _public_, listed from the most powerful to the least one.

## Contributing

### Code Style

We use prettier to format code. For now the Prettier instance is managed via the VS Code extension and is not listed as package dependency.
We set `"printWidth": 100`.

### Visual Studio Code

If you are using VS Code you may want to add the extensions we are using:

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
