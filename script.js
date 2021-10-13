function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

    // This is an object that keeps track of the properties of relevant keys
    keyArray = {
        "a": { "pressed": false, "n": 0 }, "d": { "pressed": false, "n": 0 }, " ": { "pressed": false, "n": 0 }, "s": { "pressed": false }, "click": { "pressed": false }
    }
    let doWeStop = false
    standingOn = null
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
    //to check if an array contains a subarray
    function arrayContains(arr, item) {
        let item_as_string = item.toString()
        let contains = arr.some(function (item) {
            return item.toString() === item_as_string
        })
        return contains
    }
    //to check if two arrays are the same
    function arraysEqual(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false
            }
        }
        return true
    }

    class Graph {
        constructor() {
            this.edges = {}
        }

        neighbors(node) {
            if (this.edges[node]) {
                return this.edges[node]
            }
            let directions = [[20, 0], [0, 20], [-20, 0], [0, -20]]
            this.edges[node] = []
            for (let i = 0; i < 4; i++) {
                let neighbor = [node[0] + directions[i][0], node[1] + directions[i][1]]
                if (arrayContains(nodeArray, neighbor)) {
                    this.edges[node].push(neighbor)
                }
            }
            return this.edges[node]
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
    function makeMultipleOfTwenty(x) {
        newArray = []
        for (let i = 0; i < x.length; i++) {
            newArray.push(Math.ceil(x[i] / 20) * 20)
        }
        return newArray
    }

    class Enemies {
        constructor(x, y, radius, color) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.position = [this.x, this.y]
            this.dx = 0
            this.dy = 0
            this.i = 0
            this.isChasing = false
            this.path = []
        }

        drawEnemy() {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.fill()
        }

        pathfinder = function (start, goal) {
            let frontier = new Queue()
            frontier.put(start)
            frontier.put(start)
            let reached = {}
            while (!frontier.empty()) {
                let current = frontier.get()
                if (arraysEqual(current, goal)) {
                    break
                }
                let neighborArrayLength = gameGraph.neighbors(current).length
                for (let i = 0; i < neighborArrayLength; i++) {
                    let next = gameGraph.neighbors(current)[i]
                    if (!reached[next]) {
                        frontier.put(next)
                        reached[next] = current
                    }
                }
            }
            return reached
        }

        makeThePath(start, goal) {
            let reached = this.pathfinder(start, goal)
            let pathArray = []
            let startNode = start
            console.log(reached)
            let currentNode = reached[goal]
            while (!arraysEqual(currentNode, startNode)) {
                console.log("nodes", currentNode, startNode)
                pathArray.push(currentNode)
                currentNode = reached[currentNode]
            }
            this.i = pathArray.length - 1
            this.path = pathArray
            return pathArray
        }

        updateEnemy() {
            this.x = this.x + this.dx
            this.y = this.y + this.dy
        }

        movementLoop(path) {
            let moveTime = setTimeout(() => {
                this.dx = (path[this.i][0] - this.x) / 10
                this.dy = (path[this.i][1] - this.y) / 10
                if (this.i--) {
                    this.movementLoop(path)
                } else {
                    this.dx = 0
                    this.dy = 0
                }
            }, 100)
        }


        chase(goal) {
            console.log("goal", makeMultipleOfTwenty(goal))
            console.log(makeMultipleOfTwenty([this.x, this.y]))
            this.makeThePath(makeMultipleOfTwenty([this.x, this.y]), makeMultipleOfTwenty(goal))
            this.movementLoop(this.path)
        }

        chasing(goal) {
            if (this.isChasing) {
                return
            }
            this.isChasing = true
            // this.chase(goal)
            // this.isChasing = false
            setTimeout(() => {
                this.chase(goal)
                this.isChasing = false
            }, 3000);
        }
    }

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
            this.centerX = this.x + this.width / 2
            this.centerY = this.y + this.height / 2
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
    const theHero = new Entity(500, 400, 50, 20, "green", 0, 0)
    const floor = new Entity(-10, 600, 0.1, 620, "black", 0, 0)
    const bulletOne = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletTwo = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletThree = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletFour = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletFive = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletSix = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const bulletSeven = new Projectile(theHero.centerX, theHero.centerY, 3, "red", 0, 0)
    const platformOne = new Entity(50, 475, 10, 200, "black", 0, 0)
    const platformTwo = new Entity(350, 475, 10, 200, "black", 0, 0)
    const platformThree = new Entity(225, 400, 10, 150, "black", 0, 0)
    const platformFour = new Entity(100, 280, 10, 150, "black", 0, 0)
    const platformFive = new Entity(360, 280, 10, 150, "black", 0, 0)
    const platformSix = new Entity(50, 110, 10, 200, "black", 0, 0)
    const platformSeven = new Entity(350, 110, 10, 200, "black", 0, 0)
    const enemyOne = new Enemies(20, 20, 15, "blue")

    //making an arrays of things
    enemyArray = []
    platformArray = [floor, platformOne, platformTwo, platformThree, platformFour, platformFive, platformSix, platformSeven]
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
        const xCoord = event.clientX - canvas.offsetLeft
        const yCoord = event.clientY - canvas.offsetTop
        const theta = Math.atan2(yCoord - theHero.y, xCoord - theHero.x)
        let opposite = Math.cos(theta)
        let adjacent = Math.sin(theta)
        bulletArray[j].x = theHero.x + (theHero.width / 2)
        bulletArray[j].y = theHero.y + (theHero.height / 2)
        bulletArray[j].dx = opposite * 8
        bulletArray[j].dy = adjacent * 8
        j++
        if (j === 6) {
            j = 0
        }
    }
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
        enemyOne.chasing([theHero.x + theHero.width / 2, theHero.y + theHero.height / 2])
        enemyOne.updateEnemy()
        enemyOne.drawEnemy()
    }
    //clears the canvas and updates canvas
    function animate() {
        requestAnimationFrame(animate)
        context.clearRect(0, 0, canvas.width, canvas.height)
        update()
        // for (let x = 0; x < 601; x += 20) {
        //     context.strokeStyle = "light grey"
        //     context.strokeWidth = 1
        //     context.beginPath()
        //     context.moveTo(x, 0)
        //     context.lineTo(x, canvas.height)
        //     context.stroke()

        // }
        // for (let y = 0; y < 601; y += 20) {
        //     context.strokeStyle = "light grey"
        //     context.strokeWidth = 1
        //     context.beginPath()
        //     context.moveTo(0, y)
        //     context.lineTo(canvas.width, y)
        //     context.stroke()
        // }
        // for (let x = 0; x < 601; x += 20) {
        //     for (let y = 0; y < 601; y += 20) {
        //         nodeArray.push([x, y])
        //         context.beginPath()
        //         context.arc(x, y, 2, 0, Math.PI * 2, false)
        //         context.fillStyle = "blue"
        //         context.fill()
        //     }
        // }
    }
    animate()

    addEventListener("keydown", theHero.whereTo)
    addEventListener("keyup", theHero.stop)
    addEventListener("click", whereDoIShoot)
}
addEventListener("DOMContentLoaded", init)