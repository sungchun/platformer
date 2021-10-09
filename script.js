function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

    keyArray = [{ "a": false, "d": false, " ": false }]

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
            console.log(event)
            switch (event.key) {
                case "a":
                    keyArray["a"] = true
                    console.log(keyArray, keyArray["a"])
                    console.log(theHero.x)
                    if (theHero.dx <= -5) {
                        break
                    }
                    theHero.dx -= 5
                    break
                case "d":
                    keyArray["d"] = true
                    console.log(keyArray, keyArray["d"])
                    // console.log(theHero.dx)
                    if (theHero.dx >= 5) {
                        break
                    }
                    theHero.dx += 5
                    break
                case " ":
                    keyArray[" "] = true
                    theHero.dy -= 25
                    console.log(theHero.dy, theHero)

            }
        }

        stop(event) {
            switch (event.key) {
                case "a":
                    keyArray["a"] = false
                    theHero.dx += 5
                    console.log(keyArray, keyArray["a"])
                    // console.log(theHero.dx)
                    break
                case "d":
                    keyArray["d"] = false
                    theHero.dx -= 5
                    console.log(keyArray, keyArray["d"])
                    // console.log(theHero.dx)
                    break
                case " ":
                    keyArray[" "] = false
                    theHero.dy += 25
            }
        }

        gravity() {
            if (this.y + this.height >= canvas.height) {
                console.log(this.dy, this.y)
                this.dy -= this.dy
                this.y = 550
            } else {
                if (this.dy >= 5) {
                    return
                } else {
                    this.dy += 0.5
                }
            }
        }

        updateHeroPos() {
            if (keyArray["a"] && keyArray["d"]) {
                theHero.dx = 0
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