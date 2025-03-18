<?php // Inserts a new plant into the database
try {
    require 'pdo.php';
    require 'auth.php';
    $stmt = $pdo->prepare("INSERT INTO plants (number, location, circumference, height, common_name, scientific_name, user_id) 
    VALUES (:num, POINT(:lon, :lat), :circ, :height, :common, :scientific, :user)");
    $stmt->bindParam(':num', $data['number']);
    $stmt->bindParam(':lon', $data['longitude']);
    $stmt->bindParam(':lat', $data['latitude']);
    $stmt->bindParam(':circ', $data['circumference']);
    $stmt->bindParam(':height', $data['height']);
    $stmt->bindParam(':common', $data['common-name']);
    $stmt->bindParam(':scientific', $data['scientific-name']);
    $stmt->bindParam(':user', $data['user-id']);
    $stmt->execute();
    $result = ['status' => 'success', 'message' => 'Pianta inserita correttamente'];
} catch (Exception $e) {
    $result = ['status' => 'error', 'message' => $e->getMessage()];
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
?>