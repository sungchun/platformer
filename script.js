function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

    keyArray = {
        "a": { "pressed": false, "n": 0 }, "d": { "pressed": false, "n": 0 }, " ": { "pressed": false, "n": 0, "canJump": true }
    }



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

        drawRect() {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
        }

        whereTo(event) {
            switch (event.key) {
                case "a":
                    keyArray["a"]["pressed"] = true
                    console.log(keyArray, keyArray["a"]["pressed"])
                    console.log(theHero.x)
                    if (theHero.dx <= -5) {
                        break
                    }
                    theHero.dx -= 5
                    break
                case "d":
                    keyArray["d"]["pressed"] = true
                    console.log(keyArray, keyArray["d"])
                    // console.log(theHero.dx)
                    if (theHero.dx >= 5) {
                        break
                    }
                    theHero.dx += 5
                    break
                case " ":
                    console.log(event.repeat)
                    console.log(keyArray[" "]["n"])
                    if (keyArray[" "]["n"] >= 2) {
                        break
                    }
                    keyArray[" "]["pressed"] = true
                    if (!event.repeat) {
                        theHero.dy -= 30
                    }
                    setTimeout(() => theHero.dy += 30, 100)
                    break
            }
        }

        stop(event) {
            switch (event.key) {
                case "a":
                    keyArray["a"]["pressed"] = false
                    theHero.dx += 5
                    console.log(keyArray, keyArray["a"])
                    // console.log(theHero.dx)
                    break
                case "d":
                    keyArray["d"]["pressed"] = false
                    theHero.dx -= 5
                    console.log(keyArray, keyArray["d"]["pressed"])
                    // console.log(theHero.dx)
                    break
                case " ":
                    keyArray[" "]["n"]++
                //  
                // theHero.dy += 30
            }
        }

        gravity() {
            if (this.y + this.height >= canvas.height) {
                keyArray[" "]["pressed"] = false
                keyArray[" "]["n"] = 0
                console.log(this.dy, this.y)
                this.dy -= this.dy
                this.y = 550
            } else {
                if (this.dy >= 5) {
                    return
                } else {
                    this.dy += 1
                }
            }
        }

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
            theHero.x = theHero.x + theHero.dx
            theHero.y = theHero.y + theHero.dy
        }


    }

    const theHero = new Entity(100, 550, 50, 20, "green", 0, 0)

    theHero.drawRect()

    function update() {
        theHero.updateHeroPos()
        theHero.gravity()
        theHero.drawRect()
    }

    function animate() {
        requestAnimationFrame(animate)
        context.clearRect(0, 0, canvas.width, canvas.height)
        update()

    }
    animate()

    addEventListener("keydown", theHero.whereTo)
    addEventListener("keyup", theHero.stop)
}

addEventListener("DOMContentLoaded", init)