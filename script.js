let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
let speed = 12;
let lastPaintTime = 0;
let score = 0;
let currentDiff = document.getElementById("currentDiff");
/*let Difficulty = Medium;*/
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

// Get the selected game mode from localStorage
const gameMode = localStorage.getItem("gameMode");
switch (gameMode) {
  case "easy":
    currentDiff.innerHTML = "Difficulty: Easy";
    speed = 8; // Set speed for easy mode
    break;
  case "medium":
    currentDiff.innerHTML = "Difficulty: Medium";
    speed = 12; // Set speed for medium mode
    break;
  case "hard":
    currentDiff.innerHTML = "Difficulty: Hard";
    speed = 16; // Set speed for hard mode
    break;
  default:
    speed = 12; // Default speed (if no mode is selected)
}
//for current difficulty display



// Add event listener to the "Change Difficulty" button
document.getElementById("modeBox").addEventListener("click", function () {
  window.location.href = "intro.html"; // Redirect to the mode selection page
});

//game engine
function main(ctime) {
  window.requestAnimationFrame(main);
  //console.log(ctime)
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  //if u bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // updating the snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over.Press any key to Play Again!");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score:" + score;
  }
  //if u have eaten the food increment the snake and regen the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    scoreBox.innerHTML = "Score:" + score;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore:" + hiscoreval;
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
  //moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  //display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  //display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);

  hiscoreBox.innerHTML = "HiScore:" + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; //start the game
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});
