<?php // Loads all plants from the database
try {
    require 'pdo.php';
    $plants = $pdo->query('SELECT id, number, ST_Y(location) AS latitude, ST_X(location) AS longitude, height, circumference, height,
    common_name AS `common-name`, scientific_name AS `scientific-name`, insert_date AS date, user_id AS user
    FROM plants')->fetchAll(PDO::FETCH_ASSOC);

    // Adds user data to plants array
    $userIds = array();
    foreach ($plants as &$plant) {
        if (!in_array($plant['user'], $userIds)) $userIds[] = $plant['user'];
    }
    $users = $pdo->query('SELECT id, full_name AS name, email FROM users WHERE id IN ('. join(',', $userIds). ')')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($plants as &$plant) {
        foreach ($users as $user) {
            if ($user['id'] == $plant['user']) {
                $plant['user'] = $user;
                break;
            }
        }
    }
    // Add images data to plants array
    $plantIds = array();
    foreach ($plants as &$plant) {
        $plantIds[] = $plant['id'];
    }
    $files = $pdo->query('SELECT id, file_name, plant_id FROM images WHERE plant_id IN ('. join(',', $plantIds). ')')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($plants as &$plant) {
        $plant['images'] = array();
        foreach ($files as $file) {
            if ($file['plant_id'] == $plant['id']) {
                $image = array();
                $image['id'] = $file['id'];
                $image['file-path'] = 'uploads/' . $file['file_name'];
                $plant['images'][] = $image;
            }
        }
    }
    $result = array('status' => 'success', 'plants' => $plants);
} catch (Exception $e) {
    $result = array('status' => 'error', 'message' => $e->getMessage());
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>