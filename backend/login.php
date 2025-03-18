<?php // Receives the login JSON data and checks the user is in database
// Adds a random token to the user in the database
// Returns a JSON with the token and user data
try {
    require 'pdo.php';
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (empty($data['email']) || empty($data['password'])) {
        throw new Exception('Email and password are required');
    }
    $stmt = $pdo->prepare('SELECT id, full_name AS name, email, password FROM users WHERE email = :email');
    $stmt->execute([':email' => $data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($data['password'], $user['password'])) {
        $stmt = $pdo->prepare('UPDATE users SET token = :token WHERE email = :email');
        $token = bin2hex(random_bytes(50));
        $stmt->execute([':token' => $token, ':email' => $data['email']]);
        $result = array('status' => 'success', 'message' => 'Login successful', 'token' => $token, 'user' => $user);
    } else {
        throw new Exception('Login fallito');
    }
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>