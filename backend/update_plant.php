<?php // Receives a JSON with plant ID and other data and updates the plant in database
// Doesn't updates date, user and images
// TODO aggiornare le immagini?
try {
    require 'pdo.php';
    require 'auth.php';
    if (empty($data['id'])) {
        throw new Exception('ID pianta mancante');
    }
    // Converts null values to empty strings to make them accepted by the following isset() checks
    foreach ($data as $key => $value) {
        if (is_null($value)) {
            $data[$key] = '';
        }
    }
    // Checks if all required fields are provided
    if (!isset($data['number'])) {
        throw new Exception('Numero pianta mancante');
    }
    if (!isset($data['latitude'])) {
        throw new Exception('Latitudine mancante');
    }
    if (!isset($data['longitude'])) {
        throw new Exception('Longitudine mancante');
    }
    if (!isset($data['height'])) {
        throw new Exception('Altezza mancante');
    }
    if (!isset($data['circumference'])) {
        throw new Exception('Circonferenza mancante');
    }
    if (!isset($data['common-name'])) {
        throw new Exception('Nome comune mancante');
    }
    if (!isset($data['scientific-name'])) {
        throw new Exception('Nome scientifico mancante');
    }
    // Converts empty strings to null values because we want to store null values in database
    foreach ($data as $key => $value) {
        if ($value == '') {
            $data[$key] = NULL;
        }
    }
    $stmt = $pdo->prepare('UPDATE plants SET number = :number, location = POINT(:longitude, :latitude),
    height = :height, circumference = :circumference, common_name = :common_name, scientific_name = :scientific_name
    WHERE id = :id');
    $stmt->execute([
        ':id' => $data['id'],
        ':number' => $data['number'],
        ':latitude' => $data['latitude'],
        ':longitude' => $data['longitude'],
        ':height' => $data['height'],
        ':circumference' => $data['circumference'],
        ':common_name' => $data['common-name'],
        ':scientific_name' => $data['scientific-name']
    ]);
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