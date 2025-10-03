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

function startGame() {
  const nameInput = document.getElementById('playerName').value;
  playerName = nameInput || "Player";
  document.getElementById('splash').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  resetGame();
}

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

function handleClick(index) {
  if (!gameActive || cells[index]) return;
  cells[index] = currentPlayer;
  renderBoard();
  if (checkWinner()) return;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
}

function updateStatus() {
  document.getElementById('status').textContent = `${playerName} (${currentPlayer})'s turn`;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      document.getElementById('status').textContent = `${cells[a]} wins!`;
      drawWinLine(a, c);
      updateScore(cells[a]);
      return true;
    }
  }
  if (!cells.includes('')) {
    gameActive = false;
    document.getElementById('status').textContent = "It's a draw!";
    return true;
  }
  return false;
}

function updateScore(winner) {
  if (winner === 'X') {
    xWins++;
    document.getElementById('xWins').textContent = `X Wins: ${xWins}`;
  } else {
    oWins++;
    document.getElementById('oWins').textContent = `O Wins: ${oWins}`;
  }
}

function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  updateStatus();
  renderBoard();
}

function drawWinLine(start, end) {
  const canvas = document.getElementById('winLine');
  const board = document.getElementById('board');
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;
  const ctx = canvas.getContext('2d');
  const cellSize = 100;
  const offset = 10;

  const x1 = (start % 3) * cellSize + cellSize / 2;
  const y1 = Math.floor(start / 3) * cellSize + cellSize / 2;
  const x2 = (end % 3) * cellSize + cellSize / 2;
  const y2 = Math.floor(end / 3) * cellSize + cellSize / 2;

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1 + offset, y1 + offset);
  ctx.lineTo(x2 + offset, y2 + offset);
  ctx.stroke();
}

function clearCanvas() {
  const canvas = document.getElementById('winLine');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
