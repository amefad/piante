# Piante

Simple web application for collaborative mapping of public green spaces.

## Repository Structure

This project is built with the Vite React template and structured to serve both frontend and backend components from a specific server folder (`piante`).

The codebase is organized as follows:

- `src/`: Contains the primary React frontend code
- `public/`: Houses files that Vite preserves untouched during build:
  - `api/`: Backend PHP endpoints
  - `test/`: Basic API testing interface

The `public` folder's contents are copied directly to the `piante/` output directory during build.

While placing `api/` and `test/` inside `public/` may seem unconventional, this structure allows us to serve both frontend and backend under the same domain subpath (`piante/`) on our production server.

The Vite configuration uses a `base` path and API proxying to maintain consistent behavior across development and production environments.

## Prerequisites

In order to successfully start the app and run it either in dev and in preview mode you need:

- A reachable instance of a MySQL or MariaDB database.
- PHP with PDO extension.
- Node **LTS** >= 20 and npm

### Database Setup

The application requires a MySQL or MariaDB database instance. Use the scripts in the `database/` folder to create the schema.

Copy `public/config.php.sample` to `public/config.php` and configure your database connection parameters.

> **Note on MariaDB Authentication (Debian/Ubuntu)**:
>
> On Debian-based systems, MariaDB typically uses Unix socket authentication for the root user instead of password authentication. This means:
>
> 1. Authentication matches the system username with the database username
> 2. To use `root@localhost`, you must either be the system root user or use sudo:
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

1. PHP (CLI or VS Code extension)
2. [PDO extension](https://www.php.net/manual/en/book.pdo.php) for database connectivity

### Node.js Setup

Use the latest npm version compatible with your Node.js LTS installation (v20 or v22).

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the backend (required for development):
   ```bash
   npm run build
   ```
4. Start development servers:
   ```bash
   npm start
   ```

Additional commands:

- `npm run build`: Generate production build in `piante/`
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
| GET    | `/users`                 | List all users            | admin        | required |
| GET    | `/users/{id}`            | Get user details          | viewer       | required |
| POST   | `/users`                 | Create user               | -            | -        |
| POST   | `/users/{id}`            | Confirm user              | invalid      | required |
| PUT    | `/users/{id}`            | Update user               | viewer       | required |
| DELETE | `/users/{id}`            | Delete user               | viewer       | required |
| GET    | `/users?confirm={email}` | Send confirmation email   | -            | -        |
| GET    | `/users?reset={email}`   | Send password reset email | -            | -        |
| POST   | `/session`               | Login                     | -            | -        |
| DELETE | `/session`               | Logout                    | -            | optional |
| GET    | `/plants`                | List all plants           | -            | -        |
| GET    | `/plants/{id}`           | Get plant details         | -            | -        |
| POST   | `/plants`                | Create plant              | editor       | required |
| PUT    | `/plants/{id}`           | Update plant              | editor       | required |
| DELETE | `/plants/{id}`           | Delete plant              | editor       | required |
| GET    | `/images`                | List all images           | -            | -        |
| GET    | `/images/{id}`           | Get image details         | -            | -        |
| POST   | `/images`                | Upload image              | editor       | required |
| DELETE | `/images/{id}`           | Delete image              | editor       | required |

## Contributing

### Code Style

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
