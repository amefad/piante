<?php // Registers a new user inserting received JSON data in database
// Since in database email is unique, checks also if the email already exists
// Returns a JSON with success or error message
try {
    require 'pdo.php';
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        throw new Exception('Name, email and password are required');
    }
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password) VALUES (:name, :email, :password)");
    $name = $data['name'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->execute();
    $result = array('status' => 'success', 'message' => 'Utente registrato con successo');
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result)
?>