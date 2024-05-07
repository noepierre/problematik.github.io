const BOARD_SIZE = 9;
let board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function initializeBoard() {
    // Pas besoin d'initialiser la grille car elle est déjà remplie avec les numéros initiaux.
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
        return true;
    }

    let row = emptyCell[0];
    let col = emptyCell[1];

    for (let num = 1; num <= 9; num++) {
        if (isSafe(row, col, num)) {
            board[row][col] = num;

            if (solve()) {
                return true;
            }

            board[row][col] = 0; 
        }
    }

    return false;
}

function isValidBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] !== 0) {
                if (!isSafe(i, j, board[i][j])) {
                    return false;
                }
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
    return null;
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
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    renderBoard();
}

initializeBoard();
renderBoard();
