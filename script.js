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

  if (currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

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

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'O';
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'X';
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = '';
      }
    }
    return best;
  }
}

function evaluate(boardState) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a] === 'O' ? 1 : -1;
    }
  }
  if (!boardState.includes('')) return 0;
  return null;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      document.getElementById('status').textContent = `${cells[a]} wins!`;
      drawWinLine(a, c);
      updateScore(cells[a]);
      launchConfetti();
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

function updateStatus() {
  document.getElementById('status').textContent = `${playerName} (${currentPlayer})'s turn`;
}

function drawWinLine(start, end) {
  const canvas = document.getElementById('winLine');
  const board = document.getElementById('board');
  canvas.width = board.offsetWidth;
  canvas.height = board.offsetHeight;
  const ctx = canvas.getContext('2d');

  const cellSize = 100;
  const x1 = (start % 3) * cellSize + cellSize / 2;
  const y1 = Math.floor(start / 3) * cellSize + cellSize / 2;
  const x2 = (end % 3) * cellSize + cellSize / 2;
  const y2 = Math.floor(end / 3) * cellSize + cellSize / 2;

  let progress = 0;
  const steps = 30;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    const currentX = x1 + (x2 - x1) * (progress / steps);
    const currentY = y1 + (y2 - y1) * (progress / steps);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    progress++;
    if (progress <= steps) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

