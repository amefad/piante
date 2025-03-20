<?php // Logouts deleting the token from database
    try {
        require 'pdo.php';
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $message = 'Eri già disconnesso';
        if (isset($data['token'])) {
            $stmt = $pdo->prepare('UPDATE users SET token = NULL WHERE token = ?');
            $stmt->execute([$data['token']]);
            if ($stmt->rowCount() == 1) {
                $message = 'Logout avvenuto con successo';
            }
        }
        $result = ['status' => 'success', 'message' => $message];
    } catch (Exception $e) {
        $result = ['status' => 'error', 'message' => $e->getMessage()];
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($result);
?>