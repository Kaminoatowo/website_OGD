// **** CONSTANTS ****...
const SCREEN_W = 600
const SCREEN_H = 600

const W = 50
const H = 50
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
function countNeighborsColumns(row, col) {
    let counted = 0
    if (col == 0) {
        for (let icol = 0; icol < 2; icol++) {
            counted += world.get(row, col + icol)
        }
    } else if (col == H-1) {
        for (let icol = -1; icol < 1; icol++) {
            counted += world.get(row, col + icol)
        }
    } else {
        for (let icol = -1; icol < 2; icol++) {
            counted += world.get(row, col + icol)
        }
    }
    return counted
}

function countNeighbors(row, col) {
    let counted = 0
    if (row == 0) {
        for (let irow = 0; irow < 2; irow++) {
            counted = countNeighborsColumns(row + irow, col)
        }
    } else if (row == W-1) {
        for (let irow = -1; irow < 1; irow++) {
            counted = countNeighborsColumns(row + irow, col)
        }
    } else {
        for (let irow = -1; irow < 1; irow++) {
            counted = countNeighborsColumns(row + irow, col)
        }
    }
    return counted
}

function update() {
    console.log("updating...")
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++){
            let neighbors = countNeighbors(i, j)
            if (world.get(i, j) && (neighbors == 2 || neighbors == 3)) {
                nextWorld.set(true, i, j)
            } else if (!world.get(i, j) && (neighbors == 3)) {
                nextWorld.set(true, i, j)
            } else {
                nextWorld.set(false, i, j)
            }
        }
    }
}

// ...**** RULES ****

// **** SCREEN ****...
function draw() {
    console.log("drawing...")
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (world.get(i, j)) {
                m.fillStyle = "red";
                m.fillRect(j, i, 1, 1)
            }
        }
    }
}

updateWorld = () => {
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            world.set(nextWorld.get(i, j), i, j)
        }    
    }
}

setInterval(() => {
    m.clearRect(0, 0, SCREEN_W, SCREEN_H)
    update()
    //updateWorld()
    draw()
}, 1000);
// ...**** SCREEN ****

// **** VARIOUS ****...
// redefine random function
random = () => {
    return Math.floor(Math.random()*SCREEN_W)
}

randomSetter = (number) => {
    for (let i = 0; i < number; i++) {
        world.set(true, random(), random())
    }
}
// ...**** VARIOUS ****

// **** MAIN ****...
screen = document.getElementById("life")
screen.width = SCREEN_W
screen.height = SCREEN_H
const m = screen.getContext('2d')
m.scale(SCREEN_W / W, SCREEN_H / H)
let world = new World(W, H)
let nextWorld = new World(W, H)
//randomSetter(SCREEN_H*SCREEN_W/20)
randomSetter(10)
//const rules = new Map()

// ...**** MAIN ****