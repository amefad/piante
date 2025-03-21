<?php // Creates the database
try {
    require '../backend/config.php';
    $pdo = new PDO('mysql:host=' . DB_HOST, DB_USER, DB_PASSWORD);
    $sql = file_get_contents('database.sql');
    $sql = str_replace('`piante`', DB_NAME, $sql);
    $pdo->exec($sql);
    echo 'Complimenti!<br>Hai creato il database <code>' . DB_NAME . '</code>.';
} catch (Exception $exception) {
    echo $exception->getMessage();
}
?>