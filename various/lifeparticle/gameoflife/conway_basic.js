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
function countNeighbors(rows, cols) {

    let n = 0
    
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            if (r*c != 1 && wrapWorld.get(rows[r], cols[c])) {
                n += 1
            }
        }
    }
    return n
}

function changeState(irow, icol, env) {

    if ((wrapWorld.get(irow + 1, icol + 1) && (env == 2)) || (env == 3)) {
        nextWorld.set(true, irow, icol)
    } else {
        nextWorld.set(false, irow, icol)
    }
}

function updateWorld() {
    let neighbors = 0

    wrapWorld = makeWrap(world)
    wrapWorld.toString()

    for (let i = 0 ; i < gridheight; i++) {
        const indicesH = [i, i + 1 , i + 2]
        for (let j = 0 ; j < gridwidth; j++) {
            const indicesW = [j, j + 1, j + 2]
            
            neighbors = countNeighbors(indicesH, indicesW)
            changeState(i, j, neighbors)
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
    //updateWorld()
    // ...**** RULES ****
    m.clearRect(0, 0, screenwidth, screenheight)
    drawRect(0, 0, "black", screensize)
    
    draw(world)
    updateWorld()
    world.toString()
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
// link to the canvas
c = document.getElementById("life")
m = c.getContext('2d')
// create the world
let world = new World(gridwidth, gridheight)
let nextWorld = new World(gridwidth, gridheight)
let wrapWorld = makeWrap(world)
// initialize the world
reset(world)
reset(nextWorld)
// set the initial state
randomSetter(world, NUMBER_PARTICLES)
// start the animation
update()
// TODO

// ...**** MAIN ****