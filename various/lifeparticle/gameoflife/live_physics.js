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
const SPEED = 0.5
// limits of the particles' world
const mind = 0
const maxd = 80
const minpos = 0
const maxpos = 500
// ...**** CONSTANTS ****


// **** PARTICLES ****...
// particle object
particle = (x,y,c,m,q) => {
    return{"x":x, "y":y, "vx":0, "vy":0, "color":c, "mass":m, "charge":q}
}

// create number of particles with a given color
create = (number, color, mass, charge) => {
    group = []
    for (let i =0; i < number; i++){
        group.push(particle(random(), random(), color, mass, charge))
        particles.push(group[i])
    }
        return group
}

rule = (particles1, particles2) => {

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
                F = 0.001 * a.mass * b.mass / d + a.charge * b.charge / d
                fx += (F * dx)
                fy += (F * dy)
            }
        }
        a.vx = (a.vx + fx/a.mass)*SPEED
        a.vy = (a.vy + fy/a.mass)*SPEED
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
    /*// ## EXAMPLE 1: subatomic
    rule(protons, protons)
    rule(electrons, electrons)
    rule(neutrons, neutrons)
    rule(protons, electrons)
    rule(electrons, protons)
    rule(neutrons, protons)
    rule(protons, neutrons)
    rule(neutrons, electrons)
    rule(electrons, neutrons)
    // EXAMPLE 1 ##*/
    // ## EXAMPLE 2: atomic
    rule(nuclei, nuclei)
    rule(nuclei, electrons)
    rule(electrons, electrons)
    rule(electrons, nuclei)
    // EXAMPLE 2 ##
    // ...**** RULES ****
    m.clearRect(0, 0, screenwidth, screenheight)
    draw(0, 0, "black", screensize)
    for (i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, PARTICLE_SIZE)
    }
    requestAnimationFrame(update)
}
// ...**** SCREEN ****1

// **** MAIN ****...
/*canva = document.createElement("canvas")
canva.id = "life"
canva.width = screenwidth
canva.height = screenheight*/
m = document.getElementById("life").getContext('2d')
particles = []
let numberOfParticles = 2
let numberOfAtoms = 100
let electronMass = 1
let protonMass = 1000 * electronMass
nuclei = create(numberOfAtoms, "yellow", numberOfParticles*protonMass, numberOfParticles)
electrons = create(numberOfParticles*numberOfAtoms, "green", electronMass, -1)
update()
// ...**** MAIN ****