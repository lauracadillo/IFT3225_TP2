<?php
header('Content-Type: text/html');
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title> Projet2 Documentation</title>
<link rel="stylesheet" href="style.css">
<style>
    .doc-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #fefefe;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    font-family: sans-serif;
    }

    h2 {
    border-bottom: 2px solid #ccc;
    padding-bottom: 4px;
    margin-top: 30px;
    }

    code {
    background: #eee;
    padding: 2px 6px;
    border-radius: 4px;
    }

    ul {
    line-height: 1.6;
    }

    body {
    background-color: #f5f5f5;
    }
</style>
</head>
<body>
<div class="doc-container">
    <h1> Projet2 Documentations</h1>

    <h2> REST Endpoints</h2>
    <h3> Gamers</h3>
    <ul>
    <li><code>GET /api/gamers/login/&lt;username&gt;/&lt;password&gt;</code></li>
    <li><code>GET /api/gamers/logout</code></li>
    <li><code>GET /api/gamers/add/&lt;username&gt;/&lt;password&gt;</code></li>
    <li><code>GET /api/gamers/get/&lt;username&gt;</code></li>
    </ul>

    <h3>Game</h3>
    <ul>
    <li><code>GET /api/jeu/word/&lt;lang&gt;/&lt;time&gt;/&lt;hint&gt;</code></li>
    <li><code>GET /api/jeu/def/&lt;lang&gt;/&lt;time&gt;</code></li>
    <li><code>POST /api/jeu/submit-def.php</code></li>
    <li><code>POST /api/jeu/save-score.php</code></li>
    <li><code>POST /api/jeu/get-suggestions.php</code></li>
    <li><code>GET /api/jeu/dump.php/&lt;nb&gt;</code></li>
    </ul>

    <h3> Admin</h3>
    <ul>
    <li><code>GET /api/admin/top.php/&lt;nb&gt;</code></li>
    <li><code>DELETE /api/admin/delete/gamer/&lt;username&gt;</code></li>
    <li><code>DELETE /api/admin/delete/def/&lt;id&gt;</code></li>
    <li><code>GET /api/admin/words.php/&lt;nb&gt;/&lt;from&gt;</code></li>
    </ul>

    <h2> SPA Client Routes</h2>
    <ul>
    <li><code>home</code> – Welcome screen</li>
    <li><code>login</code> – Login & Sign up</li>
    <li><code>admin</code> – Admin panel</li>
    <li><code>game</code> – Game view</li>
    <li><code>top</code> – Leaderboard</li>
    </ul>

    <h2> Notes</h2>
    <ul>
    <li>All API responses are in <code>application/json</code></li>
    <li>Game states are rendered dynamically with JavaScript</li>
    </ul>
    <a href="index.html" class="back-button">⬅️ Back to Home</a>
</div>
</body>
</html>

