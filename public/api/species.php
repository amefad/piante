<?php
// Gets all species
function getAllSpecies() {
    require 'pdo.php';
    $species = $pdo->query("SELECT id, scientific_name AS scientificName, common_name AS commonName, warning
    FROM species")->fetchAll();
    return $species;
}

// Gets one species
function getSpecies($id) {
    require 'pdo.php';
    $species = $pdo->query("SELECT id, scientific_name AS scientificName, common_name AS commonName, warning
    FROM species WHERE id = $id")->fetch();
    if ($species) {
        return $species;
    } else {
        return error('Specie inesistente', 404);
    }
}
?>