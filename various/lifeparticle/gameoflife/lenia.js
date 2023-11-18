// **** CONSTANTS ****...
// size of the canvas square
const screensize = 500
// upper-left coordinates of the canvas 
const upperleftx = 0
const upperlefty = 0
// width and height of the screen
const screenwidth = screensize
const screenheight = screensize
// number of states
const STATES = 12
// size of particles 
/*const PARTICLE_SIZE = screensize/100
const NUMBER_PARTICLES = 10000//screenheight*screenwidth/(2)*/
const CELLS_ROW = 100
const PARTICLE_SIZE = screensize/CELLS_ROW
const NUMBER_PARTICLES = CELLS_ROW*CELLS_ROW
// width and height of the grid
const gridwidth = screenwidth/PARTICLE_SIZE
const gridheight = screenheight/PARTICLE_SIZE
// multipliers of particles' velocity
// ...**** CONSTANTS ****

// **** WORLD ****...
class World {
    constructor(w, h) {
        this.w = w
        this.h = h 
        this.cells = new Array(w * h).fill(0)
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
    
    let growth = (wrapWorld.get(irow + 1, icol + 1)) + grow(env)
    //console.log(growth)
    let clipped = clip(growth, 0, STATES)
    //console.log(clipped)
    nextWorld.set(clipped, irow, icol)
    //console.log(nextWorld.get(irow, icol))
}

function convolveState(irow, icol, rows, cols) {
    let volume = []
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            volume.push(wrapWorld.get(rows[r], cols[c]))
        }
    }
    
    const convolved = (convolve2(volume, kernel).reduce((a, b) => a + b, 0))
    changeState(irow, icol, convolved)
}

function updateWorld() {
    wrapWorld = makeWrap(world)

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
                m.fillStyle = 'rgb(255, 255, 255, ' + grid.get(i, j)/STATES + ')';
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
    step() 
    requestAnimationFrame(update)
}

step = () => {
    updateWorld()
    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
    
    //world.toString()
}

initialize = () => {
    reset(world)
    reset(nextWorld)
    // set the initial state
    randomSetter(world, NUMBER_PARTICLES)
    

    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
}

// ...**** SCREEN ****

// **** VARIOUS ****...
// redefine random function
random = (max) => {
    return Math.floor(Math.random()*max)
}

reset = (grid) => {
    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            grid.set(0, i, j)
        }
    }
}

randomSetter = (grid, number) => {
    for (let i = 0; i < number+1; i++) {
        grid.set(random(STATES+1), random(gridheight), random(gridwidth))
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
    //return 0 + (conv == 3 ? 1 : 0) - ((conv < 2 || conv > 3) ? 1 : 0)
    return 0 + ((conv >= 20 && conv <= 24) ? 1 : 0) - ((conv <= 18 || conv >= 32) ? 1 : 0)
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
const kernel_sum = kernel.reduce((a, b) => a + b, 0) * STATES
// create the world
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
let wrapWorld = makeWrap(world)
// initialize the world
// start the animation
initialize()
world.toString()
document.getElementById("step").onclick = function(){step()}
document.getElementById("start").onclick = function(){update()}
document.getElementById("reset").onclick = function(){initialize()}
// TODO

// ...**** MAIN ****