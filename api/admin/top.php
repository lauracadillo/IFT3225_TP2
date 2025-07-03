<?php
header('Content-Type: application/json');
include("config-freq.php");

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Parse: /api/admin/top[/<nb>]
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$nb = isset($segments[5]) && is_numeric($segments[5]) ? (int)$segments[5] : 10;

$stmt = $pdo->prepare("SELECT username, score FROM gamers ORDER BY score DESC LIMIT :nb");
$stmt->bindValue(':nb', $nb, PDO::PARAM_INT);
$stmt->execute();

$topGamers = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "message" => "Top $nb gamers retrieved.",
    "top_gamers" => $topGamers
]);
