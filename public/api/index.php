<?php
define('UPLOADS_PATH', '../uploads/');

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
            case 'GET': return getUser($id);
            case 'DELETE': return deleteUser($id);
            default: return error('Usa GET o DELETE', 405);
        }
    } else {
        switch ($method) {
            case 'POST': return postUser();
            default: return error('Usa POST', 405);
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
            case 'PUT': return putPlant($id);
            case 'DELETE': return deletePlant($id);
            default: return error('Usa GET, PUT o DELETE', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return getPlants();
            case 'POST': return postPlant();
            default: return error('Usa GET o POST', 405);
        }
    }
}

function handleImages($id) {
    require 'images.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if (isset($id)) {
        switch ($method) {
            case 'GET': return getImage($id);
            case 'DELETE': return deleteImage($id);
            default: return error('Usa GET o DELETE', 405);
        }
    } else {
        switch ($method) {
            case 'GET': return getImages();
            case 'POST': return postImage();
            default: return error('Usa GET o POST', 405);
        }        
    }
}

function getToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        return trim(str_replace('Bearer', '', $headers['Authorization']));
    } else {
        return null;
    }
}

function success($message) {
    return [['message' => $message], 200 ];
}

function error($message = 'Errore generico', $code = 400) {
    return [['message' => $message], $code ];
}
?>