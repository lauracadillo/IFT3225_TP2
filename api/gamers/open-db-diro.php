<?php

include("config-freq.php");

$conn = new mysqli($db_host, $db_user, $db_pwd, $db_name);
try {
    $conn->set_charset("utf8mb4");
    #echo "Connected successfully\n";
} catch (Exception $e) {
    die("Connection failed: " . $conn->connect_error . "\n");
}

?>
