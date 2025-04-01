<?php
// Gets bearer token and authorizes
$token = getToken();
if (is_null($token)) {
    return error('Token necessario', 401);
} else {
    $user = $pdo->query("SELECT id FROM users WHERE token = '$token'")->fetch();
    if (!$user) {
        return error('Token non valido', 401);
    }
}
// Gets JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);
return false; // Returns no error
?>