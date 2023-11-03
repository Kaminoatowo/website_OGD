const rows = 50
const cols = 50

const grid = new Array(rows).fill(null).map(() 
    => new Array(cols).fill(false))

function initializeGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.2
        }   
    }
}

function nextGeneration() {
    const newGrid = new Array(rows).fill(null).map(() 
        => new Array(cols).fill(false))

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j]
            const neighbors = countNeighbors(i, j)

            if (cell) {
                newGrid[i][j] = neighbors === 2 || neighbors === 3
            } else {
                newGrid[i][j] = neighbors === 3
            }
        }   
    }    

    grid = newGrid
}

function countNeighbors(x, y) {
    let count = 0
    for (let i = -1; i < 1; i++) {
        for (let j = -1; j < 1; j++) {
            const newX = x + i
            const newY = y + i

            if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
                if (i !== 0 || j !== 0) {
                    count += grid[newX][newY] ? 1 : 0
                }
            }
        }   
    } 
    return count
}

function displayGrid() {
    const gridContainer = document.getElementById("grid-container")
    gridContainer.inerHTML = ""
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div")
            cell.className = grid[i][j] ? "cell alive" : "cell dead"
            gridContainer.appendChild(cell)
        }
    }
}

initializeGrid()
setInterval(() => {
    displayGrid()
    nextGeneration()
}, 100)