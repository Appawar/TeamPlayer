let players = ["VishWajit", "Aajay", "Atherva", "rithik", "Divyap", "Harshal", "Shubhangi", "Harshda", "Viraj", "AjayA", "Shruti", "Raksha", "Mangesh", "shreyas", "Mansi", "Pournima", "Mohini","Nidhi", "Rehan","Gauri", "Soham", "Aishwarya"];
let matches = [];
let matchHistory = JSON.parse(localStorage.getItem("matchHistory") || "[]");
let nextRoundPlayers = [];
let nextRoundMatches = [];

function renderPlayers() {
  const tbody = document.querySelector("#playerTable tbody");
  tbody.innerHTML = "";
  players.forEach((p, i) => {
    tbody.innerHTML += `<tr><td>${p}</td><td><button onclick="deletePlayer(${i})" class="delete-btn">Delete</button></td></tr>`;
  });
}

function addPlayer() {
  const input = document.getElementById("playerInput");
  const name = input.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    renderPlayers();
    input.value = "";
  }
}

function deletePlayer(i) {
  players.splice(i, 1);
  renderPlayers();
}

function generateMatches() {
  matches = [];
  for (let i = 0; i < players.length - 1; i += 2) {
    matches.push({ p1: players[i], p2: players[i + 1], score1: 0, score2: 0, winner: "-" });
  }
  renderMatches();
}

function renderMatches() {
  const tbody = document.querySelector("#matchTable tbody");
  tbody.innerHTML = "";
  matches.forEach((m, i) => {
    tbody.innerHTML += `
    <tr>
      <td>${m.p1}<br>
        <button onclick="updateScore(${i}, 'score1', 1)" ${m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>+</button>
        <button onclick="updateScore(${i}, 'score1', -1)" ${m.score1 === 0 || m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>-</button>
      </td>
      <td>${m.score1}</td>
      <td>${m.p2}<br>
        <button onclick="updateScore(${i}, 'score2', 1)" ${m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>+</button>
        <button onclick="updateScore(${i}, 'score2', -1)" ${m.score2 === 0 || m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>-</button>
      </td>
      <td>${m.score2}</td>
      <td class="${m.winner !== '-' ? 'winner confetti' : ''}">${m.winner === '-' ? 'In Progress' : m.winner}</td>
    </tr>`;
  });
}

function updateScore(i, key, delta) {
  const m = matches[i];
  if (m.winner !== '-') return;
  if (delta === -1 && m[key] === 0) return;
  m[key] += delta;
  if (m[key] > 11) m[key] = 11;

  const { score1, score2 } = m;
  if ((score1 >= 11 || score2 >= 11) && Math.abs(score1 - score2) >= 2) {
    m.winner = score1 > score2 ? m.p1 : m.p2;
    matchHistory.push({ ...m });
    if (!nextRoundPlayers.includes(m.winner)) nextRoundPlayers.push(m.winner);
    saveState();
    renderMatchHistory();
    renderNextRoundPlayers();
  }

  renderMatches();
}

function renderMatchHistory() {
  const tbody = document.querySelector("#matchHistoryTable tbody");
  tbody.innerHTML = "";
  matchHistory.forEach(m => {
    tbody.innerHTML += `<tr>
      <td>${m.p1}</td><td>${m.score1}</td>
      <td>${m.p2}</td><td>${m.score2}</td>
      <td class="winner">${m.winner}</td>
    </tr>`;
  });
}

function renderNextRoundPlayers() {
  const ul = document.getElementById("nextRoundList");
  ul.innerHTML = "";
  nextRoundPlayers.forEach(p => {
    ul.innerHTML += `<li>${p}</li>`;
  });
}

function nextRound() {
  if (nextRoundPlayers.length < 2) return alert("Not enough players!");
  players = [...nextRoundPlayers];
  nextRoundMatches = [];
  for (let i = 0; i < players.length - 1; i += 2) {
    nextRoundMatches.push({ p1: players[i], p2: players[i + 1], score1: 0, score2: 0, winner: "-" });
  }
  nextRoundPlayers = [];
  renderNextRoundPlayers();
  renderNextRoundMatches();
}

function renderNextRoundMatches() {
  const tbody = document.querySelector("#nextRoundMatchTable tbody");
  tbody.innerHTML = "";
  nextRoundMatches.forEach((m, i) => {
    tbody.innerHTML += `
    <tr>
      <td>${m.p1}<br>
        <button onclick="updateNextRoundScore(${i}, 'score1', 1)" ${m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>+</button>
        <button onclick="updateNextRoundScore(${i}, 'score1', -1)" ${m.score1 === 0 || m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>-</button>
      </td>
      <td>${m.score1}</td>
      <td>${m.p2}<br>
        <button onclick="updateNextRoundScore(${i}, 'score2', 1)" ${m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>+</button>
        <button onclick="updateNextRoundScore(${i}, 'score2', -1)" ${m.score2 === 0 || m.winner !== '-' ? 'class="disabled-btn"' : 'class="score-btn"'}>-</button>
      </td>
      <td>${m.score2}</td>
      <td class="${m.winner !== '-' ? 'winner confetti' : ''}">${m.winner === '-' ? 'In Progress' : m.winner}</td>
    </tr>`;
  });
}

function updateNextRoundScore(i, key, delta) {
  const m = nextRoundMatches[i];
  if (m.winner !== '-') return;
  if (delta === -1 && m[key] === 0) return;
  m[key] += delta;
  if (m[key] > 11) m[key] = 11;

  const { score1, score2 } = m;
  if ((score1 >= 11 || score2 >= 11) && Math.abs(score1 - score2) >= 2) {
    m.winner = score1 > score2 ? m.p1 : m.p2;
    matchHistory.push({ ...m });
    if (!nextRoundPlayers.includes(m.winner)) nextRoundPlayers.push(m.winner);
    saveState();
    renderMatchHistory();
    renderNextRoundPlayers();
  }

  renderNextRoundMatches();
}

function saveState() {
  localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
}

function clearMatchHistory() {
  matchHistory = [];
  localStorage.removeItem("matchHistory");
  renderMatchHistory();
}

renderPlayers();
renderMatchHistory();

// Firebase configuration object (from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBULDhQMRtdUm8VEwHoTfSWWJPtPPPIY5s",
    authDomain: "table-tennis-match.firebaseapp.com",
    projectId: "table-tennis-match",
    storageBucket: "table-tennis-match.firebasestorage.app",
    messagingSenderId: "897431867959",
    appId: "1:897431867959:web:3f40bff5621a3f34b1a5b2",
    measurementId: "G-65DJWZRSCV"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database(); // Initialize Realtime Database (for example)
  