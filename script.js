const board = document.getElementById('board');
const status = document.getElementById('status');
let currentPlayer = 'X';
let gameActive = true;
let cells = Array(9).fill('');

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      status.textContent = `Player ${cells[a]} wins!`;
      return;
    }
  }
  if (!cells.includes('')) {
    gameActive = false;
    status.textContent = "It's a draw!";
  }
}

function handleClick(index) {
  if (!gameActive || cells[index]) return;
  cells[index] = currentPlayer;
  renderBoard();
  checkWinner();
  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell;
    cellDiv.onclick = () => handleClick(index);
    board.appendChild(cellDiv);
  });
}

function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

renderBoard();
