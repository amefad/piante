<?php // Deletes one plant from database
try {
    require 'pdo.php';
    require 'auth.php';
    if (empty($data['plant-id'])) {
        throw new Exception('Plant ID is required');
    }
    $stmt = $pdo->prepare('DELETE FROM plants WHERE id = :id');
    $stmt->execute([':id' => $data['plant-id']]);
    if ($stmt->rowCount() == 0) {
        throw new Exception('Pianta non trovata');
    }
    // Eliminare anche immagini?
    //$stmt = $pdo->prepare('DELETE FROM images WHERE plant_id = :id');
    $result = array('status' => 'success', 'message' => 'Pianta eliminata');
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>