let playerName = "Player";
let currentPlayer = 'X';
let gameActive = true;
let cells = Array(9).fill('');
let xWins = 0, oWins = 0;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// ✅ Start Game button logic
function startGame() {
  const nameInput = document.getElementById('playerName').value;
  playerName = nameInput || "Player";
  document.getElementById('splash').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  resetGame();
}

// ✅ Render board
function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell;
    cellDiv.onclick = () => handleClick(index);
    board.appendChild(cellDiv);
  });
  clearCanvas();
}

// ✅ Handle player move
function handleClick(index) {
  if (!gameActive || cells[index]) return;
  cells[index] = currentPlayer;
  renderBoard();
  if (checkWinner()) return;

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

// ✅ AI move
function computerMove() {
  if (!gameActive) return;
  const mode = document.getElementById('mode').value;
  let move;

  if (mode === 'easy') {
    const empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else {
    move = getBestMove();
  }

  cells[move] = 'O';
  renderBoard();
  if (checkWinner()) return;

  currentPlayer = 'X';
  updateStatus();
}

// ✅ Minimax for hard mode
function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === '') {
      cells[i] = 'O';
      let score = minimax(cells, 0, false);
      cells[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  const winner = evaluate(boardState);
  if (winner !== null) return winner;

