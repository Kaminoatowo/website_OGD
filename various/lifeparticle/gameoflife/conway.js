// **** CONSTANTS ****...
// size of the canvas square
const screensize = 500
// upper-left coordinates of the canvas 
const upperleftx = 0
const upperlefty = 0
// width and height of the screen
const screenwidth = screensize
const screenheight = screensize
// size of particles
const PARTICLE_SIZE = 5
// multipliers of particles' velocity
const SPEED = 0.5
// limits of the particles' world
const mind = 0
const maxd = 80
const minpos = 0
const maxpos = 500
// timer
let timer
const reproductionTime = 100
// ...**** CONSTANTS ****


// **** PARTICLES ****...
particle = (x,y,c) => {
    return{"x":x, "y":y, "color":c}
}

// create number of particles with a given color
create = (number, color) => {
    group = []
    for (let i = 0; i < number; i++){
        for (let xi = 0; xi < maxpos; xi++){
            for (let yi = 0; yi < maxpos; yi++){
                group.push(particle(xi, yi, color))
            }
        }
        //group.push(particle(i, i, color))
        
        particles.push(group[i])
    }
        return group
}
/*
computeNextGen = () => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            applyRules(i, j)
        }
    }

    copyAndResetGrid()
    updateView()
}*/

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

/*applyRules = (row, col) => {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1
            }
        }
    }
}*/

/*countNeighbors = (row, col) => {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++
    }
    if (row-1 >= 0 && col+1 < COLS) {
        if (grid[row-1][col+1] == 1) count++
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++
    }
    if (col+1 < COLS) {
        if (grid[row][col+1] == 1) count++
    }
    if (row+1 < ROWS) {
        if (grid[row+1][col] == 1) count++
    }
    if (row+1 < ROWS && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++
    }
    if (row+1 < ROWS && col+1 < COLS) {
        if (grid[row+1][col+1] == 1) count++
    }
    return count;
}*/

// ...**** PARTICLES ****

// **** VARIOUS ****...

// ...**** VARIOUS ****

// **** TABLE **** ...
// draw things on screen
draw = (x,y,c,s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

update = () => {
    m.clearRect(0, 0, screenwidth, screenheight)
    draw(0, 0, "black", screensize)
    for (i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, PARTICLE_SIZE)
    }
    requestAnimationFrame(update)
}
/*
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
}*/

// ...**** TABLE ****

// **** MAIN ****...
/*let grid = new Array(ROWS)
let nextGrid = new Array(ROWS)*/

m = document.getElementById("life").getContext('2d')
particles = []
particles = create(500, "yellow")
update()
// ...**** MAIN ****