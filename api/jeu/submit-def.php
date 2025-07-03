<?php
session_start();

header('Content-Type: application/json');

include("open-db-diro.php");
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$id = $_POST['id'] ?? null;
$definition = trim($_POST['definition'] ?? '');
$source = $_SESSION['gamer'] ?? 'unknown'; // Assurez-vous que l’utilisateur est connecté
$word = $_POST['word'];
$lang = $_POST['lang'];

if (!$id || strlen($definition) < 5 || strlen($definition) > 200) {
    echo "Invalid definition";
    exit;
}

// Vérifier si la définition existe déjà
$stmt = $pdo->prepare("SELECT COUNT(*) FROM words WHERE id = ? AND definition = ?");
$stmt->execute([$id, $definition]);
$exists = $stmt->fetchColumn();

if ($exists) {
    echo "This definition already exists.";
    exit;
}

// Ajouter la définition
$stmt = $pdo->prepare("INSERT INTO words (id, word, definition, source, language) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$id, $word, $definition, $source, $lang]);

// Ajouter 5 points au joueur
$stmt = $pdo->prepare("UPDATE gamers SET score = score + 5 WHERE username = ?");
$stmt->execute([$source]);

echo "Definition added successfully! +5 points";
?>

