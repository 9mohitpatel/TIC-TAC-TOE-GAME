const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

let board = ["", "", "", "", "", "", "", "", ""];
let user = "X";
let ai = "O";
let gameOver = false;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

// Event listeners for boxes
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!gameOver && !box.classList.contains("disabled-box")) {
      makeMove(index, user);
      if (!gameOver) {
        const bestMove = getBestMove();
        if (bestMove !== -1) {
          setTimeout(() => makeMove(bestMove, ai), 300); // Delay for better UX
        }
      }
    }
  });
});

// Make move
function makeMove(index, player) {
  board[index] = player;
  boxes[index].innerText = player;
  boxes[index].classList.add("disabled-box");

  if (checkWinner(board, player)) {
    showWinner(player);
    gameOver = true;
    disableAll();
  } else if (isDraw()) {
    showDraw();
    gameOver = true;
  }
}

// Winner checking
function checkWinner(bd, player) {
  return winPatterns.some(pattern =>
    pattern.every(index => bd[index] === player)
  );
}

// Draw check
function isDraw() {
  return board.every(cell => cell !== "") &&
         !checkWinner(board, user) &&
         !checkWinner(board, ai);
}

// Display winner
function showWinner(winner) {
  if (winner === 'X') {
    msg.innerText = "🎉 Player (X) Wins!";
  } else {
    msg.innerText = "🤖 Computer (O) Wins!";
  }
  msgContainer.classList.add("show");
}

// Display draw
function showDraw() {
  msg.innerText = "😐 It's a Draw!";
  msgContainer.classList.add("show");
}

// Disable all boxes
function disableAll() {
  boxes.forEach(box => box.classList.add("disabled-box"));
}

// Reset function
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  boxes.forEach(box => {
    box.innerText = "";
    box.classList.remove("disabled-box");
  });
  gameOver = false;
  msgContainer.classList.remove("show");
}

// Button listeners
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

// AI - Get best move using minimax
function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, ai)) return 10 - depth;
  if (checkWinner(newBoard, user)) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = user;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
