<?php
header('Content-Type: application/json');
session_start();

include("open-db-diro.php");

// connect to DB
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Parse URL segments
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($requestPath, '/'));

$lang = $segments[4] ?? 'en';
$time = isset($segments[5]) ? (int)$segments[5] : 60;
$hint = isset($segments[6]) ? (int)$segments[6] : 10;

// Get random word
$stmt = $pdo->prepare("SELECT word, definition FROM words WHERE language = :lang ORDER BY RAND() LIMIT 1");
$stmt->bindValue(':lang', $lang);
$stmt->execute();

$data = $stmt->fetch();

if (!$data) {
    echo json_encode(['success' => false, 'message' => "No word found for language '$lang'."]);
    exit;
}

echo json_encode([
    'success' => true,
    'word' => strtoupper($data['word']),
    'definition' => $data['definition'],
    'time' => $time,
    'hint' => $hint
]);

