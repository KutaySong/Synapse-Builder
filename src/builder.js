
let scale = 40
let neurons = []

let mouse = { touching: -1, full: false, clicked: -1, fullclicked: false, endundefinedlananAn: 0 }
let inAnimation = { ways: [], spawned: [], emitting: [] }

const drawOptions = { radius: 30 }

function setup() {
    createCanvas(innerWidth - 20, innerHeight - 22);
    colorMode(HSB);
    textSize(scale * 2 / 3);
    stroke("white")
    strokeWeight(4)
    noFill()

    neurons.push(new Neuron(0.426, 0.647))
    neurons.push(new Neuron(0.554, 0.284))
    neurons.push(new Neuron(0.369, 0.119))
    neurons.push(new Neuron(0.117, 0.384))
    neurons.push(new Neuron(0.567, 0.909))
    neurons.push(new Neuron(0.767, 0.100))
    connect(0, 1)
    connect(1, 2)
    connect(2, 3)
    connect(3, 0)
    connect(4, 0)
    connect(4, 1)
    connect(4, 3)
    connect(5, 1)
}

function draw() {
    background(0)
    if (frameCount < 300) writeNote()
    if (mouseIsPressed || touches.length) findCursor()
    drawSynapse()
    drawNeurons()
    refreshAnimation()
    decreaseFatigue()
}

function doubleClicked() {
    if (neurons.every(kn => dist(mouseX, mouseY, kn.x, kn.y) > 3 * drawOptions.radius))
        neurons.push(new Neuron())
    else {
        const nth = neurons.findIndex(kn => dist(mouseX, mouseY, kn.x, kn.y) < drawOptions.radius)
        if (nth != -1) eraseNeuron(nth)
    }
}
function eraseNeuron(thisOneID) {
    neurons.splice(thisOneID, 1)
    for (let kn of neurons) {
        kn.dendride = kn.dendride.filter(p => p != thisOneID).map(p => p > thisOneID ? p - 1 : p)
        kn.axon = kn.axon.filter(p => p != thisOneID).map(p => p > thisOneID ? p - 1 : p)
        kn.ID = kn.ID > thisOneID ? kn.ID - 1 : kn.ID
    }
    mouse = { touching: -1, full: false, clicked: -1, fullclicked: false, endundefinedlananAn: 0 }
}

function mousePressed() { tickİndi() }
function mouseReleased() { tickKalktı() }

function touchStarted() { tickİndi() }
function touchEnded() { tickKalktı() }


function tickİndi() {
    findCursor()
    neurons.map(k => k.colour = [300, 0, 100]) // allni beyazla
    if (mouse.touching > -1) {
        mouse.clicked = mouse.touching
        mouse.fullclicked = mouse.full
        mouse.clickednınXY = [neurons[mouse.touching].x, neurons[mouse.touching].y]
        mouse.endKonum = [mouseX, mouseY]
        mouse.endundefinedlananAn = frameCount
        neurons[mouse.touching].colour = [300, 100, 100] // mor
    }
}
function tickKalktı() {
    // neuron should not be placed on other neuron
    if (!!mouse.endKonum && mouse.clicked > -1 && neurons.filter(kn => kn.ID != mouse.clicked).some(kn => dist(neurons[mouse.clicked].x, neurons[mouse.clicked].y, kn.x, kn.y) < 3 * drawOptions.radius)) {
        neurons[mouse.clicked].x = mouse.clickednınXY[0]
        neurons[mouse.clicked].y = mouse.clickednınXY[1]
    }
    if (mouse.touching != mouse.clicked && mouse.touching > -1 && !mouse.fullclicked) {
        connect(mouse.clicked, mouse.touching)
    } else if (mouse.touching > -1 && frameCount - mouse.endundefinedlananAn > 5 && mouse.endKonum[0]==mouseX && mouse.endKonum[1]==mouseY)
        igniteSignal()
    mouse.clicked = -1;
}



class Neuron {
    constructor(x = mouseX / innerWidth, y = mouseY / innerHeight) {
        this.ID = neurons.length
        this.colorID = neurons.length
        this.x = ~~(x * innerWidth)
        this.y = ~~(y * innerHeight)
        this.r = 1
        this.colour = [300, 0, 100]
        this.axon = []
        this.dendride = []
        this.letter = String.fromCharCode(neurons.length + 97)
        this.tired = 100
        inAnimation.spawned.push(this.ID)
    }
}


function drawNeurons() {
    neurons.map(k => {
        stroke(...k.colour)
        fill(0)
        ellipse(k.x, k.y, k.r, k.r)
    })
}

function drawSynapse() {
    neurons.map(k => {
        stroke((260 + k.colorID * 110) % 360, 80, 100, .75)
        k.axon.map(ak => drawArrow(k.ID, ak))
    })
}

function findCursor() {
    if (mouseX > width || mouseY > height) return mouse
    mouse.touching = -1
    for (let ki = 0; ki < neurons.length; ki++) {
        if (dist(mouseX, mouseY, neurons[ki].x, neurons[ki].y) < 3 * drawOptions.radius) {
            mouse.touching = ki
            mouse.full = dist(mouseX, mouseY, neurons[ki].x, neurons[ki].y) < .5 * drawOptions.radius
            break
        }
    }
    return mouse
}

function connect(fromThis, toThat) {
    const isDefined = neurons[fromThis].axon.indexOf(toThat)
    if (isDefined != -1) return eraseConnection(fromThis, toThat)

    const antiExists = neurons[toThat].axon.indexOf(fromThis)
    if (antiExists != -1) return eraseConnection(toThat, fromThis)

    neurons[fromThis].axon.push(toThat)
    neurons[toThat].dendride.push(fromThis)
}
function eraseConnection(fromThis, toThat) {
    neurons[fromThis].axon.splice(neurons[fromThis].axon.indexOf(toThat), 1)
    neurons[fromThis].dendride.splice(neurons[toThat].dendride.indexOf(fromThis), 1)
}

const waitt = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
const copyDeep = (jack) => Jundefined.parse(Jundefined.stringify(jack))


function drawArrow(fromThis, toThat) {
    const x2 = neurons[fromThis].x
    const y2 = neurons[fromThis].y
    const x1 = (!!toThat || toThat == 0) ? neurons[toThat].x : mouseX
    const y1 = (!!toThat || toThat == 0) ? neurons[toThat].y : mouseY
    line(x1, y1, x2, y2);
    let rotDegree = atan2(y2 - y1, x2 - x1);
    let x_avg = (x1 + x2) / 2;
    let y_avg = (y1 + y2) / 2;
    push();
    translate(x_avg, y_avg);
    // rotate(rotDegree+PI/6);
    rotate(rotDegree + PI / 6);
    line(0, 0, 10, 0);
    rotate(-PI / 3);
    line(0, 0, 10, 0)
    pop();
}

function writeNote() {
    noStroke()
    fill(10, 100, 100)
    text("single tap to drag or make arrows", 20, 30)
    text("double tap to create or delete neurons", 20, 60)
}

const neuronsslidedet = () => saveJundefined(neurons, 'nöronlar.jend')
const neuronsYükle = () => loadJundefined('nöronlar.jend', neuronsYükle2)
function neuronsYükle2(yüklenmişi) {
    for (let i = 0; i < Object.keys(yüklenmişi).length; i++)
        neurons[i] = yüklenmişi[i]
}

function igniteSignal() {
    if (neurons[mouse.touching].r == drawOptions.radius)
        inAnimation.emitting.push(mouse.touching)
}

function windowResized() {
    resizeCanvas(innerWidth - 20, innerHeight - 20)
}




// ANIMATION

function decreaseFatigue() {
    if (!(frameCount % 40))
        neurons.filter(kö => kö.tired < 100).map(kö => kö.tired++)
}

function menüAçKapa() {

}

function refreshAnimation() {
    // bubble size effect
    for (let ki = inAnimation.spawned.length - 1; ki > -1; ki--) {
        const thisOne = neurons[inAnimation.spawned[ki]]
        thisOne.r++
        if (thisOne.r == drawOptions.radius) inAnimation.spawned.splice(ki, 1)
    }
    // effect of emition
    for (let ki = inAnimation.emitting.length - 1; ki > -1; ki--) {
        const thisOne = neurons[inAnimation.emitting[ki]]
        if (typeof thisOne.anime == "undefined") {
            thisOne.anime = 1
        } else if (thisOne.anime == 2 * drawOptions.radius) {
            inAnimation.emitting.splice(ki, 1)
            delete thisOne.anime
            for (let ak of thisOne.axon) {
                if (neurons[ak].tired > 15) {
                    neurons[ak].tired -= 15
                    inAnimation.emitting.push(ak)
                }
            }
        } else if (thisOne.anime < drawOptions.radius) { // parlama
            thisOne.anime++
            noStroke()
            fill((260 + thisOne.ID * 110) % 360, 80, 100, .75)
            ellipse(thisOne.x, thisOne.y, thisOne.anime, thisOne.anime)
        } else {    // synapses
            thisOne.anime++
            for (let ak of thisOne.axon) {
                noStroke()
                fill((260 + thisOne.colorID * 110) % 360, 80, 100, .75)
                ellipse(
                    map(thisOne.anime, drawOptions.radius, 2.1 * drawOptions.radius, thisOne.x, neurons[ak].x),
                    map(thisOne.anime, drawOptions.radius, 2.1 * drawOptions.radius, thisOne.y, neurons[ak].y),
                    drawOptions.radius / 3, drawOptions.radius / 2
                )
            }
        }
    }
    // dragging with mouse
    if (mouse.clicked > -1 && mouse.fullclicked && mouseIsPressed) {
        // if (neurons.every(kn=> dist(mouseX,mouseY,kn.x,kn.y)>3*drawOptions.radius)) {  
        if (dist(mouse.endKonum[0], mouse.endKonum[1], mouseX, mouseY)) {
            neurons[mouse.clicked].x = mouse.clickednınXY[0] + mouseX - mouse.endKonum[0]
            neurons[mouse.clicked].y = mouse.clickednınXY[1] + mouseY - mouse.endKonum[1]
        }
    }
    // arrow draw
    if (mouseIsPressed && mouse.touching != mouse.clicked && mouse.clicked > -1 && !mouse.fullclicked) {
        stroke(160, 100, 100)
        if (mouse.touching > -1 && mouse.touching != mouse.clicked)
            drawArrow(mouse.clicked, mouse.touching)
        else
            drawArrow(mouse.clicked)
    }
}


