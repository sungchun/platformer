function init() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")

    function moveHoe(x) {
        console.log(x)
        theHero.clearHeroRect()
        theHero.update(x)
        theHero.drawRect()
    }

    class Entity {
        constructor(x, y, height, width, speed, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.speed = speed
            this.color = color
        }

        drawRect() {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
        }

        clearHeroRect() {
            context.clearRect(this.x, this.y, this.width, this.height)
        }

        whereTo(event) {
            switch (event.key) {
                case "a":
                    console.log("key pressed", event.key)
                    moveHoe(-10)
                    break
                case "d":
                    console.log("key pressed", event.key)
                    moveHoe(10)
                    break

            }
        }

        update(addedX) {
            this.x = this.x + addedX
            console.log("moved", this.x)
        }




    }

    const theHero = new Entity(100, 550, 50, 20)

    theHero.drawRect()

    document.addEventListener("keypress", theHero.whereTo)
}

addEventListener("DOMContentLoaded", init)