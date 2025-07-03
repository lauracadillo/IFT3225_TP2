<?php
header('Content-Type: application/json');
include("config-freq.php");
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Path: /admin/words[/<nb>[/<from>]]
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

$nb   = isset($segments[4]) && is_numeric($segments[4]) ? (int)$segments[4] : 10;
$from = isset($segments[5]) && is_numeric($segments[5]) ? (int)$segments[5] : 1;

$stmt = $pdo->prepare("SELECT word, id, definition FROM words WHERE id >= :index ORDER BY id ASC LIMIT :nb");
$stmt->bindValue(':nb', $nb, PDO::PARAM_INT);
$stmt->bindValue(':index', $from, PDO::PARAM_INT);
$stmt->execute();

$words = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "message" => "$nb words selected from index $from retrieved.",
    "words" => $words
]);
