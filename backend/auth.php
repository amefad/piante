<?php // Gets JSON data and authorizes
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if (empty($data['token'])) {
    throw new Exception('Token is required');
} else {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE token = :token');
    $stmt->execute([':token' => $data['token']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        throw new Exception('Token non valido');
    }
}
?>