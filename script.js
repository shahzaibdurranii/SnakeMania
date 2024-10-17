let inputDir = { x: 0, y: 0 };
let lastInputDir = { x: 0, y: 0 }; // Tracks the last valid direction
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
let speed = 12;
let lastPaintTime = 0;
let score = 0;
let currentDiff = document.getElementById("currentDiff");
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Get the selected game mode from localStorage
const gameMode = localStorage.getItem("gameMode");
switch (gameMode) {
  case "easy":
    currentDiff.innerHTML = "Mode: Easy";
    speed = 8; // Speed for easy mode
    break;
  case "medium":
    currentDiff.innerHTML = "Mode: Medium";
    speed = 12; // Speed for medium mode
    break;
  case "hard":
    currentDiff.innerHTML = "Mode: Hard";
    speed = 16; // Speed for hard mode
    break;
  default:
    speed = 12; // If no mode is selected
}

// Add event listener to the "Change Difficulty" button
document.getElementById("modeBox").addEventListener("click", function () {
  window.location.href = "intro.html"; // Redirect to the mode selection page
});

// Game engine
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // Check if the snake bumps into itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // Check if the snake bumps into the wall
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
    return true;
  }

  return false;
}
let gameOver = false;
function gameEngine() {
  if (gameOver)return;
  // Update the snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    gameOver = true;
    inputDir = { x: 0, y: 0 };

    // Show the custom game over modal
    const gameOverModal = document.getElementById("modal-alert");
    const finalScoreDisplay = document.getElementById("final-score");
    finalScoreDisplay.textContent = score; // Set the final score
    gameOverModal.style.display = "flex"; // Make the modal visible

    // Reset the game when the play again button is clicked
    document.getElementById("playAgainBtn").addEventListener("click", function () {
      gameOverModal.style.display = "none"; // Hide the modal
      gameOver= false;
      snakeArr = [{ x: 13, y: 15 }];
      score = 0;
      scoreBox.innerHTML = "Score: " + score;
    });

    return; // Stop the game engine after collision
  }


  // If the snake eats the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    scoreBox.innerHTML = "Score: " + score;

    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }

    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }

    board.appendChild(snakeElement);
  });

  // Display the food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);

  // Update lastInputDir after each move
  lastInputDir = { ...inputDir }; // Update the last direction after every move
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);

// Keydown event listener to control the snake's direction
window.addEventListener("keydown", (e) => {
  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      // Prevent moving down if already moving up
      if (lastInputDir.y !== 1) {
        inputDir = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      // Prevent moving up if already moving down
      if (lastInputDir.y !== -1) {
        inputDir = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      // Prevent moving right if already moving left
      if (lastInputDir.x !== 1) {
        inputDir = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      // Prevent moving left if already moving right
      if (lastInputDir.x !== -1) {
        inputDir = { x: 1, y: 0 };
      }
      break;

    default:
      break;
  }
});
