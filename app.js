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
    [1 * width + 0, 2 * width + 0, 2 * width + 1, 2 * width + 2],
  ];

  const zTetromino = [
    [width + 1, 2 * width, width + 2, 2 * width + 1],
    [width + 1, 2 * width, 1, 2 * width + 1],
  ];

  const oTetromino = [[width, 2 * width, width + 1, 2 * width + 1]];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, 2 * width + 1, 1],
  ];

  const iTetromino = [
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominos = [
    lTetromino,
    zTetromino,
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
          squares[currentPosition + index + width].classList.contains("frozen")
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
    currentTetromino.forEach((index) =>
      squares[currentPosition + index].classList.add("frozen")
    );
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

    if (
      newTetromino.some((index) =>
        squares[currentPosition + index].classList.contains("frozen")
      )
    )
      return;

    // check if all new places are empty
    undraw();
    rotation = newRotation;
    currentTetromino = theTetrominos[shape][rotation];
    draw();
  }

  let shape, rotation, currentPosition, currentTetromino;

  // * * * * * * * * * * * * * * * * LOGIC OF THE GAME * * * * * * * * * * * * * * * *

  makeNewTertomino();
  console.log(currentTetromino);

  draw();
  // setInterval(undraw, delay);
  setInterval(moveDown, delay);

  // onDOMContentLoaded = (event) => {};
});
