const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const lineElement = document.getElementById("lines");
const timeElement = document.getElementById("time");
const startButton = document.getElementById("start");
const difSelector = document.getElementById('difficulty');

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";

let score = 0;
let multiplier = 1;
let lines = 0;
let dateStart;
let dropStart = Date.now();
let gameStart = Date.now();
let gameOver = false;
let game = false;
let board = [];
let timer;
let continueGame = true;

const difficulty = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
}

document.addEventListener("keydown", CONTROL);

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

const PIECES = [
    [I, "yellow"],
    [J, "yellow"],
    [L, "yellow"],
    [O, "yellow"],
    [T, "yellow"],
    [U, "yellow"],
    [dot, "yellow"]
];

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }

}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }

            if (this.y + r < 0) {
                window.location.href = window.location.href.replace("new-game.html", "ranking.html");
                gameOver = true;
                break;
            }

            board[this.y + r][this.x + c] = this.color;
        }
    }

    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }

            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }

            score += 10 * multiplier;
            lines += 1;
            multiplier = multiplier + 1;
        }
    }

    drawBoard();

    scoreElement.innerHTML = score;
    lineElement.innerHTML = lines;
}

Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }

            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

function drop() {
    if (!game)
        return;

    let now = Date.now();
    let delta = now - dropStart;
    let interval;
    multiplier = 1;

    switch (difSelector.value) {
        case difficulty.EASY:
            interval = 2000;
            break;
        case difficulty.MEDIUM:
            interval = 1000;
            break;
        case difficulty.HARD:
            interval = 500;
            break;
        default:
            interval = 2000;
    }

    if ((delta > interval - score) && continueGame ) {
        p.moveDown();
        dropStart = Date.now();
    }

    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

function handleStart() {
    if (!game) {
        startButton.innerHTML = "Parar";
        game = true;
        dropStart = Date.now();
        dateStart = Date.now();
        timer = setInterval(gameTime, 1000);
        drop();
    } else {
        clearInterval(timer);
        score = 0;
        lines = 0;
        dropStart = Date.now();
        gameStart = Date.now();
        gameOver = false;
        game = false;
        drawBoard();
        p.unDraw();
        p = randomPiece();
        timeElement.innerHTML = '00:00';
        startButton.innerHTML = "Iniciar";
    }
}

function handleStop() {
    continueGame = !continueGame;

    let continueButton = document.getElementById('pause');

    console.log(continueButton);

    if(!continueGame) {
        continueButton.innerHTML = 'Continuar';
    } else {
        continueButton.innerHTML = 'Pausar';
    }
}

function gameTime() {
    let days, hours, minutes, seconds;
    let timeSpent = parseInt((dropStart - dateStart) / 1000);

    if (timeSpent >= 0) {
        days = parseInt(timeSpent / 86400);
        timeSpent = (timeSpent % 86400);
        hours = parseInt(timeSpent / 3600);
        timeSpent = (timeSpent % 3600);
        minutes = parseInt(timeSpent / 60);
        timeSpent = (timeSpent % 60);
        seconds = parseInt(timeSpent);

        let time = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2);
        timeElement.innerHTML = time;
    }
}

function openEndGame() {
    varWindow = window.open('endgame.html')
}