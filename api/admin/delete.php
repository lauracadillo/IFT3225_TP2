<?php
header('Content-Type: application/json');
include("config-freq.php");

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Parse the URL path
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

// Expect: /api/admin/delete/gamer/<username> OR /api/admin/delete/def/<id>
$type  = $segments[3] ?? null; // 'gamer' or 'def'
$value = $segments[4] ?? null;

if (!$type || !$value) {
    echo json_encode(["error" => "Missing delete target"]);
    exit;
}

// DELETE GAMER
if ($type === "gamer") {
    $stmt = $pdo->prepare("DELETE FROM gamers WHERE BINARY username = ?");
    $stmt->execute([$value]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["message" => "Player '$value' deleted"]);
    } else {
        echo json_encode(["error" => "Player '$value' not found"]);
    }

// DELETE WORD (DEF)
} elseif ($type === "def" && is_numeric($value)) {
    $stmt = $pdo->prepare("DELETE FROM words WHERE id = ?");
    $stmt->execute([$value]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["message" => "Definition with ID $value deleted"]);
    } else {
        echo json_encode(["error" => "Definition with ID $value not found"]);
    }

} else {
    echo json_encode(["error" => "Invalid delete target"]);
}
