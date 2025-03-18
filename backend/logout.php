<?php // Logouts deleting the token from database
    try {
        require 'pdo.php';
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        if (empty($data['token'])) {
            throw new Exception('Token not provided');
        }
        $stmt = $pdo->prepare('UPDATE users SET token = NULL WHERE token = :token');
        $stmt->execute([':token' => $data['token']]);
        if ($stmt->rowCount() == 0) {
            throw new Exception('Token not found');
        }
        $result = ['status' => 'success', 'message' => 'Logout avvenuto con successo'];
    } catch (Exception $e) {
        $result = ['status' => 'error', 'message' => $e->getMessage()];
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($result);
?>