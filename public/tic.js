const board = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "]
];

let currentPlayer;
const human = "X";
const ai = "O";

const boxes = document.querySelectorAll(".box");
const messageBox = document.getElementById("message");
const reset = document.getElementById("resetBtn");
const startModal = document.getElementById("startModal");
const startX = document.getElementById("startX");
const startO = document.getElementById("startO");

// 🎯 Choose who starts
startX.addEventListener("click", () => {
  currentPlayer = human;
  startModal.classList.add("hidden");
  startGame();
});

startO.addEventListener("click", () => {
  currentPlayer = ai;
  startModal.classList.add("hidden");
  startGame();
});

// 🎮 Start game
function startGame() {
  clearBoard();
  boxes.forEach((btn) => {
    btn.innerText = " ";
    btn.disabled = false;
    btn.classList.remove("winner"); // clear old animations
    btn.addEventListener("click", handleMove);
  });
  messageBox.classList.add("hidden");

  // If AI starts
  if (currentPlayer === ai) {
    const move = findBestMove();
    makeMove(move.row, move.col, ai);
    currentPlayer = human;
  }
}

// 🧹 Reset board
function clearBoard() {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) board[i][j] = " ";
}

// 📥 Handle player move
function handleMove(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (board[row][col] === " ") {
    makeMove(row, col, currentPlayer);

    if (checkWinner(currentPlayer)) {
      showMessage(`${currentPlayer} Wins!`);
      highlightWinner(currentPlayer);
      disableBoard();
      return;
    }

    if (draw()) {
      showMessage("It's a draw!");
      return;
    }

    currentPlayer = currentPlayer === human ? ai : human;

    // AI Move
    if (currentPlayer === ai) {
      const move = findBestMove();
      makeMove(move.row, move.col, ai);

      if (checkWinner(ai)) {
        showMessage(`${ai} Wins!`);
        highlightWinner(ai);
        disableBoard();
        return;
      }

      if (draw()) {
        showMessage("It's a draw!");
        return;
      }

      currentPlayer = human;
    }
  }
}

// ✍️ Place a move with animation
function makeMove(row, col, player) {
  board[row][col] = player;
  const btn = document.querySelector(`.box[data-row="${row}"][data-col="${col}"]`);
  btn.innerText = player;
  btn.disabled = true;

  // Animation
  btn.classList.remove("pop");
  void btn.offsetWidth; // restart animation
  btn.classList.add("pop");
}

// 🏆 Highlight winning cells
function highlightWinner(player) {
  // Rows & Cols
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      document.querySelector(`.box[data-row="${i}"][data-col="0"]`).classList.add("winner");
      document.querySelector(`.box[data-row="${i}"][data-col="1"]`).classList.add("winner");
      document.querySelector(`.box[data-row="${i}"][data-col="2"]`).classList.add("winner");
    }
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      document.querySelector(`.box[data-row="0"][data-col="${i}"]`).classList.add("winner");
      document.querySelector(`.box[data-row="1"][data-col="${i}"]`).classList.add("winner");
      document.querySelector(`.box[data-row="2"][data-col="${i}"]`).classList.add("winner");
    }
  }
  // Diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    document.querySelector(`.box[data-row="0"][data-col="0"]`).classList.add("winner");
    document.querySelector(`.box[data-row="1"][data-col="1"]`).classList.add("winner");
    document.querySelector(`.box[data-row="2"][data-col="2"]`).classList.add("winner");
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    document.querySelector(`.box[data-row="0"][data-col="2"]`).classList.add("winner");
    document.querySelector(`.box[data-row="1"][data-col="1"]`).classList.add("winner");
    document.querySelector(`.box[data-row="2"][data-col="0"]`).classList.add("winner");
  }
}

// 📢 Show game message
function showMessage(msg) {
  messageBox.innerText = msg;
  messageBox.classList.remove("hidden");
  messageBox.classList.add("fade-in");
}

// ⛔ Disable board
function disableBoard() {
  boxes.forEach((btn) => (btn.disabled = true));
}

// 🏅 Winner check
function checkWinner(player) {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
  }
  if (
    (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)
  )
    return true;
  return false;
}

// ⚖️ Draw check
function draw() {
  return board.flat().every((cell) => cell !== " ");
}

// 🤖 AI Minimax
function minimax(isMaximizing) {
  if (checkWinner(ai)) return 1;
  if (checkWinner(human)) return -1;
  if (draw()) return 0;

  let best = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        board[i][j] = isMaximizing ? ai : human;
        let score = minimax(!isMaximizing);
        board[i][j] = " ";
        best = isMaximizing ? Math.max(score, best) : Math.min(score, best);
      }
    }
  }
  return best;
}

// 🧠 Best AI move
function findBestMove() {
  let bestVal = -Infinity;
  let bestMove = { row: -1, col: -1 };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        board[i][j] = ai;
        let moveVal = minimax(false);
        board[i][j] = " ";
        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = { row: i, col: j };
        }
      }
    }
  }
  return bestMove;
}

// 🔄 Reset game
function resetGame() {
  startModal.classList.remove("hidden");
}
reset.addEventListener("click", resetGame);
