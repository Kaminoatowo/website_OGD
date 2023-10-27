// **** CONSTANTS ****...
// size of the grid
const ROWS = 38
const COLS = 100
// logic control of the game
let playing = false
// timer
let timer
const reproductionTime = 100
// ...**** CONSTANTS ****


// **** PARTICLES ****...
/*updateState = () => {
    for (let x = 1; x < state.__width - 1; x++) {
        for (let y = 1; y < state.__width - 1; y++) {
            let neighbors = 0
            for (let i = x - 1; i < x + 2; x++) {
                for (let j = y - 1; j < y + 2; y++) {
                    if (state.get(i,j) != 0) {neighbors += 1}
                }
            }
            if (state.get(x,y) != 0) {
                if (neighbors == 2 || neighbors == 3) {state.set(x, y, 1)}
            } else {
                if (neighbors == 3) {state.set(x, y, 1)}
            }
        }
    }
}*/

play = () => {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime)
    }
}

computeNextGen = () => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            applyRules(i, j)
        }
    }

    copyAndResetGrid()
    updateView()
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

applyRules = (row, col) => {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }
    
countNeighbors = (row, col) => {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

// ...**** PARTICLES ****

// **** VARIOUS ****...

// ...**** VARIOUS ****

// **** TABLE **** ...
let grid = new Array(ROWS)
let nextGrid = new Array(ROWS)

initializeGrids = () => {
    for (let i = 0; i < ROWS; i++) {
        grid[i] = new Array(COLS)
        nextGrid[i] = new Array(COLS)
    }
}

resetGrids = () => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = 0
            nextGrid[i][j] = 0
        }
    }
}

copyAndResetGrid = () => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = nextGrid[i][j]
            nextGrid[i][j] = 0
        }
    }
}

initialize = () => {
    createTable()
    initializeGrids()
    resetGrids()
    setupControlButtons()
}

createTable = () => {
    let gridContainer = document.getElementById('gridContainer')
    if (!gridContainer) {
        console.error("Problem: No div for the grid table!")
    }
    let table = document.createElement("table")

    for (let i = 0; i < ROWS; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < COLS; j++) {
            let cell = document.createElement("td")

            cell.setAttribute("id", i + "_" + j)
            cell.setAttribute("class", "dead")
            cell.onclick = cellClickHandler

            tr.appendChild(cell)
        }
        table.appendChild(tr)
    }
    gridContainer.appendChild(table)
}

cellClickHandler = () => {
    let rowcol = this.IdleDeadline.split("_")
    let row = rowcol[0]
    let col = rowcol[1]

    let classes = this.getAttribute("class")

    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead")
        grid[row][col] = 0
    } else {
        this.setAttribute("class", "alive")
        grid[row][col] = 1
    }
}

updateView = () => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < ROWS; j++) {
            let cell = document.getElementById(i + "_" + j)

            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead")
            } else {
                cell.setAttribute("class", "alive")
            }
        }    
    }
}

clearButtonHandler = () => {
    console.log("Clear the game: stop playing, clear the grid")

    playing = false
    let startButton = document.getElementById('start')
    startButton.innerHTML = "Start"
    clearTimeout(timer)

    
    var cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
}

// start/pause/continue the game
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

// ...**** TABLE ****

// **** MAIN ****...

// Start everything
window.onload = initialize;

// ...**** MAIN ****