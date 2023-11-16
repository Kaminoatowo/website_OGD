// **** CONSTANTS ****...
const SCREEN_W = 600
const SCREEN_H = 600

const W = 600
const H = 600
// ...**** CONSTANTS ****

// **** WORLD ****...
class World {
    constructor(w, h) {
        this.w = w
        this.h = h 
        this.cells = new Array(w * h).fill(false)
        this.set(true, 0, Math.floor(this.w/2))
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

// **** SCREEN ****...
function update() {
    for (let i = 0; i < W - 2; i++) {
        const w = [world.get(curRow - 1, i),
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
        }
    }
    curRow++
    console.log(curRow)
}

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

function drawCell(cell) {
    if (cell) {
        m.fillStyle = "red";
        m.fillRect(0, 0, SCREEN_H, SCREEN_W)
    } else {
        m.fillStyle = "green";
        m.fillRect(0, 0, SCREEN_H, SCREEN_W)
    }
}

setInterval(() => {
    m.clearRect(0, 0, SCREEN_W, SCREEN_H)
    update()
    draw()
}, 100);
// ...**** SCREEN ****

// **** MAIN ****...
screen = document.getElementById("life")
screen.width = SCREEN_W
screen.height = SCREEN_H
const m = screen.getContext('2d')
m.scale(SCREEN_W / W, SCREEN_H / H)
let world = new World(W, H)
let curRow = 1
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