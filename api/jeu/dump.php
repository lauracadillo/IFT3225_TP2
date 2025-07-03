<?php
header('Content-Type: application/json');

include("open-db-diro.php");

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$step = $segments[3] ?? null;

if (!is_numeric($step) || $step <= 0) {
    echo json_encode(['success' => false, 'message' => "Parameter 'step' must be a positive integer."]);
    exit;
}

$step = (int) $step;

// Fetch words
$stmt = $pdo->prepare("SELECT id, word, definition, language FROM words LIMIT :step");
$stmt->bindValue(':step', $step, PDO::PARAM_INT);
$stmt->execute();

$words = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($words);

