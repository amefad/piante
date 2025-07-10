<?php
// Gets all plants from the database
function getPlants() {
    try {
        require 'pdo.php';
        $plants = $pdo->query('SELECT id, number, ST_Y(location) AS latitude, ST_X(location) AS longitude, height, circumferences, height,
        common_name AS `common-name`, scientific_name AS `scientific-name`, insert_date AS date, user_id AS user
        FROM plants')->fetchAll();
        foreach ($plants as &$plant) {
            if (!is_null($plant['circumferences'])) {
                $plant['circumferences'] = json_decode($plant['circumferences']);
            } else {
                $plant['circumferences'] = array();
            }
        }
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
        $images = $pdo->query('SELECT plant_id, id, file_name AS `file-name`
        FROM images WHERE plant_id IN ('. join(',', $plantIds). ')')->fetchAll(PDO::FETCH_GROUP);
        foreach ($plants as &$plant) {
            if (isset($images[$plant['id']])) {
                $plant['images'] = $images[$plant['id']];
            } else {
                $plant['images'] = array(); // Empty array
            }
        }
        return $plants;
    } catch (Exception $exception) {
        return error($exception->getMessage());
    }
}

// Receives a plant ID and searches for the plant in database
// With $complete false returns no user nor images
function getPlant($id, $complete = true) {
    require 'pdo.php';
    $stmt = $pdo->prepare('SELECT id, number, ST_Y(location) AS latitude, ST_X(location) AS longitude, circumferences, height,
    common_name AS `common-name`, scientific_name AS `scientific-name`, insert_date AS date, user_id AS user FROM plants WHERE id = ?');
    $stmt->execute([$id]);
    $plant = $stmt->fetch();
    if ($plant) {
        if (!is_null($plant['circumferences'])) {
            $plant['circumferences'] = json_decode($plant['circumferences']);
        } else {
            $plant['circumferences'] = array();
        }
        if ($complete) {
            $user = $pdo->query('SELECT id, full_name AS name, email FROM users WHERE id = '. $plant['user'])->fetch();
            if ($user) {
                $plant['user'] = $user;
            }
            $files = $pdo->query('SELECT id, file_name, plant_id FROM images WHERE plant_id = '. $plant['id'])->fetchAll();
            $plant['images'] = array();
            foreach ($files as $file) {
                $image = array();
                $image['id'] = $file['id'];
                $image['file-name'] = $file['file_name'];
                $plant['images'][] = $image;
            }
        } else {
            unset($plant['user']);
        }
        return $plant;
    } else {
        return error('Pianta non trovata', 404);
    }
}

// Inserts a new plant in database
function postPlant() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['user-id'])) {
        return error('ID utente necessario');
    }
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO plants (number, location, circumferences, height, common_name, scientific_name, user_id)
    VALUES (:num, POINT(:lon, :lat), :circ, :height, :common, :scientific, :user)");
    $stmt->bindParam(':num', $data['number']);
    $stmt->bindParam(':lon', $data['longitude']);
    $stmt->bindParam(':lat', $data['latitude']);
    if (isset($data['circumferences']) && !is_null($data['circumferences'])) {
        $circ = json_encode($data['circumferences']);
    }
    $stmt->bindParam(':circ', $circ);
    $stmt->bindParam(':height', $data['height']);
    $stmt->bindParam(':common', $data['common-name']);
    $stmt->bindParam(':scientific', $data['scientific-name']);
    $stmt->bindParam(':user', $data['user-id']);
    $stmt->execute();
    // Returns new plant
    $plant = getPlant($pdo->lastInsertId(), false);
    return [$plant, 201];
}

// Receives a JSON with plant ID and other data and updates the plant in database
// Doesn't update date, user and images
function putPlant($id) {
    $updates = array(
        'number' => 'number',
        'longitude' => 'longitude',
        'latitude' => 'latitude',
        'circumferences' => 'circumferences',
        'height' => 'height',
        'common_name' => 'common-name',
        'scientific_name' => 'scientific-name'
    );
    // Data into $updates
    $data = json_decode(file_get_contents('php://input'), true);
    foreach ($updates as $key => $value) {
        if (array_key_exists($value, $data)) {
            if (is_null($data[$value])) {
                $updates[$key] = NULL;
            } else if ($key == 'circumferences') {
                $updates[$key] = json_encode($data[$value]);
            } else {
                $updates[$key] = $data[$value];
            }
        } else {
            unset($updates[$key]);
        }
    }
    if ($updates) {
        global $pdo;
        // Prepares statement
        $stmt = $pdo->prepare('UPDATE plants SET ' . join(', ', array_map(function($key) {
            if ($key == 'longitude') {
                return "location = POINT(:longitude";
            } else if ($key == 'latitude') {
                return ':latitude)';
            } else {
                return "$key = :$key";
            }
        }, array_keys($updates))) . ' WHERE id = :id');
        // Binds values
        foreach ($updates as $key => &$value) {
            $stmt->bindParam(":$key", $value);
        }
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        if ($stmt->rowCount() == 1) {
            return getPlant($id, false);
        } else {
            return success('Nessuna pianta è stata modificata');
        }
    } else { // $updates is empty
        return error('Nessun dato da aggiornare');
    }
}

// Deletes one plant
function deletePlant($id) {
    global $pdo;
    $stmt = $pdo->prepare('DELETE FROM plants WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() == 1) {
        // TODO Eliminare anche immagini?
        //$stmt = $pdo->prepare("DELETE FROM images WHERE plant_id = $id");
        return success('Pianta eliminata');
    } else {
        return error('Pianta non trovata', 404);
    }
}
?>