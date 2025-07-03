const app = document.getElementById('app');

// Simple router to control views
function showView(view) {
    switch (view) {
      case 'login':
        showLoginForm();
        break;
      case 'game':
        showGame();
        break;
      case 'top':
        showLeaderboard();
        break;
      case 'admin':
        showAdminPanel();
        break;
      default:
        showHome(); 
    }
  }
  

// === HOME PAGE ===
function showHome() {
    app.innerHTML = `
    <div class="centered-container">
        <h2>Welcome!!</h2>
        <p>Please choose a mode:</p>

        <button onclick="showView('login')">👤 Player (Login/Signup)</button><br><br>
        <button onclick="showView('admin')">🛠️ Admin Functions</button><br><br>
        <h3>📄 Browse Word List</h3>
        <button onclick="wordConsultation()">View Words</button><br><br>
        <button onclick="window.location.href='doc.php'">📖 View Documentation</button>
        <hr>
    </div>
    `;
}
  


// === ADMIN VIEW = 

function showAdminPanel() {
    app.innerHTML = `
    <div class="centered-container">
    <h2>🛠️ Admin Panel</h2>

    <button onclick="showLeaderboard()">🏆 View Top Players</button><br><br>
    
    <h3>🗑️ Delete a Gamer</h3>
    <input id="deleteGamerInput" placeholder="Enter username">
    <button onclick="deleteGamer()">Delete Gamer</button><br><br>

    <h3>🗑️ Delete a Word</h3>
    <input id="deleteWordInput" placeholder="Enter word ID">
    <button onclick="deleteWord()">Delete Word</button><br><br>

    <button onclick="showView('home')">⬅️ Back to Home</button>
    

    <div id="adminFeedback" style="margin-top: 20px;"></div>
    </div>
    `;
}


// === LOGIN FORM ===
function showLoginForm() {
    app.innerHTML = `
    <div class="centered-container row-container">
        <div class="form-box">
        <h2>Login</h2>
        <input id="login-username" placeholder="Username"><br>
        <input id="login-password" type="password" placeholder="Password"><br>
        <button onclick="login()">Login</button>
        </div>

        <div class="form-box">
        <h2>Sign Up</h2>
        <input id="signup-username" placeholder="Choose a Username"><br>
        <input id="signup-password" type="password" placeholder="Choose a Password"><br>
        <button onclick="add()">Sign Up</button>
        </div>
    </div>

    <div class="centered-container">
        <hr>
        <button onclick="showView('home')">⬅️ Back</button>
    </div>
`;

}



function add() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    //fetch(` api/gamers/add/${username}/${password}`)
    fetch(`api/gamers/add/${username}/${password}`)

    .then(response => response.json())
    .then(data => {
    console.log("Signup response:", data);
    if (data.success) {
        alert('Account created!');
        sessionStorage.setItem('username', username);
        showGameSelection();
    } else {
        alert(data.message || 'Username taken.');
    }
    })
    .catch(error => {
    console.error("Fetch error:", error);
    alert("Something went wrong while signing up.");
    });

        
}


function login() {
const username = document.getElementById('login-username').value;
const password = document.getElementById('login-password').value;

fetch(`api/gamers/login/${username}/${password}`)
    .then(response => response.json())
    .then(data => {
    console.log("Login response:", data);
    if (data.success) {
        sessionStorage.setItem('username', username);
        showGameSelection();
    } else {
        alert(data.message || 'Login failed');
    }
    })
    .catch(error => {
    console.error("Login fetch error:", error);
    alert("Something went wrong while logging in.");
    });
}
  

// === GAME VIEW ===
function showGameSelection() {
    const username = sessionStorage.getItem('username') || 'Player';

    app.innerHTML = `<div class="centered-container">
        <h2>Welcome, ${username}!</h2>
        <p>Choose an option:</p>

        <div style="margin-bottom: 20px;">
        <button onclick="showWordGameSetup()">🎯 Word Guessing</button>
        <button onclick="showDefinitionGameSetup()">📖 Definition Game</button>
        </div>

        <div style="margin-bottom: 20px;">
        <button onclick="getUserInfo()">📄 My Info</button>
        
        </div>

        <button onclick="logout()">Logout</button>

        <div id="extraOutput" style="margin-top: 20px;"></div>
        </div>
    `;
}

function getUserInfo() {
    const username = sessionStorage.getItem('username');
    if (!username) return alert("Not logged in!");

    fetch(`api/gamers/get/${username}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById('extraOutput').innerHTML = `
        <div class="centered-container">
        <h3>👤 Your Info</h3>
        <ul>
            <li>Username: ${data.username}</li>
            <li>Score: ${data.score}</li>
            <li>Games Played: ${data.games_played}</li>
            <li>Games Won: ${data.games_won}</li>
            <li>Last Login: ${data.last_login}</li>
        </ul>
        </div>
        `;
    })
    .catch(err => {
        console.error("Error fetching user info:", err);
        alert("Failed to load user info.");
    });
}


function getWordDump() {
    const num = prompt("How many words would you like to fetch?", "10");
    const count = parseInt(num);

    if (isNaN(count) || count <= 0) {
    alert("Please enter a valid number.");
    return;
    }

    fetch(`api/jeu/dump.php/${count}`)
    .then(res => res.json())
    .then(data => {
        // Build table HTML
        const tableHTML = `
        <div class="centered-container">
        <h3>📚 Word List (${count})</h3>
        <table id="wordDumpTable" class="display">
            <thead>
            <tr>
                <th>ID</th>
                <th>Word</th>
                <th>Definition</th>
                <th>Language</th>
            </tr>
            </thead>
            <tbody>
            ${data.map(word => `
                <tr>
                <td>${word.id}</td>
                <td>${word.word}</td>
                <td>${word.definition}</td>
                <td>${word.language}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
        </div>
        `;

        document.getElementById('extraOutput').innerHTML = tableHTML;

        // Load DataTables if not already loaded
        if (!window.jQuery || !$.fn.DataTable) {
        const loadScript = (src, cb) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = cb;
            document.head.appendChild(s);
        };

        // Load jQuery and DataTables CSS/JS
        loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css';
            document.head.appendChild(css);

            loadScript('https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js', () => {
            $('#wordDumpTable').DataTable();
            });
        });
        } else {
        // Already loaded
        $('#wordDumpTable').DataTable();
        }
    })
    .catch(err => {
        console.error("Error fetching word dump:", err);
        alert("Failed to load word list.");
    });
}


// === GAME SETUP ===
function showWordGameSetup() {
    app.innerHTML = `
    <div class="centered-container">
        <h2>🎯 Word Game Setup</h2>

        <label for="langSelect">Language:</label>
        <select id="langSelect">
        <option value="en">English</option>
        <option value="fr">French</option>
        </select><br><br>

        <label for="timeInput">Game Time (in seconds):</label>
        <input id="timeInput" type="number" min="10" max="300" value="60"><br><br>

        <label for="hintInput">Hint Interval (in seconds):</label>
        <input id="hintInput" type="number" min="1" max="60" value="10"><br><br>

        <button onclick="startWordGame()">Start Game</button>
        <button onclick="showGameSelection()">⬅️ Back</button>
    </div>
    `;
}

function showDefinitionGameSetup() {
    app.innerHTML = `
    <div class="centered-container">
    <h2>📖 Definition Game Setup</h2>

    <label for="defLang">Language:</label>
    <select id="defLang">
        <option value="en">English</option>
        <option value="fr">French</option>
    </select><br><br>

    <label for="defTime">Game Time (in seconds):</label>
    <input type="number" id="defTime" min="10" max="300" value="60"><br><br>

    <button onclick="startDefinitionGame()">Start Game</button>
    <button onclick="showGameSelection()">⬅️ Back</button>
    </div>
    `;
}
  
// === WORD GAME ===
function startWordGame() {
    const lang = document.getElementById('langSelect')?.value || 'en';
    const time = document.getElementById('timeSelect')?.value || '60';
    const hint = document.getElementById('hintSelect')?.value || '10';

    const apiUrl = ` api/jeu/word/${lang}/${time}/${hint}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
        if (!data.success) {
            alert(data.message || "Could not load word.");
            return;
        }

        const word = data.word;
        const definition = data.definition;
        let displayed = Array(word.length).fill('_');
        let score = word.length * 10;
        let timer = data.time;
        const hint = data.hint;
        let firstHintShown = false;
        let suggestionUsed = false;

        app.innerHTML = `
        <div class="game-container">
            <div class="player-info">
            <h2>👤 ${sessionStorage.getItem('username') ?? 'Guest'}</h2>
            <p>🏆 <span id="score">${score}</span></p>
            </div>

            <div class="game-panel">
            <h2>${definition}</h2>

            <div class="masked" id="masked"></div>

            <div class="score-timer">
                <div>⏱️ <span id="timer">${timer}</span>s</div>
                <div>🎯 +<span id="bonus">0</span></div>
            </div>

            <div style="margin-top: 10px">
                <button id="suggestionBtn" style="display:none;" disabled>💡 Suggestion (-20 pts)</button>
            </div>

            <div class="suggestions" id="suggestionBox" style="display: none;">
                <strong>Suggestions:</strong>
                <ul id="suggestionsList"></ul>
            </div>

            <br>
            <button onclick="showGameSelection()">Back</button>
            </div>
        </div>
        `;

        const suggestionBtn = document.getElementById('suggestionBtn');
        suggestionBtn.onclick = revealSuggestion;

        // Render masked word input fields
        function renderMasked() {
        const container = document.getElementById('masked');
        container.innerHTML = '';
        for (let i = 0; i < word.length; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.size = 1;
            input.maxLength = 1;
            input.className = 'letter-box';
            input.dataset.index = i;
            input.value = displayed[i] !== '_' ? displayed[i] : '';
            input.disabled = displayed[i] !== '_';
            input.addEventListener('change', handleLetterInput);
            container.appendChild(input);
        }
        }

        function handleLetterInput(e) {
        const index = parseInt(e.target.dataset.index);
        const guess = e.target.value.toUpperCase();

        if (guess.length === 1) {
            if (word[index] === guess && displayed[index] === '_') {
            displayed[index] = guess;
            score += 5;
            } else {
            score -= 5;
            }
            renderMasked();
            updateScore();
            checkWin();
        }
        }

        function updateScore() {
        document.getElementById('score').textContent = score;
        document.getElementById('bonus').textContent = Math.floor(timer / 10);
        }

        function saveScore(finalScore, won = false) {
            fetch(' api/jeu/save-score.php', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ score: finalScore, won })
            })
                .then(res => res.json())
                .then(data => {
                console.log("Score save response:", data);
                })
                .catch(err => {
                console.error("Score save failed:", err);
                });
        }
          

        function checkWin() {
        if (!displayed.includes('_')) {
            clearInterval(timerInterval);
            const finalScore = score + Math.floor(timer / 10);
            saveScore(finalScore, true); 
            setTimeout(() => {
            alert("Bravo! Score final: " + finalScore);
            }, 400);
        }
        }
        

        function revealRandomLetter() {
        const hidden = displayed.map((c, i) => c === '_' ? i : -1).filter(i => i >= 0);
        if (hidden.length > 0) {
            const idx = hidden[Math.floor(Math.random() * hidden.length)];
            displayed[idx] = word[idx];
            score -= 10;
            renderMasked();
            updateScore();
            checkWin();
        }
        }

        function revealSuggestion() {
        document.getElementById('suggestionBox').style.display = 'block';

        if (!suggestionUsed) {
            score -= 20;
            suggestionUsed = true;
            updateScore();
            setInterval(() => {
            filterSuggestions();
            }, hint * 1000);
        }

        filterSuggestions();
        }

        function filterSuggestions() {
        let pattern = displayed.map(l => l !== '_' ? l : '_').join('');
        fetch(' api/jeu/get-suggestions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            pattern,
            language: 'en'
            })
        })
            .then(res => res.json())
            .then(data => {
            const list = document.getElementById('suggestionsList');
            list.innerHTML = '';

            if (!Array.isArray(data)) {
                list.innerHTML = "<li>Server error or unexpected format.</li>";
                return;
            }

            if (data.length === 0) {
                list.innerHTML = "<li>No suggestions found.</li>";
                return;
            }

            data.forEach(s => {
                const span = document.createElement('span');
                span.textContent = s.word;
                span.onclick = () => selectSuggestion(s.word);
                list.appendChild(span);
            });
            })
            .catch(err => {
            document.getElementById('suggestionsList').innerHTML = "<li>Error fetching suggestions.</li>";
            });
        }

        function selectSuggestion(suggestion) {
        if (suggestion === word) {
            let gained = 0;
            for (let i = 0; i < word.length; i++) {
            if (displayed[i] !== word[i]) {
                displayed[i] = word[i];
                gained++;
            }
            }
            score += gained * 5;
            renderMasked();
            updateScore();
            checkWin();
        } else {
            alert("Wrong guess!");
        }
        }

        // Enable suggestion button after hint time
        setTimeout(() => {
        firstHintShown = true;
        suggestionBtn.style.display = 'inline-block';
        suggestionBtn.disabled = false;
        }, hint * 1000);

        const timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;

        if (timer % hint === 0 && timer > 0) {
            revealRandomLetter();
        }

        if (timer <= 0) {
            clearInterval(timerInterval);
            saveScore(score, false);
            alert(`Time's up! Final score: ${score}`);
        }
        
        }, 1000);

        renderMasked();
        updateScore();
    });
}


function startDefinitionGame() {
    const lang = document.getElementById('defLang')?.value || 'en';
    const time = parseInt(document.getElementById('defTime')?.value) || 60;

    const url = ` api/jeu/def/${lang}/${time}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
        alert(data.message || "Could not load definition game.");
        return;
        }

        const { word, id, lang, time } = data;
        let countdown = time;

        app.innerHTML = `
        <div class="game-container">
            <div class="definition-panel">
            <h1>📝 Define the word: <strong>${word}</strong></h1>
            <p>⏱️ Time remaining: <span id="timer">${time}s</span></p>
            <form id="defForm">
                <input type="hidden" name="id" value="${id}">
                <input type="hidden" name="word" value="${word}">
                <input type="hidden" name="lang" value="${lang}">

                <label for="definition">Your definition:</label><br>
                <textarea name="definition" rows="4" required minlength="5" maxlength="200"></textarea><br>
                <input type="submit" value="Submit">
            </form>
            <div id="feedback"></div>
            <br>
            <button onclick="showGameSelection()">⬅️ Back</button>
            </div>
        </div>
        `;

        const timerDisplay = document.getElementById("timer");

        const timerInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = `${countdown}s`;

        if (countdown <= 0) {
            clearInterval(timerInterval);
            document.getElementById("defForm").requestSubmit(); // auto-submit
        }
        }, 1000);

        document.getElementById("defForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch(' api/jeu/submit-def.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then(res => res.text())
            .then(response => {
            document.getElementById("feedback").innerHTML = `<p>✅ Submitted! Thank you!</p>`;
            clearInterval(timerInterval);
            })
            .catch(err => {
            document.getElementById("feedback").innerHTML = `<p>❌ Submission failed.</p>`;
            });
        });
    });
}

// === LOGOUT ===
function logout() {
    const username = sessionStorage.getItem('username');
    if (!username) {
    alert("You're not logged in.");
    return showView('login');
    }

    const password = prompt("Please enter your password to confirm logout:");
    if (!password) {
    alert("Logout cancelled.");
    return;
    }

    fetch(` api/gamers/login/${username}/${password}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
        sessionStorage.clear();
        alert("Logged out successfully.");
        showView('login');
        } else {
        alert("Incorrect password. Logout aborted.");
        }
    })
    .catch(err => {
        console.error("Logout error:", err);
        alert("Something went wrong during logout.");
    });
}


//ADMIN FUNCTIONS
// === LEADERBOARD ===
function showLeaderboard() {
    const nbs = prompt("How many top players would you like to see?", "10");
    const count = parseInt(nbs);

    if (isNaN(count) || count <= 0) {
    alert("Please enter a valid number.");
    return;
    }

    const url = ` api/admin/top/${count}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        const players = data.top_gamers;

        if (!Array.isArray(players)) {
        throw new Error("Invalid leaderboard format.");
        }

        app.innerHTML = `
        <h2>🏆 Top ${count} Players</h2>
        <ul>
            ${players.map(user => `<li>${user.username}: ${user.score}</li>`).join('')}
        </ul>
        <button onclick="showView('admin')">⬅️ Back to Admin</button>
        `;
    })
    .catch(err => {
        console.error("Leaderboard fetch failed:", err);
        alert("Could not load leaderboard.");
    });
}



function deleteGamer() {
    const username = document.getElementById('deleteGamerInput').value.trim();
    if (!username) return alert("Please enter a username.");

    fetch(`api/admin/delete/gamer/${username}`, {
    method: 'DELETE',
    credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('adminFeedback').innerHTML = `<p>${data.message || 'Gamer deleted.'}</p>`;
    })
    .catch(err => {
        console.error("Delete gamer error:", err);
        alert("Error deleting gamer.");
    });
}

function deleteWord() {
    const wordId = document.getElementById('deleteWordInput').value.trim();
    if (!wordId || isNaN(wordId)) return alert("Please enter a valid word ID.");

    fetch(` api/admin/delete/def/${wordId}`, {
    method: 'DELETE',
    credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('adminFeedback').innerHTML = `<p>${data.message || 'Word deleted.'}</p>`;
    })
    .catch(err => {
        console.error("Delete word error:", err);
        alert("Error deleting word.");
    });
}

function wordConsultation() {
    const nb = prompt("How many words would you like to retrieve?", "10");
    const from = prompt("From which ID should the list start?", "1");

    const count = parseInt(nb);
    const start = parseInt(from);

    if (isNaN(count) || count <= 0 || isNaN(start) || start < 1) {
    alert("Please enter valid numeric values.");
    return;
    }

    const url = `api/admin/words.php/${count}/${start}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        const words = data.words;

        if (!Array.isArray(words)) {
        throw new Error("Invalid word list format.");
        }

        const tableHTML = `
        <div class="centered-container">
        <h3>📚  Word List (${count} from ID ${start})</h3>
        <table id="adminWordListTable" class="display">
            <thead>
            <tr>
                <th>ID</th>
                <th>Word</th>
                <th>Definition</th>
            </tr>
            </thead>
            <tbody>
            ${words.map(w => `
                <tr>
                <td>${w.id}</td>
                <td>${w.word}</td>
                <td>${w.definition}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
        <button onclick="showView('home')">⬅️ Back </button>
        </div>
        `;

        app.innerHTML = tableHTML;

        // Load DataTables if needed
        if (!window.jQuery || !$.fn.DataTable) {
        const loadScript = (src, cb) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = cb;
            document.head.appendChild(s);
        };

        loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css';
            document.head.appendChild(css);

            loadScript('https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js', () => {
            $('#adminWordListTable').DataTable();
            });
        });
        } else {
        $('#adminWordListTable').DataTable();
        }
    })
    .catch(err => {
        console.error("Word list fetch failed:", err);
        alert("Could not load word list.");
    });
}


// Initialize view
document.addEventListener('DOMContentLoaded', () => {
    showView('home');
});

