// Get Canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Snake Part
class SnakePart{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

// Snake and Board
let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

// Apple
let appleX = Math.floor(Math.random() * tileCount);;
let appleY = Math.floor(Math.random() * tileCount);;

// Speeds
let xVelocity = 0;
let yVelocity = 0;

let score = 0;

// Audios
const eatSound = new Audio("gulp.mp3");
const gameOverSound = new Audio("sfx-defeat7.mp3");

// Game Loop
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if(result) {
        gameOverSound.play();
        return;
    }
    clearScreen();

    detectCollision();
    drawSnake();
    drawApple();

    drawScore();

    if(score > 2) {
        speed = 11;
    }
    if(score > 5) {
        speed = 15;
    }

    setTimeout(drawGame, 1000/speed);


}
// Clear the Screen
function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width, canvas.height);
}
// Draw the snake
function drawSnake() {
    // Draw Initial Snake
    ctx.fillStyle = "green";
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount,tileSize, tileSize);
    }
    snakeParts.push(new SnakePart(headX,headY)); // Add to end of list
    while(snakeParts.length > tailLength) {
        snakeParts.shift(); // Remove First
    }
    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize); 
}
// Draw an Apple
function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount,appleY * tileCount,tileSize, tileSize);
}
// Add Score Text
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score: " + score, canvas.width-50, 10);
}
function keyDown(event){
    // Up
    if(event.keyCode == 38) {
        if(yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }
    // Down
    if(event.keyCode == 40) {
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    // Left
    if(event.keyCode == 37) {
        if(xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }
    // Right
    if(event.keyCode == 39) {
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}
// Move Snake
function changeSnakePosition() {
    headX += xVelocity;
    headY += yVelocity;
}
// Detect Apple 
function detectCollision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        eatSound.play();
    }
}
function isGameOver() {
    let gameOver = false;
    if(xVelocity == 0 && yVelocity == 0) {
        return false;
    }
    // Hit a wall
    if(headX < 0) {
        gameOver = true;
    }
    else if(headY < 0) {
        gameOver = true;
    }
    else if(headX >= tileCount) {
        gameOver = true;
    }
    else if (headY >= tileCount) {
        gameOver = true;
    }
    // Detect Self Collision
    for(let i=0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }
    // Print Game Over Message
    if(gameOver) {
        ctx.filleStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("Game Over.", canvas.width / 6.5, canvas.height / 2)
    }
    return gameOver;
}
// Import Keys
document.addEventListener('keydown', keyDown);
// Run Game
drawGame();