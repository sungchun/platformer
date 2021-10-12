function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")
    //empty array to be filled with nodes
    nodeArray = []
    noGoNodes = [[60, 120], [80, 120], [100, 120], [120, 120], [140, 120], [160, 120], [180, 120], [200, 120], [220, 120],
    [240, 120], [360, 120], [380, 120], [400, 120], [420, 120], [440, 120], [460, 120], [480, 120], [500, 120], [520, 120], [540, 120],
    [100, 280], [120, 280], [140, 280], [160, 280], [180, 280], [200, 280], [220, 280], [240, 280],
    [360, 280], [380, 280], [400, 280], [420, 280], [440, 280], [460, 280], [480, 280], [500, 280],
    [240, 400], [260, 400], [280, 400], [300, 400], [320, 400], [340, 400], [360, 400],
    [60, 480], [80, 480], [100, 480], [120, 480], [140, 480], [160, 480], [180, 480], [200, 480], [220, 400], [240, 400],
    [360, 480], [380, 400], [400, 400], [420, 400], [440, 400], [460, 400], [480, 400], [500, 400], [520, 400], [540, 400]]
    //for loop that pushes all nodes to node array
    for (let x = 0; x < 601; x += 20) {
        for (let y = 0; y < 601; y += 20) {
            nodeArray.push([x, y])
            context.beginPath()
            context.arc(x, y, 2, 0, Math.PI * 2, false)
            context.fillStyle = "blue"
            context.fill()
        }
    }
    // removes nodes inside platforms from node Array
    function removeBadNodes() {
        let nodeCounter = {}
        for (let i = 0; i < nodeArray.length; i++) {
            nodeCounter[nodeArray[i]] = 1
        }
        for (let i = 0; i < noGoNodes.length; i++) {
            nodeCounter[noGoNodes[i]] = (nodeCounter[noGoNodes[i]] || 0) + 1
        }
        for (let i = 0; i < nodeArray.length; i++) {
            if (nodeCounter[nodeArray[i]] > 1) {
                nodeArray.splice(i, 1)
            }
        }
    }
    removeBadNodes()

    //checks the neighboring nodes
    // function neighbors(node) {
    //     directions = [[20, 0], [0, 20], [-20, 0], [0, -20]]
    //     result = []
    //     for (let i = 0; i < direction.length; i++) {
    //         let neighbor = [node[0] + directions[0], node[1] + directions[1]]
    //         if (nodeArray.includes(neighbor)) {
    //             result.push(neighbor)
    //         }
    //     }
    //     return result
    // }
    function arrayContains(arr, item) {
        let item_as_string = item.toString()
        let contains = arr.some(function (item) {
            return item.toString() === item_as_string
        })
        return contains
    }

    class Graph {
        constructor() {
            this.edges = {}
        }

        neighbors(node) {
            let directions = [[20, 0], [0, 20], [-20, 0], [0, -20]]
            this.edges[node] = []
            for (let i = 0; i < 4; i++) {
                let neighbor = [node[0] + directions[i][0], node[1] + directions[i][1]]
                // console.log(neighbor)
                if (arrayContains(nodeArray, neighbor)) {
                    this.edges[node].push(neighbor)
                }
            }
            return this.edges
        }
    }

    class Queue {
        constructor() {
            this.elements = []
        }
        empty() {
            return !(this.elements.length > 0)
        }
        put(x) {
            this.elements.push(x)
        }
        get() {
            return this.elements.shift()
        }
    }

    let gameGraph = new Graph()

    //function that finds a path from a start
    const pathfinder = function () {
        let frontier = new Queue()
        frontier.put([0, 0])
        frontier.put([0, 0])
        let reached = {}
        reached[[0, 0]] = true
        let current = frontier.get()
        while (!frontier.empty()) {
            let current = frontier.get()
            let neighborArrayLength = gameGraph.neighbors(current)[current].length
            // console.log("length", gameGraph.neighbors(current)[].length)
            for (let i = 0; i < neighborArrayLength; i++) {
                let next = gameGraph.neighbors(current)[current][i]
                if (!reached[next]) {
                    frontier.put(next)
                    reached[next] = true
                }
            }
        }
        console.log("reached", reached)
    }

    pathfinder()
    // This is an object that keeps track of the properties of relevant keys
    keyArray = {
        "a": { "pressed": false, "n": 0 }, "d": { "pressed": false, "n": 0 }, " ": { "pressed": false, "n": 0 }, "s": { "pressed": false }, "click": { "pressed": false }
    }
    let doWeStop = false
    standingOn = null

    class Projectile {
        constructor(x, y, radius, color, dx, dy) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.dx = dx
            this.dy = dy
        }
        //updates the bullet's position to be drawn by adding the speed onto the coordinates
        updateBullet() {
            this.x = this.x + this.dx
            this.y = this.y + this.dy
            let xDone = (this.x > canvas.width || this.x < 0)
            let yDone = (this.y > canvas.height || this.y < 0)
            if (xDone || yDone) {
                shotBulletArray.splice(shotBulletArray.indexOf(this), 1)
            }
        }
        //draws the bullet
        drawCircle() {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.fill()
        }
    }

    // this is the class that creates entities like the player and the enemies
    class Entity {
        constructor(x, y, height, width, color, dx, dy) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.dx = dx
            this.dy = dy
        }
        //this method draws the entity
        drawRect() {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
        }
        //this method checks to see which key is pressed and moves the player character accordingly
        whereTo(event) {
            switch (event.key) {
                case "a":
                    keyArray["a"]["pressed"] = true
                    if (theHero.dx <= -5) {
                        break
                    }
                    theHero.dx -= 6
                    break
                case "d":
                    keyArray["d"]["pressed"] = true
                    if (theHero.dx >= 5) {
                        break
                    }
                    theHero.dx += 6
                    break
                case " ":
                    // when the space-bar is pressed, if the player has not jumped twice yet and they're not holding the button down, theHero will jump
                    if (keyArray[" "]["n"] >= 2) {
                        break
                    }
                    keyArray[" "]["pressed"] = true
                    if (!event.repeat) {
                        theHero.dy -= 30
                    }
                    break
                // let's the player
                case "s":
                    keyArray[" "]["n"] = 2
                    keyArray["s"]["pressed"] = true
            }
        }
        // this method stops the movement when the key is released
        stop(event) {
            switch (event.key) {
                case "a":
                    keyArray["a"]["pressed"] = false
                    theHero.dx += 6
                    break
                case "d":
                    keyArray["d"]["pressed"] = false
                    theHero.dx -= 6
                    break
                case " ":
                    //the number of jump checker is incremented when the space-bar is released
                    keyArray[" "]["n"]++
                    break
                case "s":
                    keyArray["s"]["pressed"] = false
                    break
            }
        }
        //checks to see which platform is closest
        isOnPlatform() {
            let feet = this.height + this.y
            const rightSide = this.x + this.width
            let xPos = this.x
            return platformArray.find(function (platform) {
                const checkX = (xPos >= platform.x && rightSide <= platform.x + platform.width)
                const checkY = (feet >= platform.y && feet <= platform.y + 30)
                if (checkX && checkY) {
                    standingOn = platform
                }
                return checkX && checkY
            })
        }

        //the gravity function constantly moves the player down by a certain dy, unless they are standing on something
        playerGravity() {
            let closestPlatform = this.isOnPlatform()
            doWeStop = closestPlatform && this.dy > 0
            if (doWeStop && standingOn === floor) {
                keyArray[" "]["pressed"] = false
                keyArray[" "]["n"] = 0
                this.dy -= this.dy
                this.y = closestPlatform.y - this.height
            } else if (doWeStop && keyArray["s"]["pressed"] === false) {
                keyArray[" "]["pressed"] = false
                keyArray[" "]["n"] = 0
                this.dy -= this.dy
                this.y = closestPlatform.y - this.height
            } else {
                if (this.dy >= 6) {
                    return
                } else {
                    this.dy += 3
                }
            }
        }
        // this method uses theHero's dx and dy to change it's coordinates to that it can be drawn in a new place
        updateHeroPos() {
            if (keyArray["a"]["pressed"] && keyArray["d"]["pressed"]) {
                theHero.dx = 0
            }
            if (theHero.dx < 0 && theHero.x <= 8) {
                theHero.x = 5
            }
            if (theHero.dx > 0 && theHero.x >= 575) {
                theHero.x = 575
            }
            if (theHero.dy < 0 && theHero.y <= 0) {
                theHero.y = 0
            }
            theHero.x = theHero.x + theHero.dx
            theHero.y = theHero.y + theHero.dy
        }
    }

    //creating class instances
    const theHero = new Entity(100, 500, 50, 20, "green", 0, 0)
    const floor = new Entity(-10, 600, 0.1, 620, "black", 0, 0)
    const bulletOne = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletTwo = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletThree = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletFour = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletFive = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletSix = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const bulletSeven = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const platformOne = new Entity(50, 475, 10, 200, "black", 0, 0)
    const platformTwo = new Entity(350, 475, 10, 200, "black", 0, 0)
    const platformThree = new Entity(225, 400, 10, 150, "black", 0, 0)
    const platformFour = new Entity(100, 280, 10, 150, "black", 0, 0)
    const platformFive = new Entity(360, 280, 10, 150, "black", 0, 0)
    const platformSix = new Entity(50, 110, 10, 200, "black", 0, 0)
    const platformSeven = new Entity(350, 110, 10, 200, "black", 0, 0)

    bulletArray = [bulletOne, bulletTwo, bulletThree, bulletFour, bulletFive, bulletSix, bulletSeven]
    shotBulletArray = []
    let j = 0
    function whereDoIShoot(event) {
        if (keyArray["click"]["pressed"]) {
            return
        }
        keyArray["click"]["pressed"] = true
        setTimeout(function () {
            keyArray["click"]["pressed"] = false
        }, 300)
        shotBulletArray.push(bulletArray[j])
        console.log(shotBulletArray)
        const xCoord = event.clientX - canvas.offsetLeft
        const yCoord = event.clientY - canvas.offsetTop
        const theta = Math.atan2(yCoord - theHero.y, xCoord - theHero.x)
        console.log("x coord", xCoord)
        console.log("y coord", yCoord)
        let opposite = Math.cos(theta)
        let adjacent = Math.sin(theta)
        bulletArray[j].x = theHero.x + (theHero.width / 2)
        bulletArray[j].y = theHero.y + (theHero.height / 2)
        bulletArray[j].dx = opposite * 8
        bulletArray[j].dy = adjacent * 8
        console.log(bulletArray[j].dy, bulletArray[j].dx)
        j++
        if (j === 6) {
            j = 0
        }
    }

    //making an array of platforms
    platformArray = [floor, platformOne, platformTwo, platformThree, platformFour, platformFive, platformSix, platformSeven]

    //updates the canvas by drawing the entities' in new positions
    function update() {
        platformArray.forEach(platform => platform.drawRect())
        theHero.updateHeroPos()
        theHero.playerGravity()
        theHero.drawRect()
        shotBulletArray.forEach(bullet => {
            bullet.updateBullet()
            bullet.drawCircle()
        })
    }
    //clears the canvas and updates canvas
    function animate() {
        requestAnimationFrame(animate)
        context.clearRect(0, 0, canvas.width, canvas.height)
        update()
        for (let x = 0; x < 601; x += 20) {
            context.strokeStyle = "light grey"
            context.strokeWidth = 1
            context.beginPath()
            context.moveTo(x, 0)
            context.lineTo(x, canvas.height)
            context.stroke()

        }
        for (let y = 0; y < 601; y += 20) {
            context.strokeStyle = "light grey"
            context.strokeWidth = 1
            context.beginPath()
            context.moveTo(0, y)
            context.lineTo(canvas.width, y)
            context.stroke()
        }
        for (let x = 0; x < 601; x += 20) {
            for (let y = 0; y < 601; y += 20) {
                nodeArray.push([x, y])
                context.beginPath()
                context.arc(x, y, 2, 0, Math.PI * 2, false)
                context.fillStyle = "blue"
                context.fill()
            }
        }
    }
    animate()

    addEventListener("keydown", theHero.whereTo)
    addEventListener("keyup", theHero.stop)
    addEventListener("click", whereDoIShoot)
}


addEventListener("DOMContentLoaded", init)