<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow all origins (or restrict to specific ones)
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');  // Allow specific methods
header('Access-Control-Allow-Headers: Content-Type');  // Allow Content-Type header

include("open-db-diro.php");


try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pwd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['pattern']) || !isset($data['language'])) {
        throw new Exception("Invalid input.");
    }

    $pattern = $data['pattern'];
    $language = $data['language'];

    error_log("Pattern: $pattern");
    error_log("Language: $language");

    // Convert '_' to SQL wildcard '_' (safe)
    $sqlPattern = $pattern;

    $stmt = $pdo->prepare("SELECT word FROM words WHERE language = :lang AND UPPER(word) LIKE UPPER(:pattern)");

    $stmt->execute([
        ':lang' => $language,
        ':pattern' => $sqlPattern
    ]);
    $suggestions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Suggestions count: " . count($suggestions));
    error_log("JSON Response: " . json_encode($suggestions));


    echo json_encode($suggestions);

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['error' => 'Database query failed or invalid request']);
}
?>
