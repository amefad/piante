<?php
define('UPLOAD_PATH', '../uploads/');
define('SCALED_PATH', '../uploads/scaled/');
define('THUMBNAIL_PATH', '../uploads/thumbnail/');

$url = strtok($_SERVER['REQUEST_URI'], '?'); // Removes any query from the request
preg_match('/\/api[\/]?(.*)/', $url, $matches); // Finds everything after '/api/'
$pieces = explode('/', $matches[1]); // Request pieces
if (isset($pieces[1]) && is_numeric($pieces[1])) {
    $id = intval($pieces[1]);
} else {
    $id = null;
}
$result = match ($pieces[0]) {
    'users' => handleUsers($id),
    'session' => handleSession(),
    'plants' => handlePlants($id),
    'species' => handleSpecies($id),
    'images' => handleImages($id),
    default => error('Endpoint inesistente')
};
// $result can be an array: [array, 201]
if (is_array($result) && sizeof($result) == 2 && isset($result[0]) && is_array($result[0]) && is_int($result[1])) {
    $array = $result[0];
    $code = $result[1];
} else { // Or a single array
    $array = $result;
    $code = 200;
}
http_response_code($code);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($array, JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);

function handleUsers($id) {
    require 'users.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($id)) {
        switch ($method) {
            case 'GET': return auth('getUser', 'view_user', $id);
            case 'POST': return auth('confirmUser', 'create_user', $id);
            case 'PUT': return auth('putUser', 'edit_user', $id);
            case 'DELETE': return auth('deleteUser', 'delete_user', $id);
            default: return error('Usa GET, POST, PUT o DELETE', 405);
        }
    } else if (isset($_GET['confirm'])) {
        switch ($method) {
            case 'GET': return resendConfirmation($_GET['confirm']);
            default: return error('Usa GET', 405);
        }
    } else if (isset($_GET['reset'])) {
        switch ($method) {
            case 'GET': return sendResetEmail($_GET['reset']);
            default: return error('Usa GET', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return auth('getUsers', 'view_users');
            case 'POST': return postUser();
            default: return error('Usa GET o POST', 405);
        }
    }
}

function handleSession() {
    require 'session.php';
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST': return postSession();
        case 'DELETE': return deleteSession();
        default: return error('Usa POST o DELETE', 405);
    }
}

function handlePlants($id) {
    require 'plants.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($id)) {
        switch ($method) {
            case 'GET': return getPlant($id);
            case 'PUT': return auth('putPlant', 'edit_plant', $id);
            case 'DELETE': return auth('deletePlant', 'delete_plant', $id);
            default: return error('Usa GET, PUT o DELETE', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return getPlants();
            case 'POST': return auth('postPlant', 'create_plant');
            default: return error('Usa GET o POST', 405);
        }
    }
}

function handleSpecies($id) {
    require 'species.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($id)) {
        switch ($method) {
            case 'GET': return getSpecies($id);
            default: return error('Usa GET', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return getAllSpecies();
            default: return error('Usa GET', 405);
        }
    }
}

function handleImages($id) {
    require 'images.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($id)) {
        switch ($method) {
            case 'GET': return getImage($id);
            case 'DELETE': return auth('deleteImage', 'delete_image', $id);
            default: return error('Usa GET o DELETE', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return getImages();
            case 'POST': return auth('postImage', 'create_image');
            default: return error('Usa GET o POST', 405);
        }
    }
}

// Checks if the user has the permission to access the resource
function auth($callback, $permission, $id = null) {
    require 'pdo.php';
    $token = getToken();
    if (is_null($token)) {
        return error('Token necessario', 401);
    } else {
        $user = $pdo->query("SELECT id, role FROM users WHERE token = '$token'")->fetch();
        if (!$user) {
            return error('Token non valido', 401);
        } else {
            $stmt = $pdo->prepare("SELECT self_only FROM authorizations WHERE role = ? AND permission = ?");
            $stmt->execute([$user['role'], $permission]);
            $selfOnly = $stmt->fetch()['self_only'] ?? false;
            if ($stmt->rowCount() == 0 || $selfOnly && $user['id'] != $id) {
                return error('Permessi insufficienti', 403);
            }
        }
    }
    if ($id) {
        return $callback($id);
    } else {
        return $callback();
    }
}

function getToken() {
    $headers = array_change_key_case(getallheaders());
    if (isset($headers['authorization'], )) {
        return trim(str_replace('Bearer', '', $headers['authorization']));
    } else {
        return null;
    }
}

function success($message) {
    return [['message' => $message], 200];
}

function error($message, $code = 400) {
    return [['message' => $message], $code];
}
?>