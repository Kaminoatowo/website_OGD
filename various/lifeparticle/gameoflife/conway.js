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
const PARTICLE_SIZE = screensize/100
const NUMBER_PARTICLES = 800
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

const makeWrap = (grid) => {
    let wrapGrid = new World(gridwidth + 2, gridheight + 2)

    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            wrapGrid.set(grid.get(i, j), i + 1, j + 1)
        }
    }
    for (let i = 0; i < gridheight; i++) {
        wrapGrid.set(grid.get(i, gridwidth - 1), i + 1, 0)
        wrapGrid.set(grid.get(i, 0), i + 1, gridwidth + 1)
    }
    for (let j = 0; j < gridwidth; j++) {
        wrapGrid.set(grid.get(gridheight - 1, j), 0, j + 1)
        wrapGrid.set(grid.get(0, j), gridheight + 1, j + 1)
    }
    wrapGrid.set(grid.get(gridheight - 1, gridwidth - 1), 0, 0)
    wrapGrid.set(grid.get(gridheight - 1, 0), 0, gridwidth + 1)
    wrapGrid.set(grid.get(0, gridwidth - 1), gridheight + 1, 0)
    wrapGrid.set(grid.get(0, 0), gridheight + 1, gridwidth + 1)
    return wrapGrid
}
// ...**** WORLD ****

// **** RULES ****...

function changeState(irow, icol, env) {

    /*if ((wrapWorld.get(irow + 1, icol + 1) && (env == 2)) || (env == 3)) {
        nextWorld.set(true, irow, icol)
    } else {
        nextWorld.set(false, irow, icol)
    }*/
    
    let growth = (wrapWorld.get(irow + 1, icol + 1) ? 1 : 0) + grow(env)
    let clipped = clip(growth, 0, 1)
    /*console.log("row: " + irow + " col: " + icol)
    console.log("env: " + env +  " grow: " + grow(env))
    console.log("W[" + irow + "][" + icol + "]: " + (wrapWorld.get(irow + 1, icol + 1) ? 1 : 0) + " + grow: " + growth)
    console.log("clip(W[i][j] + grow): " + clipped)*/
    nextWorld.set(clipped, irow, icol)
}

function convolveState(irow, icol, rows, cols) {
    let volume = []
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            volume.push(wrapWorld.get(rows[r], cols[c]) ? 1 : 0)
        }
    }
    //console.log(volume)
    
    const convolved = (convolve2(volume, kernel).reduce((a, b) => a + b, 0))///kernel_sum
    //console.log("row: " + irow + " col: " + icol + " -> " + convolved)
    changeState(irow, icol, convolved)
}

function updateWorld() {
    let neighbors = 0

    wrapWorld = makeWrap(world)
    //wrapWorld.toString()

    for (let i = 0 ; i < gridheight; i++) {
        const indicesH = [i, i + 1 , i + 2]
        for (let j = 0 ; j < gridwidth; j++) {
            const indicesW = [j, j + 1, j + 2]
            
            convolveState(i, j, indicesH, indicesW)
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
    updateWorld()
    // ...**** RULES ****
    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
    //updateWorld()
    //world.toString()
    requestAnimationFrame(update)
}

initialize = () => {
    reset(world)
    reset(nextWorld)
    // set the initial state
    randomSetter(world, NUMBER_PARTICLES)
    /*world.set(true, 2, 1)
    world.set(true, 2, 2)
    world.set(true, 2, 3)*/

    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
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
const convolve2 = (vec1, vec2) => {
    if (vec1.length === 0 || vec2.length === 0) {
        throw new Error('Vectors must not be empty')
    }
    const volume = vec1
    const kernel = vec2
     /* Initialized to zero by default */
    const convVec = new Float32Array(volume.length);

    for (i = 0; i < volume.length; ++i) {
        convVec[i] = volume[i] * kernel[i];
    }

    return convVec;
}

// growth function
const grow = (conv) => {
    return 0 + (conv == 3 ? 1 : 0) - ((conv < 2 || conv > 3) ? 1 : 0)
}

// clip function
const clip = (value, min, max) => {
    return Math.min(Math.max(value, min), max)
}
// ...**** VARIOUS ****

// **** MAIN ****...
// link to the canvas
c = document.getElementById("life")
m = c.getContext('2d')
// define kernel
const kernel = [1, 1, 1, 1, 0, 1, 1, 1, 1]
const kernel_sum = kernel.reduce((a, b) => a + b, 0)
// create the world
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
let wrapWorld = makeWrap(world)
// initialize the world
// start the animation
initialize()
document.getElementById("start").onclick = function(){update()}
document.getElementById("reset").onclick = function(){initialize()}
// TODO

// ...**** MAIN ****