<?php // Receives a JSON with plant ID and other data and updates the plant in database
// Doesn't updates date, user and images
// TODO aggiornare le immagini?
try {
    require 'pdo.php';
    require 'auth.php';
    if (empty($data['id'])) {
        throw new Exception('ID pianta mancante');
    }
    $stmt = $pdo->prepare('UPDATE plants SET number = :number, location = POINT(:longitude, :latitude),
    height = :height, circumference = :circumference, common_name = :common_name, scientific_name = :scientific_name
    WHERE id = :id');
    $stmt->bindParam(':number', $data['number']);
    $stmt->bindParam(':longitude', $data['longitude']);
    $stmt->bindParam(':latitude', $data['latitude']);
    $stmt->bindParam(':height', $data['height']);
    $stmt->bindParam(':circumference', $data['circumference']);
    $stmt->bindParam(':common_name', $data['common-name']);
    $stmt->bindParam(':scientific_name', $data['scientific-name']);
    $stmt->bindParam(':id', $data['id']);
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        throw new Exception('Nessuna pianta è stata modificata');
    }
    $result = array('status' => 'success', 'message' => 'Pianta aggiornata correttamente');
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>