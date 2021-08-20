/* Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

const startModalBtn = document.querySelectorAll("[data-start-button]");

openStartModal = (startModal) => {
  startModal.classList.add("active");
  overlay.classList.add("active");
};

closeModal = (startModal) => {
  startModal.classList.remove("active");
  overlay.classList.remove("active");
};

window.addEventListener("DOMContentLoaded", (event) => {
  const startModal = document.getElementById("start-modal");
  openStartModal(startModal);
});

startModalBtn.forEach((button) => {
  button.addEventListener("click", () => {
    const startModal = button.closest(".start-modal");
    closeModal(startModal);
  });
});

/* makeBoard: create in-JS board structure:
 * board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  // Creating the row in which the user(s) interact with to place their chips.
  const playerMove = document.createElement("tr");
  playerMove.setAttribute("id", "column-top");
  playerMove.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    playerMove.append(headCell);
  }
  htmlBoard.append(playerMove);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/* findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
};

/* placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const piece = document.createElement("div");
  const chip = document.getElementById(`${y}-${x}`);
  piece.classList.add("piece");
  piece.classList.add(`player${currPlayer}`);
  chip.append(piece);
};

const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  board[y][x] = currPlayer;
  placeInTable(y, x);

  const resetBtn = document.querySelector("#reset");
  function openRestartModal(restartModal, str) {
    restartModal.classList.add("active");
    overlay.classList.add("active");
    console.log(str);
    document.querySelector(".game-results").innerText = str;
  }

  // check for win
  if (checkForWin()) {
    const restartModal = document.getElementById("restart-modal");
    const playerXWins = `Player ${currPlayer} Wins!`;
    console.log(playerXWins);
    openRestartModal(restartModal, playerXWins);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  if (board.every((row) => row.every((cell) => cell))) {
    const restartModal = document.getElementById("restart-modal");
    const tieGame = "The game was a tie!";
    console.log(tieGame);
    openRestartModal(restartModal, tieGame);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2

  currPlayer = currPlayer === 1 ? 2 : 1;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  };

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

makeBoard();
makeHtmlBoard();
