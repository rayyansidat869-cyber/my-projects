let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// ✅ Render the board
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
}

// ✅ Handle player move
function handleClick(index) {
  if (!gameActive || cells[index]) return;
  cells[index] = currentPlayer;
  renderBoard();
  if (checkWinner()) return;

  currentPlayer = 'O';
  document.getElementById('status').textContent = "Computer's turn";
  setTimeout(computerMove, 500);
}

// ✅ AI move
function computerMove() {
  if (!gameActive) return;
  const modeSelect = document.getElementById('mode');
  const mode = modeSelect ? modeSelect.value : 'easy';
  let move;

  if (mode === 'easy') {
    const empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else {
    move = getBestMove();
  }

  if (move === undefined) return;

  cells[move] = 'O';
  renderBoard();
  if (checkWinner()) return;

  currentPlayer = 'X';
  document.getElementById('status').textContent = "Your turn";
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
  if (depth > 4) return 0; // Limit depth to prevent lag
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

// ✅ Check for winner or draw
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      document.getElementById('status').textContent = `${cells[a]} wins!`;
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

// ✅ Restart game
function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  document.getElementById('status').textContent = "Your turn";
  renderBoard();
}

// ✅ Initialize board on load
renderBoard();
