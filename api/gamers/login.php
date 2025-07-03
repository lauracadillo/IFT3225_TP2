<?php
header('Content-Type: application/json');
include("config-freq.php");

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
session_start();

// Extract path segments
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($requestPath, '/'));

$username = $segments[4] ?? null;
$password = $segments[5] ?? null;

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'Username and password required']);
    exit;
}

// Check user
$stmt = $pdo->prepare("SELECT * FROM gamers WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && $user['password'] === $password) {
    $_SESSION['gamer'] = $username;
    $pdo->prepare("UPDATE gamers SET last_login = NOW() WHERE username = ?")->execute([$username]);

    echo json_encode(['success' => true, 'message' => 'Login successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

