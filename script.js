function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

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
            console.log("spawning hero")
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
        }

        clearHeroRect() {
            context.clearRect(this.x, this.y, this.width, this.height)
        }

        whereTo(event) {
            switch (event.key) {
                case "a":
                    console.log(event)
                    if (theHero.dx <= -4) {
                        break
                    }
                    theHero.dx -= 4

                    break
                case "d":
                    console.log(event)
                    if (theHero.dx >= 4) {
                        break
                    }
                    theHero.dx += 4
                    break
            }
        }

        stop(event) {
            switch (event.key) {
                case "a":
                    console.log(event)
                    theHero.dx += 4
                    break
                case "d":
                    console.log(event)
                    theHero.dx -= 4
                    break
            }
        }

        // updateHeroPos(){

        // }

    }

    const theHero = new Entity(100, 550, 50, 20, "green", 0, 0)

    theHero.drawRect()

    function update() {
        theHero.x = theHero.x + theHero.dx
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