<?php
header('Content-Type: application/json');
include("config-freq.php");
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

session_start();
file_put_contents("debug_add.log", print_r($_SERVER['REQUEST_URI'], true), FILE_APPEND);

//  Parse only the path part (without query string)
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($requestPath, '/'));

// Example: /projet2/api/gamers/add/gamer5/1234
$username = $segments[4] ?? null;
$password = $segments[5] ?? null;

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => "Username and password required"]);

    exit;
}

//  Use $username in place of $gamer
$stmt = $pdo->prepare("SELECT COUNT(*) FROM gamers WHERE username = ?");
$stmt->execute([$username]);
if ($stmt->fetchColumn() > 0) {
    echo json_encode(['success' => false, 'message' => "Player '$username' already exists"]);
    exit;
}

//  Insert new gamer
$stmt = $pdo->prepare("INSERT INTO gamers (username, password, score, games_played, games_won, last_login)
    VALUES (?, ?, 0, 0, 0, NOW())");
$stmt->execute([$username, $password]);

$_SESSION['gamer'] = $username;
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
file_put_contents("debug_add.log", print_r($segments, true), FILE_APPEND);


echo json_encode(['success' => true, 'message' => "Player '$username' added successfully"]);
