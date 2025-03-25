<?php
// Since in database email is unique, checks if the email already exists
// Registers a new user inserting received JSON data in database
// Returns the user just created
function postUser() {
    require 'pdo.php';
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        return error('Nome, email e password sono necessari');
    }
    // Checks existing email
    $email = $data['email'];
    $existing = $pdo->query("SELECT email FROM users WHERE email = '$email'")->fetch();
    if ($existing) {
        return error('Email già esistente', 409);
    }
    // Inserts in database
    $stmt = $pdo->prepare('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)');
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt->execute([$data['name'], $email, $password]);
    // User just created
    $id = $pdo->lastInsertId();
    $user = $pdo->query("SELECT id, full_name AS name, email FROM users WHERE id = $id")->fetch();
    return [$user, 201];
}

function getUser($id) {
    require 'pdo.php';
    $error = require 'auth.php';
    if ($error) return $error;
    $user = $pdo->query("SELECT id, full_name AS name, email, token FROM users WHERE id = $id AND token = '$token'")->fetch();
    if ($user) {
        return $user;
    } else {
        return error('Utente non trovato', 404);
    }
}

function deleteUser($id) {
    require 'pdo.php';
    $token = getToken();
    if (isset($token)) {
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = ? AND token = ?');
        $stmt->execute([$id, $token]);
        if ($stmt->rowCount() == 1) {
            return success('Utente eliminato');
        } else {
            return error('Utente non trovato', 404);
        }
    } else {
        return error('Token necessario', 401);
    }
}
?>