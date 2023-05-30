addEventListener("DOMContentLoaded", (event) => {
  // Code goes here
  const upBtn = document.getElementById("up-btn");
  const downBtn = document.getElementById("down-btn");
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const gameoverdiv = document.getElementById("game-over");
  const highScoreDisplay = document.getElementById("high-score");
  const startBtn = document.querySelector("#start-button");
  const scoreDisplay = document.querySelector("#score");
  const grid = document.querySelector(".grid");

  const width = 10;
  const delays = [2000, 1500, 1200, 1000, 800, 600, 400, 300, 200, 100];
  const delay = delays[6];

  let squares = Array.from(document.querySelectorAll(".grid div"));
  let gameOver = false;
  let flag = "start";
  let score;
  let highestScore = 0;

  const lTetromino = [
    [0 * width + 1, 1 * width + 1, 2 * width + 1, 0 * width + 2],
    [1 * width + 0, 1 * width + 1, 1 * width + 2, 2 * width + 2],
    [0 * width + 1, 1 * width + 1, 2 * width + 1, 2 * width + 0],
    [0 * width + 0, 1 * width + 0, 1 * width + 1, 1 * width + 2],
  ];

  const z1Tetromino = [
    [1, 2, width, width + 1],
    [0, width, width + 1, 2 * width + 1],
  ];

  const z2Tetromino = [
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, 2 * width + 1],
  ];

  const oTetromino = [[1, 2, width + 1, width + 2]];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, 2 * width + 1, 1],
  ];

  const iTetromino = [
    [0, width, 2 * width, 3 * width],
    [0, 1, 2, 3],
  ];

  const theTetrominos = [
    lTetromino,
    z1Tetromino,
    z2Tetromino,
    oTetromino,
    tTetromino,
    iTetromino,
  ];

  let shape, rotation, currentPosition, currentTetromino, nextTetromino;
  let nextShape = Math.floor(theTetrominos.length * Math.random());
  let nextRotation = Math.floor(
    theTetrominos[nextShape].length * Math.random()
  );

  // * * * * * * * * * * * * * * * * FUNCTIONS OF THE GAME * * * * * * * * * * * * * * * *

  function startGame() {
    flag = "stop";
    gameOver = false;
    gameoverdiv.textContent = "";
    console.log("Start button clicked!");
    startBtn.textContent = "Stop";
    clearGrids();
    makeNewTetromino();
    draw();
    intervalID = setInterval(moveDown, delay);
    scoreDisplay.textContent = score = 0;
    addButtonEvents();
  }

  function stopGame() {
    flag = "start";
    startBtn.textContent = "Start";
    clearInterval(intervalID);
    removeButtonEvents();
  }

  function over() {
    gameOver = true;
    gameoverdiv.textContent = "Game Over!!!";
    cleanMiniGrid();
    stopGame();
    highestScore = Math.max(highestScore, score);
    highScoreDisplay.textContent = highestScore;
    console.log(highestScore);
    removeButtonEvents();
    console.log("Game Over!");
  }

  function addButtonEvents() {
    document.addEventListener("keydown", control);
    upBtn.addEventListener("click", rotate);
    downBtn.addEventListener("click", moveDown);
    leftBtn.addEventListener("click", moveLeft);
    rightBtn.addEventListener("click", moveRight);
  }

  function removeButtonEvents() {
    document.removeEventListener("keydown", control);
    upBtn.removeEventListener("click", rotate);
    downBtn.removeEventListener("click", moveDown);
    leftBtn.removeEventListener("click", moveLeft);
    rightBtn.removeEventListener("click", moveRight);
  }

  function clearGrids() {
    cleanMiniGrid();
    squares.forEach((ele) => {
      ele.classList.remove("frozen");
      ele.classList.remove("tetromino");
    });
    console.log("Cleaned Grids.");
  }

  function checkGameOver() {
    // if first or second row from top has any frozen element, then game over
    for (let i = 0; i < width; i++) {
      if (squares[i].classList.contains("frozen")) {
        over();
        break;
      }
    }
  }

  function makeNewTetromino() {
    // make new tetromino
    shape = nextShape;
    rotation = nextRotation;
    currentPosition = 3;
    currentTetromino = theTetrominos[shape][rotation];

    if (
      currentTetromino.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "taken"
          ) ||
          squares[currentPosition + index + width].classList.contains(
            "frozen"
          ) ||
          squares[currentPosition + index].classList.contains("frozen")
      )
    ) {
      freeze();
    }

    if (gameOver) return;
    console.log("makeNewTertomino()");
    nextShape = Math.floor(theTetrominos.length * Math.random());
    nextRotation = Math.floor(theTetrominos[nextShape].length * Math.random());
    displayNextTetromino();
  }

  function draw() {
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  function undraw() {
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  function freeze() {
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.add("frozen");
      squares[currentPosition + index].classList.remove("tetromino");
    });
    checkGameOver();
  }

  function removeFilledLinesAndShiftDown() {
    for (let line = 0; line < squares.length - width; line += width) {
      let filled = true;
      for (let index = line; index < line + width; index++) {
        // if cell is filled
        filled = filled && squares[index].classList.contains("frozen");
      }
      if (filled) {
        scoreDisplay.textContent = score += 10;
        for (let index = line; index < line + width; index++) {
          squares[index].classList.remove("frozen");
        }
        // remove the divs
        let squaresRemoved = squares.splice(line, width);
        // and add them to the top of the array
        squares = squaresRemoved.concat(squares);
        squares.forEach((ele) => grid.appendChild(ele));
      }
    }
  }

  function moveDown() {
    if (gameOver === true) return;
    console.log("moveDown()");

    if (
      currentTetromino.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "taken"
          ) ||
          squares[currentPosition + index + width].classList.contains("frozen")
      )
    ) {
      freeze();
      if (gameOver === true) return;
      makeNewTetromino();
    } else {
      undraw();
      currentPosition += width;
      draw();
    }
    removeFilledLinesAndShiftDown();
  }

  function control(event) {
    console.log(event);
    if (event.key === "ArrowLeft") {
      moveLeft();
    }
    if (event.key === "ArrowRight") {
      moveRight();
    }
    if (event.key === "ArrowDown") {
      moveDown();
    }
    if (event.key === "ArrowUp") {
      rotate();
    }
  }

  function moveLeft() {
    const isAtLeftEdge = currentTetromino.some(
      (index) => (currentPosition + index) % 10 === 0
    );
    const isLeftFrozen = currentTetromino.some((index) =>
      squares[currentPosition - 1 + index].classList.contains("frozen")
    );
    if (isAtLeftEdge || isLeftFrozen) return;
    undraw();
    --currentPosition;
    draw();
  }

  function moveRight() {
    const isAtRightEdge = currentTetromino.some(
      (index) => (currentPosition + index) % 10 === 9
    );
    const isRightFrozen = currentTetromino.some((index) =>
      squares[currentPosition + 1 + index].classList.contains("frozen")
    );
    if (isAtRightEdge || isRightFrozen) return;

    undraw();
    ++currentPosition;
    draw();
  }

  function rotate() {
    let newRotation = (rotation + 1) % theTetrominos[shape].length;
    let newTetromino = theTetrominos[shape][newRotation];
    // check if all new places are empty
    const overlapping = newTetromino.some((index) =>
      squares[currentPosition + index].classList.contains("frozen")
    );
    if (overlapping) return;
    // if after rotation some are in leftmost col and some are in rightmost col then dont rotate
    const isAtLeftEdge = newTetromino.some(
      (index) => (currentPosition + index) % 10 === 0
    );
    const isAtRightEdge = newTetromino.some(
      (index) => (currentPosition + index) % 10 === 9
    );
    if (isAtLeftEdge && isAtRightEdge) return;

    undraw();
    rotation = newRotation;
    currentTetromino = theTetrominos[shape][rotation];
    draw();
  }

  // * * * * * * * * * * * * * * * * UP NEXT GRID * * * * * * * * * * * * * * * *

  const miniSquares = document.querySelectorAll(".mini-grid div");
  const miniWidth = 4;
  const miniIndex = 0;

  const nextlTetromino = [
    [
      0 * miniWidth + 1,
      1 * miniWidth + 1,
      2 * miniWidth + 1,
      0 * miniWidth + 2,
    ],
    [
      1 * miniWidth + 0,
      1 * miniWidth + 1,
      1 * miniWidth + 2,
      2 * miniWidth + 2,
    ],
    [
      0 * miniWidth + 1,
      1 * miniWidth + 1,
      2 * miniWidth + 1,
      2 * miniWidth + 0,
    ],
    [
      0 * miniWidth + 0,
      1 * miniWidth + 0,
      1 * miniWidth + 1,
      1 * miniWidth + 2,
    ],
  ];

  const nextz1Tetromino = [
    [1, 2, miniWidth, miniWidth + 1],
    [0, miniWidth, miniWidth + 1, 2 * miniWidth + 1],
  ];

  const nextz2Tetromino = [
    [0, 1, miniWidth + 1, miniWidth + 2],
    [2, miniWidth + 2, miniWidth + 1, 2 * miniWidth + 1],
  ];

  const nextoTetromino = [[1, 2, miniWidth + 1, miniWidth + 2]];

  const nexttTetromino = [
    [1, miniWidth, miniWidth + 1, miniWidth + 2],
    [1, miniWidth + 1, miniWidth + 2, 2 * miniWidth + 1],
    [miniWidth, miniWidth + 1, miniWidth + 2, 2 * miniWidth + 1],
    [miniWidth, miniWidth + 1, 2 * miniWidth + 1, 1],
  ];

  const nextiTetromino = [
    [0, miniWidth, 2 * miniWidth, 3 * miniWidth],
    [0, 1, 2, 3],
  ];

  const upNextTetrominos = [
    nextlTetromino,
    nextz1Tetromino,
    nextz2Tetromino,
    nextoTetromino,
    nexttTetromino,
    nextiTetromino,
  ];

  function cleanMiniGrid() {
    miniSquares.forEach((square) => square.classList.remove("tetromino"));
  }

  function displayNextTetromino() {
    cleanMiniGrid();
    nextTetromino = upNextTetrominos[nextShape][nextRotation];
    nextTetromino.forEach((index) => {
      miniSquares[index].classList.add("tetromino");
    });
  }

  // * * * * * * * * * * * * * * * * LOGIC OF THE GAME * * * * * * * * * * * * * * * *

  startBtn.addEventListener("click", function () {
    if (flag === "start") startGame();
    else if (flag === "stop") {
      console.log("Stop button clicked!");
      clearGrids();
      stopGame();
    } else console.log("errrrrrr!");
  });

  // onDOMContentLoaded = (event) => {};
});
