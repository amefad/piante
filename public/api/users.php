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
    // Inserts user data in database
    $stmt = $pdo->prepare('INSERT INTO users (full_name, email, password, token) VALUES (?, ?, ?, ?)');
    $name = $data['name'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $token = base64_encode(random_bytes(32));
    $stmt->execute([$name, $email, $password, $token]);
    // Sends confirmation email
    $id = $pdo->lastInsertId();
    sendEmail($id, $name, $email, $token);
    // Returns user just created
    $user = $pdo->query("SELECT id, full_name AS name, email, role FROM users WHERE id = $id")->fetch();
    return [$user, 201];
}

// Resends the confirmation email to the user with the given email
function resendConfirmation($email) {
    require 'pdo.php';
    $stmt = $pdo->prepare("SELECT id, full_name AS name, role, token FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if ($user) {
        if ($user['role'] == 'invalid') {
            if (sendEmail($user['id'], $user['name'], $email, $user['token'])) {
                return success('Email di conferma inviata');
            } else {
                return error('Email non inviata', 500);
            }
        } else {
            return error('Email già confermata', 409);
        }
    } else {
        return error('Utente non trovato', 404);
    }
}

// Returns true on success
function sendEmail($id, $name, $email, $token) {
    $token = urlencode($token);
    $subject = 'Benvenuto nella Mappa delle piante';
    $link = "https://michelesalvador.it/piante/test/confirm.html?id=$id&token=$token";
    $message = "<p>Ciao $name,<br>benvenuto nella Mappa delle piante.</p>
        <p>Per completare la registrazione clicca questo link:</p>
        <p><strong><a href=\"$link\">$link</a></strong></p>
        <p>Se non hai richiesto questa email, puoi ignorarla.</p>
        <p>Grazie,<br>Il team di Mappa delle piante</p>";
    return mail($email, $subject, $message, "From: fame@libero.it\r\nContent-Type: text/html; charset=UTF-8");
}

// Confirms the user by setting the role to editor and the token to NULL in database
// Returns the user just updated
function confirmUser($id) {
    require 'pdo.php';
    $error = require 'auth.php';
    if ($error) return $error;
    // Updates user
    $stmt = $pdo->prepare("UPDATE users SET role = 'editor', token = NULL WHERE id = ? AND token = ?");
    $stmt->execute([$id, $token]);
    if ($stmt->rowCount() == 1) {
        // Returns user just updated
        $user = $pdo->query("SELECT id, full_name AS name, email, role FROM users WHERE id = $id")->fetch();
        return $user;
    } else {
        return error('Utente non trovato');
    }
}

function getUsers() {
    require 'pdo.php';
    $error = require 'auth.php';
    if ($error) return $error;
    return $pdo->query("SELECT id, full_name AS name, email, role FROM users")->fetchAll();
}

function getUser($id) {
    require 'pdo.php';
    $error = require 'auth.php';
    if ($error) return $error;
    $user = $pdo->query("SELECT id, full_name AS name, email, role, token FROM users WHERE id = $id AND token = '$token'")->fetch();
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