<?php
header('Content-Type: application/json');
session_start();

include("open-db-diro.php");

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

$lang = $segments[4] ?? 'en';
$time = isset($segments[5]) ? intval($segments[5]) : 60;

$stmt = $pdo->prepare("SELECT id, word FROM words WHERE language = ? ORDER BY RAND() LIMIT 1");
$stmt->execute([$lang]);
$motData = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$motData) {
    echo json_encode(['success' => false, 'message' => "No word found for language '$lang'"]);
    exit;
}

echo json_encode([
    'success' => true,
    'word' => $motData['word'],
    'id' => $motData['id'],
    'time' => $time,
    'lang' => $lang
]);

