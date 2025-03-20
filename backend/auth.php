<?php // Gets JSON data and authorizes
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if (empty($data['token'])) {
    throw new Exception('Token necessario');
} else {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE token = ?');
    $stmt->execute([$data['token']]);
    $user = $stmt->fetch();
    if (!$user) {
        throw new Exception('Token non valido');
    }
}
?>