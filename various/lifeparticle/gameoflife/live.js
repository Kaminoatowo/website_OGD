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
const SPEED = 0.3
// limits of the particles' world
const mind = 0
const maxd = 80
const minpos = 0
const maxpos = 500
// ...**** CONSTANTS ****


// **** PARTICLES ****...
// particle object
particle = (x,y,c) => {
    return{"x":x, "y":y, "vx":0, "vy":0, "color":c}
}

// create number of particles with a given color
create = (number, color) => {
    group = []
    for (let i = 0; i < number; i++){
        group.push(particle(random(), random(), color))
        /*for (let ix = minpos; ix < maxpos; ix++) {
            for (let iy = minpos; iy < maxpos; iy++) {
                group.push(particle(ix, iy, color))
            }    
        }*/
        
        particles.push(group[i])
    }
        return group
}

rule = (particles1, particles2, g) => {

    for (let i = 0; i < particles1.length; i++) {
        fx = 0
        fy = 0
        
        for (let j = 0; j < particles2.length; j++) {
            a = particles1[i]
            b = particles2[j]
            dx = a.x - b.x
            dy = a.y - b.y
            d = Math.sqrt(dx*dx + dy*dy)

            if (d > mind && d < maxd) {
                F = g * 1/d
                fx += (F * dx)
                fy += (F * dy)
            }
        }
        a.vx = (a.vx + fx)*SPEED
        a.vy = (a.vy + fy)*SPEED
        a.x += a.vx
        a.y += a.vy

        if (a.x <= minpos || a.x >= maxpos) { a.vx *= -1}
        if (a.y <= minpos || a.y >= maxpos) { a.vy *= -1}
    }
}
// ...**** PARTICLES ****

// **** VARIOUS ****...
// redefine random function
random = () => {
    return Math.random()*400+50
}
// ...**** VARIOUS ****

// **** SCREEN **** ...
// draw things on screen
draw = (x,y,c,s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

// update screen frame
update = () => {
    // **** RULES ****...
    /*// ## EXAMPLE 1
    rule(green, green, -0.7)
    rule(green, red, -0.2)
    rule(yellow, red, 0.01)
    rule(red, green, -0.1)
    rule(red, yellow, -0.01)
    rule(red, red, -0.1)
    // EXAMPLE 1 ##*/
    // ## EXAMPLE 2
    rule(green, green, -0.32)
    rule(green, yellow, 0.34)
    rule(green, red, -0.17)
    rule(green, purple, 0)
    rule(yellow, green, -0.20)
    rule(yellow, yellow, 0.15)
    rule(yellow, purple, -0.45)
    rule(red, green, -0.34)
    rule(red, red, -0.10)
    rule(red, purple, -0.67)
    rule(purple, green, -0.32)
    rule(purple, yellow, 0.46)
    // EXAMPLE 1 ##
    // ...**** RULES ****
    m.clearRect(0, 0, screenwidth, screenheight)
    draw(0, 0, "black", screensize)
    for (i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, PARTICLE_SIZE)
    }
    requestAnimationFrame(update)
}
// ...**** SCREEN ****

// **** MAIN ****...
/*canva = document.createElement("canvas")
canva.id = "life"
canva.width = screenwidth
canva.height = screenheight*/
m = document.getElementById("life").getContext('2d')
particles = []
yellow = create(200, "yellow")
red = create(200, "red")
green = create(200, "green")
purple = create(200, "purple")
update()
// ...**** MAIN ****