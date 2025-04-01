# Piante
Simple web application for collaborative mapping of public green spaces.

## Database
`database` folder contains the scripts for creating the MySQL database.

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
