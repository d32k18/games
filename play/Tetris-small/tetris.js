// This file contain the tetris game logic

// This tetris file will use pieces made of 4 blocks. Each single block is a square of 20px.

// The tetris board is a 10x20 grid of squares. The board is a 2D array of 20 arrays of 10 elements each.

// The tetris pieces are stored in a 4x4 grid. The pieces are stored in a 2D array of 4 arrays of 4 elements each.

// Define the tetris pieces
const pieces = [
    // I piece
    [
        [1, 1, 1, 1]
    ],

    // J piece
    [
        [2, 0, 0],
        [2, 2, 2]
    ],

    // L piece
    [
        [0, 0, 3],
        [3, 3, 3],
    ],

    // O piece
    [
        [4, 4],
        [4, 4]
    ],

    // S piece
    [
        [0, 5, 5],
        [5, 5, 0]
    ],

    // T piece
    [
        [0, 6, 0],
        [6, 6, 6]
    ],

    // Z piece
    [
        [7, 7, 0],
        [0, 7, 7]
    ]
];

// Define the tetris colors
const colors = [
    'white',
    'cyan',
    'blue',
    'orange',
    '#FF0D72',
    'green',
    'purple',
    'red'
];

// Define the tetris board
let board = [];

// Store current piece
let currentPiece = [];
let currentPieceRow = 0;
let currentPieceCol = 0;


var canvas = document.getElementById('tetris');
var context = canvas.getContext('2d');

// speed will contains the speed of the game symbolized by the number of milliseconds between each move
var speed = 400;

var timeHandler = () => {
    moveDown();
}

var intervalId;

var squareWidht = 20;
var squareHeight = 20;

var score = 0;
var level = 1;

// start game function
function startGame() {

    score = 0;
    level = 1;
    

    // Create the board
    createBoard();

    // Create the first piece
    createPiece();

    // Draw the board
    drawBoard();

    speed = 400;

    document.getElementById('game-over').style.display = 'none';

    // Move the piece down every second
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(timeHandler, speed);
}

// Stop the game
function stopGame() {
    console.log('stop game');
    // Stop the game
    clearInterval(intervalId);
    intervalId = null;
}

// Pause the game
function pauseGame() {
    // Pause the game
    clearInterval(intervalId);
    intervalId = null;
}

// Resume the game
function resumeGame() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Resume the game
    intervalId = setInterval(timeHandler, speed);
}

// Game over
function gameOver() {
    // Stop the game
    stopGame();

    // Display game over message
    document.getElementById('game-over').style.display = 'block';
}

// Create the board
function createBoard() {


    squareWidht = canvas.width / 10;
    squareHeight = canvas.height / 20;

    // Create the board
    for (let row = 0; row < 20; row++) {
        board[row] = [];
        for (let col = 0; col < 10; col++) {
            board[row][col] = 0;
        }
    }
}

// Create the piece
function createPiece() {
    // Get a random piece
    const randomPiece = Math.floor(Math.random() * pieces.length);

    // Create the piece
    currentPiece = pieces[randomPiece];
    currentPieceRow = 0;
    currentPieceCol = 3;
}

// Draw the board
function drawBoard() {
    // Clear the board
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {

            // Set the color of the piece
            context.fillStyle = colors[board[row][col]];

            // Draw the piece
            context.fillRect(col * squareWidht, row * squareHeight, squareWidht, squareHeight);
        }
    }

    // Draw the piece
    drawPiece();
}

// Draw the piece
function drawPiece() {
    // Draw the piece
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {

            if (currentPiece[row][col] === 0) {
                continue;
            }

            // Set the color of the piece
            context.fillStyle = colors[currentPiece[row][col]];

            // Draw the piece
            context.fillRect((col + currentPieceCol) * squareWidht, (row + currentPieceRow) * squareHeight, squareWidht, squareHeight);
        }
    }
}

// increase speed
function increaseSpeed() {
    speed = speed - 50;

    clearInterval(intervalId);
    intervalId = setInterval(timeHandler, speed);
}

// Move the piece down
function moveDown() {
    // Check if the piece can move down
    if (canMoveDown()) {
        // Move the currentPiece down
        currentPieceRow++;
        
    } else {

        // Check for game over
        if (currentPieceRow === 0) {

            stopGame();

            // Game over
            gameOver();
            return;
        }

        // Add the piece to the board
        for (let row = 0; row < currentPiece.length; row++) {
            for (let col = 0; col < currentPiece[row].length; col++) {
                if (currentPiece[row][col] !== 0) {
                    board[row + currentPieceRow][col + currentPieceCol] = currentPiece[row][col];
                }
            }
        }

        // Check for complete lines
        for (let row = 0; row < board.length; row++) {
            if(rowIsFull(row)) {
                // Remove the row
                removeRow(row);
            }
        }

        // Create a new piece
        createPiece();
    }

    // Draw the board
    drawBoard();
}

// Check if a row is full
function rowIsFull(row) {
    // Check if the row is full
    for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
            return false;
        }
    }

    // The row is full
    return true;
}

// Remove a row
function removeRow(row) {
    // Remove the row
    board.splice(row, 1);

    // Add a new row at the top
    board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Increase the score
    increaseScore();
}

// Increase the score
function increaseScore() {
    // Increase the score
    score += 10;

    // Display the score
    document.getElementById('score').innerHTML = 'Score: ' + score;

    if(score % 100 === 0) {

        // increaseLevel
        increaseLevel();

        // Increase the speed
        increaseSpeed();
    }
}

// Increase the level
function increaseLevel() {
    // Increase the level
    level++;

    // Display the level
    document.getElementById('level').innerHTML = 'Level: ' + level;
}

// Check if the piece can move down
function canMoveDown() {
    // Check if adding 1 row will make the piece go out of bounds
    if (currentPieceRow + currentPiece.length >= board.length) {
        return false;
    }

    // check if adding 1 row will make the piece collide with another piece
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                if (board[row + currentPieceRow + 1][col + currentPieceCol] !== 0) {
                    return false;
                }
            }
        }
    }

    // The piece can move down

    return true;
}

// Move the piece left
function moveLeft() {
    // Check if the piece can move left
    if (canMoveLeft()) {
        // Move the piece left
        currentPieceCol--;
    }

    // Draw the board
    drawBoard();
}

// Check if the piece can move left
function canMoveLeft() {
    // Check if the piece can move left
    return currentPieceCol > 0 && board[currentPieceRow][currentPieceCol - 1] === 0;
}

// Move the piece right
function moveRight() {
    // Check if the piece can move right
    if (canMoveRight()) {
        // Move the piece right
        currentPieceCol++;
    }

    // Draw the board
    drawBoard();
}

// Check if the piece can move right
function canMoveRight() {
    // Check if the piece can move right
    return currentPieceCol + currentPiece[0].length < board[0].length && board[currentPieceRow][currentPieceCol + currentPiece[0].length] === 0;

}

// Rotate the piece
function rotatePiece() {
    // rotate the currentPiece Array
    const rotatedPiece = rotateArray(currentPiece);

    // Check if the piece can rotate
    if (canRotate(rotatedPiece)) {
        // Rotate the piece
        currentPiece = rotatedPiece;
    }
}

// Check if the piece can rotate
function canRotate(rotatedPiece) {
    // Check if the piece can rotate
    if (currentPieceCol + rotatedPiece[0].length > board[0].length) {
        return false;
    }

    // Check if the piece can rotate
    if (currentPieceRow + rotatedPiece.length > board.length) {
        return false;
    }

    // Check if the piece can rotate
    for (let row = 0; row < rotatedPiece.length; row++) {
        for (let col = 0; col < rotatedPiece[row].length; col++) {
            if (rotatedPiece[row][col] !== 0) {
                if (board[row + currentPieceRow][col + currentPieceCol] !== 0) {
                    return false;
                }
            }
        }
    }

    // The piece can rotate
    return true;
}

// Rotate the array
function rotateArray(array) {
    // Create a new array
    const newArray = [];

    // Loop through the array
    for (let col = 0; col < array[0].length; col++) {
        newArray[col] = [];

        for (let row = 0; row < array.length; row++) {
            newArray[col][row] = array[array.length - row - 1][col];
        }
    }

    // Return the new array
    return newArray;
}

// Toggle menu
function toggleMenu() {
    // Toggle the menu
    if(document.getElementById('menu').style.display === 'none'){
        document.getElementById('menu').style.display = 'block';
    } else {
        document.getElementById('menu').style.display = 'none';
    }
}

// Listen for keydown events
document.addEventListener('keydown', function (event) {
    // Left arrow key
    if (event.keyCode === 37) {
        moveLeft();
    }

    // Right arrow key
    if (event.keyCode === 39) {
        moveRight();
    }

    // Down arrow key
    if (event.keyCode === 40) {
        moveDown();
    }

    // Up arrow key
    if (event.keyCode === 38) {
        rotatePiece();
    }
});

startGame();