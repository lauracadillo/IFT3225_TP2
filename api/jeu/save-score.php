<?php
header('Content-Type: application/json');
session_start();

include("config-freq.php");

if (!isset($_SESSION['gamer'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$score = isset($data['score']) ? intval($data['score']) : null;
$won   = isset($data['won']) && $data['won'] === true;

if ($score === null) {
    echo json_encode(['success' => false, 'message' => 'Score is required.']);
    exit;
}

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$username = $_SESSION['gamer'];

// Update score, games played, and (optionally) games won
$sql = "UPDATE gamers SET 
            score = score + :score,
            games_played = games_played + 1";

if ($won) {
    $sql .= ", games_won = games_won + 1";
}

$sql .= " WHERE username = :username";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':score' => $score,
    ':username' => $username
]);

echo json_encode(['success' => true, 'message' => 'Score updated']);

