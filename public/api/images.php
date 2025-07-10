<?php
// Gets all images
function getImages() {
    require 'pdo.php';
    $files = $pdo->query("SELECT id, file_name AS `file-name`, plant_id AS `plant-id` FROM images")->fetchAll();
    return $files;
}

// Gets one image
function getImage($id) {
    require 'pdo.php';
    $file = $pdo->query("SELECT id, file_name AS `file-name`, plant_id AS `plant-id` FROM images WHERE id = $id")->fetch();
    if ($file) {
        return $file;
    } else {
        return error('Immagine inesistente', 404);
    }
}

// Receives one image file and saves it in the uploads folder, creating scaled and thumbnail versions.
// Eventually inserts the image into the database and returns the image data.
function postImage() {
    global $pdo;
    if (!isset($_POST['file-time']) || !isset($_POST['plant-id'])) {
        return error('Necessari data file e ID pianta');
    }
    if (isset($_FILES['image'])) {
        $file = $_FILES['image'];
        // Checks if file is an actual image
        $check = getimagesize($file['tmp_name']);
        if ($check == false) {
            return error('Il file non è un\'immagine');
        }
        // Checks file size is less than 10 MB
        if ($file['size'] > 10000000) {
            return error('File troppo grande', 413);
        }
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($extension == 'jpeg') {
            $extension = 'jpg';
        }
        // Allows certain file formats
        if ($extension != 'jpg' && $extension != 'png' && $extension != 'gif' && $extension != 'webp') {
            return error('Accettiamo solo file JPEG, PNG, GIF e WEBP');
        }
        // Checks if file with same date and size already exists
        date_default_timezone_set('Europe/Rome'); // To be sure the Unix timestamp is converted to Italian timezone regardless of the server timezone
        $timeName = date('Ymd_His', $_POST['file-time']);
        $files = glob(UPLOAD_PATH . "$timeName*.$extension");
        foreach ($files as $existingFile) {
            if (filesize($existingFile) == $file['size']) {
                return error('Questo file esiste già', 409);
            }
        }
        // Avoids files with the same name
        $fileName = "$timeName.$extension";
        $uploadedFile = UPLOAD_PATH . $fileName;
        $i = 1;
        while (file_exists($uploadedFile)) {
            $fileName = $timeName . "_$i.$extension";
            $uploadedFile = UPLOAD_PATH . $fileName;
            $i++;
            if ($i > 100) {
                return error('Impossibile caricare il file, troppi conflitti di nome', 409);
            }
        }
        // Creates uploads folder if it doesn't exist
        if (!is_dir(UPLOAD_PATH)) {
            mkdir(UPLOAD_PATH);
        }
        // Tries to upload the file
        if (move_uploaded_file($file['tmp_name'], $uploadedFile)) {
            // Creates scaled version
            if (!is_dir(SCALED_PATH)) {
                mkdir(SCALED_PATH);
            }
            $imagick = new Imagick($uploadedFile);
            $imagick->thumbnailImage(800, 800, true);
            $imagick->setImageFormat($extension);
            $imagick->writeImage(SCALED_PATH . $fileName);
            // Creates thumbnail version
            if (!is_dir(THUMBNAIL_PATH)) {
                mkdir(THUMBNAIL_PATH);
            }
            $imagick->cropThumbnailImage(200, 200);
            $imagick->setImageFormat($extension);
            $imagick->writeImage(THUMBNAIL_PATH . $fileName);
            // Inserts the image into the database
            $stmt = $pdo->prepare('INSERT INTO images (file_name, plant_id) VALUES (?, ?)');
            $stmt->execute([$fileName, $_POST['plant-id']]);
            $image = getImage($pdo->lastInsertId());
            return [$image, 201];
        } else {
            return error('Si è verificato un errore caricando il file');
        }
    } else {
        return error('Nessun file ricevuto');
    }
}

// Deletes files and database row of the image with the given ID
function deleteImage($id) {
    global $pdo;
    // Deletes three files
    $image = getImage($id);
    if (isset($image['file-name'])) {
        $name = $image['file-name'];
        $uploadedFile = UPLOAD_PATH . $name;
        if (file_exists($uploadedFile)) unlink($uploadedFile);
        $scaledFile = SCALED_PATH . $name;
        if (file_exists($scaledFile)) unlink($scaledFile);
        $thumbnailFile = THUMBNAIL_PATH . $name;
        if (file_exists($thumbnailFile)) unlink($thumbnailFile);
    } else {
        return error('Immagine inesistente', 404);
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