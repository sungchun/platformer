function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")
    const score = document.querySelector("#score")
    const livesRemaining = document.querySelector("#lives")
    const playButton = document.querySelector("#start-button")
    const resetButton = document.querySelector("#reset-button")
    const startMenu = document.querySelector("#start-menu")
    const main = document.querySelector("main")
    const finalScore = document.querySelector("#final-score")
    const highScore = document.querySelector("#high-score")
    const endScreen = document.querySelector("#end-screen")
    const canvasRect = canvas.getBoundingClientRect()
    localStorage.setItem("high-score", 0)
    let localHighScore = localStorage.getItem("high-score")
    let points = 0
    function incrementScore() {
        let scoreInterval = setInterval(() => {
            points += 50
            score.innerHTML = `${points}`
        }, 10000);
    }

    // This is an object that keeps track of the properties of relevant keys
    keyArray = {
        "a": { "pressed": false, "n": 0 }, "d": { "pressed": false, "n": 0 }, " ": { "pressed": false, "n": 0 }, "s": { "pressed": false }, "click": { "pressed": false }
    }
    let doWeStop = false
    standingOn = null
    let heroLives = 3
    let heroDamaged = false
    let playingGame = true

    function heroDead() {
        if (heroLives <= 0) {
            endScreen.style.display = "flex"
            if (points > localHighScore) {
                localHighScore = points
            }
            finalScore.innerHTML = `${points}`
            highScore.innerHTML = `${localHighScore}`
            playingGame = false
        }
    }

    //empty array to be filled with nodes
    nodeArray = []
    noGoNodes = [[60, 120], [80, 120], [100, 120], [120, 120], [140, 120], [160, 120], [180, 120], [200, 120], [220, 120],
    [240, 120], [360, 120], [380, 120], [400, 120], [420, 120], [440, 120], [460, 120], [480, 120], [500, 120], [520, 120], [540, 120],
    [100, 280], [120, 280], [140, 280], [160, 280], [180, 280], [200, 280], [220, 280], [240, 280],
    [360, 280], [380, 280], [400, 280], [420, 280], [440, 280], [460, 280], [480, 280], [500, 280],
    [240, 400], [260, 400], [280, 400], [300, 400], [320, 400], [340, 400], [360, 400],
    [60, 480], [80, 480], [100, 480], [120, 480], [140, 480], [160, 480], [180, 480], [200, 480], [220, 400], [240, 400],
    [360, 480], [380, 400], [400, 400], [420, 400], [440, 400], [460, 400], [480, 400], [500, 400], [520, 400], [540, 400],
    [40, 100], [60, 100], [80, 100], [100, 100], [120, 100], [140, 100], [160, 100], [180, 100], [200, 100], [220, 100], [240, 100], [260, 100],
    [40, 120], [260, 120], [40, 140], [60, 140], [80, 140], [100, 140], [120, 140], [140, 140], [160, 140], [180, 140], [200, 140], [220, 120], [240, 120],
    [340, 100], [360, 100], [380, 100], [400, 100], [420, 100], [440, 100], [460, 100], [480, 100], [500, 100], [520, 100], [540, 100], [560, 100], [340, 120], [560, 120],
    [360, 140], [380, 140], [400, 140], [420, 140], [440, 140], [460, 140], [480, 140], [500, 140], [520, 140], [540, 140], [560, 140],
    [80, 260], [100, 260], [120, 260], [140, 260], [160, 260], [180, 260], [200, 260], [220, 260], [240, 260], [260, 260], [80, 280], [260, 280],
    [80, 300], [100, 300], [120, 300], [140, 300], [160, 300], [180, 300], [200, 300], [220, 300], [240, 300], [260, 300],
    [340, 260], [360, 260], [380, 260], [400, 260], [420, 260], [440, 260], [460, 260], [480, 260], [500, 260], [520, 260], [520, 280], [340, 280],
    [340, 300], [360, 300], [380, 300], [400, 300], [420, 300], [440, 300], [460, 300], [480, 300], [500, 300], [520, 300],
    [220, 380], [240, 380], [260, 380], [280, 380], [300, 380], [320, 380], [340, 380], [360, 380], [380, 380],
    [200, 400], [380, 400],
    [220, 420], [240, 420], [260, 420], [280, 420], [300, 420], [320, 420], [340, 420], [360, 420], [380, 420],
    [40, 460], [60, 460], [80, 460], [100, 460], [120, 460], [140, 460], [160, 460], [180, 460], [200, 460], [220, 460], [240, 460], [260, 460],
    [40, 500], [60, 500], [80, 500], [100, 500], [120, 500], [140, 500], [160, 500], [180, 500], [200, 500], [220, 500], [240, 500], [260, 500],
    [340, 480], [260, 480], [340, 460], [360, 460], [380, 460], [400, 460], [420, 460], [440, 460], [460, 460], [480, 460], [500, 460], [520, 460], [540, 460], [560, 460],
    [340, 500], [360, 500], [380, 500], [400, 500], [420, 500], [440, 500], [460, 500], [480, 500], [500, 500], [520, 500], [540, 500], [560, 500]
    ]

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
        // console.log("arrays", arr1, arr1.length, arr2)
        if (!arr1 || !arr2) return true
        for (let i = 0; i < 2; i++) {
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

    //change it so that it rounds up or down based on the direction that the ball wants to go
    function makeMultipleOfTwentyOne(x) {
        newArray = []
        for (let i = 0; i < x.length; i++) {
            newArray.push(Math.floor(x[i] / 20) * 20)
        }
        return newArray
    }

    function velocityHypot(x1, y1) {
        //find hypot and use it to normalize the original velocities
        let h = Math.sqrt(x1 ** 2 + y1 ** 2)
        let x2 = x1 / h
        let y2 = y1 / h
        return [x2, y2]
    }

    let spawnsArray = [[20, 20], [580, 20], [20, 580], [580, 580]]
    function randomSpawn() {
        return spawnsArray[Math.floor(Math.random() * 4)]
    }

    class Enemies {
        constructor(x, y, radius, color, velocity) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.moreColors = ["lightgrey", "red", "none"]
            this.lives = 2
            this.position = [this.x, this.y]
            this.dx = 0
            this.dy = 0
            this.i = 0
            this.velocity = velocity
            this.isChasing = false
            this.path = []
        }

        touchedHero() {
            let xDifference = (theHero.x + theHero.width / 2) - this.x
            let yDifference = theHero.y - this.y
            let hDistance = Math.hypot(yDifference, xDifference)
            if (hDistance <= this.radius * 1.7 && !heroDamaged) {
                heroLives--
                livesRemaining.innerHTML = `${heroLives}`
                heroDamaged = true
                theHero.color = "lightgreen"
                setTimeout(() => {
                    heroDamaged = false
                    theHero.color = "green"
                }, 500)
            }
        }

        dying() {
            if (this.lives <= -1) {
                spawnedEnemiesArray.splice(spawnedEnemiesArray.indexOf(this), 1)
                enemyBench.put(this)
                this.lives = 2
                this.color = "blue"
                let newSpawn = randomSpawn()
                this.x = newSpawn[0]
                this.y = newSpawn[1]
            }
        }

        drawEnemy() {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.fill()
        }

        makeMultipleOfTwentyTwo(x) {
            let horizontal = x[0] - this.x
            let vertical = x[1] - this.y
            let newArray = []
            // console.log("og thises", this.x, this.y)
            if (horizontal < 0) {
                newArray.push((Math.floor(x[0] / 20) * 20) - 20)
            } else {
                newArray.push((Math.ceil(x[0] / 20) * 20) + 20)
            }
            if (vertical < 0) {
                newArray.push((Math.floor(x[1] / 20) * 20) - 20)
            } else {
                newArray.push((Math.ceil(x[1] / 20) * 20) + 20)
            }
            while (noGoNodes.find(item => {
                return arraysEqual(newArray, item)
            })) {
                newArray[0] += 20
                newArray[1] += 20
            }
            if (newArray[0] < 0) {
                newArray[0] = 0
            } else if (newArray[0] > 600) {
                newArray[0] = 600
            }
            if (newArray[1] < 0) {
                newArray[1] = 0
            } else if (newArray[1] > 600) {
                newArray[1] = 600
            }
            return newArray
        }

        ensureNotRestrictedNode(x) {
            let newArray = []
            for (let i = 0; i < x.length; i++) {
                newArray.push(Math.floor(x[i] / 20) * 20)
            }
            while (noGoNodes.find(item => {
                return arraysEqual(newArray, item)
            })) {
                newArray[0] += 20
                newArray[1] += 20
            }
            return newArray
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
            let pathArray = [goal]
            let startNode = start
            let currentNode = reached[goal]
            while (!arraysEqual(currentNode, startNode)) {
                pathArray.push(currentNode)
                currentNode = reached[currentNode]
            }
            this.path = pathArray
            this.i = pathArray.length - 1
            return pathArray
        }

        movementLoop() {
            let moveTime = setTimeout(() => {
                if (this.path.length < 1) {
                    return
                }
                let dx = this.path[this.i][0] - this.x
                let dy = this.path[this.i][1] - this.y
                let velocities = velocityHypot(dx, dy)
                this.dx = Math.ceil(velocities[0] * this.velocity)
                this.dy = Math.ceil(velocities[1] * this.velocity)
                this.i--
                if (this.i > 0) {
                    this.movementLoop()
                } else {
                    this.path = []
                    this.dx = 0
                    this.dy = 0
                    clearTimeout(moveTime)
                    this.isChasing = false
                    return
                }
            }, 400)
        }
        updateEnemy() {
            this.x = this.x + this.dx
            this.y = this.y + this.dy
        }

        chase(goal) {
            this.makeThePath(makeMultipleOfTwentyOne(this.ensureNotRestrictedNode([this.x, this.y])), this.makeMultipleOfTwentyTwo(goal))
            this.movementLoop(this.path)
        }

        chasing(goal) {
            if (this.isChasing) {
                return
            } else {
                this.chase(goal)
                setTimeout(() => {
                    this.chase(goal)
                    this.isChasing = true
                }, 600);
            }
        }
    }

    class shootingEnemies {
        constructor(x, y, radius, color, dx, dy,) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.moreColors = ["brown", "yellow", "green"]
            this.lives = 2
            this.dx = dx
            this.dy = dy
            this.shot = false
            this.spawnX = x
            this.spawnY = y
        }

        dying() {
            if (this.lives <= -1) {
                spawnedEnemiesArray.splice(spawnedEnemiesArray.indexOf(this), 1)
                enemyBench.put(this)
                this.lives = 2
                this.color = "green"
                this.x = this.spawnX
                this.y = this.spawnY
            }
        }

        drawEnemy() {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.fill()
        }

        shootHero() {
            let theta = Math.atan2((theHero.y + (theHero.height / 2)) - this.y, (theHero.x + (theHero.width / 2)) - this.x)
            let opposite = Math.cos(theta)
            let adjacent = Math.sin(theta)
            let firedBullet = enemyBulletArray.get()
            enemyShotBullets.push(firedBullet)
            firedBullet.x = this.x
            firedBullet.y = this.y
            firedBullet.dx = opposite * 6
            firedBullet.dy = adjacent * 6
        }

        whenDoIShoot() {
            if (this.shootHero) {
                return
            }
            this.shootHero()
            let secondShot = setTimeout(() => {
                this.shootHero()
            }, 150);
            this.shot = true
            setTimeout(() => {
                this.shot = false
            }, 1000)
        }

        updateEnemy() {
            if (this.x >= 565) {
                this.dx = -this.dx
            }
            if (this.y >= 565 || this.y <= 35) {
                this.dy = -this.dy
            }
            this.x = this.x + this.dx
            this.y = this.y + this.dy
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

        hitEnemy() {
            return spawnedEnemiesArray.find((enemy) => {
                let xDifference = enemy.x - this.x
                let yDifference = enemy.y - this.y
                let hDistance = Math.hypot(xDifference, yDifference)
                // console.log("bullet radius", this.radius)
                // console.log("enemy radius", enemy.radius)
                if ((this.radius + enemy.radius) > hDistance) {
                    enemy.lives--
                    enemy.color = enemy.moreColors[enemy.lives]
                    shotBulletArray.splice(shotBulletArray.indexOf(this), 1)
                    if (enemy.lives <= -1) {
                        points += 50
                        score.innerHTML = `${points}`
                    }
                }
            })
        }

        hitHero() {
            let xDifference = (theHero.x + (theHero.width / 2)) - this.x
            let yDifference = (theHero.y + (theHero.height / 2)) - this.y
            let hDistance = Math.hypot(xDifference, yDifference)
            if ((this.radius + 10) > hDistance) {
                heroLives--
                theHero.color = "lightgreen"
                setTimeout(() => {
                    heroDamaged = false
                    theHero.color = "green"
                }, 500)
                enemyShotBullets.splice(enemyShotBullets.indexOf(this), 1)
            }
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
                case "w":
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
                case "w":
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
            let rightSide = this.x + this.width
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
    const theHero = new Entity(300, 300, 50, 20, "green", 0, 0)
    const floor = new Entity(-10, 600, 0.1, 620, "black", 0, 0)
    const bulletOne = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletTwo = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletThree = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletFour = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletFive = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletSix = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const bulletSeven = new Projectile(theHero.centerX, theHero.centerY, 3, "grey", 0, 0)
    const enemyBulletOne = new Projectile(0, 0, 4, "black", 0, 0)
    const enemyBulletTwo = new Projectile(0, 0, 4, "black", 0, 0)
    const enemyBulletThree = new Projectile(0, 0, 4, "black", 0, 0)
    const enemyBulletFour = new Projectile(0, 0, 4, "black", 0, 0)
    const enemyBulletFive = new Projectile(0, 0, 4, "black", 0, 0)
    const platformOne = new Entity(50, 475, 10, 200, "black", 0, 0)
    const platformTwo = new Entity(350, 475, 10, 200, "black", 0, 0)
    const platformThree = new Entity(225, 400, 10, 150, "black", 0, 0)
    const platformFour = new Entity(100, 280, 10, 150, "black", 0, 0)
    const platformFive = new Entity(360, 280, 10, 150, "black", 0, 0)
    const platformSix = new Entity(50, 110, 10, 200, "black", 0, 0)
    const platformSeven = new Entity(350, 110, 10, 200, "black", 0, 0)
    const enemyOne = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyTwo = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyThree = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyFour = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyFive = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemySix = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemySeven = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyEight = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyNine = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyTen = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyEleven = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyTwelve = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyThirteen = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyFourteen = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    const enemyFifteen = new Enemies(randomSpawn()[0], randomSpawn()[1], 15, "blue", 3)
    // const shootingEnemyOne = new shootingEnemies(40, 30, 20, "green", 3, 0)
    // const shootingEnemyTwo = new shootingEnemies(40, 570, 20, "green", 3, 0)
    // const shootingEnemyThree = new shootingEnemies(30, 560, 20, "green", 0, -3)
    // const shootingEnemyFour = new shootingEnemies(570, 560, 20, "green", 0, -3)
    const theCrosshair = {
        x: 0, y: 0, radius: 6, color: "black", drawCrosshair() {
            context.beginPath()
            context.strokeStyle = "black"
            context.lineWidth = 2
            context.arc(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, 0, Math.PI * 2, false)
            context.stroke()
            context.closePath()
        }
    }

    //making an arrays of things
    let enemyArray = [enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive, enemySix, enemySeven, enemyEight, enemyNine, enemyTen]
    // let shootingEnemyArray = [shootingEnemyOne, shootingEnemyTwo, shootingEnemyThree, shootingEnemyFour]
    let platformArray = [floor, platformOne, platformTwo, platformThree, platformFour, platformFive, platformSix, platformSeven]
    let spawnedEnemiesArray = []
    // let spawnedShootingEnemies = []
    let enemyBulletArray = new Queue()
    enemyBulletArray.elements = [enemyBulletOne, enemyBulletTwo, enemyBulletThree, enemyBulletFour, enemyBulletFive]
    let enemyShotBullets = []

    let enemyBench = new Queue()
    for (let i = 0; i < enemyArray.length; i++) {
        enemyBench.put(enemyArray[i])
    }

    // let shootingEnemyBench = new Queue()
    // for (let i = 0; i < shootingEnemyArray.length; i++) {
    //     shootingEnemyBench.put(shootingEnemyArray[i])
    // }

    let spawnTiming = 5000
    let howManyPoints = points
    function spawnEnemies() {
        let spawningInterval = setTimeout(() => {
            if ((points - howManyPoints) >= 100 && spawnTiming > 500) {
                howManyPoints = points
                spawnTiming -= 500
            }
            if (!enemyBench.empty()) {
                let nextUp = enemyBench.get()
                spawnedEnemiesArray.push(nextUp)
                nextUp.chase([theHero.x + theHero.width / 2, theHero.y])
            }
            if (heroLives > 0) {
                spawnEnemies()
            }
        }, spawnTiming)
    }

    // let shootingSpawnTiming = 10000

    // function spawnShootingEnemies() {
    //     let shootingSpawningInterval = setTimeout(() => {
    //         if ((points - howManyPoints) >= 500 && shootingSpawnTiming > 2000) {
    //             howManyPoints = points
    //             shootingSpawnTiming -= 2000
    //         }
    //         if (!shootingEnemyBench.empty()) {
    //             spawnedShootingEnemies.push(shootingEnemyBench.get())
    //         }
    //         if (heroLives > 0) {
    //             spawnedShootingEnemies()
    //         }
    //     }, shootingSpawnTiming)

    // }

    let bulletArray = [bulletOne, bulletTwo, bulletThree, bulletFour, bulletFive, bulletSix, bulletSeven]
    let shotBulletArray = []
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
        const xCoord = event.clientX - canvasRect.x
        const yCoord = event.clientY - canvasRect.y
        const theta = Math.atan2(yCoord - (theHero.y + (theHero.height / 2)), xCoord - (theHero.x + (theHero.width / 2)))
        let opposite = Math.cos(theta)
        let adjacent = Math.sin(theta)
        bulletArray[j].x = theHero.x + (theHero.width / 2)
        bulletArray[j].y = theHero.y + (theHero.height / 2)
        bulletArray[j].dx = opposite * 10
        bulletArray[j].dy = adjacent * 10
        j++
        if (j === 6) {
            j = 0
        }
    }

    //updates the canvas by drawing the entities' in new positions
    function update() {
        platformArray.forEach(platform => platform.drawRect())
        heroDead()
        theHero.updateHeroPos()
        theHero.playerGravity()
        theHero.drawRect()
        shotBulletArray.forEach(bullet => {
            bullet.updateBullet()
            bullet.drawCircle()
            bullet.hitEnemy()
        })
        spawnedEnemiesArray.forEach(enemy => {
            enemy.chasing([theHero.x + theHero.width / 2, theHero.y])
            enemy.updateEnemy()
            enemy.drawEnemy()
            enemy.dying()
            enemy.touchedHero()
        })
        // spawnedShootingEnemies.forEach(enemy => {
        //     enemy.patrolling()
        //     enemy.updateEnemy()
        //     enemy.drawEnemy()
        //     enemy.whenDoIShoot()
        // })
        enemyShotBullets.forEach(bullet => {
            bullet.updateBullet()
            bullet.drawCircle()
            bullet.hitHero()
        })
        theCrosshair.drawCrosshair()
    }
    //clears the canvas and updates canvas
    function animate() {
        if (playingGame) {
            requestAnimationFrame(animate)
        }
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
    function playGame() {
        howManyPoints = 0
        playingGame = true
        incrementScore()
        spawnEnemies()
        // spawnShootingEnemies()
        animate()
        startMenu.style.display = "none"
        main.style.top = "0"
    }

    function resetGame() {
        shotBulletArray = []
        for (let i = 0; i < spawnedEnemiesArray.length; i++) {
            enemyBench.put(spawnedEnemiesArray.pop())
        }
        spawnTiming = 5000
        points = 0
        howManyPoints = points
        enemyArray.forEach((enemy) => {
            enemy.x = randomSpawn()[0]
            enemy.y = randomSpawn()[0]
            enemy.lives = 2
            console.log(`enemies coords x:${enemy.x}, y:${enemy.y}`)
        })
        spawnedEnemiesArray = []
        heroLives = 3
        livesRemaining.innerHTML = "3"
        score.innerHTML = "0"
        endScreen.style.display = "none"
        theHero.x = 300
        theHero.y = 300
        spawnEnemies()
        playGame()
    }

    // playGame()


    addEventListener("keydown", theHero.whereTo)
    addEventListener("keyup", theHero.stop)
    addEventListener("click", whereDoIShoot)
    addEventListener("mousemove", event => {
        theCrosshair.x = event.clientX - canvasRect.x
        theCrosshair.y = event.clientY - canvasRect.y
    })
    resetButton.addEventListener("click", resetGame)
    playButton.addEventListener("click", playGame)
}
addEventListener("DOMContentLoaded", init)