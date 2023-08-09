let minesCount = 0;
let countMines = 10;
let board = [];
let minesCoordinate = [];
let rows = [];
let gameOver = false;
let nowPlay = false;
let row = 6;
let column = 7;
let flagged = false;
let countRevealTile = 0;
let seconds = 0;
let countdown;

document.addEventListener("contextmenu", (event) => event.preventDefault());

window.onload = (event) => {
  startGame();
};

function flaggedMode() {
  btn = document.getElementById("btn-flagged");
  flagged = !flagged;

  if (btn.classList.contains("active")) {
    btn.classList.remove("active");
  } else {
    btn.classList.add("active");
  }
}

function revealBom() {
  minesCoordinate.forEach((element) => {
    let coords = element.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    board[r][c].innerHTML = `<i class="fa-solid fa-bomb"></i>`;
    board[r][c].classList.add("reveal-bom");
  });
}

function flaggedTile(r, c) {
  if (board[r][c].innerHTML != "" && minesCount >= 0) {
    board[r][c].innerHTML = ``;
    minesCount += 1;
  } else if (minesCount != 0) {
    board[r][c].innerHTML = `<i class="fa-solid fa-flag"></i>`;
    minesCount -= 1;
  }

  document.getElementById("countMines").innerHTML = minesCount;
}

function clickTile(event) {
  tile = this;
  let coords = tile.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  if (!nowPlay) {
    countdown = setInterval(() => {
      seconds += 1;
      document.getElementById("timer").innerHTML = `${seconds}S`;
    }, 1000);

    nowPlay = true;
  }

  if (gameOver) {
    return;
  }

  if (event.buttons == 2 && !board[r][c].classList.contains("revealed")) {
    flaggedTile(r, c);
    return;
  }

  if (event.buttons == 4) {
    checkTile(r, c, true);
    return;
  }

  if (board[r][c].classList.contains("revealed")) {
    console.log("udah di klik");
    return;
  }

  if (flagged && board[r][c].innerHTML == "") {
    flaggedTile(r, c);
    return;
  }

  if (minesCoordinate.includes(tile.id) && board[r][c].innerHTML == "") {
    document.getElementById("countMines").innerHTML = "Game Over";
    revealBom();
    dat = document.createElement("p")
    dat.innerHTML = `Failed (${seconds}s)`
    document.getElementById("history").append(dat);
    clearInterval(countdown);
    gameOver = true;
    return;
  }

  checkTile(r, c);

  if (countRevealTile == row * column - countMines) {
    revealBom();
    dat = document.createElement("p")
    dat.innerHTML = `Cleared (${seconds}s)`
    document.getElementById("history").append(dat);
    clearInterval(countdown);
    document.getElementById("countMines").innerHTML = "Cleared";
  }
}

function checkTile(r, c, skipClicked = false) {
  if (r < 0 || r >= row) {
    return;
  }

  if (c < 0 || c >= column) {
    return;
  }

  if (board[r][c].innerHTML != "" && !skipClicked) {
    console.log("udah di tandain");
    return;
  }

  if (board[r][c].classList.contains("revealed") && !skipClicked) {
    console.log("udah di klik");
    return;
  }

  if (!skipClicked) {
    countRevealTile += 1;
  }

  let minesFound = 0;

  minesFound += checkMine(r - 1, c - 1);
  minesFound += checkMine(r - 1, c);
  minesFound += checkMine(r - 1, c + 1);
  minesFound += checkMine(r, c - 1);
  minesFound += checkMine(r, c + 1);
  minesFound += checkMine(r + 1, c - 1);
  minesFound += checkMine(r + 1, c);
  minesFound += checkMine(r + 1, c + 1);

  if (minesFound != 0) {
    board[r][c].innerHTML = minesFound;
    board[r][c].classList.add("revealed");
    board[r][c].classList.add(`x${minesFound}`);
    return;
  } else {
    board[r][c].classList.add("revealed");
    checkTile(r - 1, c - 1);
    checkTile(r - 1, c);
    checkTile(r - 1, c + 1);
    checkTile(r, c - 1);
    checkTile(r, c + 1);
    checkTile(r + 1, c - 1);
    checkTile(r + 1, c);
    checkTile(r + 1, c + 1);
  }
}

function checkMine(r, c) {
  if (minesCoordinate.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}

function generateMines() {
  let generate = 0;
  while (generate < minesCount) {
    let r = Math.floor(Math.random() * row);
    let c = Math.floor(Math.random() * column);

    let temp = r.toString() + "-" + c.toString();

    if (!minesCoordinate.includes(temp)) {
      minesCoordinate.push(temp);
      generate += 1;
    }
  }
}

function generateBoard() {
  for (let r = 0; r < row; r++) {
    rows = [];
    for (let c = 0; c < column; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("mousedown", clickTile);
      document.getElementById("board").append(tile);
      rows.push(tile);
    }
    board.push(rows);
  }
}

function resetGame() {
  document.getElementById("board").innerHTML = "";
  board = [];
  minesCoordinate = [];
  rows = [];
  countRevealTile = 0;
  gameOver = false;
  seconds = 0;
  nowPlay = false;

  clearInterval(countdown);
  document.getElementById("timer").innerHTML = `${seconds}S`;

  startGame();
}

function startGame() {
  minesCount = countMines;
  document.getElementById("countMines").innerHTML = minesCount;
  generateBoard();
  generateMines();
  console.log(board);
}
