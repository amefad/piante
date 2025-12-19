<?php
define('MAX_SPECIES_ID', 92);
define('MAX_NUMBER', 65535);
define('MAX_HEIGHT', 999.9);

// Gets all plants from the database
function getPlants() {
    try {
        require 'pdo.php';
        $query = 'SELECT id, ST_Y(location) AS latitude, ST_X(location) AS longitude, number, diameters, height,
        note, species_id AS species, user_id AS user, insert_date AS date FROM plants';
        if (isset($_GET['user'])) {
            $userId = intval($_GET['user']);
            if ($userId <= 0) {
                return error('ID utente non valido');
            }
            $query .= " WHERE user_id = $userId";
        }
        if (isset($_GET['last'])) {
            $limit = intval($_GET['last']);
            if ($limit <= 0) {
                return error('Limite non valido');
            }
            $query .= " ORDER BY insert_date DESC LIMIT $limit";
        }
        $plants = $pdo->query($query)->fetchAll();

        if ($plants) {
            foreach ($plants as &$plant) {
                if (!is_null($plant['diameters'])) {
                    $plant['diameters'] = json_decode($plant['diameters']);
                } else {
                    $plant['diameters'] = array();
                }
                $species = $pdo->query('SELECT id, scientific_name AS scientificName, common_name AS commonName, warning
                FROM species WHERE id = '. $plant['species'])->fetch();
                if (!$species) {
                    $species = array(
                        'id' =>  $plant['species'],
                        'warning' => 'Specie non definita.'
                    );
                }
                $plant['species'] = $species;
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
            $images = $pdo->query('SELECT plant_id, id, file_name AS fileName
            FROM images WHERE plant_id IN ('. join(',', $plantIds). ')')->fetchAll(PDO::FETCH_GROUP);
            foreach ($plants as &$plant) {
                if (isset($images[$plant['id']])) {
                    $plant['images'] = $images[$plant['id']];
                } else {
                    $plant['images'] = array(); // Empty array
                }
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
    $stmt = $pdo->prepare('SELECT id, ST_Y(location) AS latitude, ST_X(location) AS longitude, number, diameters, height,
    note, species_id AS species, user_id AS user, insert_date AS date FROM plants WHERE id = ?');
    $stmt->execute([$id]);
    $plant = $stmt->fetch();
    if ($plant) {
        if (!is_null($plant['diameters'])) {
            $plant['diameters'] = json_decode($plant['diameters']);
        } else {
            $plant['diameters'] = array();
        }
        $species = $pdo->query('SELECT id, scientific_name AS scientificName, common_name AS commonName, warning
        FROM species WHERE id = '. $plant['species'])->fetch();
        if (!$species) {
            $species = array(
                'id' =>  $plant['species'],
                'warning' => 'Specie non definita.'
            );
        }
        $plant['species'] = $species;
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
                $image['fileName'] = $file['file_name'];
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
    if (!isset($data['userId'])) {
        return error('ID utente necessario');
    }
    if (array_key_exists('number', $data) && $data['number'] > MAX_NUMBER) {
        return error('Number è maggiore di ' . MAX_NUMBER);
    }
    if (array_key_exists('height', $data) && $data['height'] > MAX_HEIGHT) {
        return error('Height è maggiore di ' . MAX_HEIGHT);
    }
    if (!isset($data['species']) || !is_array($data['species']) || !isset($data['species']['id'])) {
        return error('Specie non valida');
    }
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO plants (location, number, diameters, height, note, species_id, user_id)
    VALUES (POINT(:lon, :lat), :num, :diam, :height, :note, :species, :user)");
    $stmt->bindParam(':lon', $data['longitude']);
    $stmt->bindParam(':lat', $data['latitude']);
    $stmt->bindParam(':num', $data['number']);
    if (isset($data['diameters']) && !is_null($data['diameters'])) {
        $diameters = json_encode($data['diameters']);
    }
    $stmt->bindParam(':diam', $diameters);
    $stmt->bindParam(':height', $data['height']);
    $stmt->bindParam(':note', $data['note']);
    $speciesId = intval($data['species']['id']);
    if ($speciesId <= 0 || $speciesId > MAX_SPECIES_ID) {
        $speciesId = 1; // Default species
    }
    $stmt->bindParam(':species', $speciesId);
    $stmt->bindParam(':user', $data['userId']);
    $stmt->execute();
    // Returns new plant
    $plant = getPlant($pdo->lastInsertId());
    return [$plant, 201];
}

// Receives a JSON with plant ID and other data and updates the plant in database
// Doesn't update date, user and images
function putPlant($id) {
    $updates = array(
        'longitude' => 'longitude',
        'latitude' => 'latitude',
        'number' => 'number',
        'diameters' => 'diameters',
        'height' => 'height',
        'note' => 'note',
        'species_id' => 'species'
    );
    // Data into $updates
    $data = json_decode(file_get_contents('php://input'), true);
    foreach ($updates as $key => $value) {
        if (array_key_exists($value, $data)) {
            if ($key == 'species_id') {
                if (is_array($data[$value]) && array_key_exists('id', $data[$value])) {
                    $speciesId = intval($data[$value]['id']);
                    if ($speciesId > 0 && $speciesId <= MAX_SPECIES_ID) {
                        $updates[$key] = $speciesId;
                        continue;
                    }
                }
                unset($updates[$key]);
            } else if (is_null($data[$value])) {
                $updates[$key] = NULL;
            } else if ($key == 'number' && $data[$value] > MAX_NUMBER) {
                return error('Number è maggiore di ' . MAX_NUMBER);
            } else if ($key == 'diameters') {
                $updates[$key] = json_encode($data[$value]);
            } else if ($key == 'height' && $data[$value] > MAX_HEIGHT) {
                return error('Height è maggiore di ' . MAX_HEIGHT);
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
            return getPlant($id);
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
        $pdo->query('ALTER TABLE plants AUTO_INCREMENT = 0');
        return success('Pianta eliminata');
    } else {
        return error('Pianta non trovata', 404);
    }
}
?>