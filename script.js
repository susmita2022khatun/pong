// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = false;

startBtn.addEventListener("click", function() {
  if (!gameRunning) { // only start the game if gameRunning is false
    gameRunning = true; // set gameRunning to true when the game starts
    loop();
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

addEventListener("load", (event) => {
  draw();
});


// Define ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 5;
var ballSpeedY = 5;

// Define paddle properties
var paddleHeightleft = 80;
var paddleHeightright = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeightleft / 2;
var rightPaddleY = canvas.height / 2 - paddleHeightright / 2;
var paddleSpeed = 10;

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 10;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

// Update game state
function update() {
  // Move paddles
  if (upPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (downPressed && rightPaddleY + paddleHeightright < canvas.height) {
    rightPaddleY += paddleSpeed;
  }

  // Move right paddle based on "w" and "s" keys
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeightleft < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Check if ball collides with top or bottom of canvas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Check if ball collides with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeightleft
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check if ball collides with right paddle
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeightright
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check if ball goes out of bounds on left or right side of canvas
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  // Check if a player has won
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right player");
  }
}

function playerWin(player) {
  var message = "Congratulations! " + player + " win!";
  $('#message').text(message); // Set the message text
  $('#message-modal').modal('show'); // Display the message modal
  reset();
}

// Reset ball and paddles to center of screen
function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;

  // Reduce paddle height of the losing side
  if (leftPlayerScore > rightPlayerScore) {
    paddleHeightright = Math.max(paddleHeightright - 5, 10); // Ensure minimum paddle height
    leftPaddleY = Math.min(leftPaddleY + 2.5, canvas.height - paddleHeightright); // Adjust paddle position
  } else {
    paddleHeightleft = Math.max(paddleHeightleft - 5, 10); // Ensure minimum paddle height
    rightPaddleY = Math.min(rightPaddleY + 2.5, canvas.height - paddleHeightleft); // Adjust paddle position
  }
}

// Draw objects on canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF"; // Set line color to white
  ctx.stroke();
  ctx.closePath();

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw left paddle
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeightleft);

  // Draw right paddle
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeightright);

  // Draw scores
  ctx.fillText("Score: " + leftPlayerScore, 10, 20);
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 70, 20);
}

// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});
