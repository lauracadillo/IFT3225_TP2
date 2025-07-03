<?php
// router.php
if (preg_match('/^\/api\/(gamers|admin|jeu)\/([^\/]+)(\/.*)?$/', $_SERVER['REQUEST_URI'], $matches)) {
    $dir = $matches[1];
    $file = $matches[2];
    $_SERVER['SCRIPT_FILENAME'] = __DIR__ . "/api/$dir/$file.php";
    include $_SERVER['SCRIPT_FILENAME'];
} else {
    return false; // serve static files like index.html, app.js, etc.
}
