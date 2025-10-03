document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const modeSelect = document.getElementById('mode');

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
        return true;
      }
    }
    if (!cells.includes('')) {
      gameActive = false;
      status.textContent = "It's a draw!";
      return true;
    }
    return false;
  }

  function handleClick(index) {
    if (!gameActive || cells[index] || currentPlayer !== 'X') return;
    cells[index] = 'X';
    renderBoard();
    if (!checkWinner()) {
      currentPlayer = 'O';
      status.textContent = `Player O's turn`;
      setTimeout(computerMove, 500);
    }
  }

  function computerMove() {
    if (!gameActive) return;
    const mode = modeSelect.value;
    let move;
    if (mode === 'easy') {
      const empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
      move = empty[Math.floor(Math.random() * empty.length)];
    } else {
      move = getBestMove();
    }
    cells[move] = 'O';
    renderBoard();
    if (!checkWinner()) {
      currentPlayer = 'X';
      status.textContent = `Player X's turn`;
    }
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

  modeSelect.addEventListener('change', () => {
    resetGame();
  });

  renderBoard();
});
