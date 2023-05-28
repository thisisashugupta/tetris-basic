addEventListener("DOMContentLoaded", (event) => {
  // Code goes here

  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  const delays = [2000, 1500, 1200, 1000, 800, 600, 400, 300, 200, 100];
  const delay = delays[6];
  let gameOver = false;

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

  // * * * * * * * * * * * * * * * * FUNCTIONS OF THE GAME * * * * * * * * * * * * * * * *

  function makeNewTertomino() {
    shape = Math.floor(theTetrominos.length * Math.random());
    rotation = Math.floor(theTetrominos[shape].length * Math.random());
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
      gameOver = true;
    }
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
  }

  function shiftDown() {
    for (let line = squares.length - 2 * width; line > 0; line -= width) {
      let lineEmpty = true;
      for (let index = line; index < line + width; index++) {
        // check for complete emptiness
        if (squares[index].classList.contains("frozen")) {
          lineEmpty = false;
          break;
        }
      }
      if (lineEmpty) {
        for (let index = line; index < line + width; index++) {
          // if above cell is frozen
          if (squares[index - width].classList.contains("frozen")) {
            // then make the current cell as frozen
            squares[index].classList.add("frozen");
            // and make the above cell as free
            squares[index - width].classList.remove("frozen");
          }
        }
      }
    }
  }

  function removeFilledLinesAndShiftDown() {
    for (let line = 0; line < squares.length - width; line += width) {
      let filled = true;
      for (let index = line; index < line + width; index++) {
        // if filled
        filled = filled && squares[index].classList.contains("frozen");
      }
      if (filled) {
        for (let index = line; index < line + width; index++) {
          squares[index].classList.remove("frozen");
        }
      }
    }
    shiftDown();
  }

  function removeBottomMostFilledLine() {
    // if for all cells of a particular line, all the cells are frozen
    let filled = true;
    for (let i = squares.length - 2 * width; i < squares.length - width; i++) {
      filled = filled && squares[i].classList.contains("frozen");
    }
    console.log(filled);
    if (!filled) return;

    for (let i = squares.length - 3 * width; i >= 0; i -= width) {
      for (let index = i; index < i + width; index++) {
        let bool = squares[index].classList.contains("frozen");

        if (bool) squares[index + width].classList.add("frozen");
        else {
          squares[index + width].classList.remove("frozen");
          squares[index + width].classList.remove("tetromino");
        }
      }
    }
  }

  function moveDown() {
    if (gameOver === true) return;

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
      makeNewTertomino();
    }

    undraw();
    currentPosition += width;
    draw();
    // removeBottomMostFilledLine();
    removeFilledLinesAndShiftDown();
  }

  document.addEventListener("keydown", control);

  function control(event) {
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

  let shape, rotation, currentPosition, currentTetromino;

  // * * * * * * * * * * * * * * * * UP NEXT GRID * * * * * * * * * * * * * * * *

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const miniWidth = 4;
  const miniIndex = 0;

  const upNextTetrominos = [
    [1, miniWidth + 1, 2 * miniWidth + 1, 2], // l
    [1, 2, miniWidth, miniWidth + 1], //z
    [1, 2, miniWidth + 1, miniWidth + 2], // o
    [1, miniWidth, miniWidth + 1, miniWidth + 2], //t
    [0, 1, 2, 3], // i
  ];

  // * * * * * * * * * * * * * * * * LOGIC OF THE GAME * * * * * * * * * * * * * * * *

  makeNewTertomino();
  console.log(currentTetromino);

  draw();
  setInterval(moveDown, delay);

  // onDOMContentLoaded = (event) => {};
});
