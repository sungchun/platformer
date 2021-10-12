function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

    for (let x = 0; x < 601; x += 20) {

    }
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
    const bulletEight = new Projectile(theHero.x + theHero.width / 2, theHero.y + theHero.height / 2, 3, "red", 0, 0)
    const platformOne = new Entity(50, 475, 10, 200, "black", 0, 0)
    const platformTwo = new Entity(350, 475, 10, 200, "black", 0, 0)
    const platformThree = new Entity(225, 400, 10, 150, "black", 0, 0)
    const platformFour = new Entity(100, 280, 10, 150, "black", 0, 0)
    const platformFive = new Entity(360, 280, 10, 150, "black", 0, 0)
    const platformSix = new Entity(50, 110, 10, 200, "black", 0, 0)
    const platformSeven = new Entity(350, 110, 10, 200, "black", 0, 0)

    bulletArray = [bulletOne, bulletTwo, bulletThree, bulletFour, bulletFive, bulletSix, bulletSeven, bulletEight]
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
        if (j === 7) {
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
    }
    animate()

    addEventListener("keydown", theHero.whereTo)
    addEventListener("keyup", theHero.stop)
    addEventListener("click", whereDoIShoot)
}

addEventListener("DOMContentLoaded", init)