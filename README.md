# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

The project was scaffolded using the Vite React template (see [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite))

- `src`: Primary React front-end source code.
- `public`: Files that Vite does not process during build; these are copied unchanged into the output folder `piante`.
  - `public/api`: PHP API endpoints
  - `public/test`: Basic API testing interface

Placing `api` and `test` inside `public` may seem unconventional but allows us to easily serve both frontend and backend under the same domain subpath (`/piante`) on our existing server, just by storing the build output on the specific server folder (also named `piante`). Vite is configured with a custom base path and a proxy for API calls to maintain consistent behavior across development and production environments (see `vite.config.js`).

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

3. Run the build command:

   ```bash
   npm run build
   ```

   This will generate a complete production build in the `piante` folder. Note that this step is
   required for development, as the PHP server serves APIs even in development mode.

4. Now you can start both the Vite dev server and the PHP server using:

   ```bash
   npm start
   ```

   When launched with this command, the Vite server listens on port `5173`, while the PHP server
   listens on port `8000`.

### Additional Scripts

- `npm run preview:php`: Preview the production build using the PHP server.

Resources:

- [Vite Modes](https://vite.dev/guide/env-and-mode.html#modes)
- [Vite CLI](https://vite.dev/guide/cli.html)
- [PHP CLI](https://www.php.net/manual/en/features.commandline.php)

## API Reference

The `api` directory contains PHP endpoints that interact with the MySQL database and return JSON responses.

Endpoint permissions:

| Method | Endpoint                 | Description               | Minimum Role | Token    |
| ------ | ------------------------ | ------------------------- | ------------ | -------- |
| GET    | `/users`                 | Get all users             | admin        | required |
| GET    | `/users/{id}`            | Get a single user         | viewer*      | required |
| POST   | `/users`                 | Create user               | -            | -        |
| POST   | `/users/{id}`            | Confirm user              | invalid*     | required |
| PUT    | `/users/{id}`            | Update user               | invalid*     | required |
| DELETE | `/users/{id}`            | Delete user               | viewer*      | required |
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

(*) Can access only their own user profile (unless _admin_).

### Roles

These are the four roles, listed from the weaker to the most powerful:

1. **invalid** - User just registered, waiting to confirm their email address. Can do nothing but update their password.
2. **viewer** - Can also view and delete their own profile. Usually unused.
3. **editor** - User after email confirmation. Can also update all contents.
4. **admin** - Can also list, modify and delete other users.

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
