<?php
require_once 'pdo.php';
// require_once 'plants.php';

echo "Connection successful via Unix socket with socket-based authentication! \n";
// echo "Trying to populate \n";
// Prepare an SQL statement for inserting dummy data into the table "plants"
// $stmt = $pdo->prepare("INSERT INTO plants (common_name, user_id) VALUES (:common_name, :user_id)");

// // Dummy data to be inserted into the table
// $dummyData = [
// 	['common_name' => "quercia", 'authorid' => 1],
// ];

// try {
// 	foreach ($dummyData as $row) {
// 		$stmt->execute([
// 			':common_name' => $row['common_name']
// 		]);
// 	}

// 	echo "Dummy data inserted successfully! \n";
try {
	$select_stmt = 'SELECT * FROM plants';
	foreach ($pdo->query($select_stmt) as $row) {
		print_r($row);
	}
} catch (PDOException $e) {
	// If the connection fails, output the error message
	echo "Error " . $e->getMessage();
}
