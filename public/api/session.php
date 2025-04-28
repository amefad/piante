<?php
// Receives the login JSON data and checks the user is in database
// Adds a random token to the user in the database, if not already present
// Returns user data with the token
function postSession() {
    require 'pdo.php';
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['email']) || empty($data['password'])) {
        return error('Email e password necessarie');
    }
    $stmt = $pdo->prepare('SELECT id, full_name AS name, email, role, token, password FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    if ($user && password_verify($data['password'], $user['password'])) {
        if ($user['role'] == 'invalid') {
            return error('Email non confermata', 401);
        }
        if (is_null($user['token'])) {
            $stmt = $pdo->prepare('UPDATE users SET token = ? WHERE email = ?');
            $token = base64_encode(random_bytes(32));
            $stmt->execute([$token, $data['email']]);
            $user['token'] = $token;
        }
        unset($user['password']);
        return $user;
    } else {
        return error('Login fallito', 401);
    }
}

// Logouts deleting the token from database
function deleteSession() {
    require 'pdo.php';
    $token = getToken();
    $message = 'Eri già disconnesso';
    if (isset($token)) {
        $stmt = $pdo->prepare('UPDATE users SET token = NULL WHERE token = ?');
        $stmt->execute([$token]);
        if ($stmt->rowCount() == 1) {
            $message = 'Logout avvenuto con successo';
        }
    }
    return success($message);
}
?>