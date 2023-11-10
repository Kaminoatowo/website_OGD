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
/*const PARTICLE_SIZE = screensize/100
const NUMBER_PARTICLES = 10000//screenheight*screenwidth/(2)*/
const PARTICLE_SIZE = screensize/10
const NUMBER_PARTICLES = 80
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
        this.numbers = new Array(this.w * this.h).fill(0)
    }

    get(row, col) {
        return this.cells[col + row * this.w]
    }

    set(value, row, col) {
        this.cells[col + row * this.w] = value
        this.numbers[col + row * this.w] =  value ? 1 : 0
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
        //console.log("particle [" + irow + ", " + icol + "] survived")
    } else if (world.get(irow, icol) && (env < 2)) {
        nextWorld.set(false, irow, icol)
        //console.log("particle [" + irow + ", " + icol + "] died")
    } else if (world.get(irow, icol) && (env > 3)) {
        nextWorld.set(false, irow, icol)
        //console.log("particle [" + irow + ", " + icol + "] died")
    } else if (!world.get(irow, icol) && (env == 3)) {
        nextWorld.set(true, irow, icol)
        //console.log("particle [" + irow + ", " + icol + "] born")
    } else {
        nextWorld.set(world.get(irow, icol), irow, icol)
    }
}

function convolveState(irow, icol, rows, cols) {
    let volume = []
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            volume.push(world.get(rows[r], cols[c]) ? 1 : 0)
        }
    }
    const convolved = (convolve(volume, kernel).reduce((a, b) => a + b, 0))/kernel_sum
    
    if (world.get(irow, icol) && (convolved == 2)) {
        nextWorld.set(true, irow, icol)
    } else if (!world.get(irow, icol) && (convolved == 3)) {
        nextWorld.set(true, irow, icol)
    } else {
        nextWorld.set(false, irow, icol)
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

function updateConvolution() {
    for (let i = 0; i < gridheight; i++) {
        if (i == 0) {
            const indicesH = [gridwidth - 1, 0, 1]
            let indicesW = []
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    indicesW = [gridwidth - 1, 0, 1]
                } else if (j == gridwidth - 1) {
                    indicesW = [gridwidth - 2, gridwidth - 1, 0]                    
                } else {
                    indicesW = [j - 1, j, j + 1]                    
                }
                convolveState(i, j, indicesH, indicesW)
            }
        } else if (i == gridheight - 1) {
            const indicesH = [gridwidth - 2, gridwidth - 1, 0]
            let indicesW = []
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    indicesW = [gridwidth - 1, 0, 1]                    
                } else if (j == gridwidth - 1) {
                    indicesW = [gridwidth - 2, gridwidth - 1, 0]                    
                } else {
                    indicesW = [j - 1, j, j + 1]                    
                }
                convolveState(i, j, indicesH, indicesW)
            }
        } else {
            const indicesH = [i - 1, i, i +1]
            let indicesW = []
            for (let j = 0 ; j < gridwidth; j++) {
                if (j == 0) {
                    indicesW = [gridwidth - 1, 0, 1]                    
                } else if (j == gridwidth - 1) {
                    indicesW = [gridwidth - 2, gridwidth - 1, 0]                    
                } else {
                    indicesW = [j - 1, j, j + 1]                    
                }
                convolveState(i, j, indicesH, indicesW)
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
    //updateWorld()
    updateConvolution()
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

// convolution function
const convolve = (vec1, vec2) => {
    if (vec1.length === 0 || vec2.length === 0) {
        throw new Error('Vectors must not be empty')
    }
    const volume = vec1
    const kernel = vec2
     /* Initialized to zero by default */
    const convVec = new Float32Array(volume.length + kernel.length);

    let i = 0;
    for (let j = 0; j < kernel.length; ++j) {
        convVec[j] = volume[i] * kernel[j];
    }

    for (i = 1; i < volume.length; ++i) {
        for (let j = 0; j < kernel.length; ++j) {
            convVec[i + j] += volume[i] * kernel[j];
        }
    }

    return convVec;
}
// ...**** VARIOUS ****

// **** MAIN ****...
// link to the canvas
c = document.getElementById("life")
m = c.getContext('2d')
// define kernel
const kernel = [1, 1, 1, 1, 0, 1, 1, 1, 1]
const kernel_sum = 8
// create the world
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
// initialize the world
reset(world)
reset(nextWorld)
// set the initial state
randomSetter(world, NUMBER_PARTICLES)
randomSetter(nextWorld, NUMBER_PARTICLES)
//console.log("world is initialized as ")
//world.toString()
// start the animation
update()
//updateConvolution()
//console.log("result of convolution is ")
//world.toString()
// TODO

// ...**** MAIN ****