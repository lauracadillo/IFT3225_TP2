<?php
header('Content-Type: application/json');
include("config-freq.php");


$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Get username from the URL: /gamers/get/<username>
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$username = $segments[4] ?? null;

if (!$username) {
    http_response_code(400);
    echo json_encode(['error' => 'Gamer username is required']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM gamers WHERE username = ?");
$stmt->execute([$username]);
$gamer = $stmt->fetch(PDO::FETCH_ASSOC);

if ($gamer) {
    echo json_encode($gamer);
} else {
    http_response_code(404);
    echo json_encode(['error' => "Gamer '$username' not found"]);
}
