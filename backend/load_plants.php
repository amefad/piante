<?php // Loads all plants from the database
try {
    require 'pdo.php';
    $plants = $pdo->query('SELECT id, number, ST_Y(location) AS latitude, ST_X(location) AS longitude, height, circumference, height,
    common_name AS `common-name`, scientific_name AS `scientific-name`, insert_date AS date, user_id AS user
    FROM plants')->fetchAll();
    // Adds user data to plants array
    $userIds = array();
    foreach ($plants as &$plant) {
        if (!in_array($plant['user'], $userIds)) $userIds[] = $plant['user'];
    }
    $users = $pdo->query('SELECT id, id, full_name AS name, email
    FROM users WHERE id IN ('. join(',', $userIds). ')')->fetchAll(PDO::FETCH_UNIQUE);
    foreach ($plants as &$plant) {
        if (isset($users[$plant['user']])) {
            $plant['user'] = $users[$plant['user']];
        }
    }
    // Add images data to plants array
    $plantIds = array();
    foreach ($plants as &$plant) {
        $plantIds[] = $plant['id'];
    }
    $images = $pdo->query('SELECT plant_id, id, CONCAT("uploads/", file_name) AS `file-path`
    FROM images WHERE plant_id IN ('. join(',', $plantIds). ')')->fetchAll(PDO::FETCH_GROUP);
    foreach ($plants as &$plant) {
        if (isset($images[$plant['id']])) {
            $plant['images'] = $images[$plant['id']];
        } else {
            $plant['images'] = array(); // Empty array
        }
    }
    $result = array('status' => 'success', 'plants' => $plants);
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>