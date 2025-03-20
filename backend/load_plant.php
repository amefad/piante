<?php // Receives a JSON with plant ID and searches for the plant in database
try {
    require 'pdo.php';
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['plant-id'])) {
        throw new Exception('ID pianta mancante');
    }
    $stmt = $pdo->prepare('SELECT id, number, ST_Y(location) AS latitude, ST_X(location) AS longitude, height, circumference, height,
    common_name AS `common-name`, scientific_name AS `scientific-name`, insert_date AS date, user_id AS user FROM plants WHERE id = ?');
    $stmt->execute([$data['plant-id']]);
    $plant = $stmt->fetch();
    if ($plant) {
        $user = $pdo->query('SELECT id, full_name AS name, email FROM users WHERE id = '. $plant['user'])->fetch();
        if ($user) {
            $plant['user'] = $user;
        }
        $files = $pdo->query('SELECT id, file_name, plant_id FROM images WHERE plant_id = '. $plant['id'])->fetchAll();
        $plant['images'] = array();
        foreach ($files as $file) {
            $image = array();
            $image['id'] = $file['id'];
            $image['file-path'] = 'uploads/' . $file['file_name'];
            $plant['images'][] = $image;
        }
        $result = array('status' => 'success', 'plant' => $plant);
    } else {
        throw new Exception('Pianta non trovata');
    }
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>