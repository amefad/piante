<?php
// Gets all images
function getImages() {
    require 'pdo.php';
    $files = $pdo->query("SELECT id, CONCAT('" . UPLOADS_PATH . "', file_name) AS `file-path`, plant_id AS `plant-id` FROM images")->fetchAll();
    return $files;
}

// Gests one image
function getImage($id) {
    require 'pdo.php';
    $file = $pdo->query("SELECT id, CONCAT('" . UPLOADS_PATH . "', file_name) AS `file-path`, plant_id AS `plant-id`
    FROM images WHERE id = $id")->fetch();
    if ($file) {
        return $file;
    } else {
        return error('Immagine inesistente', 404);
    }
}

// Receives one image file and saves it in the uploads folder
function postImage() {
    global $pdo;
    if (isset($_FILES['image'])) {
        $image = $_FILES['image'];
        if (!is_dir(UPLOADS_PATH)) {
            mkdir(UPLOADS_PATH);
        }
        $target_file = UPLOADS_PATH . basename($image['name']);
        // Checks if image file is a actual image or fake image
        $check = getimagesize($image['tmp_name']);
        if ($check == false) {
            return error('Il file non è un\'immagine');
        }
        // Checks if file already exists
        if (file_exists($target_file)) {
            return error('Questo file esiste già', 409);
        }
        // Checks file size
        if ($image['size'] > 5000000) {
            return error('File troppo grande', 413);
        }
        // Allows certain file formats
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if ($fileType != 'jpg' && $fileType != 'png' && $fileType != 'jpeg' && $fileType != 'gif' && $fileType != 'webp') {
            return error('Accettiamo solo file JPG, JPEG, PNG, GIF e WEBP');
        }
        // Tries to upload the file
        if (move_uploaded_file($image['tmp_name'], $target_file)) {
            $stmt = $pdo->prepare('INSERT INTO images (file_name, plant_id) VALUES (:name, :plant_id)');
            $name = basename($image['name']);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':plant_id', $_POST['plant-id']);
            $stmt->execute();
            $id = $pdo->lastInsertId();
            $file = $pdo->query("SELECT id, CONCAT('" . UPLOADS_PATH . "', file_name) AS `file-path` FROM images WHERE id = $id")->fetch();
            return [$file, 201];
        } else {
            return error('Si è verificato un errore caricando il file');
        }
    } else return error('Nessun file ricevuto');
}

function deleteImage($id) {
    global $pdo;
    // Deletes file
    $image = getImage($id);
    if (isset($image['file-path']) && file_exists($image['file-path'])) {
        unlink($image['file-path']);
    }
    // Deletes database row
    $stmt = $pdo->prepare('DELETE FROM images WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() == 1) {
        return success('Immagine eliminata');
    } else {
        return error('Immagine non trovata', 404);
    }
}
?>