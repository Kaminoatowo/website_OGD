// **** CONSTANTS ****...
const SCREEN_W = 100
const SCREEN_H = 100

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
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++){
            let neighbors = countNeighbors(i, j)
            console.log(neighbors)
        }
        /*const w = [world.get(curRow - 1, i),
            world.get(curRow - 1, i+1),
            world.get(curRow - 1, i+2)]
        
        //world.set(rules.get(w), curRow, i + 1)
        //console.log(w)
        if (w[0] == false && w[1] == false && w[2] == false) {
            world.set(false, curRow, i + 1)
        } else if (w[0] == true && w[1] == true && w[2] == true) {
            world.set(false, curRow, i + 1)
        } else if (w[0] == true && w[1] == true && w[2] == false) {
            world.set(false, curRow, i + 1)
        } else if (w[0] == true && w[1] == false && w[2] == true) {
            world.set(false, curRow, i + 1)
        } else {
            world.set(true, curRow, i + 1)
        }*/
    }
    //curRow++
}

// ...**** RULES ****

// **** SCREEN ****...
function draw() {
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (world.get(i, j)) {
                m.fillStyle = "red";
                m.fillRect(j, i, 1, 1)
            }
        }
    }
}

setInterval(() => {
    m.clearRect(0, 0, SCREEN_W, SCREEN_H)
    update()
    draw()
}, 100);
// ...**** SCREEN ****

// **** VARIOUS ****...
// redefine random function
random = () => {
    return Math.floor(Math.random()*SCREEN_W)
}

randomSetter = (grid, number) => {
    for (let i = 0; i < number; i++) {
        grid.set(true, random(), random())
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
randomSetter(world, 100)

const rules = new Map()

// **** RULES ****...
rules.set([false, false, false], false)
rules.set([false, false, true], true)
rules.set([false, true, false], true)
rules.set([false, true, true], true)
rules.set([true, false, true], true)
rules.set([true, true, false], true)
rules.set([true, false, false], true)
rules.set([true, true, true], false)
// ...**** RULES ****
// ...**** MAIN ****