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
const PARTICLE_SIZE = screensize/100
const NUMBER_PARTICLES = 10000//screenheight*screenwidth/(2)
// width and height of the grid
const gridwidth = screenwidth/PARTICLE_SIZE
const gridheight = screenheight/PARTICLE_SIZE
// multipliers of particles' velocity
const SPEED = 0.5
// limits of the particles' world
const mind = 0
const maxd = 80
const minpos = 0
const maxpos = 500
// ...**** CONSTANTS ****

// **** WORLD ****...
class World {
    constructor(w, h) {
        this.w = w
        this.h = h 
        this.cells = new Array(w * h).fill(false)
    }

    get(row, col) {
        return this.cells[col + row * this.w]
    }

    set(value, row, col) {
        this.cells[col + row * this.w] = value
    }

    toString() {
        console.log(this.cells)
    }
}
// ...**** WORLD ****

// **** RULES ****...
function countNeighbors(rows, cols) {

    let n = 0
    
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            if (r*c != 1 && world.get(rows[r], cols[c])) {
                n += 1
            }
        }
    }
    return n

}

function changeState(irow, icol, env) {

    if (world.get(irow, icol) && (env == 2 || env == 3)) {
        nextWorld.set(true, irow, icol)
        console.log("particle [" + irow + ", " + icol + "] survived")
    } else if (world.get(irow, icol) && (env < 2)) {
        nextWorld.set(false, irow, icol)
        console.log("particle [" + irow + ", " + icol + "] died")
    } else if (world.get(irow, icol) && (env > 3)) {
        nextWorld.set(false, irow, icol)
        console.log("particle [" + irow + ", " + icol + "] died")
    } else if (!world.get(irow, icol) && (env == 3)) {
        nextWorld.set(true, irow, icol)
        console.log("particle [" + irow + ", " + icol + "] born")
    } else {
        nextWorld.set(world.get(irow, icol), irow, icol)
    }
}

function updateWorld() {
    let neighbors = 0

    
    for (let i = 0 ; i < gridheight; i++) {
        if (i == 0) {
            const indicesH = [gridwidth - 1, 0, 1]
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    const indicesW = [gridwidth - 1, 0, 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else if (j == gridwidth - 1) {
                    const indicesW = [gridwidth - 2, gridwidth - 1, 0]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else {
                    const indicesW = [j - 1, j, j + 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                }
                changeState(i, j, neighbors)
            }
        } else if (i == gridheight - 1) {
            const indicesH = [gridwidth - 2, gridwidth - 1, 0]
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    const indicesW = [gridwidth - 1, 0, 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else if (j == gridwidth - 1) {
                    const indicesW = [gridwidth - 2, gridwidth - 1, 0]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else {
                    const indicesW = [j - 1, j, j + 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                }
                changeState(i, j, neighbors)
            }
        } else {
            const indicesH = [i - 1, i, i +1]
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    const indicesW = [gridwidth - 1, 0, 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else if (j == gridwidth - 1) {
                    const indicesW = [gridwidth - 2, gridwidth - 1, 0]
                    neighbors = countNeighbors(indicesH, indicesW)
                } else {
                    const indicesW = [j - 1, j, j + 1]
                    neighbors = countNeighbors(indicesH, indicesW)
                }
                changeState(i, j, neighbors)
            }
        }
    }

    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            world.set(nextWorld.get(i, j), i, j)
        }
    }
}

// ...**** RULES ****

// **** SCREEN **** ...
// draw things on screen
draw = (grid) => {
    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            if (grid.get(i, j)) {
                m.fillStyle = "white";
                m.fillRect(j*screenwidth/gridwidth, i*screenheight/gridheight, PARTICLE_SIZE, PARTICLE_SIZE)
            }
        }
    }
}

drawRect = (x,y,c,s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

// update screen frame
update = () => {
    // **** RULES ****...
    reset(nextWorld)
    //randomSetter(nextWorld, NUMBER_PARTICLES)
    updateWorld()
    // ...**** RULES ****
    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
    
    
    requestAnimationFrame(update)
    
}
// ...**** SCREEN ****

// **** VARIOUS ****...
// redefine random function
random = () => {
    return Math.floor(Math.random()*gridwidth)
}

reset = (grid) => {
    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            grid.set(false, i, j)
        }
    }
}

randomSetter = (grid, number) => {
    for (let i = 0; i < number; i++) {
        grid.set(true, random(), random())
    }
}
// ...**** VARIOUS ****

// **** MAIN ****...
c = document.getElementById("life")
m = c.getContext('2d')
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
reset(world)
reset(nextWorld)
randomSetter(world, NUMBER_PARTICLES)
randomSetter(nextWorld, NUMBER_PARTICLES)
update()

// ...**** MAIN ****