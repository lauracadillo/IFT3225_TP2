<?php
header('Content-Type: application/json');
include("config-freq.php");
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

session_start();

// Parse URI: /api/gamers/logout/<username>/<password>
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($requestPath, '/'));

$username = $segments[4] ?? null;
$password = $segments[5] ?? null;

if (!$username || !$password) {
    echo json_encode(["error" => "Username and password required"]);
    exit;
}

// Verify credentials
$stmt = $pdo->prepare("SELECT * FROM gamers WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['password'] !== $password) {
    echo json_encode(["error" => "Invalid username or password"]);
    exit;
}

// Destroy session
session_destroy();

echo json_encode(["status" => "success", "message" => "User '$username' logged out"]);
