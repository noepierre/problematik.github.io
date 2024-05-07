const BOARD_SIZE = 9;
let board = [];

function initializeBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i].push(0);
        }
    }
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const square = document.createElement("div");
            square.className = "square";
            square.textContent = board[i][j] === 0 ? "" : board[i][j];
            square.contentEditable = true;
            square.addEventListener("input", () => {
                const value = parseInt(square.textContent) || 0;
                if (value >= 0 && value <= 9) {
                    board[i][j] = value;
                } else {
                    square.textContent = "";
                    board[i][j] = 0;
                }
            });
            boardDiv.appendChild(square);
        }
    }
}

function solveSudoku() {
    if (isValidBoard()) {
        if (solve()) {
            renderBoard();
        } else {
            alert("No solution exists!");
        }
    } else {
        alert("Invalid Sudoku board!");
    }
}

function solve() {
    let emptyCell = findEmptyCell();
    if (!emptyCell) {
        return true; // Sudoku solved
    }

    let row = emptyCell[0];
    let col = emptyCell[1];

    for (let num = 1; num <= 9; num++) {
        if (isSafe(row, col, num)) {
            board[row][col] = num;

            if (solve()) {
                return true;
            }

            board[row][col] = 0; // backtrack
        }
    }

    return false; // Trigger backtracking
}

function isValidBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] !== 0 && !isSafe(i, j, board[i][j])) {
                return false;
            }
        }
    }
    return true;
}

function findEmptyCell() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null; // No empty cell found
}

function isSafe(row, col, num) {
    return (
        isSafeInRow(row, num) &&
        isSafeInColumn(col, num) &&
        isSafeInBox(row - row % 3, col - col % 3, num)
    );
}

function isSafeInRow(row, num) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[row][i] === num) {
            return false;
        }
    }
    return true;
}

function isSafeInColumn(col, num) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[i][col] === num) {
            return false;
        }
    }
    return true;
}

function isSafeInBox(startRow, startCol, num) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row + startRow][col + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function resetBoard() {
    board = [];
    initializeBoard();
    renderBoard();
}

initializeBoard();
renderBoard();
