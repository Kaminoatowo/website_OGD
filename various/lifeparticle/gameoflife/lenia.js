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
const UPDATE_FREQUENCY = 10
const KERNEL_RADIUS = 5
// size of particles 
/*const PARTICLE_SIZE = screensize/100
const NUMBER_PARTICLES = 10000//screenheight*screenwidth/(2)*/
const CELLS_ROW = 50
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
    let wrapGrid = new World(3*gridwidth, 3*gridheight)

    for (let i = 0; i < gridheight; i++) {
        for (let j = 0; j < gridwidth; j++) {
            for (let k = 0; k < 3; k++){
                for (let l = 0; l < 3; l++){
                    wrapGrid.set(grid.get(i, j), i + k*gridheight, j + l*gridwidth)
                }
            }
        }
    }
    return wrapGrid
}
// ...**** WORLD ****

// **** RULES ****...

function changeState(irow, icol, env) {
    
    let growth = (wrapWorld.get(irow + gridheight, icol + gridwidth)) + grow(env) / UPDATE_FREQUENCY
    //console.log(growth)
    let clipped = clip(growth, 0.0, 1.0)
    //console.log(clipped)
    nextWorld.set(clipped, irow, icol)
    //console.log(nextWorld.get(irow, icol))
}

function convolveState(irow, icol) {
    let volume = []
    for (let r = -KERNEL_RADIUS ; r < KERNEL_RADIUS; r++) {
        for (let c = -KERNEL_RADIUS; c < KERNEL_RADIUS; c++) {
            volume.push(wrapWorld.get(irow + r + gridheight, icol + c + gridwidth))
        }
    }
    
    const convolved = (convolve2(volume, kernel).reduce((a, b) => a + b, 0))
    changeState(irow, icol, convolved)
}

function updateWorld() {
    wrapWorld = makeWrap(world)
    //wrapWorld.toString()

    for (let i = 0 ; i < gridheight; i++) {
        for (let j = 0 ; j < gridwidth; j++) {
            convolveState(i, j)
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
    /*world.set(12, 0, 0)
    world.set(5, 0, 1)
    world.set(0, 0, 2)
    world.set(3, 0, 3)
    world.set(11, 0, 4)
    //-----------------
    world.set(3, 1, 0)
    world.set(7, 1, 1)
    world.set(9, 1, 2)
    world.set(3, 1, 3)
    world.set(5, 1, 4)
    //-----------------
    world.set(2, 2, 0)
    world.set(4, 2, 1)
    world.set(7, 2, 2)
    world.set(6, 2, 3)
    world.set(8, 2, 4)
    //-----------------
    world.set(8, 3, 0)
    world.set(12, 3, 1)
    world.set(10, 3, 2)
    world.set(1, 3, 3)
    world.set(6, 3, 4)
    //-----------------
    world.set(7, 4, 0)
    world.set(7, 4, 1)
    world.set(8, 4, 2)
    world.set(1, 4, 3)
    world.set(5, 4, 4)*/

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
        grid.set(Math.random(), random(gridheight), random(gridwidth))
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
    //return 0 + ((conv >= 20 && conv <= 24) ? 1 : 0) - ((conv <= 18 || conv >= 32) ? 1 : 0)
    //return 0 + ((conv >= 0.20 && conv <= 0.25) ? 1 : 0) - ((conv <= 0.18 || conv >= 0.33) ? 1 : 0)
    return 0 + ((conv >= 0.12 && conv <= 0.15) ? 1 : 0) - ((conv <= 0.12 || conv >= 0.15) ? 1 : 0)
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
/*let kernel =   [0, 1, 1, 1, 0,
                1, 0, 0, 0, 1,
                1, 0, 0, 0, 1,
                1, 0, 0, 0, 1,
                0, 1, 1, 1, 0]*/
/*let kernel =   [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
                1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
                1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]*/
let kernel =   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
const kernel_sum = kernel.reduce((a, b) => a + b, 0) //* STATES
kernel = kernel.map(x => x / kernel_sum)
// create the world
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
let wrapWorld = makeWrap(world)
// initialize the world
// start the animation
initialize()
//world.toString()
document.getElementById("step").onclick = function(){step()}
document.getElementById("start").onclick = function(){update()}
document.getElementById("reset").onclick = function(){initialize()}
// TODO

// ...**** MAIN ****