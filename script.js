const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controls.forEach(button =>
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }))
);

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-column: ${foodX}; grid-row: ${foodY};"></div>`;

    // Move the snake
    snakeX += velocityX;
    snakeY += velocityY;

    // Check for collision with wall
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Move the snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Check for collision with itself
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    // Check if food is eaten
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = Math.max(score, highScore);
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Render the snake with a head and body
    for (let i = 0; i < snakeBody.length; i++) {
        let className = i === 0 ? "head" : "body";
        html += `<div class="${className}" style="grid-column: ${snakeBody[i][0]}; grid-row: ${snakeBody[i][1]};"></div>`;
    }

    playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
