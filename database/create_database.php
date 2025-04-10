<?php // Creates the database
try {
    require __DIR__ . '/../public/config.php'; // use config in public folder
    $pdo = new PDO(DB_HOST, DB_USER, DB_PASSWORD);
    $sql = file_get_contents(__DIR__ . '/database.sql');
    $sql = str_replace('`piante`', DB_NAME, $sql); // use your db name defined in config
    $pdo->exec($sql);
    echo 'Complimenti!<br>Hai creato il database <code>' . DB_NAME . '</code>.';
} catch (Exception $exception) {
    echo $exception->getMessage();
}
?>